import styles from './TryAgain.module.scss';
import { TRY_AGAIN_TEXT, EXTERNAL_URLS } from '@/constants';

/**
 * TryAgain screen component
 * Displayed when the app is not running inside Telegram WebApp
 */
const TryAgain = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>📱</div>
        <h1 className={styles.title}>{TRY_AGAIN_TEXT.TITLE}</h1>
        <p className={styles.message}>
          {TRY_AGAIN_TEXT.MESSAGE}
        </p>
        <button
          type="button"
          onClick={() => {
            window.open(EXTERNAL_URLS.TELEGRAM_BOT, '_blank');
          }}
          className={styles.retryButton}
        >
          {TRY_AGAIN_TEXT.BUTTON_OPEN}
        </button>
      </div>
    </div>
  );
};

export default TryAgain;

