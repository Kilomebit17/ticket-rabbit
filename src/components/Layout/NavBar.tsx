import { NavLink } from 'react-router-dom';
import { HomeIcon, TasksIcon, SettingsIcon } from '@/components/Icons';
import styles from './NavBar.module.scss';

const NavBar = () => {
  return (
    <nav className={styles.navBar}>
      <NavLink to="/" className={({ isActive }) => (isActive ? styles.active : '')}>
        <span className={styles.icon}><HomeIcon /></span>
        <span className={styles.label}>Dashboard</span>
      </NavLink>
      <NavLink to="/tasks" className={({ isActive }) => (isActive ? styles.active : '')}>
        <span className={styles.icon}><TasksIcon /></span>
        <span className={styles.label}>Tasks</span>
      </NavLink>
      <NavLink to="/profile" className={({ isActive }) => (isActive ? styles.active : '')}>
        <span className={styles.icon}><SettingsIcon /></span>
        <span className={styles.label}>Profile</span>
      </NavLink>
    </nav>
  );
};

export default NavBar;

