import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { AuthGuard } from './components/auth/AuthGuard';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './components/dashboard/Dashboard';
import { Timeline } from './components/timeline/Timeline';
import { Analytics } from './components/analytics/Analytics';
import { Settings } from './components/settings/Settings';

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <AuthGuard>
          <Routes>
            <Route element={<AppShell />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </AuthGuard>
      </HashRouter>
    </AuthProvider>
  );
}
