import { useEffect, useState } from 'react';
import './App.css';
import GateScreen from './components/GateScreen';
import MainMenu from './pages/MainMenu';

const UNLOCK_KEY = 'tesl1315:unlocked';

/**
 * Top-level app.
 *
 * Renders the gate screen until the user enters the correct access code
 * (VITE_APP_KEY from .env). Once unlocked, sessionStorage keeps them in
 * for the rest of the tab's life.
 *
 * The gate itself is wrapped in its own CSS (./components/GateScreen.css).
 */
export default function App() {
  // Read the unlock flag once at mount so refreshes after success stay open.
  const [unlocked, setUnlocked] = useState(() => {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(UNLOCK_KEY) === '1';
    } catch (_) {
      return false;
    }
  });

  // Bump the body background once unlocked so the menu's deep palette
  // can take over (the gate CSS scopes backgrounds to itself).
  useEffect(() => {
    if (!unlocked) return;
    document.body.style.background = 'var(--bg-deep)';
    return () => {
      document.body.style.background = '';
    };
  }, [unlocked]);

  if (!unlocked) {
    return <GateScreen onUnlock={() => setUnlocked(true)} />;
  }

  return <MainMenu />;
}