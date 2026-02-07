import React, { type InputHTMLAttributes, forwardRef, useState } from 'react';

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * Input type variant
   */
  variant?: 'text' | 'number' | 'tel';

  /**
   * Maximum length for text input
   */
  maxLength?: number;

  /**
   * Minimum value for number input
   */
  min?: number;

  /**
   * Maximum value for number input
   */
  max?: number;

  /**
   * Whether to allow negative values (number input only)
   */
  allowNegative?: boolean;

  /**
   * Custom validation error message
   */
  error?: string;

  /**
   * Called when validation fails
   */
  onValidationError?: (message: string) => void;

  /**
   * Display unit label
   */
  unit?: string;
}

/**
 * SafeInput Component
 *
 * A wrapper around input that handles edge cases:
 * - Text truncation for very long input
 * - Numeric validation with min/max bounds
 * - XSS prevention through sanitization
 * - Visual feedback for validation errors
 */
export const SafeInput = forwardRef<HTMLInputElement, Props>(({
  variant = 'text',
  maxLength = 100,
  min,
  max,
  allowNegative = false,
  error,
  onValidationError,
  unit,
  value,
  onChange,
  onBlur,
  ...restProps
}, ref) => {
  const [internalError, setInternalError] = useState<string>();

  const handleError = (message: string) => {
    setInternalError(message);
    onValidationError?.(message);
  };

  const clearError = () => {
    setInternalError(undefined);
  };

  const validateAndTransform = (inputValue: string): string => {
    // Clear error on new input
    clearError();

    // Handle empty string
    if (inputValue === '') {
      return '';
    }

    // Handle minus sign for negative numbers
    if (inputValue === '-') {
      return allowNegative ? '-' : '';
    }

    // Text input validation
    if (variant === 'text') {
      // Truncate if too long
      if (inputValue.length > maxLength) {
        handleError(`${maxLength}文字以内で入力してください`);
        return inputValue.substring(0, maxLength);
      }

      // Sanitize to prevent XSS
      return inputValue
        .replace(/</g, '')
        .replace(/>/g, '')
        .replace(/"/g, '')
        .replace(/'/g, '');
    }

    // Number input validation
    if (variant === 'number' || variant === 'tel') {
      const num = Number(inputValue);

      // Check if valid number
      if (isNaN(num)) {
        handleError('有効な数値を入力してください');
        return '';
      }

      // Check negative
      if (!allowNegative && num < 0) {
        handleError('負の値は入力できません');
        return Math.abs(num).toString();
      }

      // Check min/max bounds
      if (min !== undefined && num < min) {
        handleError(`${min}以上の値を入力してください`);
        return min.toString();
      }

      if (max !== undefined && num > max) {
        handleError(`${max}以下の値を入力してください`);
        return max.toString();
      }

      return inputValue;
    }

    return inputValue;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedValue = validateAndTransform(e.target.value);

    // Create a new event with the validated value
    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: validatedValue
      }
    };

    onChange?.(newEvent);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const finalValue = validateAndTransform(e.target.value);

    if (finalValue !== e.target.value) {
      // Update the input with validated value
      e.target.value = finalValue;
    }

    onBlur?.(e);
  };

  const displayError = error || internalError;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        ref={ref}
        type={variant === 'tel' ? 'tel' : variant}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        style={{
          width: '100%',
          background: '#ffffff',
          border: displayError
            ? '1px solid #ef4444'
            : '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: unit ? '10px 40px 10px 14px' : '10px 14px',
          color: '#1e293b',
          fontFamily: 'var(--font-main, Inter, sans-serif)',
          fontSize: '0.95rem',
          transition: 'all 0.2s ease',
          outline: 'none',
          ...(displayError ? {
            boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.1)'
          } : {})
        }}
        {...restProps}
      />
      {unit && (
        <span
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#64748b',
            fontSize: '0.8rem',
            fontWeight: '600',
            pointerEvents: 'none'
          }}
        >
          {unit}
        </span>
      )}
      {displayError && (
        <span
          style={{
            position: 'absolute',
            bottom: '-18px',
            left: '0',
            fontSize: '0.7rem',
            color: '#ef4444',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%'
          }}
        >
          {displayError}
        </span>
      )}
    </div>
  );
});

SafeInput.displayName = 'SafeInput';

/**
 * SafeTextArea Component
 *
 * Similar to SafeInput but for multiline text input.
 */
interface TextAreaProps {
  maxLength?: number;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

export const SafeTextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(({
  maxLength = 500,
  error,
  value,
  onChange,
  rows = 3,
}, ref) => {
  const [internalError, setInternalError] = useState<string>();

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let inputValue = e.target.value;

    // Clear error
    setInternalError(undefined);

    // Truncate if too long
    if (inputValue.length > maxLength) {
      setInternalError(`${maxLength}文字以内で入力してください`);
      inputValue = inputValue.substring(0, maxLength);
    }

    // Sanitize to prevent XSS
    inputValue = inputValue
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const newEvent = {
      ...e,
      target: {
        ...e.target,
        value: inputValue
      }
    } as React.ChangeEvent<HTMLTextAreaElement>;

    onChange?.(newEvent);
  };

  const displayError = error || internalError;

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <textarea
        ref={ref}
        value={value}
        onChange={handleChange}
        rows={rows}
        style={{
          width: '100%',
          background: '#ffffff',
          border: displayError
            ? '1px solid #ef4444'
            : '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '10px 14px',
          color: '#1e293b',
          fontFamily: 'var(--font-main, Inter, sans-serif)',
          fontSize: '0.95rem',
          transition: 'all 0.2s ease',
          outline: 'none',
          resize: 'vertical',
          minHeight: '60px'
        }}
      />
      {displayError && (
        <span
          style={{
            position: 'absolute',
            bottom: '-18px',
            left: '0',
            fontSize: '0.7rem',
            color: '#ef4444'
          }}
        >
          {displayError}
        </span>
      )}
    </div>
  );
});

SafeTextArea.displayName = 'SafeTextArea';
