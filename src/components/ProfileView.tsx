/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  db, 
  auth, 
  uploadFileToStorage, 
  handleFirestoreError, 
  OperationType 
} from '../lib/firebase';
import { doc, updateDoc, deleteDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { updateProfile, updateEmail, deleteUser } from 'firebase/auth';

interface ProfileViewProps {
  userProfile: {
    id: string;
    name: string;
    email: string;
    photoFileName: string;
    createdAt?: string;
  };
  onProfileUpdated: (updatedProfile: any) => void;
  onAccountDeleted: () => void;
}

export default function ProfileView({ userProfile, onProfileUpdated, onAccountDeleted }: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(userProfile.name);
  const [email, setEmail] = useState(userProfile.email);
  const [photoUrl, setPhotoUrl] = useState(userProfile.photoFileName);
  
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [requests, setRequests] = useState<any[]>([]);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [requestsError, setRequestsError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      setLoadingRequests(true);
      setRequestsError(null);
      try {
        const q = query(
          collection(db, 'connectionRequests'),
          where('requesterEmail', '==', userProfile.email)
        );
        const querySnapshot = await getDocs(q);
        const fetched: any[] = [];
        querySnapshot.forEach((doc) => {
          fetched.push({ _id: doc.id, ...doc.data() });
        });
        // Sort by timestamp descending
        fetched.sort((a, b) => {
          const tA = a.timestamp?.seconds || 0;
          const tB = b.timestamp?.seconds || 0;
          return tB - tA;
        });
        setRequests(fetched);
      } catch (err: any) {
        console.error("Error fetching connection requests:", err);
        setRequestsError("Could not retrieve connection request history.");
      } finally {
        setLoadingRequests(false);
      }
    };

    fetchRequests();
  }, [userProfile.email]);

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
      
      const downloadUrl = await uploadFileToStorage(file, 'avatars');
      setPhotoUrl(downloadUrl);
    } catch (err: any) {
      console.error(err);
      setUploadError(err.message || 'Error uploading file.');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    const currentUser = auth.currentUser;
    if (!currentUser) {
      setSaveError("No authenticated user found.");
      setSaving(false);
      return;
    }

    try {
      // 1. Update general Firebase Auth Profile
      await updateProfile(currentUser, {
        displayName: name.trim(),
        photoURL: photoUrl
      });

      // 2. Clear out email updates if needed
      if (email.trim().toLowerCase() !== currentUser.email?.toLowerCase()) {
        try {
          await updateEmail(currentUser, email.trim());
        } catch (authEmailErr: any) {
          console.warn("Could not update auth email. (Requires recent login):", authEmailErr);
          // If updateEmail fails, we can still proceed or warn the user, but we'll show a friendly message
          if (authEmailErr.code === 'auth/requires-recent-login') {
            throw new Error("To change your email address, you must have logged in recently. Please sign out and sign in again.");
          } else {
            throw authEmailErr;
          }
        }
      }

      // 3. Update firestore user record
      const userDocRef = doc(db, 'users', userProfile.id);
      const updatedData = {
        name: name.trim(),
        email: email.trim(),
        photoFileName: photoUrl
      };
      
      await updateDoc(userDocRef, updatedData);

      // 4. Notify parent state callback
      onProfileUpdated({
        ...userProfile,
        ...updatedData
      });

      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error("Save Profile Error:", err);
      try {
        handleFirestoreError(err, OperationType.UPDATE, `users/${userProfile.id}`);
      } catch (logErr: any) {
        setSaveError(err.message || "An error occurred while saving your profile details.");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError(null);
    const currentUser = auth.currentUser;

    if (!currentUser) {
      setDeleteError("Authentication session expired.");
      setDeleting(false);
      return;
    }

    try {
      // 1. First, delete user record from Firestore users collection
      const userDocRef = doc(db, 'users', userProfile.id);
      await deleteDoc(userDocRef);

      // 2. Next, delete Firebase Auth user
      await deleteUser(currentUser);

      // 3. Clear sessions and redirect
      onAccountDeleted();
    } catch (err: any) {
      console.error("Delete Account Error:", err);
      if (err.code === 'auth/requires-recent-login') {
        setDeleteError("This is a sensitive operation and requires recent authentication. Please sign out and sign back in to delete your account.");
      } else {
        setDeleteError(err.message || "An error occurred during account deletion.");
      }
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 select-text font-sans text-white">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Profile Details Card / Edit Form container */}
        <div className="bg-surface-container rounded-3xl p-6 sm:p-10 border border-outline-variant shadow-xl w-full flex-1 relative overflow-hidden">
          {/* Decorative backdrop */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-fixed/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex justify-between items-center mb-8 border-b border-outline-variant pb-6">
            <div>
              <h2 className="font-display text-2xl font-black uppercase tracking-tight text-white m-0">
                User Profile
              </h2>
              <p className="text-xs text-on-surface-variant font-medium mt-1">
                Your credentials and grassroots directory identifiers.
              </p>
            </div>
            {!isEditing && (
              <button
                type="button"
                onClick={() => {
                  setName(userProfile.name);
                  setEmail(userProfile.email);
                  setPhotoUrl(userProfile.photoFileName);
                  setIsEditing(true);
                }}
                id="profile_edit_toggle_btn"
                className="bg-secondary-fixed/10 hover:bg-secondary-fixed/20 text-secondary-fixed text-xs font-bold font-display px-4 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm font-bold">edit</span>
                <span>Edit Profile</span>
              </button>
            )}
          </div>

          {saveSuccess && (
            <div className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs rounded-xl p-4 mb-6 flex items-center gap-3">
              <span className="material-symbols-outlined text-sm shrink-0">check_circle</span>
              <span className="font-medium">Profile successfully synced to directory database!</span>
            </div>
          )}

          {saveError && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-4 mb-6 flex items-start gap-3">
              <span className="material-symbols-outlined text-sm shrink-0 mt-0.5">error</span>
              <span className="leading-relaxed font-semibold">{saveError}</span>
            </div>
          )}

          {isEditing ? (
            <form onSubmit={handleSaveChanges} className="space-y-6">
              {/* Photo upload */}
              <div>
                <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-3">
                  Upload Avatar Photo
                </label>
                <div
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all relative ${
                    dragActive
                      ? 'border-secondary-fixed bg-secondary-fixed/5'
                      : 'border-outline-variant bg-surface-container-low hover:border-secondary-fixed/40'
                  }`}
                >
                  <input
                    type="file"
                    id="profile-avatar-input"
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                  />
                  
                  {uploading ? (
                    <div className="flex flex-col items-center justify-center space-y-3 py-4">
                      <span className="w-8 h-8 border-3 border-secondary-fixed border-t-transparent rounded-full animate-spin" />
                      <span className="text-xs text-on-surface-variant font-medium">Uploading secure profile asset...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="relative">
                        <img
                          src={photoUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'}
                          alt="Avatar Preview"
                          className="w-20 h-20 rounded-2xl object-cover border border-outline-variant shadow-lg"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute -bottom-1.5 -right-1.5 bg-green-500 text-white rounded-full p-1 shadow flex items-center justify-center">
                          <span className="material-symbols-outlined text-xs font-bold">check</span>
                        </div>
                      </div>
                      <div className="text-xs text-on-surface-variant">
                        <label
                          htmlFor="profile-avatar-input"
                          className="text-secondary-fixed font-bold hover:underline cursor-pointer"
                        >
                          Choose new file
                        </label>{' '}
                        or drag here
                      </div>
                      <p className="text-[10px] text-on-surface-variant/60 font-mono">
                        PNG, JPG or WEBP up to 5MB
                      </p>
                    </div>
                  )}

                  {uploadError && (
                    <p className="text-xs text-[#EF4444] mt-3 font-medium">{uploadError}</p>
                  )}
                </div>
              </div>

              {/* Edit Full Name */}
              <div>
                <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2" htmlFor="edit_name">
                  Full Name
                </label>
                <input
                  id="edit_name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/30 font-sans"
                />
              </div>

              {/* Edit Email */}
              <div>
                <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2" htmlFor="edit_email">
                  Email Address
                </label>
                <input
                  id="edit_email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/30 font-sans"
                />
                <p className="text-[10px] text-on-surface-variant/70 mt-1.5 leading-normal">
                  Note: Updating your email address changes your primary directory contact and login credential.
                </p>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 justify-end pt-4 border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  disabled={saving}
                  className="bg-surface-container-high hover:bg-surface-container-highest border border-outline-variant px-5 py-3 rounded-xl font-display text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  id="profile_save_btn"
                  className="bg-secondary-fixed text-primary hover:brightness-110 disabled:opacity-50 px-6 py-3 rounded-xl font-display text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xl shadow-secondary-fixed/5"
                >
                  {saving && <span className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start text-center sm:text-left">
              {/* Profile details read-only view */}
              <img
                src={userProfile.photoFileName || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250'}
                alt="Profile Avatar"
                referrerPolicy="no-referrer"
                className="w-28 h-28 rounded-2xl object-cover border-2 border-outline-variant shadow-lg shrink-0"
              />
              
              <div className="space-y-4 flex-grow">
                <div>
                  <span className="text-[10px] font-display font-medium text-on-surface-variant uppercase tracking-widest block mb-0.5">
                    Full Name
                  </span>
                  <span className="text-xl font-bold font-sans text-white block">
                    {userProfile.name}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-display font-medium text-on-surface-variant uppercase tracking-widest block mb-0.5">
                    Email Address
                  </span>
                  <span className="text-sm font-sans text-white/90 block font-semibold">
                    {userProfile.email}
                  </span>
                </div>

                {userProfile.createdAt && (
                  <div>
                    <span className="text-[10px] font-display font-medium text-on-surface-variant uppercase tracking-widest block mb-0.5">
                      Registered Since
                    </span>
                    <span className="text-xs font-mono text-on-surface-variant block">
                      {new Date(userProfile.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Delete Account section */}
        <div className="w-full md:w-80 bg-[#1E1B1B] rounded-3xl p-6 sm:p-8 border border-red-900/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2.5 text-red-400 mb-4">
              <span className="material-symbols-outlined font-bold">warning</span>
              <h3 className="font-display text-sm font-black uppercase tracking-wider m-0">
                Danger Zone
              </h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed font-sans mb-6">
              Deleting your account is permanent. This removes your directory entry, authentications, and scouting indicators from the system permanently.
            </p>
          </div>

          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              id="profile_delete_warn_btn"
              className="w-full bg-red-950/45 hover:bg-red-900/50 text-red-400 border border-red-900/35 text-xs font-bold py-3.5 rounded-xl font-display transition-all cursor-pointer active:scale-95"
            >
              Delete Account
            </button>
          ) : (
            <div className="space-y-4">
              {deleteError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] rounded-lg p-3 font-semibold leading-relaxed">
                  {deleteError}
                </div>
              )}
              <p className="text-xs text-red-400 font-bold leading-normal">
                Are you absolutely sure? This action is completely irreversible.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={deleting}
                  className="bg-surface-container hover:bg-surface-container-high border border-outline-variant text-[10px] font-bold py-2.5 rounded-lg transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  id="profile_delete_confirm_btn"
                  className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold py-2.5 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {deleting && <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <span>Delete</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Connection Request History */}
      <div className="mt-8 bg-surface-container rounded-3xl p-6 sm:p-10 border border-outline-variant shadow-xl w-full relative overflow-hidden text-left">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-fixed/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="mb-6 border-b border-outline-variant pb-6">
          <h2 className="font-display text-xl font-black uppercase tracking-tight text-white m-0 flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary-fixed">history</span>
            Connection Requests History
          </h2>
          <p className="text-xs text-on-surface-variant font-medium mt-1">
            Track and view previous connection requests submitted to professional coaches in the network.
          </p>
        </div>

        {loadingRequests ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <span className="w-8 h-8 border-3 border-secondary-fixed border-t-transparent rounded-full animate-spin" />
            <span className="text-xs text-on-surface-variant font-mono uppercase tracking-widest font-semibold">Fetching History...</span>
          </div>
        ) : requestsError ? (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-4 flex items-center gap-3">
            <span className="material-symbols-outlined text-sm shrink-0">error</span>
            <span className="font-semibold">{requestsError}</span>
          </div>
        ) : requests.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-outline-variant rounded-2xl bg-surface-container-low">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant/40 mb-3 block">contact_mail</span>
            <p className="text-sm font-semibold text-white uppercase tracking-wider mb-1">No Connection Requests Found</p>
            <p className="text-xs text-on-surface-variant max-w-sm mx-auto leading-relaxed">
              When you submit direct trial or training booking requests to professional coaches, their history will populate here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((req) => (
              <div key={req._id || req.id} className="bg-surface-container-low border border-outline-variant hover:border-secondary-fixed/30 rounded-2xl p-5 transition-all duration-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
                  <div>
                    <h4 className="font-display text-md font-extrabold text-white uppercase flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary-fixed text-lg">sports_soccer</span>
                      Connection with {req.coachName}
                    </h4>
                    <p className="text-[10px] text-on-surface-variant font-mono uppercase tracking-widest mt-0.5">
                      Coach ID: {req.coachId}
                    </p>
                  </div>
                  
                  {/* Status Badges */}
                  <div>
                    <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-bold font-display uppercase tracking-widest ${
                      req.status === 'pending'
                        ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                        : req.status === 'accepted'
                        ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                        : 'bg-red-500/10 text-red-500 border border-red-500/20'
                    }`}>
                      {req.status}
                    </span>
                  </div>
                </div>

                {/* Message detail */}
                <div className="bg-surface-container/60 rounded-xl p-3.5 mb-3 border border-outline-variant/40">
                  <span className="text-[9px] font-display font-black text-secondary-fixed uppercase tracking-widest block mb-1">Message Submitted:</span>
                  <p className="text-xs text-white/90 leading-relaxed font-sans whitespace-pre-wrap select-text">
                    {req.message}
                  </p>
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between text-[10px] text-on-surface-variant font-mono mt-3 pt-3 border-t border-outline-variant/20">
                  <span>Req ID: {req.id}</span>
                  <span>
                    {req.timestamp?.seconds 
                      ? new Date(req.timestamp.seconds * 1000).toLocaleString(undefined, {
                          dateStyle: 'medium',
                          timeStyle: 'short'
                        })
                      : 'Just now'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
