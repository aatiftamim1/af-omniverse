import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { data, error } = await signUp(email, password, { username });
    if (error) setError(error.message);
    else {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="glass-panel p-8 rounded-2xl w-full max-w-md border border-white/10">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Create Account</h1>
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-500/50"
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-500/50"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-500/50"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500/20 border border-cyan-500/30 rounded-xl py-3 text-cyan-400 font-bold hover:bg-cyan-500/30 transition disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6 text-sm">
          Already have account? <Link to="/login" className="text-cyan-400 hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}