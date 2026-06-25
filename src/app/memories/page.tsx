"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Plus, X, Calendar } from "lucide-react";

type Memory = { id: number; title: string; description: string; imageUrl: string; createdAt: string };

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  } as const;
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } }
  } as const;

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/memories');
      if (res.ok) {
        const data = await res.json();
        setMemories(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !imageUrl) return;
    try {
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, imageUrl })
      });
      if (res.ok) {
        setTitle("");
        setDescription("");
        setImageUrl("");
        setIsModalOpen(false);
        fetchMemories(); // refresh
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto z-10 relative pb-24">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
        <h1 className="text-5xl font-bold font-[family-name:var(--font-playfair)] mb-4 drop-shadow-xl text-white">Memories Gallery</h1>
        <p className="text-xl text-white/80 drop-shadow-md">Every beautiful moment we&apos;ve captured.</p>
      </motion.div>

      {loading ? (
        <div className="text-white text-center py-10 animate-pulse">Loading memories...</div>
      ) : (
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
                src={mem.imageUrl} 
                alt={mem.title} 
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-xl font-bold font-[family-name:var(--font-playfair)] text-white">{mem.title}</h3>
                <p className="text-white/70 flex items-center gap-2 mt-1 text-sm">
                  <Calendar className="w-3 h-3" /> {mem.description}
                </p>
              </div>
            </motion.div>
          ))}
          {memories.length === 0 && <p className="text-white/60">No memories added yet.</p>}
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
          <div className="bg-white/10 border border-white/20 backdrop-blur-xl p-8 rounded-3xl w-full max-w-md shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold font-[family-name:var(--font-playfair)] text-white mb-6">Add a Memory</h2>
            <form onSubmit={handleAddMemory} className="flex flex-col gap-4">
              <div>
                <label className="block text-white/80 text-sm mb-1">Title</label>
                <input 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Summer in Paris" 
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-rose-400"
                  required 
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-1">Location or Description</label>
                <input 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. France" 
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-rose-400"
                  required 
                />
              </div>
              <div>
                <label className="block text-white/80 text-sm mb-1">Image Upload (JPG Only)</label>
                <input 
                  type="file" 
                  accept=".jpg,.jpeg,image/jpeg"
                  onChange={handleImageChange}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-rose-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-500 file:text-white hover:file:bg-rose-600"
                  required 
                />
                {imageUrl && (
                  <div className="mt-4">
                    <p className="text-white/60 text-xs mb-2">Preview:</p>
                    <img src={imageUrl} alt="Preview" className="h-32 object-cover rounded-xl border border-white/20" />
                  </div>
                )}
              </div>
              <button 
                type="submit" 
                className="mt-4 w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                Save Memory
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
