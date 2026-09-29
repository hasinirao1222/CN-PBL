import React from 'react';
import { Play, Network, Shield, ArrowDown, Activity, Info } from 'lucide-react';
import { useFeatureModal } from '../context/ModalContext';

export default function HeroSection() {
  const { openFeatureModal } = useFeatureModal();

  return (
    <section id="hero" className="relative min-h-[78vh] flex items-center justify-center pt-24 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        
        {/* Status Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-5 rounded-md bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-pulse" />
          <span>COMPUTER NETWORKS PBL • CS304 (UNITS III & IV)</span>
        </div>

        {/* Realistic Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white mb-4">
          Dynamic Routing <span className="text-sky-400">Optimization</span>
        </h1>

        {/* 2-line Description */}
        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 mb-8 leading-relaxed">
          Simulating how autonomous network nodes navigate traffic bottlenecks and compute optimal paths.<br className="hidden sm:inline" />
          Benchmarking static shortest-path Dijkstra against dynamic congestion-aware Bellman-Ford in real time.
        </p>

        {/* Clean Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          <a
            href="#simulator"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold text-xs font-mono transition-all shadow-sm"
          >
            <Play className="w-3.5 h-3.5 fill-slate-950" />
            <span>Launch Topology Simulator</span>
          </a>

          <a
            href="#theory"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-mono transition-all"
          >
            <Network className="w-3.5 h-3.5 text-sky-400" />
            <span>View Architecture</span>
          </a>

          <a
            href="#layer-stack"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-mono transition-all"
          >
            <Shield className="w-3.5 h-3.5 text-purple-400" />
            <span>CRC & L4 Context</span>
          </a>
        </div>

        {/* Clickable Feature Cards with Popups */}
        <div className="text-[11px] font-mono text-slate-400 mb-2 flex items-center justify-center gap-1.5">
          <Info className="w-3 h-3 text-sky-400" />
          <span>Click any card below for an instant simple explanation popup:</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-left max-w-3xl mx-auto">
          <button
            onClick={() => openFeatureModal('topology_graph')}
            className="p-3 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-sky-500/50 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 group-hover:text-sky-400 block uppercase">GRAPH TOPOLOGY</span>
              <Info className="w-3 h-3 text-slate-600 group-hover:text-sky-400" />
            </div>
            <span className="text-xs sm:text-sm font-bold font-mono text-slate-200 block mt-0.5">7 Routers • 10 Trunks</span>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
              Bi-directional full-duplex mesh network.
            </p>
          </button>

          <button
            onClick={() => openFeatureModal('dijkstra')}
            className="p-3 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 group-hover:text-purple-400 block uppercase">STATIC METRIC</span>
              <Info className="w-3 h-3 text-slate-600 group-hover:text-purple-400" />
            </div>
            <span className="text-xs sm:text-sm font-bold font-mono text-purple-400 block mt-0.5">Dijkstra (OSPF)</span>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
              Calculates shortest path using baseline delay.
            </p>
          </button>

          <button
            onClick={() => openFeatureModal('dynamic_routing')}
            className="p-3 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 group-hover:text-emerald-400 block uppercase">DYNAMIC REROUTE</span>
              <Info className="w-3 h-3 text-slate-600 group-hover:text-emerald-400" />
            </div>
            <span className="text-xs sm:text-sm font-bold font-mono text-emerald-400 block mt-0.5">Adaptive Bellman-Ford</span>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
              Senses queue depth and diverts traffic around jams.
            </p>
          </button>

          <button
            onClick={() => openFeatureModal('token_bucket')}
            className="p-3 rounded-lg bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-500 group-hover:text-amber-400 block uppercase">TRAFFIC POLICING</span>
              <Info className="w-3 h-3 text-slate-600 group-hover:text-amber-400" />
            </div>
            <span className="text-xs sm:text-sm font-bold font-mono text-amber-400 block mt-0.5">Token Bucket QoS</span>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
              Smooths bursty data to prevent buffer dropouts.
            </p>
          </button>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-8 flex justify-center">
          <a href="#theory" className="text-slate-600 hover:text-slate-400 transition-colors">
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
