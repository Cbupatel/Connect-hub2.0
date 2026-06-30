/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { Coach } from '../types';
import { HERO_BG_URL, MISSION_IMG_URL, FOUNDER_IMG_URL } from '../data';

interface HomeViewProps {
  coaches: Coach[];
  onSelectCoach: (coach: Coach) => void;
  onNavigateToTab: (tab: 'find-coaches' | 'find-players' | 'training-plans' | 'about-us') => void;
  onOpenRegister: () => void;
}

export default function HomeView({
  coaches,
  onSelectCoach,
  onNavigateToTab,
  onOpenRegister,
}: HomeViewProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmt = direction === 'left' ? -350 : 350;
      carouselRef.current.scrollBy({ left: scrollAmt, behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-primary">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/80 to-transparent z-10" />
          <img
            className="w-full h-full object-cover select-none"
            alt="Football Pitch"
            src={HERO_BG_URL}
          />
        </div>

        <div className="relative z-20 px-10 max-w-7xl mx-auto w-full py-16">
          <div className="max-w-2xl select-text">
            <span className="inline-block bg-secondary-fixed text-primary font-display text-xs font-bold px-3 py-1 mb-6 rounded-sm tracking-wider">
              GRASSROOTS REVOLUTION
            </span>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white font-extrabold mb-6 leading-tight text-shadow-athletic">
              Where Football Coaches <br />
              <span className="text-secondary-fixed">&amp; Players Connect</span>, <br />
              Learn &amp; Grow.
            </h1>
            <p className="font-sans text-lg text-white/80 my-8 leading-relaxed max-w-lg">
              Empowering the next generation of Indian footballers with affordable scouting, professional coaching, and a vibrant community hub. Let talent take the pitch.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                onClick={() => onNavigateToTab('find-coaches')}
                id="hero_find_coach_btn"
                className="bg-secondary-fixed text-primary px-8 py-4 rounded font-display text-base font-bold hover:brightness-110 transition-all active:scale-95 shadow-xl shadow-secondary-fixed/20"
              >
                Find a Coach
              </button>
              <button
                onClick={() => onNavigateToTab('find-players')}
                id="hero_find_players_btn"
                className="border-2 border-white text-white px-8 py-4 rounded font-display text-base font-bold hover:bg-white hover:text-primary transition-all active:scale-95"
              >
                Find Players
              </button>
            </div>
          </div>
        </div>

        {/* Floating Stat Bar */}
        <div className="absolute bottom-12 right-10 hidden lg:flex gap-12 text-white border-l-2 border-secondary-fixed pl-8 select-text">
          <div>
            <div className="font-display text-4xl font-extrabold">12k+</div>
            <div className="font-display text-xs font-bold text-secondary-fixed uppercase tracking-widest mt-1">
              Active Players
            </div>
          </div>
          <div>
            <div className="font-display text-4xl font-extrabold">850+</div>
            <div className="font-display text-xs font-bold text-secondary-fixed uppercase tracking-widest mt-1">
              Verified Coaches
            </div>
          </div>
        </div>
      </section>

      {/* Bento How It Works */}
      <section className="py-24 px-10 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 select-text">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-white mb-2 uppercase italic tracking-tighter">
              How It Works
            </h2>
            <div className="w-24 h-1.5 bg-secondary-fixed rounded-full" />
          </div>
          <p className="font-sans text-base text-on-surface-variant max-w-md">
            Bridging the gap between raw talent and professional guidance through three simple steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-4 bg-surface-container border border-outline-variant p-8 hover:border-outline transition-all duration-300 rounded-3xl group shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-secondary-fixed/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <span className="material-symbols-outlined text-5xl text-secondary-fixed mb-6 group-hover:scale-110 transition-transform duration-300 block">
                person_add
              </span>
              <h3 className="font-display text-xl font-bold mb-3 text-white">01. Create Profile</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Players upload skill metrics and highlight clips; coaches showcase verified football licenses, fees, and tactical modules.
              </p>
            </div>
          </div>

          <div className="md:col-span-4 bg-surface-container border border-outline-variant p-8 hover:border-outline transition-all duration-300 rounded-3xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-32 h-32 bg-secondary-fixed/5 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
            <div className="relative z-10">
              <span className="material-symbols-outlined text-5xl text-secondary-fixed mb-6 block">
                hub
              </span>
              <h3 className="font-display text-xl font-bold mb-3 text-secondary-fixed">02. Smart Connection</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Our algorithmic matchmaking connects athletes with specialized mentors based on position, age, and skill-development priorities.
              </p>
            </div>
          </div>

          <div className="md:col-span-4 bg-surface-container border border-outline-variant p-8 hover:border-outline transition-all duration-300 rounded-3xl group shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-secondary-fixed/5 rounded-full blur-2xl pointer-events-none" />
            <div>
              <span className="material-symbols-outlined text-5xl text-secondary-fixed mb-6 group-hover:scale-110 transition-transform duration-300 block">
                trending_up
              </span>
              <h3 className="font-display text-xl font-bold mb-3 text-white">03. Grow Together</h3>
              <p className="text-on-surface-variant text-sm leading-relaxed">
                Unlock targeted lessons, monitor fitness and training routines in real time, and gain exposure to state scouts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section className="bg-surface-container py-24 relative overflow-hidden border-t border-b border-outline-variant">
        <div className="px-10 max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary-fixed/20 z-0 rounded-2xl blur-xl" />
            <img
              className="relative z-10 w-full aspect-square object-cover grayscale hover:grayscale-0 transition-all duration-700 rounded-3xl border border-outline-variant shadow-md"
              alt="Community Football"
              src={MISSION_IMG_URL}
            />
          </div>
          <div className="select-text">
            <h2 className="font-display text-3xl font-extrabold text-white mb-6 uppercase italic tracking-tighter">
              Our Mission
            </h2>
            <p className="font-sans text-lg text-on-surface-variant mb-6 leading-relaxed">
              In a nation with immense untapped grassroots potential, ConnectHub was born to democratize football pathing. We believe every aspiring player deserves direct access to professional coaching.
            </p>

            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-secondary-fixed pt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <div>
                  <span className="font-display text-sm font-bold text-white block">Affordable Access</span>
                  <p className="text-sm text-on-surface-variant mt-0.5">Eliminating financial barriers to make top-tier football training available to all.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-secondary-fixed pt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <div>
                  <span className="font-display text-sm font-bold text-white block">Verified Standards Only</span>
                  <p className="text-sm text-on-surface-variant mt-0.5">Every coach is vetted with verifiable AIFF, AFC, or FIFA coaching credentials.</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <span className="material-symbols-outlined text-secondary-fixed pt-1" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                <div>
                  <span className="font-display text-sm font-bold text-white block">Merit-Based Scouting</span>
                  <p className="text-sm text-on-surface-variant mt-0.5">A clean talent dashboard for scouts to find players purely on raw athletic metrics.</p>
                </div>
              </li>
            </ul>

            <button
              onClick={() => onNavigateToTab('about-us')}
              className="bg-primary border border-outline-variant text-white px-8 py-3 rounded-lg font-display text-sm font-bold hover:bg-secondary-fixed hover:text-primary transition-all active:scale-95 shadow-md"
            >
              Learn More About Us
            </button>
          </div>
        </div>
      </section>

      {/* Featured Coaches Carousel */}
      <section className="py-24 overflow-hidden bg-surface">
        <div className="px-10 max-w-7xl mx-auto mb-12 flex justify-between items-end select-text">
          <div>
            <h2 className="font-display text-3xl font-extrabold text-white mb-2 uppercase italic tracking-tighter">
              Featured Coaches
            </h2>
            <div className="w-24 h-1.5 bg-secondary-fixed rounded-full" />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scrollCarousel('left')}
              className="w-12 h-12 rounded-lg border border-outline flex items-center justify-center hover:bg-secondary-fixed hover:text-primary hover:border-secondary-fixed transition-all active:scale-95"
              aria-label="Previous"
            >
              <span className="material-symbols-outlined font-bold">chevron_left</span>
            </button>
            <button
              onClick={() => scrollCarousel('right')}
              className="w-12 h-12 rounded-lg border border-outline flex items-center justify-center hover:bg-secondary-fixed hover:text-primary hover:border-secondary-fixed transition-all active:scale-95"
              aria-label="Next"
            >
              <span className="material-symbols-outlined font-bold">chevron_right</span>
            </button>
          </div>
        </div>

        <div
          ref={carouselRef}
          className="flex gap-6 px-10 overflow-x-auto snap-x snap-mandatory no-scrollbar pb-8 max-w-7xl mx-auto scrolling-touch"
        >
          {coaches.map((coach) => (
            <div
              key={coach.id}
              className="min-w-[300px] md:min-w-[340px] snap-start bg-surface-container border border-outline-variant hover:border-outline rounded-3xl group transition-all duration-300 shadow-sm flex flex-col justify-between overflow-hidden relative"
            >
              <div className="h-64 overflow-hidden relative">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                  alt={coach.name}
                  src={coach.avatar}
                />
                <div className="absolute bottom-4 left-4">
                  <span className="bg-secondary-fixed text-primary px-3 py-1 rounded-md font-display text-xs font-bold uppercase tracking-wider shadow">
                    {coach.specialty}
                  </span>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between relative">
                <div className="absolute top-0 right-0 w-24 h-24 bg-secondary-fixed/5 rounded-full blur-xl pointer-events-none" />
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-display text-lg font-bold text-white">{coach.name}</h4>
                    <div className="flex items-center text-secondary-fixed animate-pulse">
                      <span className="material-symbols-outlined text-base align-middle" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-sans font-bold text-sm ml-1">{coach.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-on-surface-variant font-semibold mb-4 uppercase tracking-wider">{coach.license}</p>
                  <p className="text-sm text-on-surface-variant mb-6 line-clamp-3 leading-relaxed">
                    {coach.bio}
                  </p>
                </div>

                <div>
                  <div className="bg-surface-container-low p-4 rounded-2xl border border-outline-variant">
                    <div className="flex justify-between text-xs font-bold text-secondary-fixed uppercase mb-2 tracking-wider">
                      <span>{coach.growthLabel}</span>
                      <span>{coach.growthRate}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-outline-variant rounded-full overflow-hidden">
                      <div className="h-full bg-secondary-fixed" style={{ width: `${coach.growthRate}%` }} />
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectCoach(coach)}
                    className="w-full mt-4 py-3 rounded-xl border-2 border-secondary-fixed hover:bg-secondary-fixed hover:text-primary font-display text-sm font-bold text-secondary-fixed transition-all active:scale-95"
                  >
                    Connect Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Message from Our Founder */}
      <section className="bg-gradient-to-br from-primary via-surface-container to-primary py-24 text-white border-t border-b border-outline-variant">
        <div className="px-10 max-w-7xl mx-auto grid md:grid-cols-12 gap-16 items-center">
          <div className="md:col-span-5 relative">
            <div className="aspect-square bg-surface-container-highest overflow-hidden rounded-3xl relative border border-outline-variant shadow-2xl">
              <img
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000 select-none"
                alt="Shibu Patel"
                src={FOUNDER_IMG_URL}
              />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-secondary-fixed p-6 md:p-8 rounded-2xl shadow-2xl border border-outline-variant">
              <h5 className="text-primary font-display text-xl font-extrabold leading-none mb-1">
                Shibu Patel
              </h5>
              <p className="text-primary/70 font-display text-[10px] font-bold uppercase tracking-widest">
                Founder &amp; CEO
              </p>
            </div>
          </div>
          <div className="md:col-span-6 md:col-start-7 pt-12 md:pt-0 select-text relative">
            <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-48 h-48 bg-secondary-fixed/5 rounded-full blur-3xl pointer-events-none" />
            <span className="text-secondary-fixed font-display text-xs font-bold tracking-widest uppercase mb-4 block">
              A MESSAGE FROM OUR FOUNDER
            </span>
            <blockquote className="font-display text-2xl md:text-3xl mb-8 leading-normal font-extrabold italic text-secondary-fixed text-shadow-athletic">
              &ldquo;ConnectHub isn't just a platform; it's the digital highway for the next billion football dreams. We make sure India's raw diamond football talent is scouted right from the dirt fields.&rdquo;
            </blockquote>
            <p className="text-white/75 leading-relaxed max-w-xl font-sans text-sm">
              With over two decades spent inside professional athletic setups, Shibu Patel encountered the deep systemic barriers limiting talented boys and girls outside regional urban circuits. ConnectHub is an active bridge to empower any certified coach and scout real potential across rural and tier testing locations transparently.
            </p>
          </div>
        </div>
      </section>

      {/* Action CTA Block */}
      <section className="py-24 px-10 max-w-7xl mx-auto text-center">
        <div className="max-w-4xl mx-auto bg-surface-container border border-outline-variant p-12 md:p-20 relative overflow-hidden rounded-3xl shadow-2xl select-text">
          <div className="absolute top-0 left-0 w-2 h-full bg-secondary-fixed" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary-fixed/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-4xl text-white font-extrabold mb-6 uppercase tracking-tight">
              Ready to Take the Field?
            </h2>
            <p className="font-sans text-base text-on-surface-variant mb-10 max-w-xl mx-auto leading-relaxed">
              Join India's fastest-growing grassroots football framework. Map your stats, book verified trainers, or list your soccer credentials today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onOpenRegister}
                className="bg-secondary-fixed text-primary px-10 py-4 rounded-xl font-display text-base font-bold hover:brightness-110 hover:scale-[1.02] shadow-xl transition-all active:scale-95"
              >
                Register as Player
              </button>
              <button
                onClick={onOpenRegister}
                className="bg-primary border border-outline text-white px-10 py-4 rounded-xl font-display text-base font-bold hover:bg-surface-container hover:scale-[1.02] shadow-xl transition-all active:scale-95"
              >
                Register as Coach
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
