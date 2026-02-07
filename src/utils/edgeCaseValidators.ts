/**
 * Edge Case Validators for Cooking Helper
 *
 * This module provides validation and sanitization utilities for handling edge cases
 * that may occur in the Cooking Helper application.
 */

/**
 * Maximum safe values for inputs
 */
export const LIMITS = {
  MAX_INGREDIENT_NAME_LENGTH: 100,
  MAX_AMOUNT_VALUE: 99999,
  MAX_SERVINGS: 1000,
  MAX_WATTAGE: 10000,
  MAX_TIME_MINUTES: 60,
  MAX_TIME_SECONDS: 59,
} as const;

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  sanitizedValue?: string | number;
  errorMessage?: string;
}

/**
 * Validates and sanitizes numeric input for amount fields
 * Handles empty strings, negative values, and excessively large values
 */
export function validateAmount(value: string): ValidationResult {
  // Empty string is valid (user is still typing)
  if (value === '' || value === '-') {
    return { isValid: true, sanitizedValue: '' };
  }

  const num = Number(value);

  // Check if it's a valid number
  if (isNaN(num)) {
    return {
      isValid: false,
      sanitizedValue: '',
      errorMessage: '有効な数値を入力してください'
    };
  }

  // Check for negative values
  if (num < 0) {
    return {
      isValid: false,
      sanitizedValue: '0',
      errorMessage: '負の値は入力できません'
    };
  }

  // Check for excessively large values
  if (num > LIMITS.MAX_AMOUNT_VALUE) {
    return {
      isValid: false,
      sanitizedValue: LIMITS.MAX_AMOUNT_VALUE.toString(),
      errorMessage: `値は ${LIMITS.MAX_AMOUNT_VALUE} 以下である必要があります`
    };
  }

  return { isValid: true, sanitizedValue: value };
}

/**
 * Validates ingredient name length
 */
export function validateIngredientName(name: string): ValidationResult {
  if (name.length > LIMITS.MAX_INGREDIENT_NAME_LENGTH) {
    return {
      isValid: false,
      sanitizedValue: name.substring(0, LIMITS.MAX_INGREDIENT_NAME_LENGTH),
      errorMessage: `材料名は${LIMITS.MAX_INGREDIENT_NAME_LENGTH}文字以内にしてください`
    };
  }

  // Sanitize potentially dangerous characters (XSS prevention)
  const sanitizedName = name
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');

  return { isValid: true, sanitizedValue: sanitizedName };
}

/**
 * Validates servings value
 */
export function validateServings(value: string): ValidationResult {
  if (value === '' || value === '-') {
    return { isValid: true, sanitizedValue: '' };
  }

  const num = Number(value);

  if (isNaN(num)) {
    return {
      isValid: false,
      sanitizedValue: '1',
      errorMessage: '有効な数値を入力してください'
    };
  }

  if (num <= 0) {
    return {
      isValid: false,
      sanitizedValue: '1',
      errorMessage: '人数は1以上である必要があります'
    };
  }

  if (num > LIMITS.MAX_SERVINGS) {
    return {
      isValid: false,
      sanitizedValue: LIMITS.MAX_SERVINGS.toString(),
      errorMessage: `人数は ${LIMITS.MAX_SERVINGS} 以下である必要があります`
    };
  }

  return { isValid: true, sanitizedValue: value };
}

/**
 * Validates wattage value
 */
export function validateWattage(value: string): ValidationResult {
  if (value === '') {
    return { isValid: true, sanitizedValue: '' };
  }

  const num = Number(value);

  if (isNaN(num) || num <= 0) {
    return {
      isValid: false,
      sanitizedValue: '600',
      errorMessage: '有効なワット数を入力してください'
    };
  }

  if (num > LIMITS.MAX_WATTAGE) {
    return {
      isValid: false,
      sanitizedValue: LIMITS.MAX_WATTAGE.toString(),
      errorMessage: `ワット数は ${LIMITS.MAX_WATTAGE} 以下である必要があります`
    };
  }

  return { isValid: true, sanitizedValue: value };
}

/**
 * Validates time values (minutes and seconds)
 */
export function validateTime(value: string, type: 'min' | 'sec'): ValidationResult {
  if (value === '' || value === '-') {
    return { isValid: true, sanitizedValue: '' };
  }

  const num = Number(value);

  if (isNaN(num)) {
    return {
      isValid: false,
      sanitizedValue: '0',
      errorMessage: '有効な時間を入力してください'
    };
  }

  if (num < 0) {
    return {
      isValid: false,
      sanitizedValue: '0',
      errorMessage: '負の値は入力できません'
    };
  }

  const maxValue = type === 'min' ? LIMITS.MAX_TIME_MINUTES : LIMITS.MAX_TIME_SECONDS;

  if (num > maxValue) {
    return {
      isValid: false,
      sanitizedValue: maxValue.toString(),
      errorMessage: `${type === 'min' ? '分' : '秒'}は ${maxValue} 以下である必要があります`
    };
  }

  return { isValid: true, sanitizedValue: value };
}

/**
 * Safe division that handles division by zero
 */
export function safeDivision(numerator: number, denominator: number, fallback: number = 0): number {
  if (denominator === 0 || isNaN(denominator) || isNaN(numerator)) {
    return fallback;
  }
  const result = numerator / denominator;

  // Check for infinity or NaN
  if (!isFinite(result)) {
    return fallback;
  }

  return result;
}

/**
 * Formats a numeric result with safety checks
 */
export function formatResult(value: number, decimals: number = 1): string {
  if (isNaN(value) || !isFinite(value)) {
    return '---';
  }
  return value.toFixed(decimals);
}

/**
 * Validates that an array of ingredients has at least one item
 */
export function validateIngredientsList<T>(ingredients: T[]): {
  isValid: boolean;
  isEmpty: boolean;
} {
  return {
    isValid: ingredients.length > 0,
    isEmpty: ingredients.length === 0
  };
}
