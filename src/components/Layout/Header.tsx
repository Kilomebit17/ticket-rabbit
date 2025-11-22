import { useAuthBalance } from '@/providers/auth';
import { PROJECT_NAME } from '@/constants';
import styles from './Header.module.scss';

const Header = (): JSX.Element => {
  const balance = useAuthBalance();

  return (
    <header className={styles.header}>
      <div className={styles.logo}>{PROJECT_NAME}</div>
      <div className={styles.balance}>
        <span className={styles.ticketIcon}>🎫</span>
        <span className={styles.balanceAmount}>{balance}</span>
      </div>
    </header>
  );
};

export default Header;

