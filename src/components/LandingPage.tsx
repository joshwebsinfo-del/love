"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { Heart, Clock, Image as ImageIcon, Sparkles, MapPin, CalendarHeart } from "lucide-react";

export default function LandingPage() {
  const [latestNote, setLatestNote] = useState<any>(null);
  const [latestMemory, setLatestMemory] = useState<any>(null);
  const [latestTimeline, setLatestTimeline] = useState<any>(null);

  useEffect(() => {
    // Fetch latest data
    Promise.all([
      fetch('/api/notes').then(res => res.json()).catch(() => []),
      fetch('/api/memories').then(res => res.json()).catch(() => []),
      fetch('/api/timeline').then(res => res.json()).catch(() => [])
    ]).then(([notes, memories, timeline]) => {
      if (notes.length > 0) setLatestNote(notes[0]);
      if (memories.length > 0) setLatestMemory(memories[0]);
      if (timeline.length > 0) setLatestTimeline(timeline[timeline.length - 1]); // last event or next event depending on order
    });
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  } as const;

  const item = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", bounce: 0.4, duration: 0.8 } }
  } as const;

  const startDate = new Date("2024-10-28");
  const today = new Date();
  const diffDays = today < startDate ? 0 : Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-full text-white font-sans flex flex-col max-w-7xl mx-auto w-full relative z-10">
      
      {/* Dashboard Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12"
      >
        <div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6"
          >
            <Sparkles className="w-4 h-4 text-rose-300" />
            <span className="text-sm font-medium tracking-wide">Welcome to your universe</span>
          </motion.div>
          
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight drop-shadow-2xl font-[family-name:var(--font-playfair)]">
            Momo <span className="text-rose-400 italic">&</span> J
          </h1>
        </div>
        
        <div className="text-right hidden md:block">
          <p className="text-white/80 text-lg drop-shadow-md">Today is a beautiful day</p>
          <p className="text-2xl font-bold drop-shadow-lg font-[family-name:var(--font-playfair)]">
            {today.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
          </p>
        </div>
      </motion.div>

      {/* Dashboard Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[240px]"
      >
        {/* Widget: Days Together */}
        <motion.div variants={item} className="col-span-1 lg:col-span-2 row-span-1 p-8 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 shadow-2xl overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                <Clock className="w-6 h-6 text-rose-300" />
              </div>
              <h3 className="text-xl font-semibold text-white/90">Time Together</h3>
            </div>
            <div>
              <p className="text-6xl md:text-7xl font-bold tracking-tighter drop-shadow-lg font-[family-name:var(--font-playfair)]">
                {diffDays.toLocaleString()} <span className="text-2xl md:text-3xl text-white/70 tracking-normal font-sans font-light">days</span>
              </p>
              <p className="text-white/60 mt-2 ml-1">Since October 28, 2024</p>
            </div>
          </div>
        </motion.div>

        {/* Widget: Latest Note */}
        <Link href="/notes" className="col-span-1 lg:col-span-2 row-span-1">
          <motion.div variants={item} className="h-full p-8 rounded-[2.5rem] bg-gradient-to-br from-rose-900/40 to-slate-900/40 backdrop-blur-xl border border-rose-500/30 shadow-2xl group flex flex-col justify-center relative overflow-hidden hover:scale-[1.02] transition-transform cursor-pointer">
            <Heart className="absolute -right-10 -bottom-10 w-48 h-48 text-rose-500/10 transform -rotate-12 group-hover:scale-110 transition-transform duration-700" />
            <div className="relative z-10">
              <p className="text-2xl font-[family-name:var(--font-playfair)] italic leading-relaxed text-rose-50 drop-shadow-md">
                &quot;{latestNote ? latestNote.text : "In all the world, there is no heart for me like yours..."}&quot;
              </p>
              <div className="mt-4 flex items-center gap-2">
                <div className="w-8 h-px bg-rose-400/50" />
                <span className="text-sm font-semibold tracking-widest uppercase text-rose-300">Latest Note {latestNote ? `from ${latestNote.author}` : ''}</span>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Widget: Featured Memory */}
        <Link href="/memories" className="col-span-1 lg:col-span-2 row-span-2">
          <motion.div variants={item} className="h-full p-2 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2 px-4 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
              <ImageIcon className="w-4 h-4 text-white" />
              <span className="text-xs font-semibold tracking-wide">Featured Memory</span>
            </div>
            <div className="w-full h-full rounded-[2rem] overflow-hidden relative">
              <div className="absolute inset-0 bg-slate-800 animate-pulse" />
              {latestMemory?.type === "video" && latestMemory.videoUrl ? (
                <video 
                  src={latestMemory.videoUrl} 
                  muted 
                  loop 
                  playsInline
                  onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                  onMouseLeave={(e) => {
                    const v = e.target as HTMLVideoElement;
                    v.pause();
                    v.currentTime = 0;
                  }}
                  className="w-full h-full object-cover opacity-90 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000"
                />
              ) : (
                <img 
                  src={latestMemory ? latestMemory.imageUrl : "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=800&q=80"} 
                  alt="Memory" 
                  className="w-full h-full object-cover opacity-90 mix-blend-overlay group-hover:scale-105 transition-transform duration-1000"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 pointer-events-none">
                <h3 className="text-2xl font-bold font-[family-name:var(--font-playfair)]">{latestMemory ? latestMemory.title : "Summer in Paris"}</h3>
                <p className="text-white/70 flex items-center gap-2 mt-2">
                  <MapPin className="w-4 h-4" /> {latestMemory ? latestMemory.description : "France"}
                </p>
              </div>
            </div>
          </motion.div>
        </Link>

        {/* Widget: Upcoming Milestone */}
        <Link href="/timeline" className="col-span-1 row-span-1">
          <motion.div variants={item} className="h-full p-8 rounded-[2.5rem] bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl flex flex-col justify-between group hover:bg-white/15 hover:scale-[1.02] transition-all duration-500 cursor-pointer">
            <div className="p-3 bg-rose-500/20 rounded-2xl w-fit border border-rose-500/30">
              <CalendarHeart className="w-6 h-6 text-rose-300" />
            </div>
            <div>
              <h4 className="text-sm uppercase tracking-widest text-white/60 font-semibold mb-2">Milestone</h4>
              <p className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-white">{latestTimeline ? latestTimeline.title : "Our Anniversary"}</p>
              <p className="text-rose-300 font-medium mt-1">{latestTimeline ? latestTimeline.date : "In 61 days"}</p>
            </div>
          </motion.div>
        </Link>

        {/* Widget: Quick Actions */}
        <motion.div variants={item} className="col-span-1 row-span-1 p-8 rounded-[2.5rem] bg-black/20 backdrop-blur-xl border border-white/10 shadow-2xl flex flex-col justify-center group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h4 className="text-lg font-semibold mb-4 text-white/90">Quick Journey</h4>
          <div className="space-y-3 relative z-10">
            <Link href="/memories" className="w-full px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-left flex items-center justify-between text-sm font-medium">
              Open Memories Gallery <span>→</span>
            </Link>
            <Link href="/notes" className="w-full px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-left flex items-center justify-between text-sm font-medium">
              Read Love Notes <span>→</span>
            </Link>
            <Link href="/dreams" className="w-full px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-colors text-left flex items-center justify-between text-sm font-medium">
              Check our Dreams <span>→</span>
            </Link>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
