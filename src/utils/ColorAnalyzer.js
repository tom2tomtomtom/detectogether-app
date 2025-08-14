/**
 * ColorAnalyzer.js
 * Utilities for analyzing health-related photos
 * Currently provides mock analysis - to be enhanced with real image processing
 */

// Urine color scale mapping
const URINE_COLOR_SCALE = {
  1: { color: '#F5F5DC', status: 'Excellent hydration', hydration: 'optimal' },
  2: { color: '#FFFACD', status: 'Good hydration', hydration: 'good' },
  3: { color: '#F0E68C', status: 'Adequate hydration', hydration: 'adequate' },
  4: { color: '#DAA520', status: 'Mild dehydration', hydration: 'mild_dehydration' },
  5: { color: '#B8860B', status: 'Moderate dehydration', hydration: 'moderate_dehydration' },
  6: { color: '#8B4513', status: 'Severe dehydration', hydration: 'severe_dehydration' },
  7: { color: '#A0522D', status: 'Very severe dehydration', hydration: 'very_severe' },
  8: { color: '#800080', status: 'Medical attention needed', hydration: 'medical' }
};

// Bristol Stool Scale
const BRISTOL_SCALE = {
  1: { 
    type: 'Type 1 - Severe Constipation',
    description: 'Separate hard lumps, like nuts',
    recommendation: 'Increase fiber and water intake'
  },
  2: { 
    type: 'Type 2 - Mild Constipation',
    description: 'Sausage-shaped but lumpy',
    recommendation: 'Add more fiber to diet'
  },
  3: { 
    type: 'Type 3 - Normal',
    description: 'Like a sausage but with cracks',
    recommendation: 'Good digestive health'
  },
  4: { 
    type: 'Type 4 - Ideal',
    description: 'Smooth and soft sausage',
    recommendation: 'Excellent digestive health'
  },
  5: { 
    type: 'Type 5 - Lack of Fiber',
    description: 'Soft blobs with clear edges',
    recommendation: 'Consider increasing fiber'
  },
  6: { 
    type: 'Type 6 - Mild Diarrhea',
    description: 'Fluffy pieces with ragged edges',
    recommendation: 'Monitor hydration and diet'
  },
  7: { 
    type: 'Type 7 - Diarrhea',
    description: 'Watery, no solid pieces',
    recommendation: 'Seek medical advice if persistent'
  }
};

// Skin condition indicators
const SKIN_CONDITIONS = [
  { name: 'Clear', score: 5, color: '#90EE90' },
  { name: 'Minor Redness', score: 4, color: '#FFB6C1' },
  { name: 'Moderate Irritation', score: 3, color: '#FFA07A' },
  { name: 'Significant Concern', score: 2, color: '#FF6347' },
  { name: 'Medical Attention', score: 1, color: '#DC143C' }
];

/**
 * Analyzes urine color from photo
 * @param {string} imageUri - Path to the captured image
 * @returns {Object} Analysis results
 */
export const analyzeUrineColor = (imageUri) => {
  // Mock analysis - in real implementation, this would process the image
  const mockColorLevel = Math.floor(Math.random() * 8) + 1;
  const colorData = URINE_COLOR_SCALE[mockColorLevel];
  
  const confidence = 0.75 + Math.random() * 0.2; // 75-95% confidence
  
  return {
    colorLevel: mockColorLevel,
    detectedColor: colorData.color,
    hydrationStatus: colorData.status,
    hydrationLevel: colorData.hydration,
    recommendation: getHydrationRecommendation(colorData.hydration),
    confidence: Math.round(confidence * 100) / 100,
    timestamp: new Date().toISOString(),
    imageUri
  };
};

/**
 * Analyzes stool characteristics
 * @param {string} imageUri - Path to the captured image
 * @returns {Object} Analysis results
 */
export const analyzeStoolType = (imageUri) => {
  // Mock analysis
  const bristolType = Math.floor(Math.random() * 7) + 1;
  const scaleData = BRISTOL_SCALE[bristolType];
  
  const confidence = 0.70 + Math.random() * 0.25;
  
  return {
    bristolType,
    typeDescription: scaleData.type,
    characteristics: scaleData.description,
    recommendation: scaleData.recommendation,
    confidence: Math.round(confidence * 100) / 100,
    colorNotes: getStoolColorNotes(),
    timestamp: new Date().toISOString(),
    imageUri
  };
};

/**
 * Analyzes skin condition
 * @param {string} imageUri - Path to the captured image
 * @param {string} bodyArea - Area of body being analyzed
 * @returns {Object} Analysis results
 */
export const analyzeSkinCondition = (imageUri, bodyArea = 'general') => {
  // Mock analysis
  const conditionIndex = Math.floor(Math.random() * SKIN_CONDITIONS.length);
  const condition = SKIN_CONDITIONS[conditionIndex];
  
  const confidence = 0.65 + Math.random() * 0.3;
  
  return {
    condition: condition.name,
    score: condition.score,
    color: condition.color,
    bodyArea,
    concerns: generateSkinConcerns(condition.score),
    recommendation: getSkinRecommendation(condition.score, bodyArea),
    confidence: Math.round(confidence * 100) / 100,
    timestamp: new Date().toISOString(),
    imageUri
  };
};

/**
 * Gets hydration recommendations based on level
 */
const getHydrationRecommendation = (hydrationLevel) => {
  const recommendations = {
    optimal: 'Excellent! Maintain current hydration habits.',
    good: 'Good hydration. Keep it up!',
    adequate: 'Drink an extra glass of water today.',
    mild_dehydration: 'Drink 2-3 glasses of water within the next hour.',
    moderate_dehydration: 'Increase water intake significantly. Drink 4-5 glasses over the next 2 hours.',
    severe_dehydration: 'Drink water immediately and monitor symptoms. Consider electrolyte replacement.',
    very_severe: 'Seek medical attention. Drink fluids immediately.',
    medical: 'Consult a healthcare provider immediately.'
  };
  
  return recommendations[hydrationLevel] || 'Monitor hydration levels.';
};

/**
 * Generates random stool color observations
 */
const getStoolColorNotes = () => {
  const colors = [
    'Normal brown color',
    'Slightly darker than normal',
    'Light brown color',
    'Golden brown color'
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Generates skin concerns based on score
 */
const generateSkinConcerns = (score) => {
  if (score >= 4) return [];
  
  const possibleConcerns = [
    'Mild redness detected',
    'Slight texture changes',
    'Minor discoloration',
    'Possible irritation',
    'Dryness indicators',
    'Surface irregularities'
  ];
  
  const numConcerns = score <= 2 ? 2 : 1;
  const shuffled = possibleConcerns.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numConcerns);
};

/**
 * Gets skin care recommendations
 */
const getSkinRecommendation = (score, bodyArea) => {
  if (score >= 4) {
    return 'Skin appears healthy. Continue current care routine.';
  } else if (score === 3) {
    return 'Monitor for changes. Consider gentle moisturizing.';
  } else if (score === 2) {
    return 'Consider using gentle, fragrance-free products. Monitor closely.';
  } else {
    return 'Consider consulting a dermatologist for proper evaluation.';
  }
};

/**
 * Extracts dominant colors from image (mock implementation)
 * In real implementation, this would use image processing libraries
 */
export const extractDominantColors = (imageUri) => {
  // Mock color extraction
  const mockColors = [
    '#F5F5DC', '#FFFACD', '#F0E68C', '#DAA520', 
    '#B8860B', '#8B4513', '#A0522D', '#800080'
  ];
  
  const numColors = Math.floor(Math.random() * 3) + 1;
  const shuffled = mockColors.sort(() => 0.5 - Math.random());
  
  return shuffled.slice(0, numColors).map(color => ({
    color,
    percentage: Math.random() * 40 + 10 // 10-50%
  }));
};

/**
 * Validates if image is suitable for analysis
 */
export const validateImageQuality = (imageUri) => {
  // Mock validation - in real implementation, check lighting, blur, etc.
  const quality = Math.random();
  
  return {
    isValid: quality > 0.3,
    quality: quality > 0.8 ? 'excellent' : quality > 0.6 ? 'good' : quality > 0.3 ? 'fair' : 'poor',
    issues: quality <= 0.3 ? ['Poor lighting', 'Image too blurry'] : [],
    suggestions: quality <= 0.6 ? ['Ensure good lighting', 'Hold camera steady'] : []
  };
};

export default {
  analyzeUrineColor,
  analyzeStoolType,
  analyzeSkinCondition,
  extractDominantColors,
  validateImageQuality
};
