/**
 * Custom hook for recipe state management with localStorage persistence
 */

import { useEffect, useState } from 'react';
import type { Recipe, RecipeFormData, RecipeStep } from '../types/recipe';
import { recipeStorage } from '../utils/storage';

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  // Load recipes from localStorage on mount
  useEffect(() => {
    try {
      const savedRecipes = recipeStorage.getAll();
      setRecipes(savedRecipes);
    } catch (error) {
      console.error('Failed to load recipes:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Generate unique ID
  const generateId = (): string => {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  };

  // Create ingredient with ID
  const createIngredient = (name: string, amount: string, id?: string) => ({
    id: id || generateId(),
    name,
    amount
  });

  // Create step with ID
  const createStep = (instruction: string, order: number, id?: string): RecipeStep => ({
    id: id || generateId(),
    instruction,
    order,
    completed: false
  });

  // Add a new recipe
  const addRecipe = (data: RecipeFormData): Recipe => {
    const now = new Date().toISOString();
    const newRecipe: Recipe = {
      id: generateId(),
      name: data.name,
      servings: data.servings,
      ingredients: data.ingredients.map((ing, idx) =>
        createIngredient(ing.name, ing.amount)
      ),
      steps: data.steps
        .filter(step => step.trim() !== '')
        .map((step, idx) => createStep(step.trim(), idx)),
      createdAt: now,
      updatedAt: now
    };

    recipeStorage.save(newRecipe);
    setRecipes(prev => [...prev, newRecipe]);
    return newRecipe;
  };

  // Update an existing recipe
  const updateRecipe = (id: string, data: RecipeFormData): Recipe | null => {
    const existingRecipe = recipes.find(r => r.id === id);
    if (!existingRecipe) return null;

    const updatedRecipe: Recipe = {
      ...existingRecipe,
      name: data.name,
      servings: data.servings,
      ingredients: data.ingredients.map((ing, idx) => {
        // Try to preserve existing ID if available
        const existingIng = existingRecipe.ingredients[idx];
        return createIngredient(ing.name, ing.amount, existingIng?.id);
      }),
      steps: data.steps
        .filter(step => step.trim() !== '')
        .map((step, idx) => {
          // Try to preserve existing step data if available
          const existingStep = existingRecipe.steps.find(s => s.order === idx);
          return createStep(step.trim(), idx, existingStep?.id);
        }),
      updatedAt: new Date().toISOString()
    };

    recipeStorage.save(updatedRecipe);
    setRecipes(prev =>
      prev.map(r => (r.id === id ? updatedRecipe : r))
    );
    return updatedRecipe;
  };

  // Delete a recipe
  const deleteRecipe = (id: string): void => {
    recipeStorage.delete(id);
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  // Toggle step completion
  const toggleStep = (recipeId: string, stepId: string): void => {
    const recipe = recipes.find(r => r.id === recipeId);
    if (!recipe) return;

    const updatedRecipe: Recipe = {
      ...recipe,
      steps: recipe.steps.map(step =>
        step.id === stepId
          ? { ...step, completed: !step.completed }
          : step
      ),
      updatedAt: new Date().toISOString()
    };

    recipeStorage.save(updatedRecipe);
    setRecipes(prev =>
      prev.map(r => (r.id === recipeId ? updatedRecipe : r))
    );
  };

  // Get a recipe by ID
  const getRecipe = (id: string): Recipe | undefined => {
    return recipes.find(r => r.id === id);
  };

  return {
    recipes,
    loading,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    toggleStep,
    getRecipe
  };
}
