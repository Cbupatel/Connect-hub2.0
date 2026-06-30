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
  updateProfile,
  uploadFileToStorage,
  sendEmailVerification
} from '../lib/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default function AuthGateway() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verificationEmailSentTo, setVerificationEmailSentTo] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await processUpload(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processUpload(e.dataTransfer.files[0]);
    }
  };

  const processUpload = async (file: File) => {
    setUploading(true);
    setUploadError(null);
    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size exceeds 5MB limit.");
      }
      if (!file.type.startsWith("image/")) {
        throw new Error("Only image files are accepted.");
      }
      
      // Since they are not logged in yet, we can upload under a general folder
      // or temp path. Let's send to Firebase Storage avatars directory.
      const downloadUrl = await uploadFileToStorage(file, 'avatars');
      setAvatarUrl(downloadUrl);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

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
        if (password !== repeatPassword) {
          throw new Error('Passwords do not match.');
        }
        
        // Create user with Email and Password
        const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
        
        const photoPath = avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250';

        // Update user profile with display name & avatar URL
        await updateProfile(userCredential.user, {
          displayName: name.trim(),
          photoURL: photoPath
        });

        // Add them to firestore database collection '/users'
        // Path: "/users/(uid)"
        try {
          await setDoc(doc(db, 'users', userCredential.user.uid), {
            id: userCredential.user.uid,
            name: name.trim(),
            email: email.trim().toLowerCase(),
            photoFileName: photoPath,
            createdAt: new Date().toISOString()
          });
        } catch (dbErr) {
          console.error("Error writing user to users collection on registration: ", dbErr);
        }

        // Verify key requirements: register with email/password => do not sign in automatically, verify email and display verification screen
        await sendEmailVerification(userCredential.user);
        await auth.signOut();
        setVerificationEmailSentTo(email.trim());
      } else {
        // Sign in with Email and Password
        const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
        
        // If they log in and email is not verified, do the same as after registration
        if (!userCredential.user.emailVerified) {
          await sendEmailVerification(userCredential.user);
          await auth.signOut();
          setVerificationEmailSentTo(email.trim());
        }
      }
    } catch (err: any) {
      console.error('Auth Error:', err);
      if (mode === 'signin') {
        // SPECIFIC RULE: If email/password are incorrect display "Password or Email Incorrect" in the ui
        setError('Password or Email Incorrect');
      } else {
        // SPECIFIC RULE: If user with those credentials already exists display 'User already exists. Sign in?'
        if (err.code === 'auth/email-already-in-use') {
          setError('User already exists. Sign in?');
        } else {
          setError(err.message || 'An error occurred during authentication.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError(null);
    setLoading(true);
    try {
      await signInWithGoogle();
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
    verificationEmailSentTo ? (
      <div className="fixed inset-0 bg-[#0F172A] z-50 flex items-center justify-center p-4 overflow-y-auto font-sans text-white select-text">
        {/* Visual Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary-fixed/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

        <div className="bg-surface-container rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-outline-variant p-6 sm:p-10 relative z-10 animate-scale-up my-8 text-center select-text">
          <div className="inline-flex bg-secondary-fixed/10 text-secondary-fixed p-3 rounded-2xl mb-6 shadow-lg shadow-secondary-fixed/5">
            <span className="material-symbols-outlined text-4xl font-bold">
              mark_email_read
            </span>
          </div>
          <h2 className="font-display text-2xl font-black tracking-tight text-white uppercase mb-4">
            Verify Your Email
          </h2>
          <p className="text-sm text-on-surface-variant font-medium leading-relaxed mb-8 max-w-md mx-auto">
            We have sent you a verification email to <span className="text-secondary-fixed font-black">{verificationEmailSentTo}</span>. Verify it and log in.
          </p>

          <button
            type="button"
            onClick={() => {
              setVerificationEmailSentTo(null);
              setMode('signin');
              setPassword('');
              setRepeatPassword('');
            }}
            id="auth_back_to_login_btn"
            className="w-full bg-secondary-fixed text-primary hover:brightness-110 py-3.5 rounded-xl font-display text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xl shadow-secondary-fixed/10 flex items-center justify-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">login</span>
            <span>Login</span>
          </button>

          <p className="text-xs text-on-surface-variant/70 mt-6 font-sans">
            Didn't receive the email? Check your spam folder or{' '}
            <button
              type="button"
              onClick={() => {
                setError("Please sign in to trigger a new email verification link if you didn't receive it.");
                setVerificationEmailSentTo(null);
                setMode('signin');
              }}
              className="text-secondary-fixed font-bold hover:underline cursor-pointer"
            >
              Sign In to Resend
            </button>
          </p>
        </div>
      </div>
    ) : (
    <div className="fixed inset-0 bg-[#0F172A] z-50 flex items-center justify-center p-4 overflow-y-auto font-sans text-white select-text">
      {/* Visual Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-secondary-fixed/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-surface-container rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-outline-variant p-6 sm:p-10 relative z-10 animate-scale-up my-8">
        
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-secondary-fixed/10 text-secondary-fixed p-3 rounded-2xl mb-4 shadow-lg shadow-secondary-fixed/5">
            <span className="material-symbols-outlined text-4xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>
              sports_soccer
            </span>
          </div>
          <h1 className="font-display text-3xl font-black tracking-tight text-white uppercase">
            Connect<span className="text-secondary-fixed">Hub</span>
          </h1>
          <p className="text-xs text-on-surface-variant font-medium mt-2 max-w-xs mx-auto">
            {mode === 'signup' 
              ? 'Join India’s elite grassroots football scout and training network.' 
              : 'Sign in to monitor rosters, view scouting cards, and unlock modules.'}
          </p>
        </div>

        {/* Custom Error Alerts */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-4 mb-6 leading-relaxed flex items-start gap-3">
            <span className="material-symbols-outlined text-sm shrink-0 mt-0.5">error</span>
            <div className="flex-1">
              {error === 'User already exists. Sign in?' ? (
                <span>
                  User already exists.{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('signin');
                      setError(null);
                    }}
                    className="text-secondary-fixed font-black underline hover:text-white transition-colors cursor-pointer"
                  >
                    Sign in?
                  </button>
                </span>
              ) : (
                <span>{error}</span>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              {/* Profile Photo Upload Section */}
              <div>
                <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2 font-display">
                  Profile Photo (Firebase Storage)
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-4 text-center transition-all relative ${
                    dragActive
                      ? 'border-secondary-fixed bg-secondary-fixed/5'
                      : 'border-outline-variant bg-surface-container-low hover:border-secondary-fixed/40'
                  }`}
                >
                  <input
                    type="file"
                    id="gateway-avatar-input"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {uploading ? (
                    <div className="flex flex-col items-center justify-center space-y-2 py-2">
                      <span className="w-6 h-6 border-2 border-secondary-fixed border-t-transparent rounded-full animate-spin" />
                      <span className="text-[11px] text-on-surface-variant font-sans">Uploading secure profile asset...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-2">
                      {avatarUrl ? (
                        <div className="relative">
                          <img
                            src={avatarUrl}
                            alt="Uploaded Preview"
                            className="w-14 h-14 rounded-xl object-cover border border-outline-variant"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5 shadow flex items-center justify-center">
                            <span className="material-symbols-outlined text-[10px] font-bold">check</span>
                          </div>
                        </div>
                      ) : (
                        <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                          add_a_photo
                        </span>
                      )}
                      <div className="text-xs text-on-surface-variant">
                        <label
                          htmlFor="gateway-avatar-input"
                          className="text-secondary-fixed font-bold hover:underline cursor-pointer"
                        >
                          Upload a photo
                        </label>{' '}
                        or drag &amp; drop
                      </div>
                      <p className="text-[9px] text-on-surface-variant/60 font-mono">
                        PNG, JPG or WEBP up to 5MB
                      </p>
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-xs text-[#EF4444] mt-2 font-medium">{uploadError}</p>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label 
                  className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2"
                  htmlFor="signup_name"
                >
                  Full Name
                </label>
                <input
                  id="signup_name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Sunil Chhetri Jr."
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/30 font-sans"
                />
              </div>
            </>
          )}

          {/* Email */}
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
              placeholder="athlete@connecthub.in"
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/30 font-sans"
            />
          </div>

          {/* Password */}
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
              className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/30 font-sans"
            />
          </div>

          {/* Repeat Password */}
          {mode === 'signup' && (
            <div>
              <label 
                className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2"
                htmlFor="auth_repeat_password"
              >
                Repeat Password
              </label>
              <input
                id="auth_repeat_password"
                type="password"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                placeholder="Confirm password"
                className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/30 font-sans"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading || uploading}
            id="auth_submit_btn"
            className="w-full bg-secondary-fixed text-primary hover:brightness-110 disabled:opacity-50 py-3.5 rounded-xl font-display text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xl shadow-secondary-fixed/10 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            ) : null}
            <span>{mode === 'signup' ? 'Create Your Account' : 'Sign In Now'}</span>
          </button>
        </form>

        {/* Separator */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-outline-variant" />
          <span className="px-3 text-[9px] font-display font-bold text-on-surface-variant uppercase tracking-wider">
            OR
          </span>
          <div className="flex-1 h-px bg-outline-variant" />
        </div>

        {/* Google Authentication */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          id="auth_google_btn"
          className="w-full bg-surface-container-low hover:bg-surface-container-high border border-outline-variant text-white px-8 py-3.5 rounded-xl font-display text-xs font-bold transition-all flex items-center justify-center gap-3 cursor-pointer active:scale-95 disabled:opacity-50"
        >
          <svg className="w-4 h-4 fill-current text-secondary-fixed shrink-0" viewBox="0 0 24 24">
            <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.53 5.53 0 0 1 8.4 13a5.53 5.53 0 0 1 5.59-5.513c1.47 0 2.8.5 3.84 1.487l3.193-3.193C18.985 3.793 16.63 3 14 3 7.925 3 3 7.925 3 14s4.925 11 11 11c6.51 0 10.51-4.51 10.51-10.714 0-.693-.075-1.357-.18-1.996L12.24 10.285Z" />
          </svg>
          <span>Continue with Google</span>
        </button>

        {/* Toggle Mode */}
        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError(null);
            }}
            id="auth_switch_mode_btn"
            className="text-xs text-on-surface-variant hover:text-secondary-fixed font-semibold transition-colors cursor-pointer"
          >
            {mode === 'signin' 
              ? "Don't have an account? Sign Up" 
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
   )
  );
}
