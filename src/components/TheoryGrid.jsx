import React, { useState, useEffect } from 'react';
import { Network, GitBranch, Cpu, Sliders, Database, Info } from 'lucide-react';
import { useFeatureModal } from '../context/ModalContext';

export default function TheoryGrid() {
  const { openFeatureModal } = useFeatureModal();

  // Token Bucket State
  const [bucketCapacity, setBucketCapacity] = useState(10);
  const [fillRate, setFillRate] = useState(3); // tokens/sec
  const [currentTokens, setCurrentTokens] = useState(7);
  const [droppedCount, setDroppedCount] = useState(0);
  const [conformedCount, setConformedCount] = useState(0);
  const [lastAction, setLastAction] = useState('Traffic policer ready. Tokens refilling at configured rate.');

  // Accumulate tokens
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTokens(prev => {
        const next = Math.min(bucketCapacity, prev + (fillRate / 2));
        return Math.round(next * 10) / 10;
      });
    }, 500);

    return () => clearInterval(interval);
  }, [bucketCapacity, fillRate]);

  // Send packet burst
  const sendBurst = (packetCount) => {
    let tokens = currentTokens;
    let passed = 0;
    let dropped = 0;

    for (let i = 0; i < packetCount; i++) {
      if (tokens >= 1) {
        tokens -= 1;
        passed++;
      } else {
        dropped++;
      }
    }

    setCurrentTokens(Math.max(0, Math.round(tokens * 10) / 10));
    setConformedCount(c => c + passed);
    setDroppedCount(d => d + dropped);
    setLastAction(
      dropped > 0
        ? `Burst of ${packetCount} pkts: ${passed} forwarded, ${dropped} dropped (buffer deficit).`
        : `Burst of ${packetCount} pkts: All ${passed} packets conformed to token budget.`
    );
  };

  return (
    <section id="theory" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 mb-2">
          <Database className="w-3 h-3 text-purple-400" />
          <span>SYLLABUS CORE • UNIT III & IV</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Theoretical <span className="text-sky-400">Foundations</span>
        </h2>
        <p className="mt-1.5 text-slate-400 text-xs sm:text-sm leading-relaxed">
          The three foundational networking mechanisms powering dynamic packet routing and QoS traffic shaping.<br />
          <span className="text-sky-400 font-mono text-[11px] inline-flex items-center gap-1 mt-1">
            <Info className="w-3 h-3" /> Click any topic below to open a simple popup explanation.
          </span>
        </p>
      </div>

      {/* 3-Column Clean Engineering Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Card 1: Network Layer & Routing */}
        <div className="cyber-panel rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-sky-400">
                <Network className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                MODULE 3.1
              </span>
            </div>

            <h3 className="text-base font-semibold text-white mb-1">
              Network Layer & Routing
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Directs packets from source to destination across multiple intermediate router hops.<br />
              Determines optimal transmission paths and enforces hierarchical logical addressing.
            </p>

            <div className="space-y-2.5 text-xs">
              <button
                onClick={() => openFeatureModal('unicast_routing')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-sky-500/40 transition-colors group cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <strong className="text-sky-300 font-mono block text-[11px] mb-0.5 group-hover:text-sky-200">1. Uni-Cast Routing Protocols</strong>
                  <Info className="w-3 h-3 text-slate-600 group-hover:text-sky-400" />
                </div>
                <p className="text-slate-400 leading-snug text-[11px]">
                  Computes single-source paths using Link-State (OSPF) or Distance-Vector (RIP) algorithms.
                </p>
              </button>

              <button
                onClick={() => openFeatureModal('logical_addressing')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-sky-500/40 transition-colors group cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <strong className="text-sky-300 font-mono block text-[11px] mb-0.5 group-hover:text-sky-200">2. Logical Addressing (IPv4 / IPv6)</strong>
                  <Info className="w-3 h-3 text-slate-600 group-hover:text-sky-400" />
                </div>
                <p className="text-slate-400 leading-snug text-[11px]">
                  Assigns unique 32-bit (IPv4) or 128-bit (IPv6) identifiers so routers can forward packets hierarchically.
                </p>
              </button>

              <button
                onClick={() => openFeatureModal('routing_vs_forwarding')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-sky-500/40 transition-colors group cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <strong className="text-sky-300 font-mono block text-[11px] mb-0.5 group-hover:text-sky-200">3. Routing vs Forwarding</strong>
                  <Info className="w-3 h-3 text-slate-600 group-hover:text-sky-400" />
                </div>
                <p className="text-slate-400 leading-snug text-[11px]">
                  Routing computes the network roadmap (control plane); forwarding moves packets across ports (data plane).
                </p>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>RFC 791 / RFC 2460</span>
            <span className="text-sky-400">Layer 3 Architecture</span>
          </div>
        </div>

        {/* Card 2: Connection Topologies & Datagrams */}
        <div className="cyber-panel rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-purple-400">
                <GitBranch className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                MODULE 3.2
              </span>
            </div>

            <h3 className="text-base font-semibold text-white mb-1">
              Connection Topologies
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Models routers and physical trunks as weighted mathematical graphs.<br />
              Compares resilient connectionless datagram switching with connection-oriented circuits.
            </p>

            <div className="space-y-2.5 text-xs">
              <button
                onClick={() => openFeatureModal('topology_graph')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-purple-500/40 transition-colors group cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <strong className="text-purple-300 font-mono block text-[11px] mb-0.5 group-hover:text-purple-200">1. Graph Abstraction G = (V, E)</strong>
                  <Info className="w-3 h-3 text-slate-600 group-hover:text-purple-400" />
                </div>
                <p className="text-slate-400 leading-snug text-[11px]">
                  Routers form vertices (V) and full-duplex transmission trunks form weighted edges (E).
                </p>
              </button>

              <button
                onClick={() => openFeatureModal('datagram_networks')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-purple-500/40 transition-colors group cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <strong className="text-purple-300 font-mono block text-[11px] mb-0.5 group-hover:text-purple-200">2. Datagram Networks (Connectionless IP)</strong>
                  <Info className="w-3 h-3 text-slate-600 group-hover:text-purple-400" />
                </div>
                <p className="text-slate-400 leading-snug text-[11px]">
                  Each packet carries full addressing and is routed independently, seamlessly bypassing failed routers.
                </p>
              </button>

              <button
                onClick={() => openFeatureModal('loop_prevention')}
                className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-purple-500/40 transition-colors group cursor-pointer"
              >
                <div className="flex justify-between items-center">
                  <strong className="text-purple-300 font-mono block text-[11px] mb-0.5 group-hover:text-purple-200">3. Routing Loop Prevention</strong>
                  <Info className="w-3 h-3 text-slate-600 group-hover:text-purple-400" />
                </div>
                <p className="text-slate-400 leading-snug text-[11px]">
                  Prevents infinite loops using Split Horizon, Poison Reverse, and periodic link-state database updates.
                </p>
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>Graph Theory Model</span>
            <span className="text-purple-400">Mesh Topology</span>
          </div>
        </div>

        {/* Card 3: Quality of Service (QoS) & Token Bucket */}
        <div className="cyber-panel rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400">
                <Cpu className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                MODULE 4.1 (QoS)
              </span>
            </div>

            <h3 className="text-base font-semibold text-white mb-1">
              Quality of Service (QoS)
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed mb-4">
              Regulates peak traffic bursts to prevent queue buffer exhaustion and packet drops.<br />
              Dynamically inflates link cost when buffers fill up, steering traffic to alternate paths.
            </p>

            {/* Realistic Token Bucket Shaper */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 mb-2.5 text-xs font-mono">
              <div className="flex items-center justify-between mb-1.5">
                <button
                  onClick={() => openFeatureModal('token_bucket')}
                  className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1.5 hover:underline cursor-pointer"
                >
                  <Sliders className="w-3 h-3" />
                  TOKEN BUCKET TRAFFIC SHAPER
                  <Info className="w-2.5 h-2.5 text-slate-500" />
                </button>
                <span className="text-[10px] text-slate-400">Tokens: <strong className="text-emerald-300">{currentTokens}/{bucketCapacity}</strong></span>
              </div>

              {/* Minimal Progress Bar */}
              <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800 mb-2.5">
                <div
                  className="h-full bg-emerald-400 transition-all duration-300"
                  style={{ width: `${(currentTokens / bucketCapacity) * 100}%` }}
                />
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-2 gap-2 text-[10px] mb-2 text-slate-400">
                <div>
                  <label className="block mb-0.5">Bucket Depth: {bucketCapacity}</label>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    value={bucketCapacity}
                    onChange={(e) => setBucketCapacity(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-1 bg-slate-800 rounded"
                  />
                </div>
                <div>
                  <label className="block mb-0.5">Refill Rate: {fillRate}/s</label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    value={fillRate}
                    onChange={(e) => setFillRate(Number(e.target.value))}
                    className="w-full accent-sky-400 cursor-pointer h-1 bg-slate-800 rounded"
                  />
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-2 mb-2">
                <button
                  onClick={() => sendBurst(3)}
                  className="flex-1 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-emerald-300 text-[10px] transition-colors"
                >
                  Send 3 Pkts
                </button>
                <button
                  onClick={() => sendBurst(8)}
                  className="flex-1 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 text-[10px] transition-colors"
                >
                  Send 8 Pkt Burst
                </button>
              </div>

              {/* Output Log */}
              <div className="text-[9px] text-slate-400 bg-slate-900 p-1.5 rounded border border-slate-800/80 truncate">
                {lastAction}
              </div>
            </div>

            <button
              onClick={() => openFeatureModal('dynamic_cost_metric')}
              className="w-full text-left p-2.5 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 text-xs transition-colors group cursor-pointer"
            >
              <div className="flex justify-between items-center">
                <strong className="text-emerald-300 font-mono block text-[11px] mb-0.5 group-hover:text-emerald-200">Dynamic Cost Metric</strong>
                <Info className="w-3 h-3 text-slate-600 group-hover:text-emerald-400" />
              </div>
              <p className="text-slate-400 leading-snug text-[11px]">
                As router buffers fill, links apply latency penalties, guiding routing protocols to steer traffic elsewhere.
              </p>
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-[10px] font-mono text-slate-500 flex justify-between">
            <span>RFC 2697</span>
            <span className="text-emerald-400">Traffic Policing</span>
          </div>
        </div>

      </div>
    </section>
  );
}
