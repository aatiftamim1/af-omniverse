import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Github, Mail, Phone, Smartphone, AlertCircle, CheckCircle } from 'lucide-react';

export function LoginPage() {
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signInWithGoogle, signInWithGitHub, signInWithFacebook, signInWithPhone, verifyPhoneOTP } = useAuth();
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) setError(error.message);
    else navigate('/dashboard');
    setLoading(false);
  };

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) {
      setError('Enter valid phone number');
      return;
    }
    setError('');
    setLoading(true);
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    const { error } = await signInWithPhone(formattedPhone);
    if (error) setError(error.message);
    else {
      setOtpSent(true);
      setSuccess('OTP sent! Check your SMS.');
    }
    setLoading(false);
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) {
      setError('Enter 6-digit OTP');
      return;
    }
    setError('');
    setLoading(true);
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;
    const { error } = await verifyPhoneOTP(formattedPhone, otp);
    if (error) setError(error.message);
    else navigate('/dashboard');
    setLoading(false);
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'facebook') => {
    setError('');
    let result;
    if (provider === 'google') result = await signInWithGoogle();
    else if (provider === 'github') result = await signInWithGitHub();
    else result = await signInWithFacebook();
    if (result.error) setError(result.error.message);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4">
      <div className="glass-panel p-8 rounded-2xl w-full max-w-md border border-white/10">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white">AF OMNIVERSE</h1>
          <p className="text-xs text-gray-400 font-mono mt-1">Welcome Back</p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={() => handleSocialLogin('google')}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-white"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
          <button
            onClick={() => handleSocialLogin('github')}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-white"
          >
            <Github size={20} />
            Continue with GitHub
          </button>
          <button
            onClick={() => handleSocialLogin('facebook')}
            className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.41 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.49h-2.8V24C19.62 23.1 24 18.1 24 12.07z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="px-2 bg-black text-gray-400">or continue with</span>
          </div>
        </div>

        {/* Email/Phone Toggle */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => { setMode('email'); setOtpSent(false); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-mono transition ${mode === 'email' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-400'}`}
          >
            <Mail size={14} className="inline mr-1" /> Email
          </button>
          <button
            onClick={() => { setMode('phone'); setOtpSent(false); setError(''); }}
            className={`flex-1 py-2 rounded-lg text-sm font-mono transition ${mode === 'phone' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-gray-400'}`}
          >
            <Smartphone size={14} className="inline mr-1" /> Phone (OTP)
          </button>
        </div>

        {/* Email Form */}
        {mode === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        )}

        {/* Phone OTP Form */}
        {mode === 'phone' && !otpSent && (
          <div className="space-y-4">
            <input
              type="tel"
              placeholder="Phone Number (e.g., +923001234567)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-cyan-500/50"
            />
            <button
              onClick={handleSendOTP}
              disabled={loading}
              className="w-full bg-cyan-500/20 border border-cyan-500/30 rounded-xl py-3 text-cyan-400 font-bold hover:bg-cyan-500/30 transition disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </div>
        )}

        {/* OTP Verification Form */}
        {mode === 'phone' && otpSent && (
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-center text-xl tracking-widest font-mono outline-none focus:border-cyan-500/50"
            />
            <button
              onClick={handleVerifyOTP}
              disabled={loading}
              className="w-full bg-cyan-500/20 border border-cyan-500/30 rounded-xl py-3 text-cyan-400 font-bold hover:bg-cyan-500/30 transition disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify & Login'}
            </button>
            <button
              onClick={() => setOtpSent(false)}
              className="w-full text-sm text-gray-400 hover:text-white transition"
            >
              ← Back to phone number
            </button>
          </div>
        )}

        {/* Messages */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
        {success && (
          <div className="mt-4 p-3 rounded-xl bg-green-500/10 border border-green-500/30 flex items-center gap-2">
            <CheckCircle size={16} className="text-green-400" />
            <p className="text-sm text-green-400">{success}</p>
          </div>
        )}

        <p className="text-center text-gray-400 mt-6 text-sm">
          Don't have account? <Link to="/signup" className="text-cyan-400 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}