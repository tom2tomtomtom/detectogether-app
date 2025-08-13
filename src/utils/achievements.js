export const ACHIEVEMENTS = {
  streaks: [
    { id: 'streak_7', title: '7-Day Streak', points: 50, target: 7 },
    { id: 'streak_30', title: '30-Day Streak', points: 150, target: 30 },
    { id: 'streak_100', title: '100-Day Streak', points: 500, target: 100 },
  ],
  mastery: [
    { id: 'mastery_hydration_10', module: 'hydration', title: 'Hydration Novice (10)', points: 20, target: 10 },
    { id: 'mastery_hydration_50', module: 'hydration', title: 'Hydration Pro (50)', points: 60, target: 50 },
    { id: 'mastery_hydration_100', module: 'hydration', title: 'Hydration Master (100)', points: 120, target: 100 },
    { id: 'mastery_energy_10', module: 'energy', title: 'Energy Novice (10)', points: 20, target: 10 },
    { id: 'mastery_energy_50', module: 'energy', title: 'Energy Pro (50)', points: 60, target: 50 },
    { id: 'mastery_energy_100', module: 'energy', title: 'Energy Master (100)', points: 120, target: 100 },
    { id: 'mastery_gut_10', module: 'gut', title: 'Gut Novice (10)', points: 20, target: 10 },
    { id: 'mastery_gut_50', module: 'gut', title: 'Gut Pro (50)', points: 60, target: 50 },
    { id: 'mastery_gut_100', module: 'gut', title: 'Gut Master (100)', points: 120, target: 100 },
    { id: 'mastery_mind_10', module: 'headVision', title: 'Mind Novice (10)', points: 20, target: 10 },
    { id: 'mastery_mind_50', module: 'headVision', title: 'Mind Pro (50)', points: 60, target: 50 },
    { id: 'mastery_mind_100', module: 'headVision', title: 'Mind Master (100)', points: 120, target: 100 },
    { id: 'mastery_skin_10', module: 'skin', title: 'Skin Novice (10)', points: 20, target: 10 },
    { id: 'mastery_skin_50', module: 'skin', title: 'Skin Pro (50)', points: 60, target: 50 },
    { id: 'mastery_skin_100', module: 'skin', title: 'Skin Master (100)', points: 120, target: 100 },
  ],
  balance: [
    { id: 'balance_1', title: 'Balanced Day', points: 25, target: 1 },
    { id: 'balance_7', title: 'Balanced Week', points: 100, target: 7 },
    { id: 'balance_30', title: 'Balanced Month', points: 300, target: 30 },
  ],
  explorer: [
    { id: 'explorer_try_all', title: 'Explorer: Try All', points: 30 },
    { id: 'explorer_first_week', title: 'Explorer: First Week', points: 80 },
  ],
  special: [
    { id: 'special_night_owl', title: 'Night Owl', description: 'Log after 10pm', points: 25 },
    { id: 'special_early_bird', title: 'Early Bird', description: 'Log before 6am', points: 25 },
  ],
};

export const ALL_ACHIEVEMENTS = [
  ...ACHIEVEMENTS.streaks,
  ...ACHIEVEMENTS.mastery,
  ...ACHIEVEMENTS.balance,
  ...ACHIEVEMENTS.explorer,
  ...ACHIEVEMENTS.special,
];

export const MODULE_KEYS = ['hydration', 'energy', 'gut', 'headVision', 'skin'];
