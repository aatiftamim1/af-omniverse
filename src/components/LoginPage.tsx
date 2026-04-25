import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Mail, Lock, User } from 'lucide-react';

export function LoginPage({ onSuccess }: { onSuccess: () => void }) {
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    let success = false;
    if (isLogin) {
      success = await login(email, password);
      if (!success) setError('Invalid email or password');
    } else {
      if (!name.trim()) setError('Name required');
      else success = await signup(email, password, name);
      if (!success) setError('Email already exists');
    }
    if (success) onSuccess();
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel rounded-2xl border border-cyan-500/30 p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent mb-6">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-cyan-400"
                required
              />
            </div>
          )}
          <div className="relative">
            <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-cyan-400"
              required
            />
          </div>
          <div className="relative">
            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full bg-white/5 border border-white/20 rounded-xl pl-10 pr-4 py-2 text-white focus:outline-none focus:border-cyan-400"
              required
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-semibold"
          >
            {isLogin ? <LogIn size={16} className="inline mr-2" /> : <UserPlus size={16} className="inline mr-2" />}
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-gray-400 text-sm mt-4">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button onClick={() => setIsLogin(!isLogin)} className="text-cyan-400 hover:underline">
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </motion.div>
    </div>
  );
}