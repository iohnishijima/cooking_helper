/**
 * Edge Case Formatters for Cooking Helper
 *
 * This module provides formatting utilities for displaying data safely
 * in various edge case scenarios.
 */

/**
 * Truncates text to a maximum length with ellipsis
 */
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - 3) + '...';
}

/**
 * Formats a display value for empty states
 */
export function formatEmptyValue(value: string | number, placeholder: string = '---'): string {
  if (value === '' || value === null || value === undefined) {
    return placeholder;
  }
  return String(value);
}

/**
 * Safely formats numeric values, handling edge cases
 */
export function safeNumericFormat(
  value: string | number,
  options: {
    decimals?: number;
    fallback?: string;
    allowNegative?: boolean;
  } = {}
): string {
  const { decimals = 1, fallback = '---', allowNegative = false } = options;

  const num = typeof value === 'string' ? Number(value) : value;

  if (isNaN(num)) return fallback;

  if (!allowNegative && num < 0) return fallback;

  if (!isFinite(num)) return fallback;

  return num.toFixed(decimals);
}

/**
 * Formats time display with proper zero-padding
 */
export function formatTimeDisplay(minutes: number, seconds: number): {
  formatted: string;
  isValid: boolean;
} {
  const validMin = Math.max(0, Math.min(Number.isFinite(minutes) ? minutes : 0, 999));
  const validSec = Math.max(0, Math.min(Number.isFinite(seconds) ? seconds : 0, 59));

  return {
    formatted: `${validMin}分 ${validSec}秒`,
    isValid: Number.isFinite(minutes) && Number.isFinite(seconds)
  };
}

/**
 * Displays a message for empty ingredient lists
 */
export function getEmptyIngredientsMessage(): string {
  return '材料がありません。下のボタンから追加してください。';
}

/**
 * Displays a message for invalid seasoning data
 */
export function getInvalidSeasoningMessage(): string {
  return '調味料のデータが無効です。再選択してください。';
}

/**
 * Checks if a string contains special characters that might need escaping
 */
export function hasSpecialChars(text: string): boolean {
  const specialCharsRegex = /[<>"'\/\\]/;
  return specialCharsRegex.test(text);
}

/**
 * Escapes HTML special characters to prevent XSS
 */
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Formats error messages for display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'エラーが発生しました。もう一度お試しください。';
}

/**
 * Returns a user-friendly message for calculation errors
 */
export function getCalculationErrorMessage(errorType: 'division_by_zero' | 'overflow' | 'invalid_input'): string {
  const messages = {
    division_by_zero: '計算できません。除数がゼロです。',
    overflow: '値が大きすぎます。より小さい値を入力してください。',
    invalid_input: '無効な入力です。有効な値を入力してください。'
  };
  return messages[errorType];
}

/**
 * Formats a scaled amount with proper fallbacks
 */
export function formatScaledAmount(
  amount: string,
  baseServings: string,
  targetServings: string,
  precision: number = 1
): string {
  const amountNum = Number(amount);
  const baseNum = Number(baseServings);
  const targetNum = Number(targetServings);

  // Validate inputs
  if (isNaN(amountNum) || amount === '') return '';
  if (isNaN(baseNum) || baseNum <= 0) return '';
  if (isNaN(targetNum) || targetNum <= 0) return '';

  // Calculate ratio safely
  const ratio = targetNum / baseNum;
  if (!isFinite(ratio)) return '';

  const result = amountNum * ratio;
  if (!isFinite(result)) return '';

  return result.toFixed(precision);
}
