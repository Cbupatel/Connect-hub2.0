/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  auth, 
  db,
  signInWithGoogle, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

interface AuthModalProps {
  onClose: () => void;
  initialMode?: 'signin' | 'signup';
}

export default function AuthModal({ onClose, initialMode = 'signin' }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) {
          throw new Error('Please enter your full name.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters.');
        }
        
        // Create user with Email and Password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const defaultPhoto = userCredential.user.photoURL || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250';
        
        // Update user display name in Firebase Auth
        await updateProfile(userCredential.user, {
          displayName: name.trim(),
          photoURL: defaultPhoto
        });

        // Add them to firestore database collection '/users'
        try {
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            id: userCredential.user.uid,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            photoFileName: defaultPhoto,
            createdAt: new Date().toISOString()
          });
        } catch (dbErr) {
          console.error("Error setting user doc in AuthModal:", dbErr);
        }
      } else {
        // Sign in with Email and Password
        await signInWithEmailAndPassword(auth, email, password);
      }
      onClose(); // Success!
    } catch (err: any) {
      console.error('Auth Error:', err);
      let errMsg = err.message || 'An error occurred during authentication.';
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This email address is already in use.';
      } else if (err.code === 'auth/invalid-credential') {
        errMsg = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'The password is too weak.';
      } else if (err.code === 'auth/user-not-found') {
        errMsg = 'No user found with this email.';
      } else if (err.code === 'auth/wrong-password') {
        errMsg = 'Incorrect password.';
      }
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Failed to sign in with Google.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-primary/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-surface-container rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative border border-outline-variant p-8 animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-secondary-fixed transition-colors cursor-pointer"
          aria-label="Close"
          id="auth_modal_close"
        >
          <span className="material-symbols-outlined text-2xl font-bold">close</span>
        </button>

        {/* Logo Header */}
        <div className="text-center mb-6 relative">
          <div className="absolute top-[-10px] right-[-10px] w-24 h-24 bg-secondary-fixed/5 rounded-full blur-2xl pointer-events-none" />
          <div className="inline-flex bg-secondary-fixed/10 text-secondary-fixed p-3 rounded-2xl mb-3">
            <span className="material-symbols-outlined text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
              sports_soccer
            </span>
          </div>
          <h3 className="font-display text-2xl font-black text-white uppercase tracking-tight">
            Connect<span className="text-secondary-fixed">Hub</span> Authentication
          </h3>
          <p className="text-xs text-on-surface-variant mt-1">
            {mode === 'signup' 
              ? 'Create your free scouting account to unlock rosters.' 
              : 'Sign in to access elite players and scout networks.'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 mb-4 select-text font-medium leading-relaxed flex items-start gap-2.5">
            <span className="material-symbols-outlined text-sm shrink-0 mt-0.5">error</span>
            <span>{error}</span>
          </div>
        )}

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label 
                className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2"
                htmlFor="auth_name"
              >
                Full Name
              </label>
              <input
                id="auth_name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sunil Chhetri Jr."
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/40 font-sans"
              />
            </div>
          )}

          <div>
            <label 
              className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2"
              htmlFor="auth_email"
            >
              Email Address
            </label>
            <input
              id="auth_email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="scout_pro@connecthub.in"
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/40 font-sans"
            />
          </div>

          <div>
            <label 
              className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2"
              htmlFor="auth_password"
            >
              Password
            </label>
            <input
              id="auth_password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/40 font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            id="auth_submit_btn"
            className="w-full bg-secondary-fixed text-primary hover:brightness-110 disabled:opacity-50 py-3 rounded-xl font-display text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xl shadow-secondary-fixed/10 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : null}
            <span>{mode === 'signup' ? 'Create Account' : 'Sign In with Email'}</span>
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-outline-variant" />
          <span className="px-3 text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-wider">
            OR
          </span>
          <div className="flex-1 h-px bg-outline-variant" />
        </div>

        {/* Google Sign In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          id="auth_google_btn"
          className="w-full bg-surface-container-low hover:bg-surface-container-high border border-outline-variant text-white px-8 py-3 rounded-xl font-display text-xs font-bold transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <svg className="w-4 h-4 fill-current text-secondary-fixed shrink-0" viewBox="0 0 24 24">
            <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.53 5.53 0 0 1 8.4 13a5.53 5.53 0 0 1 5.59-5.513c1.47 0 2.8.5 3.84 1.487l3.193-3.193C18.985 3.793 16.63 3 14 3 7.925 3 3 7.925 3 14s4.925 11 11 11c6.51 0 10.51-4.51 10.51-10.714 0-.693-.075-1.357-.18-1.996L12.24 10.285Z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Footer Mode Switcher */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError(null);
            }}
            id="auth_switch_mode_btn"
            className="text-xs text-on-surface-variant hover:text-secondary-fixed font-sans transition-colors cursor-pointer"
          >
            {mode === 'signin' 
              ? "Don't have an account? Sign Up" 
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
