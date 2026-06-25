"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";

type TimelineEvent = { id: number; date: string; title: string; description: string; icon: string };

export default function TimelinePage() {
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const fetchTimeline = async () => {
    try {
      const res = await fetch('/api/timeline');
      if (res.ok) {
        const data = await res.json();
        setTimeline(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimeline();
  }, []);

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !title || !description) return;
    try {
      const res = await fetch('/api/timeline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, title, description, icon: 'Circle' })
      });
      if (res.ok) {
        setDate("");
        setTitle("");
        setDescription("");
        setIsModalOpen(false);
        fetchTimeline(); // refresh
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto z-10 relative pb-24">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-16">
        <h1 className="text-5xl font-bold font-[family-name:var(--font-playfair)] mb-4 drop-shadow-xl text-white">Our Timeline</h1>
        <p className="text-xl text-white/80 drop-shadow-md">The story of us.</p>
      </motion.div>

      {loading ? (
        <div className="text-white text-center py-10 animate-pulse">Loading timeline...</div>
      ) : (
        <div className="relative border-l-2 border-rose-500/30 pl-8 space-y-12 ml-4">
          {timeline.map((event, i) => (
            <motion.div 
              key={event.id}
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
                <p className="text-white/70">{event.description}</p>
              </div>
            </motion.div>
          ))}
          {timeline.length === 0 && <p className="text-white/60">No timeline events added yet.</p>}
        </div>
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
            <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-white mb-6">Add Event</h2>
            <form onSubmit={handleAddEvent} className="flex flex-col gap-4">
              <div>
                <label className="block text-white/80 text-sm mb-1">Date</label>
                <input 
                  type="text" 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  placeholder="e.g. Oct 2026" 
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-rose-400"
                  required 
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-1">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. First Date" 
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-rose-400"
                  required 
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-1">Description</label>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What happened?" 
                  rows={3}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-rose-400"
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="mt-4 w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Save Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
