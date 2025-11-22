import { useState, useEffect } from 'react';
import { storage } from '@/utils/storage';
import { PROJECT_NAME } from '@/constants';
import styles from './Header.module.scss';

const Header = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const updateBalance = () => {
      const currentUser = storage.getCurrentUser();
      setBalance(currentUser?.balance || 0);
    };

    // Update balance on mount
    updateBalance();

    // Update balance periodically to catch changes
    const interval = setInterval(updateBalance, 500);

    return () => clearInterval(interval);
  }, []);

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

