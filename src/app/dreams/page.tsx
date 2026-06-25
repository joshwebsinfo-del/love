"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { dreams } from "@/lib/data";
import { CheckCircle2, Circle } from "lucide-react";

export default function DreamsPage() {
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  } as const;
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } }
  } as const;

  return (
    <div className="w-full max-w-4xl mx-auto z-10 relative">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-5xl font-bold font-[family-name:var(--font-playfair)] mb-4 drop-shadow-xl text-white">Our Dreams</h1>
        <p className="text-xl text-white/80 drop-shadow-md">Everything we want to do together.</p>
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-4"
      >
        {dreams.map((dream, i) => (
          <motion.div 
            key={i} 
            variants={item}
            className="flex items-center gap-4 p-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-lg hover:bg-white/15 transition-colors cursor-pointer group"
          >
            <div className="text-rose-400 group-hover:scale-110 transition-transform">
              {dream.completed ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
            </div>
            <div>
              <h3 className={`text-xl font-bold text-white ${dream.completed ? "line-through opacity-50" : ""}`}>
                {dream.title}
              </h3>
              <p className="text-rose-200 text-sm font-medium tracking-wider uppercase mt-1">{dream.category}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
