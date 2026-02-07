/**
 * Recipe type definitions for Cooking Helper
 */

export interface RecipeStep {
  id: string;
  instruction: string;
  order: number;
  completed?: boolean;
}

export interface RecipeIngredient {
  id: string;
  name: string;
  amount: string;
}

export interface Recipe {
  id: string;
  name: string;
  servings: number;
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  createdAt: string;
  updatedAt: string;
}

export interface RecipeFormData {
  name: string;
  servings: number;
  ingredients: Array<{ name: string; amount: string }>;
  steps: string[];
}
