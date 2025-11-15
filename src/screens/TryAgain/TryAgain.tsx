import styles from './TryAgain.module.scss';

/**
 * TryAgain screen component
 * Displayed when the app is not running inside Telegram WebApp
 */
const TryAgain = (): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.icon}>📱</div>
        <h1 className={styles.title}>Please Open in Telegram</h1>
        <p className={styles.message}>
          This app is designed to work within Telegram. Please open it from a Telegram bot or link.
        </p>
        <button
          type="button"
          onClick={() => {
            window.open('https://t.me/ticket_rabbit_bot', '_blank');
          }}
          className={styles.retryButton}
        >
          Open in Telegram
        </button>
      </div>
    </div>
  );
};

export default TryAgain;

