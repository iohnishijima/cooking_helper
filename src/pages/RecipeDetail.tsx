/**
 * RecipeDetail Component
 *
 * Display recipe with ingredients table and checklist steps
 */

import { useState, useEffect, useId, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Recipe } from '../types/recipe';
import { recipeStorage } from '../utils/storage';

interface Props {
  recipeId: string;
}

export function RecipeDetail({ recipeId }: Props) {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [targetServings, setTargetServings] = useState<string>('');

  useEffect(() => {
    const loadedRecipe = recipeStorage.getById(recipeId);
    if (loadedRecipe) {
      setRecipe(loadedRecipe);
      setTargetServings(loadedRecipe.servings.toString());
    }
    setLoading(false);
  }, [recipeId]);

  const handleDelete = () => {
    if (window.confirm('このレシピを削除してもよろしいですか？')) {
      recipeStorage.delete(recipeId);
      navigate('/recipes');
    }
  };

  const handleToggleStep = (stepId: string) => {
    if (!recipe) return;
    const updatedRecipe = {
      ...recipe,
      steps: recipe.steps.map(step =>
        step.id === stepId ? { ...step, completed: !step.completed } : step
      ),
      updatedAt: new Date().toISOString()
    };
    setRecipe(updatedRecipe);
    recipeStorage.save(updatedRecipe);
  };

  const getScaledAmount = (amount: string): string => {
    if (!recipe || amount === '') return '';
    const num = Number(amount);
    if (isNaN(num)) return amount;

    const ratio = Number(targetServings) / recipe.servings;
    const scaled = num * ratio;

    // Format: integer if whole number, otherwise 2 decimal places
    return Number.isInteger(scaled) ? scaled.toString() : scaled.toFixed(2).replace(/\.?0+$/, '');
  };

  if (loading) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>読み込み中...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>レシピが見つかりません</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          指定されたレシピは存在しないか、削除されました。
        </p>
        <button
          onClick={() => navigate('/recipes')}
          style={{
            background: 'var(--accent-color)',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          レシピ一覧に戻る
        </button>
      </div>
    );
  }

  const completedCount = recipe.steps.filter(s => s.completed).length;
  const allCompleted = completedCount === recipe.steps.length && recipe.steps.length > 0;

  return (
    <div className="glass-card" style={{ maxWidth: '700px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={() => navigate('/recipes')}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem',
            marginBottom: '1rem',
            padding: 0
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          レシピ一覧に戻る
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 style={{ textAlign: 'left', marginBottom: '0.5rem' }}>{recipe.name}</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              作成日: {new Date(recipe.createdAt).toLocaleDateString('ja-JP')}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => navigate(`/recipes/${recipe.id}/edit`)}
              style={{
                background: 'rgba(14, 165, 233, 0.1)',
                color: 'var(--accent-color)',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              編集
            </button>
            <button
              onClick={handleDelete}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                color: '#ef4444',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                fontSize: '0.85rem',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              削除
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      {recipe.steps.length > 0 && (
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
              進捗: {completedCount} / {recipe.steps.length}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--accent-color)' }}>
              {Math.round((completedCount / recipe.steps.length) * 100)}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '8px',
            background: 'rgba(14, 165, 233, 0.1)',
            borderRadius: '4px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${(completedCount / recipe.steps.length) * 100}%`,
              height: '100%',
              background: allCompleted ? '#22c55e' : 'var(--accent-color)',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      {/* Serving Scaler */}
      <div style={{
        background: 'rgba(14, 165, 233, 0.05)',
        border: '1px dashed var(--accent-color)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginBottom: '2rem'
      }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>人数変更</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            元: {recipe.servings}人分
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>→</span>
          <div className="unit-label" style={{ flex: 1 }}>
            <input
              type="number"
              value={targetServings}
              onChange={(e) => setTargetServings(e.target.value)}
              min="1"
            />
            <span className="unit-text">人分</span>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <section style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>材料</h3>
        <div style={{
          background: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          border: '1px solid #e2e8f0'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'rgba(14, 165, 233, 0.05)' }}>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  材料
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  元の分量
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: 'var(--accent-color)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {targetServings}人分
                </th>
              </tr>
            </thead>
            <tbody>
              {recipe.ingredients.map((ing, idx) => (
                <tr
                  key={ing.id}
                  style={{
                    borderBottom: idx < recipe.ingredients.length - 1 ? '1px solid #e2e8f0' : undefined
                  }}
                >
                  <td style={{ padding: '12px 16px' }}>{ing.name}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-secondary)' }}>
                    {ing.amount}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: 'var(--accent-color)' }}>
                    {getScaledAmount(ing.amount) || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Steps */}
      <section>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>手順</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {recipe.steps.map((step, idx) => (
            <div
              key={step.id}
              onClick={() => handleToggleStep(step.id)}
              style={{
                display: 'flex',
                gap: '1rem',
                padding: '1rem',
                background: step.completed ? 'rgba(34, 197, 94, 0.05)' : 'white',
                border: step.completed ? '1px solid #22c55e' : '1px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                if (!step.completed) {
                  e.currentTarget.style.borderColor = 'var(--accent-color)';
                }
              }}
              onMouseLeave={(e) => {
                if (!step.completed) {
                  e.currentTarget.style.borderColor = '#e2e8f0';
                }
              }}
            >
              <span style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: step.completed ? '#22c55e' : 'var(--accent-color)',
                color: 'white',
                borderRadius: '50%',
                width: '28px',
                height: '28px',
                fontSize: '0.85rem',
                fontWeight: '600',
                flexShrink: 0
              }}>
                {idx + 1}
              </span>
              <p style={{
                margin: 0,
                color: step.completed ? 'var(--text-secondary)' : 'var(--text-primary)',
                textDecoration: step.completed ? 'line-through' : undefined,
                flex: 1
              }}>
                {step.instruction}
              </p>
              {step.completed && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Completion Message */}
      {allCompleted && (
        <div style={{
          marginTop: '2rem',
          padding: '1.5rem',
          background: 'rgba(34, 197, 94, 0.1)',
          border: '1px solid #22c55e',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" style={{ marginBottom: '0.5rem' }}>
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="M22 4L12 14.01l-3-3" />
          </svg>
          <h3 style={{ color: '#22c55e', marginBottom: '0.5rem' }}>お疲れ様でした！</h3>
          <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
            すべての手順が完了しました
          </p>
        </div>
      )}
    </div>
  );
}
