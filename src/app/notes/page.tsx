"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Heart, Plus, X } from "lucide-react";

type Note = { id: number; text: string; author: string; date: string };

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [text, setText] = useState("");
  const [author, setAuthor] = useState("");

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  } as const;
  
  const item = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring" } }
  } as const;

  const fetchNotes = async () => {
    try {
      const res = await fetch('/api/notes');
      if (res.ok) {
        const data = await res.json();
        setNotes(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text || !author) return;
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, author, date: dateStr })
      });
      if (res.ok) {
        setText("");
        setAuthor("");
        setIsModalOpen(false);
        fetchNotes(); // refresh
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto z-10 relative pb-24">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-5xl font-bold font-[family-name:var(--font-playfair)] mb-4 drop-shadow-xl text-white">Love Notes</h1>
        <p className="text-xl text-white/80 drop-shadow-md">Words we&apos;ve shared.</p>
      </motion.div>

      {loading ? (
        <div className="text-white text-center py-10 animate-pulse">Loading notes...</div>
      ) : (
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
          {notes.length === 0 && <p className="text-white/60">No notes added yet.</p>}
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
            <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-white mb-6">Write a Note</h2>
            <form onSubmit={handleAddNote} className="flex flex-col gap-4">
              <div>
                <label className="block text-white/80 text-sm mb-1">Message</label>
                <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="What's on your mind?" 
                  rows={4}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-rose-400"
                  required 
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-1">Author</label>
                <input 
                  type="text" 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Momo" 
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-rose-400"
                  required 
                />
              </div>
              <button 
                type="submit" 
                className="mt-4 w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Send Note
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
