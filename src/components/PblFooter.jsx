import React, { useState } from 'react';
import { Download, Check, GraduationCap } from 'lucide-react';

export default function PblFooter() {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadReport = () => {
    const reportData = `================================================================================
COMPUTER NETWORKS PROJECT BASED LEARNING (PBL) TECHNICAL REPORT
Project Title: Dynamic Routing Optimization Using Graph Algorithms
Course: CS304 - Computer Networks • Syllabus: Unit III & IV
Generated: ${new Date().toLocaleString()}
================================================================================

1. PROJECT OBJECTIVE:
Benchmarking dynamic routing optimization in the Network Layer using Dijkstra's 
Link-State algorithm and Congestion-Aware Adaptive Bellman-Ford routing.

2. TOPOLOGY SPECIFICATION:
7 Routers (R1 Ingress to R7 DC Egress) connected by 10 bi-directional full-duplex 
trunks with baseline latencies (5ms-22ms) and bandwidths (2.5Gbps-10Gbps).

3. ALGORITHM COMPARISON:
- Dijkstra's Algorithm (OSPF): O((V+E) log V). Computes static least-delay path.
  Blind to live traffic spikes; suffers +160ms latency and ~38% loss during congestion.
- Dynamic Bellman-Ford: O(V * E). Adapts link metrics based on queue depths.
  Detects bottlenecks and reroutes packets along clear alternate paths in real-time.

4. QUALITY OF SERVICE (QoS):
Token Bucket traffic shaper enforces average throughput and prevents buffer drops.

5. ERROR DETECTION:
Data Link Layer Cyclic Redundancy Check (CRC) modulo-2 polynomial division
detects corrupted bits before packets enter the Network Layer.
================================================================================`;

    const blob = new Blob([reportData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'CN_PBL_Routing_Report.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
  };

  return (
    <footer className="mt-14 border-t border-slate-800 bg-[#070a12] text-slate-400 text-xs font-mono relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Academic Card */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-semibold">
              <GraduationCap className="w-4 h-4 text-sky-400" />
              <span>Project Based Learning (PBL) Assessment Specification</span>
            </div>
            
            <button
              onClick={handleDownloadReport}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-sky-400 border border-slate-700 text-xs font-medium transition-all"
            >
              {downloaded ? <Check className="w-3 h-3 text-emerald-400" /> : <Download className="w-3 h-3" />}
              <span>{downloaded ? 'Report Downloaded' : 'Export Technical Report'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80">
              <span className="text-[9px] text-slate-500 block uppercase font-semibold">COURSE & TOPIC</span>
              <strong className="text-white block text-xs mt-0.5">Computer Networks (CS304)</strong>
              <p className="text-slate-400 text-[10px] mt-0.5 leading-snug">
                Dynamic Routing Optimization across the Network Layer (Units III & IV).
              </p>
            </div>

            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80">
              <span className="text-[9px] text-slate-500 block uppercase font-semibold">LEARNING OUTCOME</span>
              <strong className="text-white block text-xs mt-0.5">Convergence & Congestion</strong>
              <p className="text-slate-400 text-[10px] mt-0.5 leading-snug">
                Observing how adaptive routing diverts packets when buffer queues saturate.
              </p>
            </div>

            <div className="p-2.5 rounded bg-slate-900/60 border border-slate-800/80">
              <span className="text-[9px] text-slate-500 block uppercase font-semibold">STATUS</span>
              <strong className="text-emerald-400 block text-xs mt-0.5">Verified Simulation</strong>
              <p className="text-slate-400 text-[10px] mt-0.5 leading-snug">
                7-node topology, Token Bucket QoS demo, and CRC polynomial calculator.
              </p>
            </div>
          </div>
        </div>

        {/* Algorithm Comparison Table */}
        <div className="mb-6 overflow-x-auto">
          <table className="w-full text-left border border-slate-800 rounded-lg overflow-hidden bg-slate-950 text-[10px]">
            <thead className="bg-slate-900 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="p-2">Feature</th>
                <th className="p-2">Dijkstra's Algorithm (OSPF)</th>
                <th className="p-2">Dynamic Bellman-Ford (Adaptive)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-400">
              <tr className="hover:bg-slate-900/40">
                <td className="p-2 font-medium text-slate-300">How It Works</td>
                <td className="p-2 text-sky-300">Computes static least-cost paths using baseline delays.</td>
                <td className="p-2 text-purple-300">Adjusts link costs dynamically when queues fill up.</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-2 font-medium text-slate-300">Complexity</td>
                <td className="p-2 font-mono text-sky-400">O((V + E) log V)</td>
                <td className="p-2 font-mono text-purple-400">O(V · E)</td>
              </tr>
              <tr className="hover:bg-slate-900/40">
                <td className="p-2 font-medium text-slate-300">Congestion Response</td>
                <td className="p-2 text-rose-300">Stays on congested path; causes delay and packet loss.</td>
                <td className="p-2 text-emerald-300">Immediately redirects packets through alternate clear routes.</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Bottom */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-[10px]">
          <span className="text-slate-400">
            <strong>Dynamic Routing Optimization</strong> • Computer Networks PBL
          </span>
          <span className="text-slate-500">
            Realistic NOC Design System • React + Tailwind CSS
          </span>
        </div>

      </div>
    </footer>
  );
}
