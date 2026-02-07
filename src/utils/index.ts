/**
 * Utility exports for edge case handling
 *
 * This file provides a centralized export point for all edge case
 * utilities, making it easier to import them into components.
 */

// Validators
export {
  validateAmount,
  validateIngredientName,
  validateServings,
  validateWattage,
  validateTime,
  safeDivision,
  formatResult,
  validateIngredientsList,
  type ValidationResult,
  LIMITS
} from './edgeCaseValidators';

// Formatters
export {
  truncateText,
  formatEmptyValue,
  safeNumericFormat,
  formatTimeDisplay,
  getEmptyIngredientsMessage,
  getInvalidSeasoningMessage,
  hasSpecialChars,
  escapeHtml,
  formatErrorMessage,
  getCalculationErrorMessage,
  formatScaledAmount
} from './edgeCaseFormatters';

// Safe calculations
export {
  safeGetScaledAmount,
  safeMicrowaveCalculation,
  safeFromTbsp,
  safeFromTsp,
  safeFromGrams,
  isValidNumericString
} from './safeCalculation';
