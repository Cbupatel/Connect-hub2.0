/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Coach, Player } from '../types';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';

interface ConnectModalProps {
  onClose: () => void;
  activeCoach: Coach | null;
  activePlayer: Player | null;
}

export default function ConnectModal({ onClose, activeCoach, activePlayer }: ConnectModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (auth.currentUser) {
      setName(auth.currentUser.displayName || '');
      setEmail(auth.currentUser.email || '');
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name && email && details) {
      const requestId = 'req_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();

      if (activeCoach) {
        const payload = {
          id: requestId,
          requesterName: name,
          requesterEmail: email,
          coachId: activeCoach.id,
          coachName: activeCoach.name,
          message: details,
          timestamp: serverTimestamp(),
          status: 'pending',
          requesterId: auth.currentUser?.uid || ''
        };

        const emailPayload = {
          to: email,
          message: {
            subject: "ConnectHub Request Received",
            text: `Hello ${name},\n\nYour request to connect with ${activeCoach.name} has been received successfully.\n\nWe will notify you when the coach responds.\n\nThank you,\nConnectHub Team`
          }
        };

        try {
          // 1. Save connection request
          await setDoc(doc(db, 'connectionRequests', requestId), payload);

          // 2. Queue Email Trigger via "mail" collection for Firebase Trigger Email Extension
          const mailId = 'mail_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
          await setDoc(doc(db, 'mail', mailId), emailPayload);

          setSubmitted(true);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `connectionRequests/${requestId}`);
        }
      } else {
        const payload = {
          id: requestId,
          senderName: name,
          senderEmail: email,
          message: details,
          targetRole: 'player',
          targetId: activePlayer?.id || '',
          targetName: activePlayer?.name || '',
          createdAt: new Date().toISOString()
        };

        try {
          await setDoc(doc(db, 'connectRequests', requestId), payload);
          setSubmitted(true);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `connectRequests/${requestId}`);
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-primary/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-surface-container rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-outline-variant animate-scale-up">
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
            <h3 className="font-display text-xl md:text-2xl font-extrabold text-white uppercase mb-2">
              {activeCoach ? "Your request has been sent successfully." : "Request Processed!"}
            </h3>
            <p className="font-sans text-sm text-on-surface-variant leading-relaxed mb-8">
              {activeCoach
                ? `Hello ${name}, your coaching request for ${activeCoach.name} was saved. A notification has been sent successfully to your email.`
                : `Your scouting inquiry has been compiled and is on its way to ${activePlayer?.name}. They will connect back at your email.`}
            </p>
            <button
              onClick={onClose}
              className="bg-secondary-fixed text-primary hover:brightness-110 px-8 py-3 rounded-xl font-display text-xs font-bold transition-all w-full active:scale-95 cursor-pointer"
            >
              Back to Network
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8 md:p-10 select-text relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed/5 rounded-full blur-2xl pointer-events-none" />
            <span className="text-primary bg-secondary-fixed px-2.5 py-0.5 rounded-md font-display text-[9px] font-bold uppercase tracking-widest relative z-10">
              {activeCoach ? 'BOOK DIRECT SESSION' : 'SCOUT INQUIRY REPORT'}
            </span>

            <div className="mt-4 mb-8 relative z-10">
              <h3 className="font-display text-xl font-black text-white uppercase">
                Connect with {activeCoach ? activeCoach.name : activePlayer?.name}
              </h3>
              <p className="text-xs text-on-surface-variant mt-1 font-semibold uppercase tracking-wider text-secondary-fixed">
                {activeCoach
                  ? `Vetted License: ${activeCoach.license}`
                  : `Grassroots Player • Position: ${activePlayer?.position}`}
              </p>
            </div>

            <div className="space-y-4 relative z-10">
              {/* Full Name */}
              <div>
                <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                  Full Name / Scout Agency
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Northeast Athletic FC, or your name"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/50 font-sans"
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. coach@academy.com"
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/50 font-sans"
                />
              </div>

              {/* Booking Message */}
              <div>
                <label className="block text-[10px] font-display font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                  {activeCoach ? 'Session Schedule & Focus Points' : 'Scouting Proposal & Trials Details'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder={
                    activeCoach
                      ? 'Define your preferred hour slots, football attributes you wish to focus on (e.g., midfielder spatial transition, or stamina test)...'
                      : 'Define what trial plans or league representation offers your team wishes to provide this grassroots player...'
                  }
                  className="w-full bg-surface-container-low border border-outline-variant rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/50 font-sans resize-none"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-4 relative z-10">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 border border-outline-variant font-display text-xs font-bold text-on-surface hover:text-white bg-surface-container-low rounded-xl transition-all active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-secondary-fixed text-primary hover:brightness-110 font-display text-xs font-bold rounded-xl shadow-xl shadow-secondary-fixed/10 transition-all active:scale-95 cursor-pointer"
              >
                Submit Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
