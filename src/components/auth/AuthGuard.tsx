import { useAuth } from '../../hooks/useAuth';
import { Login } from './Login';
import { Onboarding } from './Onboarding';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, appUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">🐾</div>
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !appUser) {
    return <Login />;
  }

  if (!appUser.householdId) {
    return <Onboarding />;
  }

  return <>{children}</>;
}
