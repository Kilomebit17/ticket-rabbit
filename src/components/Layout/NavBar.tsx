import { NavLink } from 'react-router-dom';
import styles from './NavBar.module.scss';

const NavBar = () => {
  return (
    <nav className={styles.navBar}>
      <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : '')}>
        <span className={styles.icon}>🏠</span>
        <span className={styles.label}>Dashboard</span>
      </NavLink>
      <NavLink to="/userboard" className={({ isActive }) => (isActive ? styles.active : '')}>
        <span className={styles.icon}>👥</span>
        <span className={styles.label}>Userboard</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => (isActive ? styles.active : '')}>
        <span className={styles.icon}>⚙️</span>
        <span className={styles.label}>Profile</span>
      </NavLink>
    </nav>
  );
};

export default NavBar;

