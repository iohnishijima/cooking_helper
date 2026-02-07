# T1: Repository Archaeology Report

**Project:** Cooking Helper
**Date:** 2026-02-08
**Agent:** RepoArchaeologist

---

## Executive Summary

The `D:/Projects/cooking_helper` project is a **React-based cooking utility application** with three main features:
1. Seasoning unit converter (tbsp/tsp/grams)
2. Microwave wattage time converter
3. Recipe scaler (serving size calculator)

**CRITICAL FINDING:** This project does **NOT** currently have any recipe storage or step/instruction display functionality. The application is purely a utility calculator tool with no persistent storage.

---

## Project Structure

### Source Files

| File Path | Lines | Purpose |
|-----------|-------|---------|
| `src/main.tsx` | 11 | Application entry point (React 19) |
| `src/App.tsx` | 371 | Main application with all logic |
| `src/pages/Home.tsx` | 84 | Unused landing page component |
| `src/index.css` | 293 | All component styling |

### Technology Stack

- **Framework:** React 19.2.0 + TypeScript 5.9.3
- **Build:** Vite 7.2.4
- **Routing:** react-router-dom 7.11.0 (installed but not configured)
- **Styling:** Plain CSS (no Tailwind - despite package.json listing it)

---

## Data Type Definitions

### Current Types (src/App.tsx)

```typescript
// Lines 4-8: Seasoning type
interface Seasoning {
  name: string;
  nameJp: string;
  weightPerTbsp: number; // 1 tbsp = 15ml
}

// Lines 26-30: Ingredient type
interface Ingredient {
  id: string;
  name: string;
  amount: string;
}

// Line 32: Unit tracking
type LastEditedUnit = 'tbsp' | 'tsp' | 'grams' | null;
```

**NOTE:** No `Recipe` or `Step/Procedure` types exist in the codebase.

---

## Storage & Data Persistence

**Status:** NONE

The application has **no persistent storage implementation**:
- No `localStorage` usage
- No `IndexedDB` usage
- No API calls
- All data is transient state in React components

All state resets on page refresh.

---

## Current Feature Analysis

### 1. Seasoning Converter (Tab 1)
- **Location:** `src/App.tsx:180-263`
- **State:** `tbsp`, `tsp`, `grams`, `selectedSeasoning`
- **Function:** Bidirectional conversion between volume/weight units
- **Data:** Hardcoded `seasonings` array (lines 10-24)

### 2. Microwave Wattage Converter (Tab 2)
- **Location:** `src/App.tsx:266-309`
- **State:** `origW`, `origMin`, `origSec`, `targetW`
- **Function:** Calculates heating time based on wattage differences
- **Formula:** `(origW * origTime) / targetW`

### 3. Recipe Scaler (Tab 3)
- **Location:** `src/App.tsx:312-360`
- **State:** `baseServings`, `targetServings`, `ingredients[]`
- **Function:** Scales ingredient amounts by serving ratio
- **Formula:** `targetServings / baseServings * amount`
- **Limitation:** Only handles numeric amounts, no units

---

## Missing Functionality

### Recipe Storage Feature
| Component | Status |
|-----------|--------|
| Recipe data model | Not implemented |
| Storage interface | Not implemented |
| Save recipe button | Not implemented |
| Load recipe function | Not implemented |
| Recipe list view | Not implemented |

### Steps/Instructions Display Feature
| Component | Status |
|-----------|--------|
| Step/Procedure type definition | Not implemented |
| Step rendering component | Not implemented |
| Step-by-step view | Not implemented |

---

## Potential Bug Areas

### 1. Recipe Scaler - Numeric Conversion
**Location:** `src/App.tsx:90-94`

```typescript
const getScaledAmount = (amount: string) => {
  if (amount === '' || isNaN(Number(amount))) return '';
  const ratio = Number(targetServings) / Number(baseServings);
  return (Number(amount) * ratio).toFixed(selectedSeasoning.name === 'Liquid' ? 1 : 0);
};
```

**Issue:** References `selectedSeasoning.name === 'Liquid'` but no seasoning has name "Liquid". This condition will always be false, returning integers for all amounts.

### 2. Unused Dependencies
- `react-router-dom` installed but routing not configured
- `src/pages/Home.tsx` exists but never imported/routed
- Tailwind CSS in package.json but not used

### 3. Component Architecture
- All logic in single `App.tsx` (371 lines)
- No component separation
- No custom hooks for state management

---

## Data Flow Diagram

```
User Input
    |
    v
[App Component State]
    |
    +-> Seasoning Tab -> Conversion Functions -> Display
    +-> Microwave Tab -> Calculation -> Display
    +-> Scaler Tab -> Ratio Calculation -> Display
    |
    v
[No Persistence - Lost on Refresh]
```

---

## Recommendations for Recipe Feature Implementation

### Required Types to Add
```typescript
interface RecipeStep {
  id: string;
  instruction: string;
  order: number;
  completed?: boolean;
}

interface Recipe {
  id: string;
  name: string;
  servings: number;
  ingredients: Ingredient[];
  steps: RecipeStep[];
  createdAt: Date;
}
```

### Storage Layer Options
1. **localStorage** - Simple, sufficient for single-user
2. **IndexedDB** - Better for large recipe collections
3. **Backend API** - For multi-user sync

---

## Summary

This is a **utility calculator app** without recipe management features. The "Recipe Scaler" tab is misleadingly named - it only scales ingredient amounts, not actual recipes.

To implement the requested recipe storage and step display features would require:
1. New data types (Recipe, RecipeStep)
2. Storage implementation (localStorage/IndexedDB)
3. UI components for recipe CRUD operations
4. Step-by-step view component
5. Routing configuration to connect Home.tsx
