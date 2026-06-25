"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { memories } from "@/lib/data";
import { MapPin } from "lucide-react";

export default function MemoriesPage() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  } as const;
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } }
  } as const;

  return (
    <div className="w-full max-w-6xl mx-auto z-10 relative">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-5xl font-bold font-[family-name:var(--font-playfair)] mb-4 drop-shadow-xl text-white">Memories Gallery</h1>
        <p className="text-xl text-white/80 drop-shadow-md">Every beautiful moment we&apos;ve captured.</p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6"
      >
        {memories.map((mem) => (
          <motion.div 
            key={mem.id} 
            variants={item}
            className="break-inside-avoid relative rounded-[2rem] overflow-hidden group border border-white/20 shadow-xl"
          >
            <div className="absolute inset-0 bg-slate-800 animate-pulse -z-10" />
            <img 
              src={mem.url} 
              alt={mem.caption} 
              className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
              <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)] text-white">{mem.caption}</h3>
              <p className="text-white/70 flex items-center gap-2 mt-1 text-sm">
                <MapPin className="w-3 h-3" /> {mem.location} • {mem.date}
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
