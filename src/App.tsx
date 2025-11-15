import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HttpClientProvider } from '@/providers/http-client';
import { AuthProvider, useAuth } from '@/providers/auth';
import { useTelegramWebApp } from '@/hooks';
import SexSelection from './screens/SexSelection';
import Dashboard from './screens/Dashboard';
import Userboard from './screens/Userboard';
import Profile from './screens/Profile';
import FriendDetail from './screens/FriendDetail';
import TryAgain from './screens/TryAgain';
import Layout from './components/Layout';
import { useEffect } from 'react';
import { isTelegramWebApp } from './utils/telegram';

/**
 * Main app content component that uses auth context
 */
const AppContent = (): JSX.Element => {
  const isTelegram = isTelegramWebApp();

  // Initialize Telegram WebApp (expands and calls ready automatically)
  // Hook is safe to call even if not in Telegram (it handles the check internally)
  useTelegramWebApp();

  const { state, checkUser } = useAuth();

  useEffect(() => {
    if (isTelegram) {
      checkUser();
    }
  }, [isTelegram, checkUser]);

  // Check if running in Telegram WebApp early
  if (!isTelegram) {
    return (
      <Router>
        <Routes>
          <Route path="/try-again" element={<TryAgain />} />
          <Route path="*" element={<Navigate to="/try-again" replace />} />
        </Routes>
      </Router>
    );
  }

  if (state.isLoading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontSize: '1.2rem',
        }}
      >
        Loading...
      </div>
    );
  }

  if (!state.user) {
    return <SexSelection />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/userboard" element={<Userboard />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/friend/:id" element={<FriendDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
};

/**
 * Root App component with providers
 */
function App(): JSX.Element {
  return (
    <HttpClientProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </HttpClientProvider>
  );
}

export default App;

