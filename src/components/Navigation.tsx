"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Home, ImageIcon, BookOpen, Clock, Star } from "lucide-react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Dashboard", icon: Home },
    { href: "/memories", label: "Memories", icon: ImageIcon },
    { href: "/notes", label: "Notes", icon: BookOpen },
    { href: "/timeline", label: "Timeline", icon: Clock },
    { href: "/dreams", label: "Dreams", icon: Star },
  ];

  return (
    <>
      <div className="fixed top-6 inset-x-0 z-50 px-4 flex justify-center pointer-events-none">
        <nav className="pointer-events-auto bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 shadow-2xl rounded-full px-2 py-2 flex items-center gap-2">
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-2">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 ${
                    isActive ? "text-white" : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-pill"
                      className="absolute inset-0 bg-white/20 rounded-full border border-white/30"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-2">
                    <link.icon className="w-4 h-4" />
                    {link.label}
                  </span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </nav>
      </div>

      {/* Mobile Full Screen Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(20px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            className="fixed inset-0 z-[60] bg-black/60 flex flex-col p-6"
          >
            <div className="flex justify-end mb-12">
              <button
                onClick={() => setIsOpen(false)}
                className="p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex flex-col gap-4 items-center justify-center flex-1">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`text-3xl font-bold flex items-center gap-4 px-6 py-4 rounded-full ${
                      pathname === link.href ? "bg-white/20 text-white" : "text-white/70"
                    }`}
                  >
                    <link.icon className="w-8 h-8" />
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
