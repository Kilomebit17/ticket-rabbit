import { useState } from 'react';
import styles from './CreateTaskModal.module.scss';
import { CREATE_TASK_TEXT, DEFAULTS } from '@/constants';

interface CreateTaskModalProps {
  onClose: () => void;
  onCreate: (name: string, price: number) => void;
}

const CreateTaskModal = ({ onClose, onCreate }: CreateTaskModalProps) => {
  const [taskName, setTaskName] = useState('');
  const [price, setPrice] = useState<number>(DEFAULTS.TASK_PRICE);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName.trim()) {
      setError(CREATE_TASK_TEXT.VALIDATION_TASK_NAME);
      return;
    }

    if (price < DEFAULTS.MIN_TASK_PRICE) {
      setError(CREATE_TASK_TEXT.VALIDATION_PRICE_MIN);
      return;
    }

    onCreate(taskName.trim(), price);
    setTaskName('');
    setPrice(DEFAULTS.TASK_PRICE);
    setError('');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>{CREATE_TASK_TEXT.TITLE}</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>{CREATE_TASK_TEXT.LABEL_TASK_NAME}</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => {
                setTaskName(e.target.value);
                setError('');
              }}
              placeholder={CREATE_TASK_TEXT.PLACEHOLDER_TASK_NAME}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>{CREATE_TASK_TEXT.LABEL_PRICE}</label>
            <input
              type="number"
              value={price}
              onChange={(e) => {
                const value = parseInt(e.target.value) || DEFAULTS.TASK_PRICE;
                setPrice(Math.max(DEFAULTS.MIN_TASK_PRICE, value));
                setError('');
              }}
              min={DEFAULTS.MIN_TASK_PRICE.toString()}
              className={styles.input}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              {CREATE_TASK_TEXT.BUTTON_CANCEL}
            </button>
            <button type="submit" className={styles.submitButton}>
              {CREATE_TASK_TEXT.BUTTON_CREATE}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;

