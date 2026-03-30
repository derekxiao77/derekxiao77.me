import { useLocation, useNavigate } from 'react-router-dom';

const tabs = [
  { path: '/', label: 'Home', icon: '🏠' },
  { path: '/timeline', label: 'Timeline', icon: '📋' },
  { path: '/analytics', label: 'Insights', icon: '📊' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
];

export function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-40">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive ? 'text-indigo-600' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{tab.icon}</span>
              <span className="text-xs mt-0.5 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
