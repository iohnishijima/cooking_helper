/**
 * Safe Calculation Utilities for Cooking Helper
 *
 * This module provides safe calculation functions that handle edge cases
 * which were not fully addressed in the core implementation.
 */

/**
 * Safely calculates scaled amount with proper error handling
 *
 * This is an improved version of the getScaledAmount function in App.tsx
 * that handles:
 * - Division by zero (when baseServings is 0)
 * - NaN/Infinity results
 * - Empty or non-numeric inputs
 *
 * @param amount - Original ingredient amount
 * @param baseServings - Original number of servings
 * @param targetServings - Target number of servings
 * @param precision - Decimal places for result (default: 1)
 * @returns Scaled amount or empty string on error
 */
export function safeGetScaledAmount(
  amount: string,
  baseServings: string,
  targetServings: string,
  precision: number = 1
): string {
  // Handle empty input
  if (amount === '' || baseServings === '' || targetServings === '') {
    return '';
  }

  // Parse values
  const amountNum = Number(amount);
  const baseNum = Number(baseServings);
  const targetNum = Number(targetServings);

  // Validate numeric values
  if (isNaN(amountNum) || isNaN(baseNum) || isNaN(targetNum)) {
    return '';
  }

  // Prevent division by zero
  if (baseNum === 0) {
    console.warn('Division by zero prevented in safeGetScaledAmount');
    return '';
  }

  // Prevent negative values (doesn't make sense for recipe scaling)
  if (baseNum < 0 || targetNum < 0) {
    return '';
  }

  // Calculate ratio
  const ratio = targetNum / baseNum;

  // Check for infinite or NaN ratio
  if (!isFinite(ratio) || isNaN(ratio)) {
    console.warn('Invalid ratio calculated in safeGetScaledAmount');
    return '';
  }

  // Calculate scaled amount
  const scaled = amountNum * ratio;

  // Check for invalid result
  if (!isFinite(scaled) || isNaN(scaled)) {
    console.warn('Invalid scaled amount calculated in safeGetScaledAmount');
    return '';
  }

  // Format result
  return scaled.toFixed(precision);
}

/**
 * Safely calculates microwave heating time conversion
 *
 * Handles edge cases:
 * - Division by zero (when targetW is 0)
 * - Negative values
 * - Extremely large time values
 *
 * @param origW - Original wattage
 * @param origMin - Original minutes
 * @param origSec - Original seconds
 * @param targetW - Target wattage
 * @returns Object with min and sec, or null on error
 */
export function safeMicrowaveCalculation(
  origW: string,
  origMin: string,
  origSec: string,
  targetW: string
): { min: number; sec: number } | null {
  // Parse values
  const origWNum = Number(origW);
  const targetWNum = Number(targetW);
  const origMinNum = Number(origMin);
  const origSecNum = Number(origSec);

  // Validate inputs
  if (
    isNaN(origWNum) || isNaN(targetWNum) ||
    isNaN(origMinNum) || isNaN(origSecNum)
  ) {
    return null;
  }

  // Prevent division by zero
  if (targetWNum === 0) {
    console.warn('Division by zero prevented in microwave calculation');
    return { min: 0, sec: 0 };
  }

  // Prevent negative values
  if (origWNum < 0 || targetWNum < 0 || origMinNum < 0 || origSecNum < 0) {
    return null;
  }

  // Calculate total seconds
  const microwaveTotalSec = (origMinNum * 60) + origSecNum;

  // Calculate converted time
  const microwaveCalculatedSec = (origWNum * microwaveTotalSec) / targetWNum;

  // Check for invalid result
  if (!isFinite(microwaveCalculatedSec)) {
    return null;
  }

  // Handle extremely large values (cap at reasonable max)
  const MAX_SECONDS = 3600; // 1 hour max
  const clampedSec = Math.min(microwaveCalculatedSec, MAX_SECONDS);

  return {
    min: Math.floor(clampedSec / 60),
    sec: Math.round(clampedSec % 60)
  };
}

/**
 * Safely converts between units (tbsp, tsp, grams)
 *
 * Handles edge cases:
 * - Non-numeric input
 * - Negative values
 * - Extremely large values
 */
export function safeFromTbsp(tbspValue: string, weightPerTbsp: number): {
  tbsp: string;
  tsp: string;
  grams: string;
} {
  if (!tbspValue || tbspValue === '') {
    return { tbsp: '', tsp: '', grams: '' };
  }

  const num = Number(tbspValue);

  if (isNaN(num)) {
    return { tbsp: tbspValue, tsp: '', grams: '' };
  }

  if (num < 0) {
    return { tbsp: '0', tsp: '0', grams: '0' };
  }

  // Cap at reasonable max
  const MAX_VALUE = 1000;
  const clampedNum = Math.min(num, MAX_VALUE);

  return {
    tbsp: clampedNum.toString(),
    tsp: (clampedNum * 3).toFixed(1),
    grams: (clampedNum * weightPerTbsp).toFixed(1),
  };
}

export function safeFromTsp(tspValue: string, weightPerTbsp: number): {
  tbsp: string;
  tsp: string;
  grams: string;
} {
  if (!tspValue || tspValue === '') {
    return { tbsp: '', tsp: '', grams: '' };
  }

  const num = Number(tspValue);

  if (isNaN(num)) {
    return { tbsp: '', tsp: tspValue, grams: '' };
  }

  if (num < 0) {
    return { tbsp: '0', tsp: '0', grams: '0' };
  }

  const MAX_VALUE = 1000;
  const clampedNum = Math.min(num, MAX_VALUE);

  const tbspVal = clampedNum / 3;
  return {
    tbsp: tbspVal.toFixed(2),
    tsp: clampedNum.toString(),
    grams: (tbspVal * weightPerTbsp).toFixed(1),
  };
}

export function safeFromGrams(gramsValue: string, weightPerTbsp: number): {
  tbsp: string;
  tsp: string;
  grams: string;
} {
  if (!gramsValue || gramsValue === '') {
    return { tbsp: '', tsp: '', grams: '' };
  }

  const num = Number(gramsValue);

  if (isNaN(num)) {
    return { tbsp: '', tsp: '', grams: gramsValue };
  }

  if (num < 0) {
    return { tbsp: '0', tsp: '0', grams: '0' };
  }

  const MAX_VALUE = 10000;
  const clampedNum = Math.min(num, MAX_VALUE);

  const tbspVal = clampedNum / weightPerTbsp;
  return {
    tbsp: isFinite(tbspVal) ? tbspVal.toFixed(2) : '0',
    tsp: isFinite(tbspVal * 3) ? (tbspVal * 3).toFixed(2) : '0',
    grams: clampedNum.toString(),
  };
}

/**
 * Type guard to check if a value is a valid numeric string
 */
export function isValidNumericString(value: string): boolean {
  if (value === '' || value === '-') return false;
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
}
