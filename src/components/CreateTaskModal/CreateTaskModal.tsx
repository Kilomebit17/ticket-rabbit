import { useState } from 'react';
import styles from './CreateTaskModal.module.scss';

interface CreateTaskModalProps {
  onClose: () => void;
  onCreate: (name: string, price: number) => void;
}

const CreateTaskModal = ({ onClose, onCreate }: CreateTaskModalProps) => {
  const [taskName, setTaskName] = useState('');
  const [price, setPrice] = useState(1);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!taskName.trim()) {
      setError('Please enter task name');
      return;
    }

    if (price < 1) {
      setError('Price must be at least 1 ticket');
      return;
    }

    onCreate(taskName.trim(), price);
    setTaskName('');
    setPrice(1);
    setError('');
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Create Task</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Task Name</label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => {
                setTaskName(e.target.value);
                setError('');
              }}
              placeholder="Enter task name"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Price (Tickets)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 1;
                setPrice(Math.max(1, value));
                setError('');
              }}
              min="1"
              className={styles.input}
            />
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton}>
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;

