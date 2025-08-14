export const missionTemplates = [
  {
    id: 'hydration_hero',
    title: 'Hydration Hero',
    description: 'Log 5 hydration entries',
    target: 5,
    reward: { credits: 100, badge: 'water_warrior' },
    type: 'fluid',
    icon: '💧',
  },
  {
    id: 'energy_tracker',
    title: 'Energy Explorer',
    description: 'Track energy 3 days in a row',
    target: 3,
    reward: { credits: 150, item: 'energy_boost_effect' },
    type: 'vitality',
    icon: '⚡',
  },
  {
    id: 'full_check',
    title: 'Daily Champion',
    description: 'Complete all 5 modules in one day',
    target: 5,
    reward: { credits: 250, environment: 'bonus_decoration' },
    type: 'combo',
    icon: '🏆',
  },
  {
    id: 'community_goal',
    title: 'Neighborhood Challenge',
    description: 'Help reach 1000 community logs',
    target: 1000,
    reward: { credits: 50, unlock: 'dog_park' },
    type: 'community',
    icon: '🏘️',
  },
];


