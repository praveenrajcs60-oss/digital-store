import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Code2, LogIn, Sparkles, AlertCircle, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate(from === '/login' ? '/account' : from);
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
        {/* Brand */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 mx-auto flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Code2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Welcome Back</h1>
          <p className="text-xs text-slate-400">Sign in to access your digital downloads & licenses</p>
        </div>

        {/* Quick Demo Accounts Helper */}
        <div className="p-3 bg-slate-800/60 rounded-2xl border border-slate-700/60 space-y-2">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Demo Logins (Click to autofill)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickFill('alex@example.com', 'customer123')}
              className="p-2 text-left bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-1 font-semibold text-white">
                <User className="w-3 h-3 text-emerald-400" />
                <span>Customer</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">alex@example.com</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickFill('admin@store.com', 'admin123')}
              className="p-2 text-left bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-slate-700 transition-colors"
            >
              <div className="flex items-center gap-1 font-semibold text-white">
                <ShieldCheck className="w-3 h-3 text-amber-400" />
                <span>Admin</span>
              </div>
              <span className="text-[10px] text-slate-400 block truncate">admin@store.com</span>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.98]"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-blue-400 font-bold hover:underline">
            Create an Account
          </Link>
        </p>
      </div>
    </div>
  );
}
