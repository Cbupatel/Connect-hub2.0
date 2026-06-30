/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { Player, PlayerPosition } from '../types';

interface PlayerDirectoryProps {
  players: Player[];
  onScoutPlayer: (player: Player) => void;
}

const POSITIONS: ('All' | PlayerPosition)[] = ['All', 'ST', 'CM', 'CB', 'GK', 'LW', 'RW'];

export default function PlayerDirectory({ players, onScoutPlayer }: PlayerDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<'All' | PlayerPosition>('All');
  const [sortBy, setSortBy] = useState<'overall' | 'pace'>('overall');

  const filteredPlayers = useMemo(() => {
    return players
      .filter((player) => {
        const matchesSearch =
          player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          player.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPosition =
          selectedPosition === 'All' || player.position === selectedPosition;
        return matchesSearch && matchesPosition;
      })
      .sort((a, b) => {
        // Calculate average stat as overall
        const calcAvg = (p: Player) =>
          (p.stats.pace + p.stats.dribbling + p.stats.passing + p.stats.physicality + p.stats.tacticalIq) / 5;

        if (sortBy === 'overall') {
          return calcAvg(b) - calcAvg(a);
        } else {
          return b.stats.pace - a.stats.pace;
        }
      });
  }, [players, searchQuery, selectedPosition, sortBy]);

  return (
    <div className="py-12 px-10 max-w-7xl mx-auto animate-fade-in select-text">
      {/* Header */}
      <div className="mb-12">
        <span className="text-primary bg-secondary-fixed px-3 py-1 font-display text-xs font-bold tracking-wider rounded-md">
          SCOUTING NETWORK
        </span>
        <h1 className="font-display text-3xl md:text-4xl text-white font-extrabold mt-4 uppercase tracking-tight">
          India's Emerging Football Talent
        </h1>
        <p className="font-sans text-base text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
          Search the country's deepest grassroots directories. Review verified player physical metrics, spatial stats, and track records.
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
              placeholder="Search by player name, hometown, district..."
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
              <option value="overall">Sort by Overall Stats</option>
              <option value="pace">Sort by Sprint Pace (Sprint)</option>
            </select>
          </div>
        </div>

        {/* Position Filter Chips */}
        <div className="relative z-10">
          <span className="font-display text-[10px] font-bold text-on-surface-variant uppercase tracking-widest block mb-3">
            POSITIONS
          </span>
          <div className="flex flex-wrap gap-2.5">
            {POSITIONS.map((pos) => (
              <button
                key={pos}
                onClick={() => setSelectedPosition(pos)}
                className={`px-4 py-2 rounded-xl text-xs font-display font-semibold transition-all cursor-pointer ${
                  selectedPosition === pos
                    ? 'bg-secondary-fixed text-primary shadow-xl shadow-secondary-fixed/10'
                    : 'bg-surface-container-low text-on-surface hover:text-white border border-outline-variant hover:border-outline'
                }`}
              >
                {pos}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid List */}
      {filteredPlayers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredPlayers.map((player) => {
            const overallRating = Math.round(
              (player.stats.pace +
                player.stats.dribbling +
                player.stats.passing +
                player.stats.physicality +
                player.stats.tacticalIq) /
                5
            );

            return (
              <div
                key={player.id}
                className="bg-surface-container border border-outline-variant hover:border-outline rounded-3xl group transition-all duration-300 shadow overflow-hidden flex flex-col justify-between relative"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-secondary-fixed/5 rounded-full blur-3xl pointer-events-none" />
                {/* Football Trading Card Header */}
                <div className="bg-gradient-to-b from-primary to-surface-container-low pt-8 pb-6 px-6 text-white text-center relative select-none border-b border-outline-variant">
                  {/* Rating Bubble */}
                  <div className="absolute top-4 left-4 bg-secondary-fixed text-primary w-11 h-11 rounded-xl flex flex-col justify-center items-center shadow-lg">
                    <span className="font-display text-base font-black leading-none">{overallRating}</span>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-primary/70">OVR</span>
                  </div>

                  {/* Position Bubble */}
                  <div className="absolute top-4 right-4 bg-surface-container/60 text-white w-11 h-11 rounded-xl flex flex-col justify-center items-center backdrop-blur-sm border border-outline-variant">
                    <span className="font-display text-xs font-black leading-none text-secondary-fixed">{player.position}</span>
                    <span className="text-[8px] font-bold uppercase tracking-wider text-white/50">POS</span>
                  </div>

                  <div className="w-20 h-20 mx-auto rounded-full overflow-hidden border-2 border-secondary-fixed shadow-md mt-4">
                    <img className="w-full h-full object-cover" alt={player.name} src={player.avatar} />
                  </div>
                  <h3 className="font-display text-base font-bold mt-4 text-white tracking-wide truncate">
                    {player.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1 text-[10px] text-on-surface-variant font-semibold mt-1 uppercase tracking-wider">
                    <span className="material-symbols-outlined text-xs">location_on</span>
                    {player.location}
                  </div>
                </div>

                {/* Athlete Statistics Block */}
                <div className="p-5 flex-1 flex flex-col justify-between bg-surface-container relative">
                  <div>
                    {/* Age and bios */}
                    <div className="flex justify-between items-center text-xs font-bold text-on-surface-variant border-b border-outline-variant pb-3 mb-4">
                      <span>Age: {player.age} Years</span>
                      <span className="text-secondary-fixed">Verified Scout</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mb-6 line-clamp-2 leading-relaxed italic">
                      &ldquo;{player.bio}&rdquo;
                    </p>

                    {/* Quick Stats list */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-12 items-center text-xs">
                        <span className="col-span-4 font-display font-medium uppercase tracking-wider text-on-surface text-[9px]">Pace</span>
                        <div className="col-span-6 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                          <div className="h-full bg-secondary-fixed" style={{ width: `${player.stats.pace}%` }} />
                        </div>
                        <span className="col-span-2 text-right font-mono font-bold text-white">{player.stats.pace}</span>
                      </div>

                      <div className="grid grid-cols-12 items-center text-xs">
                        <span className="col-span-4 font-display font-medium uppercase tracking-wider text-on-surface text-[9px]">Dribble</span>
                        <div className="col-span-6 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                          <div className="h-full bg-secondary-fixed" style={{ width: `${player.stats.dribbling}%` }} />
                        </div>
                        <span className="col-span-2 text-right font-mono font-bold text-white">{player.stats.dribbling}</span>
                      </div>

                      <div className="grid grid-cols-12 items-center text-xs">
                        <span className="col-span-4 font-display font-medium uppercase tracking-wider text-on-surface text-[9px]">Passing</span>
                        <div className="col-span-6 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                          <div className="h-full bg-secondary-fixed" style={{ width: `${player.stats.passing}%` }} />
                        </div>
                        <span className="col-span-2 text-right font-mono font-bold text-white">{player.stats.passing}</span>
                      </div>

                      <div className="grid grid-cols-12 items-center text-xs">
                        <span className="col-span-4 font-display font-medium uppercase tracking-wider text-on-surface text-[9px]">Physique</span>
                        <div className="col-span-6 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                          <div className="h-full bg-secondary-fixed" style={{ width: `${player.stats.physicality}%` }} />
                        </div>
                        <span className="col-span-2 text-right font-mono font-bold text-white">{player.stats.physicality}</span>
                      </div>

                      <div className="grid grid-cols-12 items-center text-xs">
                        <span className="col-span-4 font-display font-medium uppercase tracking-wider text-on-surface text-[9px]">Tactics</span>
                        <div className="col-span-6 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                          <div className="h-full bg-secondary-fixed" style={{ width: `${player.stats.tacticalIq}%` }} />
                        </div>
                        <span className="col-span-2 text-right font-mono font-bold text-white">{player.stats.tacticalIq}</span>
                      </div>
                    </div>
                  </div>

                  {/* Scout Inquiry Trigger */}
                  <div className="pt-6">
                    <button
                      onClick={() => onScoutPlayer(player)}
                      className="w-full py-3.5 bg-secondary-fixed text-primary font-display text-xs font-bold rounded-xl hover:brightness-110 shadow transition-all active:scale-95"
                    >
                      Inquire Scout Profile
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-surface-container border border-outline-variant rounded-3xl">
          <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">search_off</span>
          <h3 className="font-display text-xl font-bold text-white">No Young Athletes Found</h3>
          <p className="text-sm text-on-surface-variant mt-2 max-w-md mx-auto leading-relaxed">
            We couldn't search any player matching "{searchQuery}" in "{selectedPosition}". Refine your scouts.
          </p>
        </div>
      )}
    </div>
  );
}
