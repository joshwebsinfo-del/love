"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { CheckCircle2, Circle, Plus, X } from "lucide-react";

type Dream = { id: number; title: string; category: string; completed: boolean };

export default function DreamsPage() {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  } as const;
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } }
  } as const;

  const fetchDreams = async () => {
    try {
      const res = await fetch('/api/dreams');
      if (res.ok) {
        const data = await res.json();
        setDreams(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDreams();
  }, []);

  const handleToggleDream = async (id: number, currentStatus: boolean) => {
    try {
      // Optimistic UI update
      setDreams(dreams.map(d => d.id === id ? { ...d, completed: !currentStatus } : d));
      
      const res = await fetch(`/api/dreams/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus })
      });
      if (!res.ok) {
        // Revert on failure
        setDreams(dreams.map(d => d.id === id ? { ...d, completed: currentStatus } : d));
      }
    } catch (e) {
      console.error(e);
      // Revert on failure
      setDreams(dreams.map(d => d.id === id ? { ...d, completed: currentStatus } : d));
    }
  };

  const handleAddDream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !category) return;
    try {
      const res = await fetch('/api/dreams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, completed: false })
      });
      if (res.ok) {
        setTitle("");
        setCategory("");
        setIsModalOpen(false);
        fetchDreams(); // refresh
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto z-10 relative pb-24">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-5xl font-bold font-[family-name:var(--font-playfair)] mb-4 drop-shadow-xl text-white">Our Dreams</h1>
        <p className="text-xl text-white/80 drop-shadow-md">Everything we want to do together.</p>
      </motion.div>

      {loading ? (
        <div className="text-white text-center py-10 animate-pulse">Loading dreams...</div>
      ) : (
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-4"
        >
          {dreams.map((dream) => (
            <motion.div 
              key={dream.id} 
              variants={item}
              onClick={() => handleToggleDream(dream.id, dream.completed)}
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
          {dreams.length === 0 && <p className="text-white/60">No dreams added yet.</p>}
        </motion.div>
      )}

      {/* Floating Add Button */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 p-4 bg-rose-500 text-white rounded-full shadow-2xl hover:scale-110 hover:bg-rose-600 transition-all z-50"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white/10 border border-white/20 backdrop-blur-xl p-8 rounded-3xl w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-white mb-6">Add a Dream</h2>
            <form onSubmit={handleAddDream} className="flex flex-col gap-4">
              <div>
                <label className="block text-white/80 text-sm mb-1">Dream Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Visit Japan" 
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-rose-400"
                  required 
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-1">Category</label>
                <input 
                  type="text" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Travel" 
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-rose-400"
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="mt-4 w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Save Dream
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
