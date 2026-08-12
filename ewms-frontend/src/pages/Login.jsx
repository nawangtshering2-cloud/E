import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

function Login({ onBack, onLoginSuccess }) {
  const { login, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const success = login(formData.email, formData.password);

    if (success) {
      onLoginSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-mint-100 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="card-glass p-6 sm:p-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-14 h-14 bg-gradient-forest rounded-2xl flex items-center justify-center shadow-glow">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 8c.7 0 1.4.1 2 .3C18.1 5.3 15.3 3 12 3 7.6 3 4 6.6 4 11c0 1.8.6 3.5 1.7 4.8" />
                <path d="M11 21c-1.7 0-3.2-.7-4.3-1.7" />
                <path d="M15.5 17.5 12 21l-3.5-3.5" />
                <path d="m12 3 0 18" />
              </svg>
            </div>
          </div>

          <div className="text-center mb-6">
            <h1 className="font-heading text-3xl font-bold text-forest-500">EcoDispose</h1>
            <p className="text-forest-400 mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="input-label">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="input-label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="input-field"
                required
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              Sign In
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-mint-50 border border-forest-100 p-4 text-xs text-forest-500">
            <p className="font-semibold mb-2">Demo credentials</p>
            <ul className="space-y-1">
              <li><span className="font-medium">User:</span> nawang@example.com / password123</li>
              <li><span className="font-medium">Recycler:</span> recycler@example.com / password123</li>
              <li><span className="font-medium">Admin:</span> admin@example.com / admin123</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="btn-secondary w-full mt-6"
          >
            Back to EcoDispose
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
