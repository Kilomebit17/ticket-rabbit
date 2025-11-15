import { ReactNode } from 'react';
import Header from './Header';
import NavBar from './NavBar';
import styles from './Layout.module.scss';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
      <NavBar />
    </div>
  );
};

export default Layout;

