import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACHIEVEMENTS, ALL_ACHIEVEMENTS, MODULE_KEYS } from '../utils/achievements';

// Debounced persistence to avoid heavy sync writes on rapid logs
let __persistTimer = null;

const useStore = create((set, get) => ({
  // User State
  user: {
    name: '',
    petType: null, // 'dog' or 'cat'
    petName: '',
    petColor: 'default',
    onboardingComplete: false,
  },
  
  // Notification preferences
  notifications: {
    enabled: true,
    morningCheckIn: { enabled: true, time: '08:00' },
    hydration: { enabled: true, frequencyHours: 2 },
    modules: { hydration: true, energy: true, gut: true, headVision: true, skin: true },
    achievements: { enabled: true },
    streaks: { enabled: true },
    lastNotificationTime: null,
  },
  
  // Pet State
  pet: {
    happiness: 50,
    energy: 50,
    health: 50,
    level: 1,
    careCredits: 0,
    totalCreditsEarned: 0,
    creditHistory: [],
    environment: 'starter_room',
    petEnvironmentLevel: 0,
    environmentUnlockDates: {},
    customization: {
      unlockedItems: { accessories: [], colors: ['default'], effects: [], environments: [] },
      equippedItems: { accessory: null, color: 'default', effect: null, environment: null },
    },
  },
  
  // Health Logs
  healthLogs: {
    hydration: [],
    energy: [],
    gut: [],
    headVision: [],
    skin: [],
  },

  // Achievements state
  achievements: {
    unlockedIds: [],
    progress: {},
    streakDays: 0,
    lastLogDate: null,
    moduleCounts: MODULE_KEYS.reduce((acc, k) => ({ ...acc, [k]: 0 }), {}),
    balancedDays: 0,
    lastBalancedDate: null,
    toasts: [],
  },
  // Missions
  activeMissions: [],
  completedMissions: [],
  missionProgress: {},
  // Neighborhood (mock community)
  neighborhoodData: [],
  communityStats: { totalLogs: 0, activeUsers: 0, weeklyGoal: 1000, unlocked: null },
  
  // Vista States for each tab
  vistaStates: {
    home: { colors: ['#e0f2fe', '#bae6fd'], animation: 'idle' },
    fluidFlow: { hydrationLevel: 3, gardenHealth: 'normal' },
    vitality: { energyLevel: 'neutral', sunlight: 'medium' },
    gut: { gardenGrowth: 'sprouting', soilHealth: 'balanced' },
    mindRadar: { atmosphere: 'cloudy', lighting: 'soft' },
    dermalMap: { seasonalState: 'balanced' },
  },  
  // Actions
  initializeApp: async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedData = JSON.parse(userData);
        set((state) => ({
          user: { ...state.user, ...parsedData.user },
          pet: { ...state.pet, ...parsedData.pet },
          healthLogs: { ...state.healthLogs, ...parsedData.healthLogs },
          achievements: { ...state.achievements, ...(parsedData.achievements || {}) },
          notifications: { ...state.notifications, ...(parsedData.notifications || {}) },
          activeMissions: parsedData.activeMissions || state.activeMissions,
          completedMissions: parsedData.completedMissions || state.completedMissions,
          missionProgress: parsedData.missionProgress || state.missionProgress,
          neighborhoodData: parsedData.neighborhoodData || state.neighborhoodData,
          communityStats: parsedData.communityStats || state.communityStats,
        }));
        // Seed neighbors if missing
        if (!Array.isArray(get().neighborhoodData) || get().neighborhoodData.length === 0) {
          try { get().generateMockNeighbors(); } catch (_) {}
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  },
  
  setUserData: (userData) => {
    set((state) => ({
      user: { ...state.user, ...userData },
    }));
    get().saveData();
  },

  setNotificationPreference: (path, value) => {
    set((state) => {
      const next = { ...state.notifications };
      const parts = path.split('.');
      let cursor = next;
      for (let i = 0; i < parts.length - 1; i++) {
        cursor[parts[i]] = { ...cursor[parts[i]] };
        cursor = cursor[parts[i]];
      }
      cursor[parts[parts.length - 1]] = value;
      return { notifications: next };
    });
    get().saveData();
  },
  
  setPetType: (petType) => {
    set((state) => ({
      user: { ...state.user, petType },
    }));
    get().saveData();
  },

  setPetColor: (petColor) => {
    set((state) => ({
      user: { ...state.user, petColor },
    }));
    get().saveData();
  },
  
  setPetName: (petName) => {
    set((state) => ({
      user: { ...state.user, petName },
    }));
    get().saveData();
  },
  
  completeOnboarding: () => {
    set((state) => ({
      user: { ...state.user, onboardingComplete: true },
    }));
    get().saveData();
  },
  
  setPetData: (petData) => {
    set((state) => ({
      pet: { ...state.pet, ...petData },
    }));
    get().saveData();
  },
  
  addHealthLog: (type, logData) => {
    try {
      set((state) => ({
        healthLogs: {
          ...state.healthLogs,
          [type]: [...(state.healthLogs[type] || []), { ...logData, timestamp: new Date().toISOString() }],
        },
      }));
      get().updatePetStatus(type);
      const moduleBase = { hydration: 10, energy: 10, gut: 15, headVision: 10, skin: 25 };
      const amount = moduleBase[type] || 5;
      get().addCredits(amount, `log:${type}`);
      // Update community totals
      try { get().updateCommunityProgress(1); } catch (_) {}
      get().updateVistaState(type);
      get().checkAchievements(type);
      get().saveData();
    } catch (e) {
      console.error('addHealthLog error:', e);
    }
  },  
  // Credits API
  addCredits: (amount, source = 'action', combo = false) => {
    set((state) => {
      const now = Date.now();
      const last = state.pet.lastLogTime || 0;
      const withinCombo = now - last <= 5 * 60 * 1000; // 5 minutes
      const multiplier = combo || withinCombo ? 2 : 1;
      const earned = amount * multiplier;
      const pet = { ...state.pet };
      pet.careCredits = (pet.careCredits || 0) + earned;
      pet.totalCreditsEarned = (pet.totalCreditsEarned || 0) + earned;
      pet.lastLogTime = now;
      const creditHistory = [
        ...(pet.creditHistory || []),
        { ts: now, amount: earned, base: amount, source, multiplier },
      ].slice(-200);
      pet.creditHistory = creditHistory;
      return { pet };
    });
    // milestone checks
    const total = get().pet.totalCreditsEarned;
    if (total >= 100) get().unlockAchievement?.('credits_100_getting_started');
    if (total >= 500) get().unlockAchievement?.('credits_500_accessory');
    if (total >= 1000) get().unlockAchievement?.('credits_1000_env_upgrade');
    get().saveData();
  },

  // Storefront: purchase and equip
  purchaseItem: (itemType, itemId, cost) => {
    set((state) => {
      const pet = { ...state.pet };
      const customization = { ...(pet.customization || {}) };
      const unlocked = { ...(customization.unlockedItems || {}) };
      const list = new Set(unlocked[itemType] || []);
      if (list.has(itemId)) return {};
      if ((pet.careCredits || 0) < cost) return {};
      list.add(itemId);
      unlocked[itemType] = Array.from(list);
      customization.unlockedItems = unlocked;
      // auto-equip first purchase in category
      const toKey = (t) => (t === 'colors' ? 'color' : t === 'accessories' ? 'accessory' : t === 'effects' ? 'effect' : t === 'environments' ? 'environment' : t);
      const equipKey = toKey(itemType);
      if (!customization.equippedItems[equipKey]) {
        customization.equippedItems = { ...(customization.equippedItems || {}), [equipKey]: itemId };
      }
      pet.customization = customization;
      pet.careCredits = (pet.careCredits || 0) - cost;
      return { pet };
    });
    get().saveData();
  },
  equipItem: (itemType, itemId) => {
    set((state) => {
      const pet = { ...state.pet };
      const customization = { ...(pet.customization || {}) };
      const unlocked = new Set(((customization.unlockedItems || {})[itemType] || []));
      if (!unlocked.has(itemId)) return {};
      const key = itemType === 'colors' ? 'color' : itemType === 'accessories' ? 'accessory' : itemType === 'effects' ? 'effect' : itemType === 'environments' ? 'environment' : itemType;
      customization.equippedItems = { ...(customization.equippedItems || {}), [key]: itemId };
      pet.customization = customization;
      return { pet };
    });
    get().saveData();
  },
  updatePetStatus: (actionType) => {
    set((state) => {
      const pet = { ...state.pet };
      
      // Update pet stats based on action
      switch (actionType) {
        case 'hydration':
          pet.health = Math.min(100, pet.health + 5);
          pet.energy = Math.min(100, pet.energy + 2);
          break;
        case 'energy':
          pet.energy = Math.min(100, pet.energy + 5);
          pet.happiness = Math.min(100, pet.happiness + 3);
          break;
        case 'gut':
          pet.health = Math.min(100, pet.health + 4);
          pet.happiness = Math.min(100, pet.happiness + 2);
          break;
        default:
          pet.happiness = Math.min(100, pet.happiness + 2);
      }
      
      // Add care credits
      pet.careCredits += 10;
      
      // Check for level up
      if (pet.careCredits >= pet.level * 100) {
        pet.level += 1;
        // environment progression can be added later
      }
      
      return { pet };
    });
  },
  
  updateVistaState: (tabType) => {
    set((state) => {
      const vistaStates = { ...state.vistaStates };
      
      // Update vista based on recent activity
      switch (tabType) {
        case 'hydration':
          vistaStates.fluidFlow.hydrationLevel = Math.max(1, vistaStates.fluidFlow.hydrationLevel - 1);
          vistaStates.fluidFlow.gardenHealth = 'thriving';
          break;
        case 'energy':
          const energyLogs = state.healthLogs.energy || [];
          const lastStatus = [...energyLogs].reverse().find((l) => l.type === 'status' && typeof l.value === 'number');
          let energyLevel = 'neutral';
          if (lastStatus) {
            if (lastStatus.value <= 1) {
              energyLevel = 'drained';
            } else if (lastStatus.value <= 3) {
              energyLevel = 'neutral';
            } else {
              energyLevel = 'charged';
            }
          }
          vistaStates.vitality.energyLevel = energyLevel;
          vistaStates.vitality.sunlight = energyLevel === 'charged' ? 'bright' : energyLevel === 'drained' ? 'dim' : 'medium';
          break;
        case 'gut':
          const gutLogs = state.healthLogs.gut || [];
          const lastGutStatus = [...gutLogs].reverse().find((l) => l.type === 'status' && typeof l.value === 'number');
          if (lastGutStatus) {
            if (lastGutStatus.value <= 2) {
              vistaStates.gut.gardenGrowth = 'troubled';
            } else if (lastGutStatus.value === 3) {
              vistaStates.gut.gardenGrowth = 'wilting';
            } else if (lastGutStatus.value === 4) {
              vistaStates.gut.gardenGrowth = 'sprouting';
            } else {
              vistaStates.gut.gardenGrowth = 'blooming';
            }
          } else {
            vistaStates.gut.gardenGrowth = 'sprouting';
          }
          vistaStates.gut.soilHealth = vistaStates.gut.gardenGrowth === 'troubled' ? 'dry' : 'rich';
          break;
        case 'headVision':
          const hvLogs = state.healthLogs.headVision || [];
          const lastStress = [...hvLogs].reverse().find((l) => l.type === 'status' && typeof l.value === 'number');
          if (lastStress) {
            if (lastStress.value <= 2) {
              vistaStates.mindRadar.atmosphere = 'stormy';
            } else if (lastStress.value === 3) {
              vistaStates.mindRadar.atmosphere = 'cloudy';
            } else {
              vistaStates.mindRadar.atmosphere = 'clear';
            }
          } else {
            vistaStates.mindRadar.atmosphere = 'cloudy';
          }
          break;
        case 'skin':
          const skinLogs = state.healthLogs.skin || [];
          const lastSkinStatus = [...skinLogs].reverse().find((l) => l.type === 'status' && typeof l.value === 'number');
          if (lastSkinStatus) {
            if (lastSkinStatus.value <= 2) {
              vistaStates.dermalMap.seasonalState = 'desert';
            } else if (lastSkinStatus.value === 3) {
              vistaStates.dermalMap.seasonalState = 'balanced';
            } else {
              vistaStates.dermalMap.seasonalState = 'sunshine';
            }
          } else {
            vistaStates.dermalMap.seasonalState = 'balanced';
          }
          break;
      }
      
      return { vistaStates };
    });
  },  

  unlockAchievement: (id) => {
    set((state) => {
      if (state.achievements.unlockedIds.includes(id)) return {};
      const unlockedIds = [...state.achievements.unlockedIds, id];
      return { achievements: { ...state.achievements, unlockedIds, toasts: [...(state.achievements.toasts || []), id] } };
    });
    get().saveData();
  },

  clearAchievementToast: () => {
    set((state) => ({
      achievements: {
        ...state.achievements,
        toasts: (state.achievements.toasts || []).slice(1)
      }
    }));
  },

  checkAchievements: (loggedModule) => {
    const state = get();
    const now = new Date();
    const todayKey = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    // Streaks
    set((s) => {
      const last = s.achievements.lastLogDate ? new Date(s.achievements.lastLogDate) : null;
      let streakDays = s.achievements.streakDays || 0;
      if (!last) {
        streakDays = 1;
      } else {
        const diffDays = Math.floor((now - new Date(last.getFullYear(), last.getMonth(), last.getDate())) / 86400000);
        if (diffDays === 0) {
          // same day
        } else if (diffDays === 1) {
          streakDays += 1;
        } else if (diffDays > 1) {
          streakDays = 1;
        }
      }
      return { achievements: { ...s.achievements, lastLogDate: todayKey, streakDays } };
    });

    // Module counts + mastery unlocks
    set((s) => {
      const counts = { ...s.achievements.moduleCounts };
      counts[loggedModule] = (counts[loggedModule] || 0) + 1;
      return { achievements: { ...s.achievements, moduleCounts: counts } };
    });
    const counts = get().achievements.moduleCounts;
    ACHIEVEMENTS.mastery
      .filter((m) => m.module === loggedModule)
      .forEach((m) => {
        if (counts[loggedModule] >= m.target) get().unlockAchievement(m.id);
        const prog = Math.min(1, (counts[loggedModule] || 0) / m.target);
        set((s) => ({ achievements: { ...s.achievements, progress: { ...s.achievements.progress, [m.id]: prog } } }));
      });

    // Streak thresholds
    const streakDays = get().achievements.streakDays;
    ACHIEVEMENTS.streaks.forEach((sDef) => {
      const prog = Math.min(1, streakDays / sDef.target);
      set((s) => ({ achievements: { ...s.achievements, progress: { ...s.achievements.progress, [sDef.id]: prog } } }));
      if (streakDays >= sDef.target) get().unlockAchievement(sDef.id);
    });

    // Balance: all modules logged today
    const allToday = MODULE_KEYS.every((k) => (state.healthLogs[k] || []).some((l) => new Date(l.timestamp).toDateString() === now.toDateString()));
    if (allToday) {
      // increment balanced days if new day
      set((s) => {
        const lastBal = s.achievements.lastBalancedDate ? new Date(s.achievements.lastBalancedDate) : null;
        let balancedDays = s.achievements.balancedDays || 0;
        if (!lastBal || lastBal.toDateString() !== now.toDateString()) {
          balancedDays += 1;
        }
        return { achievements: { ...s.achievements, lastBalancedDate: todayKey, balancedDays } };
      });
      const balancedDays = get().achievements.balancedDays;
      ACHIEVEMENTS.balance.forEach((b) => {
        const prog = Math.min(1, balancedDays / b.target);
        set((s) => ({ achievements: { ...s.achievements, progress: { ...s.achievements.progress, [b.id]: prog } } }));
        if (balancedDays >= b.target) get().unlockAchievement(b.id);
      });
    }

    // Special time-based
    const hour = now.getHours();
    if (hour >= 22) get().unlockAchievement('special_night_owl');
    if (hour < 6) get().unlockAchievement('special_early_bird');

    // Explorer basics
    const triedAll = MODULE_KEYS.every((k) => (get().achievements.moduleCounts[k] || 0) > 0);
    if (triedAll) get().unlockAchievement('explorer_try_all');
    if (streakDays >= 7) get().unlockAchievement('explorer_first_week');
    // environment upgrades
    get().checkEnvironmentUpgrade();
  },
  checkEnvironmentUpgrade: () => {
    set((state) => {
      const pet = { ...state.pet };
      const now = Date.now();
      const credits = pet.totalCreditsEarned || 0;
      const streak = state.achievements.streakDays || 0;
      const nextLevel = pet.petEnvironmentLevel || 0;
      let targetLevel = nextLevel;
      if (streak >= 60 && credits >= 3000) targetLevel = Math.max(targetLevel, 4);
      else if (streak >= 30 && credits >= 1500) targetLevel = Math.max(targetLevel, 3);
      else if (streak >= 14 && credits >= 500) targetLevel = Math.max(targetLevel, 2);
      else if (streak >= 7) targetLevel = Math.max(targetLevel, 1);
      if (targetLevel > nextLevel) {
        pet.petEnvironmentLevel = targetLevel;
        pet.environmentUnlockDates = { ...(pet.environmentUnlockDates || {}), [targetLevel]: now };
      }
      return { pet };
    });
  },
  
  saveData: async () => {
    try {
      if (__persistTimer) clearTimeout(__persistTimer);
      __persistTimer = setTimeout(async () => {
        try {
          const state = get();
          const dataToSave = {
            user: state.user,
            pet: {
              ...state.pet,
              lastLogTime: state.pet.lastLogTime || 0,
              creditHistory: (state.pet.creditHistory || []).slice(-50),
            },
            healthLogs: state.healthLogs,
            achievements: { ...state.achievements, lastLogDate: state.achievements.lastLogDate || null },
            notifications: state.notifications,
            activeMissions: state.activeMissions || [],
            completedMissions: state.completedMissions || [],
            missionProgress: state.missionProgress || {},
        neighborhoodData: state.neighborhoodData || [],
        communityStats: state.communityStats || { totalLogs: 0, activeUsers: 0, weeklyGoal: 1000, unlocked: null },
          };
          const jsonString = JSON.stringify(dataToSave);
          await AsyncStorage.setItem('userData', jsonString);
        } catch (saveError) {
          console.error('AsyncStorage save error:', saveError);
        }
      }, 250);
    } catch (error) {
      console.error('SaveData wrapper error:', error);
    }
  },
  generateMockNeighbors: () => {
    const petTypes = ['dog', 'cat', 'bunny', 'axolotl'];
    const rnd = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const now = Date.now();
    const neighbors = Array.from({ length: 12 }).map((_, i) => ({
      id: `nbr_${i + 1}`,
      petType: petTypes[rnd(0, petTypes.length - 1)],
      health: rnd(40, 95),
      streakDays: rnd(0, 30),
      activeToday: Math.random() > 0.3,
      lastLogTime: now - rnd(0, 48) * 3600 * 1000,
    }));
    set(() => ({ neighborhoodData: neighbors, communityStats: { totalLogs: rnd(200, 800), activeUsers: rnd(20, 60), weeklyGoal: 1000, unlocked: null } }));
    get().saveData();
  },
  updateCommunityProgress: (increment = 1) => {
    set((state) => {
      const stats = { ...(state.communityStats || { totalLogs: 0, activeUsers: 0, weeklyGoal: 1000 }) };
      stats.totalLogs = (stats.totalLogs || 0) + increment;
      if (stats.totalLogs >= (stats.weeklyGoal || 1000) && !stats.unlocked) {
        stats.unlocked = 'dog_park';
      }
      return { communityStats: stats };
    });
    get().saveData();
  },
  refreshWeeklyMissions: () => {
    const { missionTemplates } = require('../utils/missionsData');
    set((state) => {
      // pick 3 random missions not recently completed
      const pool = missionTemplates.filter((m) => !state.completedMissions?.includes(m.id));
      const selected = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
      return { activeMissions: selected, missionProgress: {} };
    });
    get().saveData();
  },
  updateMissionProgress: (missionId, increment = 1) => {
    set((state) => ({ missionProgress: { ...(state.missionProgress || {}), [missionId]: (state.missionProgress?.[missionId] || 0) + increment } }));
    get().saveData();
  },
  completeMission: (missionId) => {
    set((state) => {
      const mission = (state.activeMissions || []).find((m) => m.id === missionId);
      if (!mission) return {};
      const pet = { ...state.pet };
      pet.careCredits = (pet.careCredits || 0) + (mission.reward?.credits || 0);
      pet.totalCreditsEarned = (pet.totalCreditsEarned || 0) + (mission.reward?.credits || 0);
      const completedMissions = Array.from(new Set([...(state.completedMissions || []), missionId]));
      const activeMissions = (state.activeMissions || []).filter((m) => m.id !== missionId);
      return { pet, completedMissions, activeMissions };
    });
    get().saveData();
  },
}));

export { useStore };