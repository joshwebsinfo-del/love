"use client";

import React, { useState, useEffect } from "react";
import { motion, Variants } from "framer-motion";
import { Plus, X, Calendar } from "lucide-react";

type Memory = { id: number; title: string; description: string | null; type: string; imageUrl?: string | null; videoUrl?: string | null; createdAt: string | Date };

interface MemoriesClientProps {
  initialMemories: Memory[];
}

function VideoPlayer({ memory }: { memory: Memory }) {
  const [videoSrc, setVideoSrc] = useState<string | null>(memory.videoUrl || null);
  const [loading, setLoading] = useState(!memory.videoUrl);

  useEffect(() => {
    if (!videoSrc) {
      fetch(`/api/memories/${memory.id}/video`)
        .then(res => res.json())
        .then(data => {
          if (data.videoUrl) setVideoSrc(data.videoUrl);
        })
        .finally(() => setLoading(false));
    }
  }, [memory.id, videoSrc]);

  if (loading) {
    return <div className="w-full h-48 bg-slate-800 animate-pulse flex items-center justify-center text-white/50">Loading Video...</div>;
  }

  return (
    <video 
      src={videoSrc || ""} 
      controls 
      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
    />
  );
}

export default function MemoriesClient({ initialMemories }: MemoriesClientProps) {
  const [memories, setMemories] = useState<Memory[]>(initialMemories);
  const [loading, setLoading] = useState(false); // Default to false since we have initial data
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");

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

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (mediaType === "video" && file.size > 100 * 1024 * 1024) {
        alert("Video is too large. Please keep it under 100MB.");
        e.target.value = '';
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (mediaType === "image") setImageUrl(reader.result as string);
        if (mediaType === "video") setVideoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;
    if (mediaType === "image" && !imageUrl) return;
    if (mediaType === "video" && !videoUrl) return;

    try {
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          description, 
          type: mediaType,
          imageUrl: mediaType === "image" ? imageUrl : null,
          videoUrl: mediaType === "video" ? videoUrl : null
        })
      });
      if (res.ok) {
        setTitle("");
        setDescription("");
        setImageUrl("");
        setVideoUrl("");
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
              {mem.type === "video" ? (
                <VideoPlayer memory={mem} />
              ) : (
                <img 
                  src={mem.imageUrl || ""} 
                  alt={mem.title} 
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none flex flex-col justify-end p-6">
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
            
            <div className="flex gap-4 mb-6">
              <button 
                type="button"
                onClick={() => setMediaType("image")}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${mediaType === "image" ? "bg-rose-500 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
              >
                Photo
              </button>
              <button 
                type="button"
                onClick={() => setMediaType("video")}
                className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${mediaType === "video" ? "bg-rose-500 text-white" : "bg-white/10 text-white/60 hover:bg-white/20"}`}
              >
                Video
              </button>
            </div>

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
                <label className="block text-white/80 text-sm mb-1">
                  {mediaType === "image" ? "Image Upload (JPG Only)" : "Video Upload (MP4, <100MB)"}
                </label>
                <input 
                  type="file" 
                  accept={mediaType === "image" ? ".jpg,.jpeg,image/jpeg" : "video/mp4"}
                  onChange={handleMediaChange}
                  className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-rose-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-rose-500 file:text-white hover:file:bg-rose-600"
                  required 
                />
                {mediaType === "image" && imageUrl && (
                  <div className="mt-4">
                    <p className="text-white/60 text-xs mb-2">Preview:</p>
                    <img src={imageUrl} alt="Preview" className="h-32 object-cover rounded-xl border border-white/20" />
                  </div>
                )}
                {mediaType === "video" && videoUrl && (
                  <div className="mt-4">
                    <p className="text-white/60 text-xs mb-2">Preview:</p>
                    <video src={videoUrl} controls className="h-32 object-cover rounded-xl border border-white/20" />
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
