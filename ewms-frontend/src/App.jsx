import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import UserDashboard from './pages/UserDashboard';

function App() {
  const { user, logout, isAuthenticated } = useAuth();
  const [view, setView] = useState('landing');

  const handleLoginSuccess = () => {
    setView('dashboard');
  };

  const handleLogout = () => {
    logout();
    setView('landing');
  };

  if (isAuthenticated && user) {
    if (user.role === 'user') {
      return <UserDashboard />;
    }

    return (
      <div className="min-h-screen bg-mint-100 px-4 py-10 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <header className="card-glass px-6 py-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-forest rounded-2xl flex items-center justify-center shadow-glow">
                <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 8c.7 0 1.4.1 2 .3C18.1 5.3 15.3 3 12 3 7.6 3 4 6.6 4 11c0 1.8.6 3.5 1.7 4.8" />
                  <path d="M11 21c-1.7 0-3.2-.7-4.3-1.7" />
                  <path d="M15.5 17.5 12 21l-3.5-3.5" />
                  <path d="m12 3 0 18" />
                </svg>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-forest-400">EcoDispose</p>
                <h1 className="font-heading text-2xl text-forest-500">{user.role === 'recycler' ? 'Recycler Access' : 'Admin Access'}</h1>
              </div>
            </div>

            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </header>

          <div className="card p-8 text-center">
            <p className="text-sm uppercase tracking-[0.2em] text-forest-400">Welcome</p>
            <h2 className="font-heading text-3xl text-forest-500 mt-3">{user.name}</h2>
            <p className="mt-3 text-forest-500 capitalize">Role: {user.role}</p>
            <p className="mt-2 text-forest-400">
              Role-specific dashboard is coming next. This is a temporary authenticated placeholder for the current mock role.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'login') {
    return <Login onBack={() => setView('landing')} onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-mint-100 flex items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in-up px-4">
        <div className="w-20 h-20 mx-auto bg-gradient-forest rounded-2xl flex items-center justify-center shadow-glow">
          <svg className="w-10 h-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 8c.7 0 1.4.1 2 .3C18.1 5.3 15.3 3 12 3 7.6 3 4 6.6 4 11c0 1.8.6 3.5 1.7 4.8" />
            <path d="M11 21c-1.7 0-3.2-.7-4.3-1.7" />
            <path d="M15.5 17.5 12 21l-3.5-3.5" />
            <path d="m12 3 0 18" />
          </svg>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl font-bold text-forest-500">
          EcoDispose
        </h1>
        <p className="text-forest-400 text-lg max-w-md mx-auto">
          Electronic Waste Management System — Smart Recycling for a Cleaner Future
        </p>
        <div className="flex gap-4 justify-center">
          <button className="btn-primary" onClick={() => setView('login')}>
            Get Started
          </button>
          <button className="btn-secondary">Learn More</button>
        </div>
        <div className="flex gap-3 justify-center pt-4 flex-wrap">
          <span className="badge bg-moss-100 text-moss-700">React 18</span>
          <span className="badge bg-forest-100 text-forest-600">Tailwind v3</span>
          <span className="badge bg-recycling-orange-100 text-recycling-orange-700">Vite</span>
        </div>
      </div>
    </div>
  );
}

export default App;
