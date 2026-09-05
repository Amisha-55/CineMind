import React, { useState, useEffect } from 'react';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useTaste } from '../context/TasteContext';
import { Film, Mail, Lock, User, ArrowRight, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthOpen, setIsAuthOpen } = useTaste();
  const { login, register, authError, clearAuthError, isAuthenticated } = useAuth();

  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Clear errors when switching tabs or closing modal
  useEffect(() => {
    setValidationError(null);
    clearAuthError();
  }, [isSignUp, isAuthOpen]);

  // Close modal if already authenticated
  useEffect(() => {
    if (isAuthenticated && isAuthOpen) {
      setIsAuthOpen(false);
    }
  }, [isAuthenticated, isAuthOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    clearAuthError();

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Validation
    if (!cleanEmail || !password) {
      setValidationError('Please fill in all required fields.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (password.length < 6) {
      setValidationError('Password must be at least 6 characters long.');
      return;
    }

    if (isSignUp) {
      if (!cleanName || cleanName.length < 2) {
        setValidationError('Please provide your name (at least 2 characters).');
        return;
      }

      if (password !== confirmPassword) {
        setValidationError('Passwords do not match. Please verify your password.');
        return;
      }

      setIsSubmitting(true);
      const success = await register({
        name: cleanName,
        email: cleanEmail,
        password,
      });
      setIsSubmitting(false);

      if (success) {
        setIsAuthOpen(false);
        resetForm();
      }
    } else {
      setIsSubmitting(true);
      const success = await login({
        email: cleanEmail,
        password,
      });
      setIsSubmitting(false);

      if (success) {
        setIsAuthOpen(false);
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setValidationError(null);
  };

  const errorMessage = validationError || authError;

  return (
    <Modal
      isOpen={isAuthOpen}
      onClose={() => setIsAuthOpen(false)}
      maxWidth="md"
    >
      <div className="space-y-6">
        
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-500 via-indigo-600 to-accent-purple p-[1px] mx-auto shadow-glow-brand">
            <div className="w-full h-full bg-[#0F141F] rounded-[15px] flex items-center justify-center">
              <Film className="w-6 h-6 text-brand-400" />
            </div>
          </div>

          <h2 className="text-2xl font-display font-bold text-white tracking-tight">
            {isSignUp ? 'Create CineMind Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400">
            {isSignUp
              ? 'Save your taste profile and sync your personalized recommendations.'
              : 'Sign in with your registered credentials.'}
          </p>
        </div>

        {/* Error Alert Banner */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-2.5 text-xs text-rose-300 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 font-medium leading-relaxed">{errorMessage}</div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name field for registration */}
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Cinema"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-100 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Email Address <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@cinemind.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-100 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Password <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-100 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
            </div>
            {isSignUp && (
              <p className="text-[10px] text-slate-500">Must be at least 6 characters</p>
            )}
          </div>

          {/* Confirm Password field for registration */}
          {isSignUp && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Confirm Password <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-surface-100 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            variant="glow"
            isLoading={isSubmitting}
            className="w-full py-3 text-sm font-semibold shadow-glow-brand mt-2"
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Button>
        </form>

        {/* Toggle between Sign In & Sign Up */}
        <div className="pt-2 text-center border-t border-white/5">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setValidationError(null);
            }}
            className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {isSignUp ? (
              <span>
                Already have an account? <strong className="text-brand-400">Sign In</strong>
              </span>
            ) : (
              <span>
                Don't have an account? <strong className="text-brand-400">Create One</strong>
              </span>
            )}
          </button>
        </div>

      </div>
    </Modal>
  );
};
