"use client";

import React from "react";
import { motion } from "framer-motion";
import { timeline } from "@/lib/data";

export default function TimelinePage() {
  return (
    <div className="w-full max-w-3xl mx-auto z-10 relative">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <h1 className="text-5xl font-bold font-[family-name:var(--font-playfair)] mb-4 drop-shadow-xl text-white">Our Timeline</h1>
        <p className="text-xl text-white/80 drop-shadow-md">The story of us.</p>
      </motion.div>

      <div className="relative border-l-2 border-rose-500/30 pl-8 space-y-12 ml-4">
        {timeline.map((event, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, type: "spring" }}
            className="relative group"
          >
            {/* Timeline Dot */}
            <div className="absolute -left-[41px] top-1.5 w-5 h-5 bg-black rounded-full border-4 border-rose-400 group-hover:scale-125 transition-transform" />
            
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-[1.5rem] shadow-xl hover:bg-white/15 transition-colors">
              <span className="text-sm font-bold tracking-widest text-rose-300 uppercase mb-2 block">{event.date}</span>
              <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-playfair)] mb-2">{event.title}</h3>
              <p className="text-white/70">{event.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
