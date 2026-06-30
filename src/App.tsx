/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import CoachDirectory from './components/CoachDirectory';
import PlayerDirectory from './components/PlayerDirectory';
import TrainingHub from './components/TrainingHub';
import AboutUs from './components/AboutUs';
import ConnectModal from './components/ConnectModal';
import RegistrationModal from './components/RegistrationModal';
import AuthModal from './components/AuthModal';
import AuthGateway from './components/AuthGateway';
import ProfileView from './components/ProfileView';

import { ActiveTab, Coach, Player } from './types';
import { INITIAL_COACHES, INITIAL_PLAYERS, TRAINING_PLANS } from './data';
import { collection, onSnapshot, setDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from './lib/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Monitor auth state changes and sync user profile documents
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && !user.emailVerified) {
        auth.signOut();
        setCurrentUser(null);
        setUserProfile(null);
        setAuthLoading(false);
      } else if (user) {
        setProfileLoading(true);
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);
          
          if (!docSnap.exists()) {
            // "If a user is already registered but isn't in the database, add them there when they log in."
            const defaultPhoto = user.photoURL || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250';
            const initialProfile = {
              id: user.uid,
              name: user.displayName || 'Athlete',
              email: user.email || '',
              photoFileName: defaultPhoto,
              createdAt: new Date().toISOString()
            };
            await setDoc(userDocRef, initialProfile);
            setUserProfile(initialProfile);
          } else {
            setUserProfile(docSnap.data());
          }
          setCurrentUser(user);
        } catch (e) {
          console.error("Accessing users database error:", e);
          // Fallback
          setUserProfile({
            id: user.uid,
            name: user.displayName || 'Athlete',
            email: user.email || '',
            photoFileName: user.photoURL || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=250',
          });
          setCurrentUser(user);
        } finally {
          setProfileLoading(false);
          setAuthLoading(false);
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
        setAuthLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time synchronization for Coaches
  useEffect(() => {
    if (!currentUser) return;
    const unsub = onSnapshot(collection(db, 'coaches'), (snapshot) => {
      const coachesList: Coach[] = [];
      snapshot.forEach((docSnap) => {
        coachesList.push(docSnap.data() as Coach);
      });
      if (coachesList.length === 0) {
        // Seed database
        INITIAL_COACHES.forEach(async (coach) => {
          try {
            await setDoc(doc(db, 'coaches', coach.id), coach);
          } catch (e) {
            console.error('Seed Coach Error:', e);
          }
        });
        setCoaches(INITIAL_COACHES);
      } else {
        setCoaches(coachesList);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'coaches');
    });
    return () => unsub();
  }, [currentUser]);

  // Real-time synchronization for Players
  useEffect(() => {
    if (!currentUser) return;
    const unsub = onSnapshot(collection(db, 'players'), (snapshot) => {
      const playersList: Player[] = [];
      snapshot.forEach((docSnap) => {
        playersList.push(docSnap.data() as Player);
      });
      if (playersList.length === 0) {
        // Seed database
        INITIAL_PLAYERS.forEach(async (player) => {
          try {
            await setDoc(doc(db, 'players', player.id), player);
          } catch (e) {
            console.error('Seed Player Error:', e);
          }
        });
        setPlayers(INITIAL_PLAYERS);
      } else {
        setPlayers(playersList);
      }
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'players');
    });
    return () => unsub();
  }, [currentUser]);

  // ModalsState
  const [activeCoach, setActiveCoach] = useState<Coach | null>(null);
  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleSelectCoach = (coach: Coach) => {
    setActivePlayer(null);
    setActiveCoach(coach);
  };

  const handleSelectPlayer = (player: Player) => {
    setActiveCoach(null);
    setActivePlayer(player);
  };

  const handleAddCoach = async (newCoach: Coach) => {
    try {
      await setDoc(doc(db, 'coaches', newCoach.id), newCoach);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `coaches/${newCoach.id}`);
    }
  };

  const handleAddPlayer = async (newPlayer: Player) => {
    try {
      await setDoc(doc(db, 'players', newPlayer.id), newPlayer);
    } catch (e) {
      handleFirestoreError(e, OperationType.WRITE, `players/${newPlayer.id}`);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex flex-col items-center justify-center text-white">
        <div className="flex flex-col items-center justify-center space-y-4 animate-pulse">
          <div className="bg-secondary-fixed/10 text-secondary-fixed p-4 rounded-3xl">
            <span className="material-symbols-outlined text-5xl font-bold animate-spin" style={{ animationDuration: '3s' }}>sports_soccer</span>
          </div>
          <p className="text-xs font-bold tracking-widest uppercase text-on-surface-variant/80 font-display">
            Loading ConnectHub Pipeline...
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <AuthGateway />;
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-between">
      {/* Navbar header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenRegister={() => setIsRegisterModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
      />

      {/* Main Container Stage */}
      <main className="pt-20 flex-grow">
        {activeTab === 'home' && (
          <HomeView
            coaches={coaches}
            onSelectCoach={handleSelectCoach}
            onNavigateToTab={(tab) => setActiveTab(tab)}
            onOpenRegister={() => setIsRegisterModalOpen(true)}
          />
        )}

        {activeTab === 'find-coaches' && (
          <CoachDirectory coaches={coaches} onSelectCoach={handleSelectCoach} />
        )}

        {activeTab === 'find-players' && (
          <PlayerDirectory players={players} onScoutPlayer={handleSelectPlayer} />
        )}

        {activeTab === 'training-plans' && <TrainingHub plans={TRAINING_PLANS} />}

        {activeTab === 'about-us' && <AboutUs currentUser={currentUser} />}

        {activeTab === 'profile' && userProfile && (
          <ProfileView
            userProfile={userProfile}
            onProfileUpdated={(updatedProfile) => {
              setUserProfile(updatedProfile);
            }}
            onAccountDeleted={() => {
              setCurrentUser(null);
              setUserProfile(null);
              setActiveTab('home');
            }}
          />
        )}
      </main>

      {/* Footer component */}
      <footer className="bg-primary/95 text-white py-12 select-text border-t border-primary/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-10 max-w-7xl mx-auto py-8">
          <div>
            <div className="flex items-center gap-3 mb-6 select-none">
              <div className="bg-secondary-fixed text-primary p-1.5 rounded-full">
                <span className="material-symbols-outlined align-middle text-xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>sports_soccer</span>
              </div>
              <span className="font-display text-xl text-secondary-fixed font-black tracking-tight">ConnectHub</span>
            </div>
            <p className="text-white/60 text-sm mb-6 max-w-xs leading-relaxed font-sans">
              Empowering India's grassroots development program by connecting elite coaching and talent scout pipelines directly.
            </p>
            <div className="flex gap-4 select-none">
              <a href="#" className="w-8 h-8 rounded bg-white/10 hover:bg-secondary-fixed hover:text-primary transition-all flex items-center justify-center" aria-label="Social Link">
                <span className="material-symbols-outlined text-sm">public</span>
              </a>
              <a href="#" className="w-8 h-8 rounded bg-white/10 hover:bg-secondary-fixed hover:text-primary transition-all flex items-center justify-center" aria-label="Social Link">
                <span className="material-symbols-outlined text-sm">groups</span>
              </a>
              <a href="#" className="w-8 h-8 rounded bg-white/10 hover:bg-secondary-fixed hover:text-primary transition-all flex items-center justify-center" aria-label="Social Link">
                <span className="material-symbols-outlined text-sm">alternate_email</span>
              </a>
            </div>
          </div>

          <div>
            <h6 className="font-display text-xs font-bold text-secondary-fixed uppercase mb-6 tracking-widest">Connect</h6>
            <ul className="space-y-4">
              <li>
                <button onClick={() => setActiveTab('find-coaches')} className="text-white/70 hover:text-secondary-fixed text-sm transition-colors text-left uppercase tracking-wider font-semibold font-display">
                  Find Coaches
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('find-players')} className="text-white/70 hover:text-secondary-fixed text-sm transition-colors text-left uppercase tracking-wider font-semibold font-display">
                  Find Players
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('training-plans')} className="text-white/70 hover:text-secondary-fixed text-sm transition-colors text-left uppercase tracking-wider font-semibold font-display">
                  Training Plans
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="font-display text-xs font-bold text-secondary-fixed uppercase mb-6 tracking-widest">Platform</h6>
            <ul className="space-y-4">
              <li>
                <button onClick={() => setActiveTab('about-us')} className="text-white/70 hover:text-secondary-fixed text-sm transition-colors text-left uppercase tracking-wider font-semibold font-display">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('about-us')} className="text-white/70 hover:text-secondary-fixed text-sm transition-colors text-left uppercase tracking-wider font-semibold font-display">
                  Our Mission
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h6 className="font-display text-xs font-bold text-secondary-fixed uppercase mb-6 tracking-widest">Legal &amp; Policy</h6>
            <ul className="space-y-4 font-display text-sm font-semibold text-white/70 uppercase tracking-wider">
              <li><a href="#" className="hover:text-secondary-fixed transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-secondary-fixed transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="px-10 max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-white/50 uppercase tracking-widest font-display">
          <span>&copy; {new Date().getFullYear()} ConnectHub. Empowering Indian Grassroots Football.</span>
          <span>Designed with high athletic precision.</span>
        </div>
      </footer>

      {/* Connect Inquiry Modal */}
      {(activeCoach || activePlayer) && (
        <ConnectModal
          activeCoach={activeCoach}
          activePlayer={activePlayer}
          onClose={() => {
            setActiveCoach(null);
            setActivePlayer(null);
          }}
        />
      )}

      {/* Registration Enrollment Modal */}
      {isRegisterModalOpen && (
        <RegistrationModal
          onClose={() => setIsRegisterModalOpen(false)}
          onAddCoach={handleAddCoach}
          onAddPlayer={handleAddPlayer}
        />
      )}

      {/* Unified Authentication Modal */}
      {isAuthModalOpen && (
        <AuthModal
          onClose={() => setIsAuthModalOpen(false)}
        />
      )}
    </div>
  );
}
