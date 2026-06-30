/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CoachSpecialty = 'Elite Scout' | 'Goalkeeping' | 'Strength & Cond.' | 'Tactical Expert';

export interface Coach {
  id: string;
  name: string;
  specialty: CoachSpecialty;
  rating: number;
  ratingCount: number;
  bio: string;
  experience: string;
  growthRate: number;
  growthLabel: string;
  avatar: string;
  location: string;
  license: string;
  fees: string;
}

export type PlayerPosition = 'ST' | 'CM' | 'CB' | 'GK' | 'LW' | 'RW';

export interface Player {
  id: string;
  name: string;
  position: PlayerPosition;
  age: number;
  location: string;
  avatar: string;
  bio: string;
  stats: {
    pace: number;
    dribbling: number;
    passing: number;
    physicality: number;
    tacticalIq: number;
  };
  achievements: string[];
}

export interface TrainingPlan {
  id: string;
  title: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Elite';
  duration: string;
  description: string;
  drills: {
    title: string;
    duration: string;
    instructions: string[];
  }[];
}

export type ActiveTab = 'home' | 'find-coaches' | 'find-players' | 'training-plans' | 'about-us' | 'profile';
