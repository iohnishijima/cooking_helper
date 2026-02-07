/**
 * RecipeList Component
 *
 * Grid/list view of saved recipes with search and filter
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';

export function RecipeList() {
  const navigate = useNavigate();
  const { recipes, loading, deleteRecipe } = useRecipes();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'name' | 'servings'>('newest');

  const filteredRecipes = recipes
    .filter(recipe =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.ingredients.some(ing =>
        ing.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name, 'ja');
        case 'servings':
          return a.servings - b.servings;
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`「${name}」を削除してもよろしいですか？`)) {
      deleteRecipe(id);
    }
  };

  if (loading) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem' }}>
        <p style={{ color: 'var(--text-secondary)' }}>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ maxWidth: '800px' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h1 style={{ textAlign: 'left', margin: 0 }}>レシピ集</h1>
          <button
            onClick={() => navigate('/recipes/new')}
            style={{
              background: 'var(--accent-color)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 20px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            新しいレシピ
          </button>
        </div>

        {/* Search and Sort */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <input
              type="text"
              placeholder="レシピ名や材料で検索..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                paddingLeft: '40px'
              }}
            />
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)'
              }}
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'name' | 'servings')}
            style={{ width: 'auto', minWidth: '120px' }}
          >
            <option value="newest">新しい順</option>
            <option value="name">名前順</option>
            <option value="servings">人数順</option>
          </select>
        </div>
      </div>

      {/* Recipe Count */}
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '1rem' }}>
        {filteredRecipes.length} 件のレシピ
      </p>

      {/* Recipe Grid */}
      {filteredRecipes.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          background: 'rgba(14, 165, 233, 0.05)',
          borderRadius: '16px',
          border: '1px dashed var(--accent-color)'
        }}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent-color)"
            strokeWidth="2"
            style={{ marginBottom: '1rem' }}
          >
            <path d="M7 20s4-2 7-2 7 2 7 2V5s-4 2-7 2-7-2-7-2v15Z" />
            <path d="M7 5v15" />
            <path d="M14 7v11" />
          </svg>
          {searchQuery ? (
            <>
              <h3 style={{ marginBottom: '0.5rem' }}>検索結果がありません</h3>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>
                別のキーワードで試してみてください
              </p>
            </>
          ) : (
            <>
              <h3 style={{ marginBottom: '0.5rem' }}>レシピがありません</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                最初のレシピを作成してみましょう
              </p>
              <button
                onClick={() => navigate('/recipes/new')}
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
                レシピを作成
              </button>
            </>
          )}
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '1rem'
        }}>
          {filteredRecipes.map(recipe => (
            <div
              key={recipe.id}
              onClick={() => navigate(`/recipes/${recipe.id}`)}
              style={{
                background: 'white',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.25rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-color)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(14, 165, 233, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(recipe.id, recipe.name);
                }}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px',
                  opacity: 0,
                  transition: 'opacity 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = '1';
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.color = '#ef4444';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = '';
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '';
                }}
                className="recipe-card-delete-btn"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>

              {/* Recipe Name */}
              <h3 style={{
                fontSize: '1.1rem',
                marginBottom: '0.5rem',
                paddingRight: '2rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {recipe.name}
              </h3>

              {/* Meta Info */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                fontSize: '0.8rem',
                color: 'var(--text-secondary)',
                marginBottom: '1rem'
              }}>
                <span>🍽️ {recipe.servings}人分</span>
                <span>📝 {recipe.ingredients.length}材料</span>
                <span>👣 {recipe.steps.length}手順</span>
              </div>

              {/* Ingredients Preview */}
              <div style={{
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                marginBottom: '0.75rem'
              }}>
                {recipe.ingredients.slice(0, 3).map(ing => ing.name).join('、')}
                {recipe.ingredients.length > 3 && ' など...'}
              </div>

              {/* Date */}
              <div style={{
                fontSize: '0.75rem',
                color: '#94a3b8'
              }}>
                {new Date(recipe.createdAt).toLocaleDateString('ja-JP')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CSS for delete button hover */}
      <style>{`
        .recipe-card-delete-btn {
          opacity: 0;
        }
        .recipe-card-delete-btn:hover {
          opacity: 1 !important;
        }
      `}</style>
    </div>
  );
}
