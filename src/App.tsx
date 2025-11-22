import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { HttpClientProvider } from "@/providers/http-client";
import {
  AuthProvider,
  useAuth,
  useCurrentUser,
  useAuthLoading,
} from "@/providers/auth";
import { UsersProvider } from "@/providers/users";
import { FamilyInvitesProvider } from "@/providers/family-invites";
import { useTelegramWebApp } from "@/hooks";
import { PROJECT_NAME } from "@/constants";
import SexSelection from "./screens/SexSelection";
import Dashboard from "./screens/Dashboard";
import Userboard from "./screens/Userboard";
import Profile from "./screens/Profile";
import FriendDetail from "./screens/FriendDetail";
import TryAgain from "./screens/TryAgain";
import Layout from "./components/Layout";
import { useEffect } from "react";
import { isTelegramWebApp } from "./utils/telegram";

/**
 * Main app content component that uses auth context
 */
const AppContent = (): JSX.Element => {
  const isTelegram = isTelegramWebApp();
  const isProduction = import.meta.env.PROD;

  // Initialize Telegram WebApp (expands and calls ready automatically)
  // Hook is safe to call even if not in Telegram (it handles the check internally)
  useTelegramWebApp();

  const { checkUser } = useAuth();
  const currentUser = useCurrentUser();
  const isLoading = useAuthLoading();

  useEffect(() => {
    document.title = PROJECT_NAME;
  }, []);

  useEffect(() => {
    checkUser();
  }, [checkUser]);

  // Check if running in Telegram WebApp early (only in production)
  if (isProduction && !isTelegram) {
    return (
      <Router>
        <Routes>
          <Route path="/try-again" element={<TryAgain />} />
          <Route path="*" element={<Navigate to="/try-again" replace />} />
        </Routes>
      </Router>
    );
  }

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "1.2rem",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!currentUser && !isLoading) {
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
        <UsersProvider>
          <FamilyInvitesProvider>
            <AppContent />
          </FamilyInvitesProvider>
        </UsersProvider>
      </AuthProvider>
    </HttpClientProvider>
  );
}

export default App;
