import { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import CaptchaPage from './pages/CaptchaPage';
import DdosPage from './pages/DdosPage';
import SettingsPage from './pages/SettingsPage';
import { isSupabaseConfigured, supabase } from './lib/supabaseClient';

function App() {
  const [session, setSession] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setIsAuthReady(true);
      return undefined;
    }

    let isMounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!isMounted) {
        return;
      }

      setSession(data.session ?? null);
      setIsAuthReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleLoginSuccess = () => {
    navigate('/dashboard');
  };

  const handleSignOut = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }

    navigate('/');
  };

  if (!isAuthReady) {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage session={session} onLoginSuccess={handleLoginSuccess} />} />
      <Route
        path="/dashboard"
        element={session ? <DashboardPage onSignOut={handleSignOut} /> : <Navigate to="/" replace />}
      />
      <Route
        path="/captcha"
        element={session ? <CaptchaPage onSignOut={handleSignOut} /> : <Navigate to="/" replace />}
      />
      <Route
        path="/ddos"
        element={session ? <DdosPage onSignOut={handleSignOut} /> : <Navigate to="/" replace />}
      />
      <Route
        path="/settings"
        element={session ? <SettingsPage onSignOut={handleSignOut} /> : <Navigate to="/" replace />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
