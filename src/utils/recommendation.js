// src/utils/recommendation.js

/**
 * Provides personalized and friendly recommendations based on the difference between indoor and outdoor absolute humidity.
 * @param {number} indoorAH - Indoor absolute humidity in g/m³.
 * @param {number} outdoorAH - Outdoor absolute humidity in g/m³.
 * @returns {string} - Personalized recommendation message.
 */
export const getRecommendation = (indoorAH, outdoorAH) => {
  const difference = indoorAH - outdoorAH;

  if (difference > 0.5) {
    return 'Open your windows to lower the humidity and make your space more comfortable.';
  } else if (difference > 0.3 && difference <= 0.5) {
    return 'Consider opening your windows to reduce indoor humidity.';
  } else if (difference > 0.1 && difference <= 0.3) {
    return 'Open your windows to slightly decrease indoor humidity.';
  } else if (difference >= -0.1 && difference <= 0.1) {
    return 'No action needed right now as indoor and outdoor humidity levels are balanced.';
  } else if (difference >= -0.5 && difference < -0.1) {
    return 'Keep your windows closed to avoid raising your indoor humidity.';
  } else { // difference < -0.5
    return 'Keep your windows closed to prevent indoor humidity from rising significantly.';
  }
};
