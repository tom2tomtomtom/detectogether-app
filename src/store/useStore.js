import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStore = create((set, get) => ({
  // User State
  user: {
    name: '',
    petType: null, // 'dog' or 'cat'
    petName: '',
    onboardingComplete: false,
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
  getNextEnvironment: (level) => {
    const environments = [
      'starter_room',
      'cozy_apartment',
      'garden_yard',
      'park_space',
      'dream_home',
    ];
    return environments[Math.min(level - 1, environments.length - 1)];
  },
  
  saveData: async () => {
    try {
      const state = get();
      const dataToSave = {
        user: state.user,
        pet: state.pet,
        healthLogs: state.healthLogs,
      };
      await AsyncStorage.setItem('userData', JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  },
}));

export { useStore };