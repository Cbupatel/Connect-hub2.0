/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { TrainingPlan } from '../types';

interface TrainingHubProps {
  plans: TrainingPlan[];
}

export default function TrainingHub({ plans }: TrainingHubProps) {
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || '');

  const activePlan = plans.find((p) => p.id === selectedPlanId);

  return (
    <div className="py-12 px-10 max-w-7xl mx-auto animate-fade-in select-text">
      {/* Header */}
      <div className="mb-12">
        <span className="text-primary bg-secondary-fixed px-3 py-1 font-display text-xs font-bold tracking-wider rounded-md">
          TRAINING CURRICULUM
        </span>
        <h1 className="font-display text-3xl md:text-4xl text-white font-extrabold mt-4 uppercase tracking-tight">
          Tactical Academy &amp; Drills Hub
        </h1>
        <p className="font-sans text-base text-on-surface-variant mt-2 max-w-2xl leading-relaxed">
          Access high-caliber academy plans used by professional ISL youth teams. Tailored for midfielders, forwards, and sweepers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Playbook Sidebar List */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <span className="font-display text-[10px] font-bold text-on-surface-variant uppercase tracking-widest pl-2">
            Academy Manuals
          </span>
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => setSelectedPlanId(plan.id)}
              className={`p-5 rounded-2xl text-left border transition-all duration-200 shadow-sm flex flex-col justify-between select-none cursor-pointer ${
                selectedPlanId === plan.id
                  ? 'bg-secondary-fixed text-primary border-secondary-fixed font-semibold'
                  : 'bg-surface-container border-outline-variant hover:border-outline text-white'
              }`}
            >
              <div>
                <span
                  className={`text-[10px] font-display font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                    selectedPlanId === plan.id ? 'bg-primary/10 text-primary' : 'bg-surface-container-low text-secondary-fixed border border-outline-variant'
                  }`}
                >
                  {plan.category}
                </span>
                <h3 className="font-display text-base font-bold mt-3 leading-tight">{plan.title}</h3>
              </div>
              <div className="flex justify-between items-center mt-6 text-xs opacity-75 font-sans">
                <span>{plan.duration}</span>
                <span className="font-bold uppercase tracking-wider">{plan.difficulty}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Playbook Active Details */}
        <div className="lg:col-span-8">
          {activePlan ? (
            <div className="bg-surface-container border border-outline-variant p-8 md:p-10 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-secondary-fixed/5 rounded-full blur-3xl pointer-events-none" />
              
              <div className="flex flex-wrap justify-between items-start gap-4 pb-6 border-b border-outline-variant relative z-10">
                <div>
                  <span className="inline-block bg-secondary-fixed text-primary px-3 py-1 text-[10px] font-display font-bold uppercase rounded-md mb-3">
                    {activePlan.category}
                  </span>
                  <h2 className="font-display text-2xl md:text-3xl text-white font-extrabold uppercase tracking-tight">
                    {activePlan.title}
                  </h2>
                </div>
                <div className="flex gap-4">
                  <div className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-center">
                    <span className="text-[10px] block text-on-surface-variant font-bold tracking-wider">DIFFICULTY</span>
                    <span className="font-display text-xs font-bold text-secondary-fixed uppercase">{activePlan.difficulty}</span>
                  </div>
                  <div className="bg-surface-container-low border border-outline-variant px-4 py-2 rounded-xl text-center">
                    <span className="text-[10px] block text-on-surface-variant font-bold tracking-wider">DURATION</span>
                    <span className="font-display text-xs font-bold text-secondary-fixed uppercase">{activePlan.duration}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="my-8 relative z-10">
                <h4 className="font-display text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Manual Overview</h4>
                <p className="font-sans text-sm text-on-surface-variant leading-relaxed">
                  {activePlan.description}
                </p>
              </div>

              {/* Drills Section */}
              <div className="relative z-10">
                <h4 className="font-display text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-6">Academy Drills &amp; Stages</h4>
                <div className="space-y-6">
                  {activePlan.drills.map((drill, index) => (
                    <div
                      key={index}
                      className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl hover:border-outline transition-colors flex flex-col gap-4"
                    >
                      <div className="flex justify-between items-center">
                        <h5 className="font-display text-base font-bold text-white flex items-center gap-3">
                          <span className="bg-secondary-fixed text-primary w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold shadow">
                            {index + 1}
                          </span>
                          {drill.title}
                        </h5>
                        <span className="text-[10px] font-mono font-bold bg-surface-container border border-outline-variant px-2.5 py-1 rounded-md text-secondary-fixed">
                          {drill.duration}
                        </span>
                      </div>
                      
                      <div className="pl-10">
                        <ul className="space-y-2">
                          {drill.instructions.map((inst, instIndex) => (
                            <li key={instIndex} className="text-xs text-on-surface-variant leading-relaxed flex items-start gap-2.5">
                              <span className="font-bold text-secondary-fixed text-base leading-none">•</span>
                              <span>{inst}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-surface-container border border-outline-variant rounded-3xl">
              <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">sports_football</span>
              <h3 className="font-display text-xl font-bold text-white">No Active Lesson</h3>
              <p className="text-sm text-on-surface-variant mt-2">Choose a manual from the academy list.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
