import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from '../../styles/ConfirmModal.module.scss';
import { useTheme } from '../../context/useTheme';

const ConfirmModal = ({
  open,
  title,
  description = '',
  confirmLabel = 'Onayla',
  cancelLabel = 'Vazgeç',
  onConfirm,
  onCancel,
  confirmDisabled = false,
  error = '',
}) => {
  const { theme } = useTheme();
  const themeClass = theme === 'dark' ? styles.dark : '';

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape' && !confirmDisabled) onCancel();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onCancel, confirmDisabled]);

  if (!open) return null;

  const content = (
    <div
      className={styles.overlay}
      role="presentation"
      onClick={() => {
        if (!confirmDisabled) onCancel();
      }}
    >
      <div
        className={`${styles.modal} ${themeClass}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby={description ? 'confirm-modal-desc' : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <h2 id="confirm-modal-title" className={styles.title}>
            {title}
          </h2>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onCancel}
            disabled={confirmDisabled}
            aria-label="Kapat"
          >
            ×
          </button>
        </div>
        <div className={styles.body}>
          {description ? (
            <p id="confirm-modal-desc" className={styles.description}>
              {description}
            </p>
          ) : null}
          {error ? (
            <p className={styles.error} role="alert">
              {error}
            </p>
          ) : null}
          <div className={styles.actions}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={onCancel}
              disabled={confirmDisabled}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnDanger}`}
              onClick={onConfirm}
              disabled={confirmDisabled}
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
};

ConfirmModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  confirmLabel: PropTypes.string,
  cancelLabel: PropTypes.string,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  confirmDisabled: PropTypes.bool,
  error: PropTypes.string,
};

export default ConfirmModal;
