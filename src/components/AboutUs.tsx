/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { MISSION_IMG_URL } from '../data';
import { uploadFileToStorage } from '../lib/firebase';

interface AboutUsProps {
  currentUser?: any;
}

export default function AboutUs({ currentUser }: AboutUsProps) {
  const fileInputPortraitRef = useRef<HTMLInputElement>(null);
  const fileInputPitchRef = useRef<HTMLInputElement>(null);

  const [portraitImg, setPortraitImg] = useState(
    localStorage.getItem('custom_founder_portrait') || '/src/assets/images/shibu_headshot_1781515897716.jpg'
  );
  const [pitchImg, setPitchImg] = useState(
    localStorage.getItem('custom_founder_pitch') || '/src/assets/images/shibu_field_kit_1781515917707.jpg'
  );
  const [uploadingPortrait, setUploadingPortrait] = useState(false);
  const [uploadingPitch, setUploadingPitch] = useState(false);

  const isOwner = currentUser?.email === 'cbhujr@gmail.com' || currentUser?.email?.toLowerCase().includes('shibu');

  const handlePortraitUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingPortrait(true);
      try {
        const url = await uploadFileToStorage(e.target.files[0], 'about_photos');
        setPortraitImg(url);
        localStorage.setItem('custom_founder_portrait', url);
      } catch (err) {
        console.error("Portrait upload failed:", err);
      } finally {
        setUploadingPortrait(false);
      }
    }
  };

  const handlePitchUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadingPitch(true);
      try {
        const url = await uploadFileToStorage(e.target.files[0], 'about_photos');
        setPitchImg(url);
        localStorage.setItem('custom_founder_pitch', url);
      } catch (err) {
        console.error("Pitch upload failed:", err);
      } finally {
        setUploadingPitch(false);
      }
    }
  };
  return (
    <div className="py-12 px-10 max-w-7xl mx-auto animate-fade-in select-text">
      {/* Header */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <span className="text-primary bg-secondary-fixed px-3 py-1 font-display text-xs font-bold tracking-wider rounded-md">
          ABOUT PLATFORM
        </span>
        <h1 className="font-display text-3xl md:text-5xl text-white font-extrabold mt-4 uppercase tracking-tight">
          Empowering the Future of Indian Football
        </h1>
        <p className="font-sans text-base text-on-surface-variant mt-3 leading-relaxed">
          Connecting rural coaches, local scouting programs, and raw community talent onto a unified, transparent football pathway.
        </p>
      </div>

      {/* Grid Backstory */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-12">
        <div className="order-2 lg:order-1">
          <h2 className="font-display text-2xl md:text-3xl text-white font-bold uppercase tracking-tight mb-6">
            Our Backstory &amp; Commitment
          </h2>
          <p className="font-sans text-base text-on-surface-variant mb-6 leading-relaxed">
            ConnectHub was founded by sports expert Shibu Patel to democratize academy-level training. India possesses immense football interest and talent, yet regional scouts remain concentrated mostly around corporate academies and metropolitan centers. This leaves countless talented kids in remote areas unscouted.
          </p>
          <p className="font-sans text-base text-on-surface-variant mb-6 leading-relaxed">
            By building a secure stat-tracker and verified coach networking framework, ConnectHub provides an open, modern arena. Here, players can upload performance benchmarks, study expert training plans, and speak directly to professional scouts.
          </p>
          <div className="flex gap-4 border-l-4 border-secondary-fixed pl-4 my-8 font-display text-sm font-bold text-secondary-fixed italic">
            &ldquo;We don't sell premium subscriptions, we distribute equal soccer opportunities.&rdquo;
          </div>
        </div>

        <div className="order-1 lg:order-2 relative">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-secondary-fixed/20 z-0 rounded-3xl blur-xl" />
          <img
            className="relative z-10 w-full aspect-video object-cover rounded-3xl border border-outline-variant shadow-md grayscale hover:grayscale-0 transition-all duration-700 select-none"
            alt="Grassroots Football Training"
            src={MISSION_IMG_URL}
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Core Values */}
      <div className="py-16">
        <h3 className="font-display text-2xl text-white font-bold text-center mb-12 uppercase tracking-tight">Our Core Values</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-surface-container border border-outline-variant p-8 rounded-3xl shadow-sm relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-secondary-fixed/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-300" />
            <span className="material-symbols-outlined text-4xl text-secondary-fixed mb-4 block">diversity_3</span>
            <h4 className="font-display text-lg font-bold text-white mb-3">Inclusive Community</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              We make football infrastructure inclusive, welcoming players from tier-2, tier-3 cities, and tribal districts to list their profiles and showcase soccer metrics freely.
            </p>
          </div>

          <div className="bg-surface-container border border-outline-variant p-8 rounded-3xl shadow-sm relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-secondary-fixed/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-300" />
            <span className="material-symbols-outlined text-4xl text-secondary-fixed mb-4 block">verified_user</span>
            <h4 className="font-display text-lg font-bold text-white mb-3">Vetted Credentials</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              To preserve instructional safety and high training levels, we require all registering coaches to hold recognized AIFF, AFC, or FIFA licenses.
            </p>
          </div>

          <div className="bg-surface-container border border-outline-variant p-8 rounded-3xl shadow-sm relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-secondary-fixed/5 rounded-full blur-2xl group-hover:scale-110 transition-transform duration-300" />
            <span className="material-symbols-outlined text-4xl text-secondary-fixed mb-4 block">sports_score</span>
            <h4 className="font-display text-lg font-bold text-white mb-3">Transparency over Hype</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              We focus on actual metric indicators, reflex speeds, physical stats, and tactical understanding over expensive showcase videos, letting talent speak.
            </p>
          </div>
        </div>
      </div>

      {/* Founder Spotlight */}
      <div className="bg-surface-container border border-outline-variant p-8 md:p-14 rounded-3xl my-12 grid grid-cols-1 md:grid-cols-12 gap-12 items-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-secondary-fixed/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Adjusted left image container: 2 column layout showcasing headshot and jersey pictures */}
        <div className="md:col-span-5 grid grid-cols-2 gap-4 relative select-none">
          {/* Portrait Image */}
          <div className="flex flex-col gap-2 relative group">
            <div className="relative overflow-hidden rounded-2xl border border-outline-variant shadow justify-center items-center">
              <img
                className="w-full aspect-[4/5] object-cover hover:brightness-110 hover:scale-105 transition-all duration-300"
                alt="Founder Shibu Patel - Portrait"
                src={portraitImg}
                referrerPolicy="no-referrer"
              />
              {uploadingPortrait && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="text-[10px] text-white font-mono animate-pulse uppercase tracking-wider">Uploading...</span>
                </div>
              )}
              {isOwner && !uploadingPortrait && (
                <button
                  type="button"
                  onClick={() => fileInputPortraitRef.current?.click()}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity duration-200 cursor-pointer text-white"
                >
                  <span className="material-symbols-outlined text-xl">upload_file</span>
                  <span className="text-[9px] font-mono tracking-wider uppercase font-extrabold px-2 text-center leading-tight">Change Real Photo</span>
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputPortraitRef}
              onChange={handlePortraitUpload}
              accept="image/*"
              className="hidden"
            />
            <span className="text-[10px] text-center text-on-surface-variant font-mono uppercase tracking-widest font-semibold mt-1">Founder Portrait</span>
          </div>

          {/* Training Field Image */}
          <div className="flex flex-col gap-2 relative group">
            <div className="relative overflow-hidden rounded-2xl border border-outline-variant shadow justify-center items-center">
              <img
                className="w-full aspect-[4/5] object-cover hover:brightness-110 hover:scale-105 transition-all duration-300"
                alt="Founder Shibu Patel - Football field"
                src={pitchImg}
                referrerPolicy="no-referrer"
              />
              {uploadingPitch && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                  <span className="text-[10px] text-white font-mono animate-pulse uppercase tracking-wider">Uploading...</span>
                </div>
              )}
              {isOwner && !uploadingPitch && (
                <button
                  type="button"
                  onClick={() => fileInputPitchRef.current?.click()}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1 transition-opacity duration-200 cursor-pointer text-white"
                >
                  <span className="material-symbols-outlined text-xl">upload_file</span>
                  <span className="text-[9px] font-mono tracking-wider uppercase font-extrabold px-2 text-center leading-tight">Change Real Photo</span>
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputPitchRef}
              onChange={handlePitchUpload}
              accept="image/*"
              className="hidden"
            />
            <span className="text-[10px] text-center text-on-surface-variant font-mono uppercase tracking-widest font-semibold mt-1">On Training Field</span>
          </div>
        </div>

        {/* Text Area */}
        <div className="md:col-span-7 flex flex-col justify-center relative z-10 select-text">
          <span className="text-secondary-fixed font-display text-xs font-bold tracking-widest uppercase mb-2">FOUNDER ADDRESS &amp; MISSION</span>
          <h4 className="font-display text-xl md:text-2xl font-black mb-4 text-white">Shibu Patel</h4>
          
          <div className="relative bg-surface-container-low p-6 rounded-2xl border border-outline-variant/60 shadow-inner mb-6">
            <span className="material-symbols-outlined absolute -top-4 -left-1 text-4xl text-secondary-fixed/20 font-black pointer-events-none select-none">format_quote</span>
            <p className="text-sm text-white/90 leading-relaxed font-sans italic relative z-10">
              My name is Shibu Patel and i am also a semi professional.I have created this website so that those who are in Aiff LICENSE or semi professional players, those who are not have guidelines of training or right roadmap and can't afford high level of licensed coaches, but those who are D,C licensed coaches they are soo many in our India who do not have a job or academy , they can connect with them and improve them through guidance and I have kept it in a very minimum range and also kept it free so that you athletes and players coaches will get help.
            </p>
          </div>

          <div className="text-xs text-secondary-fixed font-display font-bold uppercase tracking-wider">
            FOUNDER &amp; CEO, CONNECTHUB ACADEMY
          </div>
        </div>
      </div>
    </div>
  );
}
