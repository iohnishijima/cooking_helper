# T4 Implementation Patch Suggestions

This document contains suggested improvements to the core implementation in `src/App.tsx` to handle edge cases.

## Overview

The core implementation in `src/App.tsx` has several edge cases that should be addressed:

1. **Division by zero in microwave calculation** - When targetW is 0
2. **Division by zero in scaler** - When baseServings is 0
3. **Negative values** - Not properly validated
4. **NaN/Infinity display** - Shows raw values instead of fallbacks
5. **Empty ingredient list** - No friendly message
6. **XSS potential** - Ingredient names not sanitized

## Suggested Changes

### 1. Import Safe Calculation Utilities

At the top of `src/App.tsx`, add:

```typescript
import {
  safeGetScaledAmount,
  safeMicrowaveCalculation,
  safeFromTbsp,
  safeFromTsp,
  safeFromGrams,
  isValidNumericString
} from './utils';
```

### 2. Replace `getScaledAmount` Function

Current implementation (lines 90-94):
```typescript
const getScaledAmount = (amount: string) => {
  if (amount === '' || isNaN(Number(amount))) return '';
  const ratio = Number(targetServings) / Number(baseServings);
  return (Number(amount) * ratio).toFixed(selectedSeasoning.name === 'Liquid' ? 1 : 0);
};
```

Suggested replacement:
```typescript
const getScaledAmount = (amount: string) => {
  return safeGetScaledAmount(amount, baseServings, targetServings, 1);
};
```

### 3. Replace Microwave Calculation

Current implementation (lines 145-152):
```typescript
const microwaveTotalSec = (origMinNum * 60) + origSecNum;
const microwaveCalculatedSec = targetWNum === 0
  ? 0
  : (origWNum * microwaveTotalSec) / targetWNum;
const resultTime = {
  min: Math.floor(microwaveCalculatedSec / 60),
  sec: Math.round(microwaveCalculatedSec % 60),
};
```

Suggested replacement:
```typescript
const resultTime = safeMicrowaveCalculation(origW, origMin, origSec, targetW) ?? {
  min: 0,
  sec: 0
};
```

### 4. Add Empty State for Ingredient List

After the ingredient list (after line 357), add:

```typescript
{ingredients.length === 0 && (
  <div style={{
    padding: '2rem',
    textAlign: 'center',
    borderRadius: '12px',
    background: 'rgba(100, 116, 139, 0.05)',
    border: '1px dashed rgba(100, 116, 139, 0.3)',
    marginBottom: '1rem'
  }}>
    <p style={{ color: '#64748b', fontSize: '0.9rem' }}>
      材料がありません。下のボタンから追加してください。
    </p>
  </div>
)}
```

### 5. Sanitize Ingredient Names

Update the `updateIngredient` function (lines 86-88):

```typescript
const updateIngredient = (id: string, field: 'name' | 'amount', value: string) => {
  // Sanitize input to prevent XSS
  const sanitizedValue = field === 'name'
    ? value.replace(/[<>]/g, '')
    : value;

  setIngredients(ingredients.map(ing =>
    ing.id === id ? { ...ing, [field]: sanitizedValue } : ing
  ));
};
```

### 6. Add Input Validation

Update the number input handlers to clamp negative values:

```typescript
// For baseServings and targetServings inputs
const handleServingsChange = (
  value: string,
  setter: (val: string) => void
) => {
  const num = Number(value);
  if (value === '' || value === '-') {
    setter(value);
    return;
  }
  if (isNaN(num) || num < 0) {
    setter('1');
    return;
  }
  if (num > 1000) {
    setter('1000');
    return;
  }
  setter(value);
};
```

### 7. Fix `isNumericString` Function

Current implementation (lines 34-36):
```typescript
function isNumericString(value: string) {
  return value !== '' && !isNaN(Number(value));
}
```

This returns `true` for empty string after the check. Also doesn't handle Infinity.

Suggested replacement:
```typescript
function isNumericString(value: string): boolean {
  if (value === '' || value === '-') return false;
  const num = Number(value);
  return !isNaN(num) && isFinite(num);
}
```

## Testing Recommendations

After applying these patches, test the following scenarios:

1. Set target wattage to a value that causes division issues
2. Enter negative values in all numeric inputs
3. Enter extremely large values (9999999)
4. Delete all ingredients and verify empty state shows
5. Enter HTML/JavaScript in ingredient name fields
6. Set base servings to 0 and verify no crash
7. Rapidly change values to test for race conditions

## Alternative: Use Provided Utilities

Instead of patching `src/App.tsx` directly, you can import and use the utilities from:
- `src/utils/index.ts` - Validation and calculation functions
- `src/components/index.ts` - Safe input components with built-in validation
