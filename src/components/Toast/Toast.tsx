import { type Toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import styles from './Toast.module.scss';

interface IToastProps {
  toast: Toast;
  message: string;
  type?: 'success' | 'error' | 'info' | 'loading';
}

/**
 * Custom beautiful toast component
 */
export const CustomToast = ({ toast, message, type = 'info' }: IToastProps): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    setTimeout(() => setIsVisible(true), 10);
  }, []);

  useEffect(() => {
    if (!toast.visible) {
      setIsVisible(false);
    }
  }, [toast.visible]);
  const getIcon = (): JSX.Element => {
    switch (type) {
      case 'success':
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.6667 5L7.50004 14.1667L3.33337 10"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'error':
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 5L5 15M5 5L15 15"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case 'loading':
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={styles.spinner}
          >
            <circle
              cx="10"
              cy="10"
              r="8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="50.24"
              strokeDashoffset="37.68"
            />
          </svg>
        );
      default:
        return (
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 9V13M10 7H10.01M18 10C18 14.4183 14.4183 18 10 18C5.58172 18 2 14.4183 2 10C2 5.58172 5.58172 2 10 2C14.4183 2 18 5.58172 18 10Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
    }
  };

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${isVisible ? styles.visible : ''} ${!toast.visible ? styles.exiting : ''}`}
      onClick={() => toast.dismiss(toast.id)}
    >
      <div className={styles.content}>
        <div className={styles.iconWrapper}>{getIcon()}</div>
        <span className={styles.message}>{message}</span>
        <button
          className={styles.closeButton}
          onClick={(e) => {
            e.stopPropagation();
            toast.dismiss(toast.id);
          }}
          aria-label="Close notification"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      <div className={styles.progressBar} />
    </div>
  );
};

