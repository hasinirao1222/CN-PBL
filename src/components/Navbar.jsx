import React, { useState } from 'react';
import { Network, Activity, Layers, BookOpen, Menu, X } from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#090d16]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          
          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-sky-400">
              <Network className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white">
                NetRoute<span className="text-sky-400 font-mono">.lab</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/90 text-slate-400 border border-slate-700">
                PBL CS304
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center space-x-1">
            <a
              href="#hero"
              className="px-3 py-1.5 rounded-md text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              Overview
            </a>
            <a
              href="#theory"
              className="px-3 py-1.5 rounded-md text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5 text-purple-400" />
              Syllabus Core
            </a>
            <a
              href="#simulator"
              className="px-3 py-1.5 rounded-md text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-sky-400" />
              Topology Simulator
            </a>
            <a
              href="#layer-stack"
              className="px-3 py-1.5 rounded-md text-xs font-mono text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors flex items-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-400" />
              L2/L4 Context & CRC
            </a>
          </div>

          {/* Right Status */}
          <div className="hidden sm:flex items-center space-x-3">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>ROUTING DAEMON ONLINE</span>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090d16] border-b border-slate-800 px-4 py-3 space-y-1">
          <a
            href="#hero"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-xs font-mono text-slate-300 hover:bg-slate-800"
          >
            Overview
          </a>
          <a
            href="#theory"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-xs font-mono text-slate-300 hover:bg-slate-800"
          >
            Syllabus Core (Network Layer & QoS)
          </a>
          <a
            href="#simulator"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-xs font-mono text-slate-300 hover:bg-slate-800"
          >
            Topology Simulator
          </a>
          <a
            href="#layer-stack"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-xs font-mono text-slate-300 hover:bg-slate-800"
          >
            L2/L4 Context & CRC
          </a>
        </div>
      )}
    </nav>
  );
}
