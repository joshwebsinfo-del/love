"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { notes } from "@/lib/data";
import { Heart } from "lucide-react";

export default function NotesPage() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  } as const;
  const item = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" } }
  } as const;

  return (
    <div className="w-full max-w-4xl mx-auto z-10 relative">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-5xl font-bold font-[family-name:var(--font-playfair)] mb-4 drop-shadow-xl text-white">Love Notes</h1>
        <p className="text-xl text-white/80 drop-shadow-md">Words we&apos;ve shared.</p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {notes.map((note) => (
          <motion.div 
            key={note.id} 
            variants={item}
            className="p-8 rounded-[2rem] bg-gradient-to-br from-rose-900/40 to-slate-900/40 backdrop-blur-xl border border-rose-500/20 shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform"
          >
            <Heart className="absolute -right-6 -bottom-6 w-32 h-32 text-rose-500/10 transform -rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            <div className="relative z-10 flex flex-col h-full justify-between gap-6">
              <p className="text-xl md:text-2xl font-[family-name:var(--font-playfair)] italic leading-relaxed text-rose-50">
                &quot;{note.text}&quot;
              </p>
              <div className="flex justify-between items-end mt-4">
                <span className="text-rose-300 font-semibold tracking-widest uppercase text-sm">{note.author}</span>
                <span className="text-white/50 text-sm">{note.date}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
