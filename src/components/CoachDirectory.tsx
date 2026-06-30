/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Coach, CoachSpecialty } from '../types';

interface CoachDirectoryProps {
  coaches: Coach[];
  onSelectCoach: (coach: Coach) => void;
}

const SPECIALTIES: ('All' | CoachSpecialty)[] = [
  'All',
  'Elite Scout',
  'Goalkeeping',
  'Strength & Cond.',
  'Tactical Expert',
];

export default function CoachDirectory({ coaches, onSelectCoach }: CoachDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<'All' | CoachSpecialty>('All');
  const [sortBy, setSortBy] = useState<'rating' | 'growth'>('rating');

  const filteredCoaches = useMemo(() => {
    return coaches
      .filter((coach) => {
        const matchesSearch =
          coach.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coach.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
          coach.license.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesSpecialty =
          selectedSpecialty === 'All' || coach.specialty === selectedSpecialty;
        return matchesSearch && matchesSpecialty;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        } else {
          return b.growthRate - a.growthRate;
        }
      });
  }, [coaches, searchQuery, selectedSpecialty, sortBy]);

  return (
    <div className="py-12 px-10 max-w-7xl mx-auto animate-fade-in select-text">
      {/* Header */}
      <div className="mb-12">
        <span className="text-primary bg-secondary-fixed px-3 py-1 font-display text-xs font-bold tracking-wider rounded-md">
          DISCOVERY NETWORK
        </span>
        <h1 className="font-display text-3xl md:text-4xl text-white font-extrabold mt-4 uppercase tracking-tight">
          Find Your Perfect Football Mentor
        </h1>
        <p className="font-sans text-base text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
          Unlock game tactics, physical stamina, or secure academy trials with verified AFC &amp; FIFA certified coaches of Indian leagues.
        </p>
      </div>

      {/* Filter and Search Box */}
      <div className="bg-surface-container border border-outline-variant p-6 rounded-3xl mb-10 shadow-sm flex flex-col gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed/5 rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row gap-4 relative z-10">
          {/* Search bar */}
          <div className="relative flex-1 select-none">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">
              search
            </span>
            <input
              type="text"
              placeholder="Search by coach name, license, city, state..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant pl-12 pr-4 py-3.5 rounded-xl text-white text-sm focus:outline-none focus:border-secondary-fixed placeholder-on-surface-variant/70 font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-secondary-fixed"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>

          {/* Sort dropdown */}
          <div className="w-full lg:w-60 select-none">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-surface-container-low border border-outline-variant px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:border-secondary-fixed font-display font-semibold text-white cursor-pointer"
            >
              <option value="rating">Sort by Rating (Highest)</option>
              <option value="growth">Sort by Growth Rate (Highest)</option>
            </select>
          </div>
        </div>

        {/* Specialty Filter Chips */}
        <div className="relative z-10">
          <span className="font-display text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-3">
            Filter Specialty
          </span>
          <div className="flex flex-wrap gap-2.5">
            {SPECIALTIES.map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialty(spec)}
                className={`px-4 py-2 rounded-xl text-xs font-display font-semibold transition-all cursor-pointer ${
                  selectedSpecialty === spec
                    ? 'bg-secondary-fixed text-primary shadow-xl shadow-secondary-fixed/10'
                    : 'bg-surface-container-low text-on-surface hover:text-white border border-outline-variant hover:border-outline'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid List */}
      {filteredCoaches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCoaches.map((coach) => (
            <div
              key={coach.id}
              className="bg-surface-container border border-outline-variant hover:border-outline rounded-3xl group transition-all duration-300 shadow-sm flex flex-col justify-between overflow-hidden relative"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-fixed/5 rounded-full blur-xl pointer-events-none" />
              {/* Avatar Header */}
              <div className="h-64 overflow-hidden relative select-none">
                <img
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  alt={coach.name}
                  src={coach.avatar}
                />
                <div className="absolute top-4 right-4 bg-primary/80 border border-outline-variant text-white px-3 py-1 text-[10px] rounded-md font-display font-bold uppercase tracking-wider">
                  {coach.experience} Exp
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-secondary-fixed text-primary px-3 py-1 rounded-md font-display text-xs font-bold uppercase tracking-wider shadow">
                    {coach.specialty}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between relative">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-display text-lg font-bold text-white">{coach.name}</h3>
                    <div className="flex items-center text-secondary-fixed animate-pulse">
                      <span className="material-symbols-outlined text-base align-middle" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-sans font-bold text-sm ml-1">{coach.rating}</span>
                    </div>
                  </div>

                  <p className="text-secondary-fixed font-semibold text-xs uppercase tracking-wider mb-2">
                    {coach.license}
                  </p>
                  
                  <div className="flex items-center gap-1.5 text-on-surface-variant font-sans text-xs mb-4">
                    <span className="material-symbols-outlined text-sm">location_on</span>
                    {coach.location}
                  </div>

                  <p className="text-sm text-on-surface-variant mb-6 leading-relaxed line-clamp-3">
                    {coach.bio}
                  </p>
                </div>

                <div>
                  {/* Progress Score widget */}
                  <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant mb-4">
                    <div className="flex justify-between text-xs font-bold text-secondary-fixed uppercase mb-2 tracking-wider">
                      <span>{coach.growthLabel}</span>
                      <span>{coach.growthRate}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-outline-variant rounded-full overflow-hidden">
                      <div className="h-full bg-secondary-fixed" style={{ width: `${coach.growthRate}%` }} />
                    </div>
                  </div>

                  {/* Pricing and Button */}
                  <div className="flex justify-between items-center pt-2">
                    <div>
                      <span className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider block">TRIAL FEE</span>
                      <p className="font-display text-base font-extrabold text-white">{coach.fees}</p>
                    </div>
                    <button
                      onClick={() => onSelectCoach(coach)}
                      className="bg-secondary-fixed text-primary hover:brightness-110 px-6 py-2.5 rounded-xl font-display text-xs font-bold shadow-md transition-all active:scale-95"
                    >
                      Connect Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface-container border border-outline-variant rounded-3xl">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">search_off</span>
          <h3 className="font-display text-xl font-bold text-white">No Mentors Found</h3>
          <p className="text-sm text-on-surface-variant mt-2 max-w-md mx-auto leading-relaxed">
            We couldn't find any coaches matching "{searchQuery}" under "{selectedSpecialty}". Try adjusting your filters or query.
          </p>
        </div>
      )}
    </div>
  );
}
