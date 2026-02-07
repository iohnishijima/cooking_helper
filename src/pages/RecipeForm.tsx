/**
 * RecipeForm Component
 *
 * Form for creating and editing recipes with ingredients and steps
 */

import { useState, useRef } from 'react';
import type { Recipe, RecipeFormData } from '../types/recipe';

interface Props {
  recipe?: Recipe;
  onSubmit: (data: RecipeFormData) => void;
  onCancel: () => void;
}

export function RecipeForm({ recipe, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(recipe?.name || '');
  const [servings, setServings] = useState(recipe?.servings?.toString() || '2');
  const [ingredients, setIngredients] = useState<Array<{ name: string; amount: string }>>(
    recipe?.ingredients.map(ing => ({ name: ing.name, amount: ing.amount })) || [
      { name: '', amount: '' }
    ]
  );
  const [steps, setSteps] = useState<string[]>(
    recipe?.steps.map(s => s.instruction) || ['']
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const appInstanceId = crypto.randomUUID();
  const ingredientIdSeq = useRef(0);

  const addIngredient = () => {
    setIngredients(prev => [...prev, { name: '', amount: '' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: 'name' | 'amount', value: string) => {
    setIngredients(prev =>
      prev.map((ing, i) => (i === index ? { ...ing, [field]: value } : ing))
    );
  };

  const addStep = () => {
    setSteps(prev => [...prev, '']);
  };

  const removeStep = (index: number) => {
    setSteps(prev => prev.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, value: string) => {
    setSteps(prev => prev.map((step, i) => (i === index ? value : step)));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'レシピ名を入力してください';
    }

    const validIngredients = ingredients.filter(ing => ing.name.trim());
    if (validIngredients.length === 0) {
      newErrors.ingredients = '少なくとも1つの材料を入力してください';
    }

    const validSteps = steps.filter(step => step.trim());
    if (validSteps.length === 0) {
      newErrors.steps = '少なくとも1つの手順を入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    const data: RecipeFormData = {
      name: name.trim(),
      servings: Math.max(1, parseInt(servings) || 1),
      ingredients: ingredients
        .filter(ing => ing.name.trim())
        .map(ing => ({
          name: ing.name.trim(),
          amount: ing.amount.trim()
        })),
      steps: steps
        .filter(step => step.trim())
        .map(step => step.trim())
    };

    onSubmit(data);
  };

  return (
    <div className="glass-card" style={{ maxWidth: '600px' }}>
      <h1>{recipe ? 'レシピを編集' : '新しいレシピ'}</h1>

      <form onSubmit={handleSubmit}>
        {/* Recipe Name */}
        <div className="input-container">
          <label>レシピ名 *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例: 親子丼"
            style={{ borderColor: errors.name ? '#ef4444' : undefined }}
          />
          {errors.name && (
            <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>
              {errors.name}
            </span>
          )}
        </div>

        {/* Servings */}
        <div className="input-container">
          <label>人数</label>
          <div className="unit-label">
            <input
              type="number"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
              min="1"
            />
            <span className="unit-text">人分</span>
          </div>
        </div>

        {/* Ingredients */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ marginBottom: '0.75rem', display: 'block' }}>
            材料 *
          </label>
          <div className="ingredient-list">
            {ingredients.map((ing, idx) => (
              <div key={idx} className="ingredient-row">
                <input
                  type="text"
                  placeholder="材料名 (例: 鶏もも肉)"
                  value={ing.name}
                  onChange={(e) => updateIngredient(idx, 'name', e.target.value)}
                />
                <div className="unit-label">
                  <input
                    type="text"
                    placeholder="分量"
                    value={ing.amount}
                    onChange={(e) => updateIngredient(idx, 'amount', e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => removeIngredient(idx)}
                  disabled={ingredients.length === 1}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-add"
              onClick={addIngredient}
            >
              + 材料を追加
            </button>
          </div>
          {errors.ingredients && (
            <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', display: 'block' }}>
              {errors.ingredients}
            </span>
          )}
        </div>

        {/* Steps */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ marginBottom: '0.75rem', display: 'block' }}>
            手順 *
          </label>
          <div className="ingredient-list">
            {steps.map((step, idx) => (
              <div key={idx} className="ingredient-row" style={{ gridTemplateColumns: 'auto 1fr 40px' }}>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--accent-color)',
                  color: 'white',
                  borderRadius: '50%',
                  width: '28px',
                  height: '28px',
                  fontSize: '0.85rem',
                  fontWeight: '600'
                }}>
                  {idx + 1}
                </span>
                <textarea
                  value={step}
                  onChange={(e) => updateStep(idx, e.target.value)}
                  placeholder={`手順 ${idx + 1}`}
                  rows={2}
                  style={{
                    width: '100%',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '10px 14px',
                    color: 'var(--text-primary)',
                    fontFamily: 'var(--font-main)',
                    fontSize: '0.95rem',
                    resize: 'vertical',
                    minHeight: '50px'
                  }}
                />
                <button
                  type="button"
                  className="btn-delete"
                  onClick={() => removeStep(idx)}
                  disabled={steps.length === 1}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              type="button"
              className="btn-add"
              onClick={addStep}
            >
              + 手順を追加
            </button>
          </div>
          {errors.steps && (
            <span style={{ color: '#ef4444', fontSize: '0.75rem', marginTop: '0.5rem', display: 'block' }}>
              {errors.steps}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
          <button
            type="submit"
            style={{
              flex: 1,
              background: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '0.9';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1';
            }}
          >
            {recipe ? '更新' : '保存'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            style={{
              flex: 1,
              background: 'transparent',
              color: 'var(--text-secondary)',
              border: '2px solid #e2e8f0',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--text-secondary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#e2e8f0';
            }}
          >
            キャンセル
          </button>
        </div>
      </form>
    </div>
  );
}
