import React from 'react';

interface Props {
  message?: string;
  type?: 'warning' | 'error' | 'info';
  onDismiss?: () => void;
}

/**
 * ErrorMessage Component
 *
 * Displays user-friendly error messages for various edge cases.
 * Handles:
 * - Validation errors
 * - Missing required fields
 * - Calculation errors
 */
export const ErrorMessage: React.FC<Props> = ({ message, type = 'error', onDismiss }) => {
  if (!message) return null;

  const styles = {
    warning: {
      background: 'rgba(251, 191, 36, 0.1)',
      border: '1px dashed #f59e0b',
      color: '#b45309'
    },
    error: {
      background: 'rgba(239, 68, 68, 0.1)',
      border: '1px dashed #ef4444',
      color: '#dc2626'
    },
    info: {
      background: 'rgba(14, 165, 233, 0.1)',
      border: '1px dashed #0ea5e9',
      color: '#0369a1'
    }
  };

  const currentStyle = styles[type];

  return (
    <div
      style={{
        padding: '0.75rem 1rem',
        borderRadius: '8px',
        background: currentStyle.background,
        border: currentStyle.border,
        color: currentStyle.color,
        fontSize: '0.85rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem'
      }}
    >
      {type === 'error' && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      )}
      {type === 'warning' && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      )}
      {type === 'info' && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      )}
      <span style={{ flex: 1 }}>{message}</span>
      {onDismiss && (
        <button
          onClick={onDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
            opacity: 0.7
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      )}
    </div>
  );
};

/**
 * EmptyState Component
 *
 * Displays a friendly message when there's no data to show.
 * Handles empty list scenarios.
 */
interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction
}) => {
  return (
    <div
      style={{
        padding: '2rem',
        textAlign: 'center',
        borderRadius: '12px',
        background: 'rgba(100, 116, 139, 0.05)',
        border: '1px dashed rgba(100, 116, 139, 0.3)'
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="rgba(100, 116, 139, 0.5)"
        strokeWidth="1.5"
        style={{ marginBottom: '1rem' }}
      >
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
        <line x1="9" y1="3" x2="9" y2="21" />
      </svg>
      <h3 style={{ color: '#64748b', fontSize: '1rem', marginBottom: '0.25rem' }}>
        {title}
      </h3>
      {description && (
        <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: actionLabel ? '1rem' : '0' }}>
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          style={{
            background: 'var(--accent-color, #0ea5e9)',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

/**
 * LoadingSkeleton Component
 *
 * Displays a placeholder while content is loading.
 * Useful for async data operations.
 */
export const LoadingSkeleton: React.FC<{ height?: string; count?: number }> = ({
  height = '40px',
  count = 1
}) => {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            height,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '8px',
            marginBottom: i < count - 1 ? '0.75rem' : '0'
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </>
  );
};
