import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACHIEVEMENTS, ALL_ACHIEVEMENTS, MODULE_KEYS } from '../utils/achievements';

const useStore = create((set, get) => ({
  // User State
  user: {
    name: '',
    petType: null, // 'dog' or 'cat'
    petName: '',
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
    environment: 'starter_room',
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
        }));
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
    set((state) => ({
      healthLogs: {
        ...state.healthLogs,
        [type]: [...state.healthLogs[type], { ...logData, timestamp: new Date() }],
      },
    }));
    get().updatePetStatus(type);
    get().updateVistaState(type);
    get().checkAchievements(type);
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
        pet.environment = get().getNextEnvironment(pet.level);
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
  },
  
  saveData: async () => {
    try {
      const state = get();
      const dataToSave = {
        user: state.user,
        pet: state.pet,
        healthLogs: state.healthLogs,
        achievements: state.achievements,
        notifications: state.notifications,
      };
      await AsyncStorage.setItem('userData', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },
}));

export { useStore };