/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Coach, Player, PlayerPosition, CoachSpecialty } from '../types';
import { 
  auth, 
  signInWithGoogle, 
  uploadFileToStorage, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  updateProfile 
} from '../lib/firebase';

interface RegistrationModalProps {
  onClose: () => void;
  onAddCoach: (coach: Coach) => void;
  onAddPlayer: (player: Player) => void;
}

export default function RegistrationModal({
  onClose,
  onAddCoach,
  onAddPlayer,
}: RegistrationModalProps) {
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const [role, setRole] = useState<'player' | 'coach'>('player');
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Player fields
  const [position, setPosition] = useState<PlayerPosition>('CM');
  const [age, setAge] = useState(16);
  // Stats
  const [pace, setPace] = useState(80);
  const [dribbling, setDribbling] = useState(80);
  const [passing, setPassing] = useState(80);
  const [physicality, setPhysicality] = useState(80);
  const [tacticalIq, setTacticalIq] = useState(80);

  // Coach fields
  const [specialty, setSpecialty] = useState<CoachSpecialty>('Tactical Expert');
  const [license, setLicense] = useState('');
  const [experience, setExperience] = useState('5 Years');
  const [fees, setFees] = useState('₹1,200/Month');

  // Storage / File Upload State
  const [avatarUrl, setAvatarUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Inline Authentication States (for both Google and Email/Password flows)
  const [authMethod, setAuthMethod] = useState<'google' | 'email'>('google');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  React.useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setCurrentUser(u);
      if (u) {
        if (!name) {
          setName(u.displayName || '');
        }
        if (!avatarUrl && u.photoURL) {
          setAvatarUrl(u.photoURL);
        }
      }
    });
    return () => unsub();
  }, [name, avatarUrl]);

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
      if (!auth.currentUser) {
        throw new Error("You must be logged in to upload files.");
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("File size exceeds 5MB limit.");
      }
      if (!file.type.startsWith("image/")) {
        throw new Error("Only images are accepted.");
      }
      
      const downloadUrl = await uploadFileToStorage(file, 'avatars');
      setAvatarUrl(downloadUrl);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  const handleInlineAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthLoading(true);
    try {
      if (authMode === 'signup') {
        if (!authName.trim()) throw new Error('Please enter your full name.');
        if (authPassword.length < 6) throw new Error('Password must be at least 6 characters.');
        
        const userCred = await createUserWithEmailAndPassword(auth, authEmail, authPassword);
        await updateProfile(userCred.user, { displayName: authName.trim() });
      } else {
        await signInWithEmailAndPassword(auth, authEmail, authPassword);
      }
    } catch (err: any) {
      console.error("Inline Auth Error:", err);
      let msg = err.message || "Authentication failed.";
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email address is already in use.';
      } else if (err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'The password is too weak.';
      }
      setAuthError(msg);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !bio) return;
    if (!auth.currentUser) {
      alert("Please sign in to register.");
      return;
    }

    const customUid = auth.currentUser.uid;
    const userPhoto = auth.currentUser.photoURL || '';

    if (role === 'player') {
      const newPlayer: Player = {
        id: customUid,
        name,
        position,
        age,
        location,
        avatar: avatarUrl || userPhoto || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
        bio,
        stats: {
          pace,
          dribbling,
          passing,
          physicality,
          tacticalIq,
        },
        achievements: ['ConnectHub Grassroots Elite Profile'],
      };
      onAddPlayer(newPlayer);
    } else {
      const newCoach: Coach = {
        id: customUid,
        name,
        specialty,
        rating: 4.8,
        ratingCount: 1,
        bio,
        experience,
        growthRate: 80,
        growthLabel: 'Player Growth Rate',
        avatar: avatarUrl || userPhoto || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCb93aeV1uqDSfogAmCWTfYmakGpzrgD7xX-WLRO5tG2RLWKUM1r6iiu4YaoDQUq-VMMJYHm0tsxAZlf5JomZ5cFXCVAuzxb_7xnS_NBnjUP4Ge8UxjEkmdyMbYdQuhrhzria7ukEAWgW7Fylifm9fPYlsRdXLkmHPVDOxUD__Ny-Jux4fb1TibmvO9WbfVUwFPdic7V-EeO_wruRQIIronaeVMUhg2wX3w1N5wVJdtXOng_ny3x7VTcDhKjQpcYWjKrRQcom4NdqMm',
        location,
        license: license || 'AIFF Grassroots Certificate',
        fees,
      };
      onAddCoach(newCoach);
    }

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 bg-primary/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative border border-outline-variant max-h-[90vh] flex flex-col animate-scale-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-on-surface-variant hover:text-secondary-fixed transition-colors z-10 cursor-pointer"
          aria-label="Close"
        >
          <span className="material-symbols-outlined text-2xl font-bold">close</span>
        </button>

        {submitted ? (
          <div className="p-8 md:p-10 text-center select-text relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed/5 rounded-full blur-2xl pointer-events-none" />
            <div className="w-16 h-16 bg-secondary-fixed text-primary rounded-xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-secondary-fixed/10">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <h3 className="font-display text-2xl font-extrabold text-white uppercase mb-2">Registration Complete!</h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-8">
              Your sport profile is now active on the ConnectHub scouts grid. Try searching your name in the directory!
            </p>
            <button
              onClick={onClose}
              className="bg-secondary-fixed text-primary hover:brightness-110 px-8 py-3 rounded-xl font-display text-xs font-bold transition-all w-full cursor-pointer active:scale-95"
            >
              Verify Profile Now
            </button>
          </div>
        ) : !currentUser ? (
          <div className="p-8 md:p-10 select-text relative flex flex-col justify-center items-center overflow-y-auto max-h-[85vh]">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed/5 rounded-full blur-2xl pointer-events-none" />
            
            <div className="w-12 h-12 bg-secondary-fixed/10 text-secondary-fixed rounded-2xl flex items-center justify-center mb-4 shadow-xl shadow-secondary-fixed/5">
              <span className="material-symbols-outlined text-3xl font-bold">vpn_key</span>
            </div>
            
            <h3 className="font-display text-xl font-black text-white uppercase mb-2">Authentication Required</h3>
            <p className="font-sans text-xs text-on-surface-variant leading-relaxed text-center mb-6 max-w-sm">
              Please secure your professional football profile card on our national pipeline network using one of our verified providers.
            </p>

            {/* Selector Method */}
            <div className="flex bg-surface-container-low p-1 rounded-xl mb-6 border border-outline-variant w-full max-w-md select-none">
              <button
                type="button"
                onClick={() => { setAuthMethod('google'); setAuthError(null); }}
                className={`flex-1 py-1.5 text-center text-xs font-display font-bold rounded-lg transition-all cursor-pointer ${
                  authMethod === 'google' ? 'bg-secondary-fixed text-primary shadow' : 'text-on-surface-variant hover:text-white'
                }`}
              >
                Google Authentication
              </button>
              <button
                type="button"
                onClick={() => { setAuthMethod('email'); setAuthError(null); }}
                className={`flex-1 py-1.5 text-center text-xs font-display font-bold rounded-lg transition-all cursor-pointer ${
                  authMethod === 'email' ? 'bg-secondary-fixed text-primary shadow' : 'text-on-surface-variant hover:text-white'
                }`}
              >
                Email / Password
              </button>
            </div>

            {authMethod === 'google' ? (
              <div className="w-full max-w-xs flex flex-col items-center">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await signInWithGoogle();
                    } catch (e) {
                      console.error(e);
                    }
                  }}
                  className="bg-secondary-fixed text-primary hover:brightness-110 px-8 py-3.5 rounded-xl font-display text-xs font-bold transition-all w-full flex items-center justify-center gap-3 cursor-pointer shadow-xl shadow-secondary-fixed/10 active:scale-95"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114A5.53 5.53 0 0 1 8.4 13a5.53 5.53 0 0 1 5.59-5.513c1.47 0 2.8.5 3.84 1.487l3.193-3.193C18.985 3.793 16.63 3 14 3 7.925 3 3 7.925 3 14s4.925 11 11 11c6.51 0 10.51-4.51 10.51-10.714 0-.693-.075-1.357-.18-1.996L12.24 10.285Z" />
                  </svg>
                  <span>Connect with Google</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleInlineAuth} className="w-full max-w-md space-y-4 text-left">
                {authError && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 select-text font-medium text-left">
                    {authError}
                  </div>
                )}
                
                {authMode === 'signup' && (
                  <div>
                    <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="Sunil Chhetri Jr."
                      className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-secondary-fixed font-sans"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="scout_pro@connecthub.in"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-secondary-fixed font-sans"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-secondary-fixed font-sans"
                  />
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full bg-secondary-fixed text-primary hover:brightness-110 disabled:opacity-50 py-3 rounded-xl font-display text-xs font-bold transition-all cursor-pointer active:scale-95 shadow-xl shadow-secondary-fixed/10 flex items-center justify-center gap-2"
                >
                  {authLoading && <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                  <span>{authMode === 'signup' ? 'Sign Up & Continue' : 'Sign In & Continue'}</span>
                </button>

                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
                      setAuthError(null);
                    }}
                    className="text-xs text-on-surface-variant hover:text-secondary-fixed font-sans transition-colors cursor-pointer"
                  >
                    {authMode === 'signin' 
                      ? "Don't have an account? Sign Up" 
                      : "Already have an account? Sign In"}
                  </button>
                </div>
              </form>
            )}
          </div>
        ) : (
          <div className="flex flex-col h-full overflow-hidden">
            <div className="p-8 pb-3 select-text relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed/5 rounded-full blur-2xl pointer-events-none" />
              <span className="text-primary bg-secondary-fixed px-2.5 py-0.5 rounded-md font-display text-[9px] font-bold uppercase tracking-widest relative z-10">
                JOIN SCOUTING NETWORK
              </span>
              <h3 className="font-display text-2xl font-black text-white uppercase mt-3 relative z-10">
                Register Your Football Path
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 relative z-10">
                Establish your tactical card or scouts registry to start connecting now.
              </p>

              {/* Selector Role */}
              <div className="flex bg-surface-container-low p-1.5 rounded-xl mt-6 border border-outline-variant select-none relative z-10">
                <button
                  type="button"
                  onClick={() => setRole('player')}
                  className={`flex-1 py-2 text-center text-xs font-display font-bold rounded-lg transition-all cursor-pointer ${
                    role === 'player' ? 'bg-secondary-fixed text-primary shadow' : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  I am a Player (Grassroots Profile)
                </button>
                <button
                  type="button"
                  onClick={() => setRole('coach')}
                  className={`flex-1 py-2 text-center text-xs font-display font-bold rounded-lg transition-all cursor-pointer ${
                    role === 'coach' ? 'bg-secondary-fixed text-primary shadow' : 'text-on-surface-variant hover:text-white'
                  }`}
                >
                  I am a Coach (Vetted Credentials)
                </button>
              </div>
            </div>

            {/* Scrollable form body */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 pt-2 select-text space-y-5 border-t border-b border-outline-variant">
              {/* Common Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sunil Chhetri Jr."
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/40 font-sans"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                    Hometown / District
                  </label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Shillong, Meghalaya"
                    className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/40 font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                  Professional Bio / Summary
                </label>
                <textarea
                  required
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell scouts about your youth trophies, training values and professional soccer goals..."
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/40 font-sans resize-none"
                />
              </div>

              {/* Profile Avatar File Upload connected to Firebase Storage */}
              <div>
                <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                  Profile Avatar / Scout Card Photo
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border border-dashed rounded-xl p-6 text-center transition-all relative ${
                    dragActive
                      ? 'border-secondary-fixed bg-secondary-fixed/5'
                      : 'border-outline-variant bg-surface-container-low hover:border-secondary-fixed/50'
                  }`}
                >
                  <input
                    type="file"
                    id="avatar-file-input"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {uploading ? (
                    <div className="flex flex-col items-center justify-center space-y-2 py-2">
                      <span className="w-8 h-8 border-2 border-secondary-fixed border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-on-surface-variant font-sans">Uploading photo securely to ConnectHub cloud...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      {avatarUrl ? (
                        <div className="relative">
                          <img
                            src={avatarUrl}
                            alt="Profile Preview"
                            className="w-16 h-16 rounded-xl object-cover border border-outline-variant"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-0.5 shadow-md flex items-center justify-center">
                            <span className="material-symbols-outlined text-[12px] font-bold">check</span>
                          </div>
                        </div>
                      ) : (
                        <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                          add_a_photo
                        </span>
                      )}
                      <div className="text-xs text-on-surface-variant">
                        <label
                          htmlFor="avatar-file-input"
                          className="text-secondary-fixed font-bold hover:underline cursor-pointer"
                        >
                          Upload a photo
                        </label>{' '}
                        or drag &amp; drop here
                      </div>
                      <p className="text-[10px] text-on-surface-variant/60 font-mono">
                        PNG, JPG, or WEBP (Max 5MB)
                      </p>
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-xs text-red-400 mt-2 font-sans font-medium">{uploadError}</p>
                  )}
                </div>
              </div>

              {/* Player specific */}
              {role === 'player' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                        Preferred Position
                      </label>
                      <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value as PlayerPosition)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary-fixed font-display font-bold text-white cursor-pointer"
                      >
                        <option value="ST" className="bg-surface-container text-white">Striker (ST)</option>
                        <option value="CM" className="bg-surface-container text-white">Central Midfield (CM)</option>
                        <option value="CB" className="bg-surface-container text-white">Center Back (CB)</option>
                        <option value="GK" className="bg-surface-container text-white">Goalkeeper (GK)</option>
                        <option value="LW" className="bg-surface-container text-white">Left Wing (LW)</option>
                        <option value="RW" className="bg-surface-container text-white">Right Wing (RW)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                        Age (Years)
                      </label>
                      <input
                        type="number"
                        min={12}
                        max={30}
                        value={age}
                        onChange={(e) => setAge(parseInt(e.target.value) || 16)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary-fixed font-sans"
                      />
                    </div>
                  </div>

                  {/* Player Stats Sliders */}
                  <div>
                    <span className="font-display text-[10px] font-bold text-secondary-fixed uppercase tracking-widest block mb-4 border-b border-outline-variant pb-2">
                      Athletic Metrics Scores (0 - 100)
                    </span>
                    <div className="space-y-4">
                      {/* Pace */}
                      <div className="grid grid-cols-12 items-center gap-4">
                        <span className="col-span-3 text-xs font-display font-bold text-on-surface-variant">Pace</span>
                        <input
                          type="range"
                          min="30"
                          max="99"
                          value={pace}
                          onChange={(e) => setPace(parseInt(e.target.value))}
                          className="col-span-7 h-1.5 bg-surface-container-low border border-outline-variant rounded-lg appearance-none cursor-pointer accent-secondary-fixed"
                        />
                        <span className="col-span-2 text-right font-mono font-bold text-sm text-secondary-fixed">{pace}</span>
                      </div>

                      {/* Dribbling */}
                      <div className="grid grid-cols-12 items-center gap-4">
                        <span className="col-span-3 text-xs font-display font-bold text-on-surface-variant">Dribbling</span>
                        <input
                          type="range"
                          min="30"
                          max="99"
                          value={dribbling}
                          onChange={(e) => setDribbling(parseInt(e.target.value))}
                          className="col-span-7 h-1.5 bg-surface-container-low border border-outline-variant rounded-lg appearance-none cursor-pointer accent-secondary-fixed"
                        />
                        <span className="col-span-2 text-right font-mono font-bold text-sm text-secondary-fixed">{dribbling}</span>
                      </div>

                      {/* Passing */}
                      <div className="grid grid-cols-12 items-center gap-4">
                        <span className="col-span-3 text-xs font-display font-bold text-on-surface-variant">Passing</span>
                        <input
                          type="range"
                          min="30"
                          max="99"
                          value={passing}
                          onChange={(e) => setPassing(parseInt(e.target.value))}
                          className="col-span-7 h-1.5 bg-surface-container-low border border-outline-variant rounded-lg appearance-none cursor-pointer accent-secondary-fixed"
                        />
                        <span className="col-span-2 text-right font-mono font-bold text-sm text-secondary-fixed">{passing}</span>
                      </div>

                      {/* Physicality */}
                      <div className="grid grid-cols-12 items-center gap-4">
                        <span className="col-span-3 text-xs font-display font-bold text-on-surface-variant">Physicality</span>
                        <input
                          type="range"
                          min="30"
                          max="99"
                          value={physicality}
                          onChange={(e) => setPhysicality(parseInt(e.target.value))}
                          className="col-span-7 h-1.5 bg-surface-container-low border border-outline-variant rounded-lg appearance-none cursor-pointer accent-secondary-fixed"
                        />
                        <span className="col-span-2 text-right font-mono font-bold text-sm text-secondary-fixed">{physicality}</span>
                      </div>

                      {/* Tactical IQ */}
                      <div className="grid grid-cols-12 items-center gap-4">
                        <span className="col-span-3 text-xs font-display font-bold text-on-surface-variant">Tactical IQ</span>
                        <input
                          type="range"
                          min="30"
                          max="99"
                          value={tacticalIq}
                          onChange={(e) => setTacticalIq(parseInt(e.target.value))}
                          className="col-span-7 h-1.5 bg-surface-container-low border border-outline-variant rounded-lg appearance-none cursor-pointer accent-secondary-fixed"
                        />
                        <span className="col-span-2 text-right font-mono font-bold text-sm text-secondary-fixed">{tacticalIq}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Coach specific */}
              {role === 'coach' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                        Coaching Specialty
                      </label>
                      <select
                        value={specialty}
                        onChange={(e) => setSpecialty(e.target.value as CoachSpecialty)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary-fixed font-display font-bold text-white cursor-pointer"
                      >
                        <option value="Elite Scout" className="bg-surface-container text-white">Elite Scout</option>
                        <option value="Goalkeeping" className="bg-surface-container text-white">Goalkeeping</option>
                        <option value="Strength & Cond." className="bg-surface-container text-white">Strength &amp; Cond.</option>
                        <option value="Tactical Expert" className="bg-surface-container text-white">Tactical Expert</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                        Coaching License
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. AIFF 'D' Certificate"
                        value={license}
                        onChange={(e) => setLicense(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/40 font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                        Experience Years
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5 Years"
                        value={experience}
                        onChange={(e) => setExperience(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/40 font-sans"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                        Monthly Training Fees
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ₹1,200/Month"
                        value={fees}
                        onChange={(e) => setFees(e.target.value)}
                        className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/40 font-sans"
                      />
                    </div>
                  </div>
                </>
              )}
            </form>

            <div className="p-8 pt-3 flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-outline-variant font-display text-xs font-bold text-on-surface hover:text-white bg-surface-container-low rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 py-3 bg-secondary-fixed text-primary hover:brightness-110 font-display text-xs font-bold rounded-xl shadow-xl shadow-secondary-fixed/10 transition-all active:scale-95 cursor-pointer"
              >
                Register Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
