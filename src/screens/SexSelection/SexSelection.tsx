import { useState } from 'react';
import type { Sex } from '@/types';
import { useAuth } from '@/providers/auth';
import styles from './SexSelection.module.scss';

const SexSelection = (): JSX.Element => {
  const { createUser, state, clearError } = useAuth();
  const [selectedSex, setSelectedSex] = useState<Sex | null>(null);
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    clearError();
    setValidationError('');

    if (!selectedSex) {
      setValidationError('Please select your sex');
      return;
    }

    if (!name.trim()) {
      setValidationError('Please enter your name');
      return;
    }

    setIsSubmitting(true);
    try {
      await createUser({
        name: name.trim(),
        sex: selectedSex,
      });
    } catch (error) {
      // Error is handled by auth context
      console.error('Failed to create user:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Welcome to Intimulator</h1>
        <p className={styles.subtitle}>Please select your sex and enter your name</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.nameInput}>
            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                clearError();
                setValidationError('');
              }}
              className={styles.input}
            />
          </div>

          <div className={styles.sexOptions}>
            <button
              type="button"
              onClick={() => {
                setSelectedSex('man');
                clearError();
                setValidationError('');
              }}
              className={`${styles.sexButton} ${selectedSex === 'man' ? styles.selected : ''}`}
            >
              <span className={styles.emoji}>👨</span>
              <span className={styles.label}>Man</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedSex('woman');
                clearError();
                setValidationError('');
              }}
              className={`${styles.sexButton} ${selectedSex === 'woman' ? styles.selected : ''}`}
            >
              <span className={styles.emoji}>👩</span>
              <span className={styles.label}>Woman</span>
            </button>
          </div>

          {(validationError || state.error) && (
            <div className={styles.error}>{validationError || state.error}</div>
          )}

          <button 
            type="submit" 
            className={styles.submitButton}
            disabled={isSubmitting || !selectedSex || !name.trim()}
          >
            {isSubmitting ? 'Creating...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SexSelection;

