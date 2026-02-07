/**
 * localStorage wrapper for recipe storage
 */

import type { Recipe } from '../types/recipe';

const RECIPE_STORAGE_KEY = 'cooking_helper_recipes';

export const recipeStorage = {
  /**
   * Get all recipes from localStorage
   */
  getAll(): Recipe[] {
    try {
      const data = localStorage.getItem(RECIPE_STORAGE_KEY);
      if (!data) return [];
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to load recipes from storage:', error);
      return [];
    }
  },

  /**
   * Get a single recipe by ID
   */
  getById(id: string): Recipe | null {
    try {
      const recipes = this.getAll();
      return recipes.find(r => r.id === id) || null;
    } catch (error) {
      console.error('Failed to load recipe from storage:', error);
      return null;
    }
  },

  /**
   * Save a recipe (create or update)
   */
  save(recipe: Recipe): void {
    try {
      const recipes = this.getAll();
      const existingIndex = recipes.findIndex(r => r.id === recipe.id);

      if (existingIndex >= 0) {
        // Update existing recipe
        recipes[existingIndex] = { ...recipe, updatedAt: new Date().toISOString() };
      } else {
        // Add new recipe
        recipes.push(recipe);
      }

      localStorage.setItem(RECIPE_STORAGE_KEY, JSON.stringify(recipes));
    } catch (error) {
      console.error('Failed to save recipe to storage:', error);
      throw new Error('レシピの保存に失敗しました。ストレージの容量を確認してください。');
    }
  },

  /**
   * Delete a recipe by ID
   */
  delete(id: string): void {
    try {
      const recipes = this.getAll();
      const filtered = recipes.filter(r => r.id !== id);
      localStorage.setItem(RECIPE_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete recipe from storage:', error);
    }
  },

  /**
   * Clear all recipes
   */
  clear(): void {
    try {
      localStorage.removeItem(RECIPE_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear recipes from storage:', error);
    }
  }
};
