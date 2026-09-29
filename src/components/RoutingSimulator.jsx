import React, { useState, useEffect, useMemo } from 'react';
import { 
  Play, Pause, RotateCcw, Zap, AlertTriangle, CheckCircle, 
  ArrowRight, Activity, Shuffle, Info, HelpCircle
} from 'lucide-react';
import { INITIAL_NODES, INITIAL_EDGES } from '../data/topology';
import { runDijkstra, runDynamicRouting, generateRoutingTable } from '../utils/algorithms';
import { useFeatureModal } from '../context/ModalContext';

export default function RoutingSimulator() {
  const { openFeatureModal } = useFeatureModal();
  const [nodes] = useState(INITIAL_NODES);
  const [edges, setEdges] = useState(INITIAL_EDGES);
  const [sourceId, setSourceId] = useState('R1');
  const [destId, setDestId] = useState('R7');
  const [algorithm, setAlgorithm] = useState('dynamic'); // 'dijkstra' | 'dynamic'
  const [isSimulating, setIsSimulating] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedNode, setSelectedNode] = useState('R1');
  const [activeTab, setActiveTab] = useState('telemetry'); // 'telemetry' | 'routingTable' | 'algoTrace'

  // Packet animation state
  const [packetProgress, setPacketProgress] = useState(0);
  const [activePacketHop, setActivePacketHop] = useState(0);
  const [deliveredPackets, setDeliveredPackets] = useState(0);

  // Compute route
  const routingResult = useMemo(() => {
    if (algorithm === 'dijkstra') {
      return runDijkstra(nodes, edges, sourceId, destId);
    } else {
      return runDynamicRouting(nodes, edges, sourceId, destId);
    }
  }, [nodes, edges, sourceId, destId, algorithm]);

  // Compute routing table
  const currentRoutingTable = useMemo(() => {
    return generateRoutingTable(selectedNode, nodes, edges, algorithm === 'dynamic');
  }, [selectedNode, nodes, edges, algorithm]);

  // Toggle link congestion
  const toggleEdgeCongestion = (edgeId) => {
    setEdges(prevEdges =>
      prevEdges.map(edge => {
        if (edge.id === edgeId) {
          const nextState = !edge.isCongested;
          return {
            ...edge,
            isCongested: nextState,
            queueOccupancy: nextState ? 95 : 15
          };
        }
        return edge;
      })
    );
  };

  // Inject congestion on active path
  const injectCongestionSpike = () => {
    const candidateEdgeIds = routingResult.pathEdges.length > 0 
      ? routingResult.pathEdges 
      : ['e-R2-R4', 'e-R1-R2', 'e-R4-R6'];
    const targetEdgeId = candidateEdgeIds[Math.floor(Math.random() * candidateEdgeIds.length)];

    setEdges(prevEdges =>
      prevEdges.map(edge => {
        if (edge.id === targetEdgeId) {
          return { ...edge, isCongested: true, queueOccupancy: 95 };
        }
        return edge;
      })
    );
  };

  // Reset topology
  const resetTopology = () => {
    setEdges(INITIAL_EDGES.map(e => ({ ...e, isCongested: false, queueOccupancy: 15 })));
  };

  // Packet animation loop
  useEffect(() => {
    if (!isSimulating || !routingResult.path || routingResult.path.length < 2) return;

    let animationFrame;
    let lastTime = performance.now();

    const animate = (time) => {
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      const hopDuration = 1.2 / speed;
      const step = delta / hopDuration;

      setPacketProgress(prev => {
        const next = prev + step;
        if (next >= 1) {
          setActivePacketHop(currentHop => {
            const nextHop = currentHop + 1;
            if (nextHop >= routingResult.path.length - 1) {
              setDeliveredPackets(c => c + 1);
              return 0;
            }
            return nextHop;
          });
          return 0;
        }
        return next;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isSimulating, routingResult.path, speed]);

  // Coordinates of the moving packet
  const packetCoords = useMemo(() => {
    if (!routingResult.path || routingResult.path.length < 2) return null;
    const fromId = routingResult.path[activePacketHop];
    const toId = routingResult.path[activePacketHop + 1];
    if (!fromId || !toId) return null;

    const fromNode = nodes.find(n => n.id === fromId);
    const toNode = nodes.find(n => n.id === toId);
    if (!fromNode || !toNode) return null;

    return {
      x: fromNode.x + (toNode.x - fromNode.x) * packetProgress,
      y: fromNode.y + (toNode.y - fromNode.y) * packetProgress
    };
  }, [nodes, routingResult.path, activePacketHop, packetProgress]);

  return (
    <section id="simulator" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-7">
        <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-400 mb-2">
          <Activity className="w-3 h-3 text-sky-400" />
          <span>NETWORK OPERATIONS CONSOLE</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Topology <span className="text-sky-400">Simulator</span>
        </h2>
        <p className="mt-1.5 text-slate-400 text-xs sm:text-sm leading-relaxed">
          Select routers and an algorithm to watch packets travel in real time.<br />
          Click any link or router for instant popup insights and controls.
        </p>
      </div>

      {/* Control Console */}
      <div className="cyber-panel rounded-xl p-3.5 sm:p-4 mb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Source & Destination Dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-500">SRC:</span>
              <select
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-sky-400 text-xs rounded px-2 py-1 focus:outline-none"
              >
                {nodes.map(n => (
                  <option key={n.id} value={n.id} disabled={n.id === destId}>
                    {n.id} ({n.ip})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => {
                const temp = sourceId;
                setSourceId(destId);
                setDestId(temp);
              }}
              title="Swap Ingress/Egress"
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800"
            >
              <Shuffle className="w-3 h-3" />
            </button>

            <div className="flex items-center gap-1.5 text-xs font-mono">
              <span className="text-slate-500">DST:</span>
              <select
                value={destId}
                onChange={(e) => setDestId(e.target.value)}
                className="bg-slate-900 border border-slate-800 text-purple-400 text-xs rounded px-2 py-1 focus:outline-none"
              >
                {nodes.map(n => (
                  <option key={n.id} value={n.id} disabled={n.id === sourceId}>
                    {n.id} ({n.ip})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Algorithm Segment Control with help icon */}
          <div className="flex items-center gap-1.5">
            <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setAlgorithm('dijkstra')}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  algorithm === 'dijkstra'
                    ? 'bg-slate-800 text-white font-semibold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                OSPF / Dijkstra (Static)
              </button>
              <button
                onClick={() => setAlgorithm('dynamic')}
                className={`px-3 py-1 rounded text-xs font-mono transition-all ${
                  algorithm === 'dynamic'
                    ? 'bg-sky-500 text-slate-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Adaptive Bellman-Ford (Dynamic)
              </button>
            </div>

            <button
              onClick={() => openFeatureModal(algorithm === 'dijkstra' ? 'dijkstra' : 'dynamic_routing')}
              title="Explain current algorithm"
              className="p-1 text-slate-500 hover:text-sky-400"
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSimulating(!isSimulating)}
              className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-mono flex items-center gap-1.5 border border-slate-800"
            >
              {isSimulating ? <Pause className="w-3 h-3 text-slate-400" /> : <Play className="w-3 h-3 text-slate-400" />}
              <span>{isSimulating ? 'Pause' : 'Stream'}</span>
            </button>

            <button
              onClick={injectCongestionSpike}
              className="px-2.5 py-1 rounded bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-xs font-mono flex items-center gap-1.5"
            >
              <Zap className="w-3 h-3 text-rose-400" />
              <span>Simulate Congestion</span>
            </button>

            <button
              onClick={resetTopology}
              className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800"
              title="Reset all trunks"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Realistic 2-line Status Alerts */}
      {routingResult.encounteredCongestion && algorithm === 'dijkstra' && (
        <div className="mb-4 p-3 rounded-lg bg-rose-950/40 border border-rose-900/80 text-rose-300 text-xs font-mono flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong>Link Congestion Detected on Static Path: </strong>
            Dijkstra remains on the congested link (+160ms delay, ~38% loss) because link-state metrics are static.
            <button onClick={() => setAlgorithm('dynamic')} className="ml-1 text-sky-400 underline font-semibold">
              Switch to Dynamic Routing →
            </button>
          </div>
        </div>
      )}

      {algorithm === 'dynamic' && edges.some(e => e.isCongested) && !routingResult.encounteredCongestion && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/80 text-emerald-300 text-xs font-mono flex items-start gap-2.5">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <strong>Dynamic Reroute Successful: </strong>
            Queue occupancy triggered cost penalties on the congested trunk; traffic automatically shifted to alternate healthy nodes.
          </div>
        </div>
      )}

      {/* Simulation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Network Topology Map (8 Cols) */}
        <div className="lg:col-span-8 cyber-panel rounded-xl p-3.5 sm:p-4 flex flex-col justify-between">
          
          {/* Map Header */}
          <div className="flex items-center justify-between gap-2 mb-2 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-0.5 bg-sky-400 inline-block" /> Active Forwarding Path
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-0.5 bg-rose-500 inline-block" /> Congested Trunk (Click to toggle)
              </span>
            </div>
            <span className="text-[10px] text-slate-500">
              Click router or trunk for details
            </span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full aspect-[16/10] bg-[#070b13] rounded-lg border border-slate-800/80 overflow-hidden">
            <div className="absolute inset-0 noc-grid opacity-30 pointer-events-none" />

            <svg viewBox="0 0 1020 580" className="w-full h-full select-none">
              {/* Edges / Network Trunks */}
              {edges.map(edge => {
                const srcNode = nodes.find(n => n.id === edge.source);
                const tgtNode = nodes.find(n => n.id === edge.target);
                if (!srcNode || !tgtNode) return null;

                const isOnActivePath = routingResult.pathEdges.includes(edge.id);
                const isCongested = edge.isCongested;
                const midX = (srcNode.x + tgtNode.x) / 2;
                const midY = (srcNode.y + tgtNode.y) / 2;

                return (
                  <g key={edge.id} className="cursor-pointer" onClick={() => toggleEdgeCongestion(edge.id)}>
                    {/* Click Hitbox */}
                    <line x1={srcNode.x} y1={srcNode.y} x2={tgtNode.x} y2={tgtNode.y} stroke="transparent" strokeWidth="22" />
                    
                    {/* Trunk Cable */}
                    <line
                      x1={srcNode.x}
                      y1={srcNode.y}
                      x2={tgtNode.x}
                      y2={tgtNode.y}
                      stroke={isCongested ? '#f43f5e' : isOnActivePath ? '#38bdf8' : '#1e293b'}
                      strokeWidth={isOnActivePath ? 2.5 : 1.5}
                      strokeDasharray={isCongested ? '4,4' : 'none'}
                    />

                    {/* Metric Badge */}
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect
                        x="-26"
                        y="-9"
                        width="52"
                        height="18"
                        rx="3"
                        fill={isCongested ? '#3b0d18' : isOnActivePath ? '#0b263b' : '#0d131f'}
                        stroke={isCongested ? '#f43f5e' : isOnActivePath ? '#38bdf8' : '#1e293b'}
                        strokeWidth="1"
                      />
                      <text
                        x="0"
                        y="3"
                        textAnchor="middle"
                        fill={isCongested ? '#fda4af' : isOnActivePath ? '#7dd3fc' : '#94a3b8'}
                        fontSize="9"
                        fontFamily="JetBrains Mono, monospace"
                        fontWeight="600"
                      >
                        {isCongested ? `! 168ms` : `${edge.baseLatency}ms`}
                      </text>
                    </g>
                  </g>
                );
              })}

              {/* Data Packet Pulse */}
              {packetCoords && isSimulating && (
                <g transform={`translate(${packetCoords.x}, ${packetCoords.y})`}>
                  <circle r="4" fill="#38bdf8" />
                  <circle r="2" fill="#ffffff" />
                </g>
              )}

              {/* Cisco/Juniper Style Router Hardware Nodes */}
              {nodes.map(node => {
                const isSource = node.id === sourceId;
                const isDest = node.id === destId;
                const isSelected = node.id === selectedNode;
                const isInPath = routingResult.path.includes(node.id);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    className="cursor-pointer group"
                    onClick={() => {
                      setSelectedNode(node.id);
                    }}
                  >
                    {/* Outer Ring */}
                    <circle
                      r="20"
                      fill={isSource ? '#0c2438' : isDest ? '#261238' : isSelected ? '#162235' : '#0d131f'}
                      stroke={isSource ? '#38bdf8' : isDest ? '#c084fc' : isInPath ? '#38bdf8' : '#334155'}
                      strokeWidth={isSource || isDest ? 2 : (isInPath ? 1.5 : 1)}
                    />

                    {/* Standard Cisco Router Cross Arrows Symbol */}
                    <path
                      d="M -9 0 L 9 0 M 6 -3 L 9 0 L 6 3 M -6 -3 L -9 0 L -6 3 M 0 -9 L 0 9 M -3 6 L 0 9 L 3 6 M -3 -6 L 0 -9 L 3 -6"
                      stroke={isSource ? '#38bdf8' : isDest ? '#c084fc' : '#64748b'}
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                      opacity="0.8"
                    />

                    {/* Router Identifier */}
                    <text
                      x="0"
                      y="3"
                      textAnchor="middle"
                      fill={isSource ? '#38bdf8' : isDest ? '#c084fc' : '#f1f5f9'}
                      fontSize="9"
                      fontFamily="JetBrains Mono, monospace"
                      fontWeight="bold"
                    >
                      {node.id}
                    </text>

                    {/* Device Label & IP */}
                    <text
                      x="0"
                      y="30"
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="9"
                      fontFamily="Inter, sans-serif"
                      fontWeight="500"
                    >
                      {node.name}
                    </text>
                    <text
                      x="0"
                      y="40"
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="8"
                      fontFamily="JetBrains Mono, monospace"
                    >
                      {node.ip}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Path Breadcrumb Bar */}
          <div className="mt-2.5 p-2 rounded-lg bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-500">ACTIVE FIB PATH:</span>
              <div className="flex items-center gap-1 text-slate-200">
                {routingResult.path.map((nodeId, idx) => (
                  <React.Fragment key={nodeId}>
                    <span className="px-1.5 py-0.5 rounded bg-slate-800 text-sky-400 font-semibold">{nodeId}</span>
                    {idx < routingResult.path.length - 1 && <ArrowRight className="w-3 h-3 text-slate-600" />}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <span className="text-slate-400 text-[11px]">Forwarded: <strong className="text-white">{deliveredPackets}</strong> pkts</span>
          </div>

        </div>

        {/* Telemetry Console (4 Cols) */}
        <div className="lg:col-span-4 cyber-panel rounded-xl p-3.5 sm:p-4 flex flex-col justify-between">
          <div>
            {/* Tab Switches */}
            <div className="flex rounded-lg bg-slate-950 p-0.5 border border-slate-800 mb-3 text-xs font-mono">
              <button
                onClick={() => setActiveTab('telemetry')}
                className={`flex-1 py-1 rounded transition-all ${
                  activeTab === 'telemetry' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
                }`}
              >
                Telemetry
              </button>
              <button
                onClick={() => setActiveTab('routingTable')}
                className={`flex-1 py-1 rounded transition-all ${
                  activeTab === 'routingTable' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
                }`}
              >
                FIB Table
              </button>
              <button
                onClick={() => setActiveTab('algoTrace')}
                className={`flex-1 py-1 rounded transition-all ${
                  activeTab === 'algoTrace' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'
                }`}
              >
                Queue Log
              </button>
            </div>

            {/* Tab 1: Telemetry with Clickable Popup Metrics */}
            {activeTab === 'telemetry' && (
              <div className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openFeatureModal('rtt_metric')}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-sky-500/40 text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono text-slate-500 group-hover:text-sky-400 block uppercase">ROUND-TRIP RTT</span>
                      <Info className="w-2.5 h-2.5 text-slate-600 group-hover:text-sky-400" />
                    </div>
                    <span className={`text-lg font-bold font-mono ${
                      routingResult.encounteredCongestion ? 'text-rose-400' : 'text-sky-400'
                    }`}>
                      {routingResult.actualLatency} ms
                    </span>
                    <p className="text-[9px] text-slate-500 leading-tight mt-0.5">
                      End-to-end packet traversal time.
                    </p>
                  </button>

                  <button
                    onClick={() => openFeatureModal('hop_count')}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-purple-500/40 text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono text-slate-500 group-hover:text-purple-400 block uppercase">HOP COUNT</span>
                      <Info className="w-2.5 h-2.5 text-slate-600 group-hover:text-purple-400" />
                    </div>
                    <span className="text-lg font-bold font-mono text-purple-400">
                      {routingResult.hopCount} Hops
                    </span>
                    <p className="text-[9px] text-slate-500 leading-tight mt-0.5">
                      Total intermediate router traversals.
                    </p>
                  </button>

                  <button
                    onClick={() => openFeatureModal('topology_graph')}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-emerald-500/40 text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono text-slate-500 group-hover:text-emerald-400 block uppercase">MIN TRUNK B/W</span>
                      <Info className="w-2.5 h-2.5 text-slate-600 group-hover:text-emerald-400" />
                    </div>
                    <span className="text-lg font-bold font-mono text-emerald-400">
                      {routingResult.minBandwidth} Gbps
                    </span>
                    <p className="text-[9px] text-slate-500 leading-tight mt-0.5">
                      Lowest link capacity bottleneck.
                    </p>
                  </button>

                  <button
                    onClick={() => openFeatureModal('packet_loss')}
                    className="p-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-rose-500/40 text-left transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono text-slate-500 group-hover:text-rose-400 block uppercase">EST. PACKET LOSS</span>
                      <Info className="w-2.5 h-2.5 text-slate-600 group-hover:text-rose-400" />
                    </div>
                    <span className={`text-lg font-bold font-mono ${
                      routingResult.packetLoss > 10 ? 'text-rose-400' : 'text-slate-300'
                    }`}>
                      {routingResult.packetLoss}%
                    </span>
                    <p className="text-[9px] text-slate-500 leading-tight mt-0.5">
                      Buffer drops during link saturation.
                    </p>
                  </button>
                </div>

                {/* Algorithmic Behavior Summary */}
                <button
                  onClick={() => openFeatureModal(algorithm === 'dijkstra' ? 'dijkstra' : 'dynamic_routing')}
                  className="w-full text-left p-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs group cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="font-mono text-slate-300 font-semibold block text-[11px] group-hover:text-sky-300">
                      {algorithm === 'dijkstra' ? "Dijkstra (Link-State OSPF)" : "Adaptive Bellman-Ford (Dynamic)"}
                    </span>
                    <Info className="w-3 h-3 text-slate-500 group-hover:text-sky-400" />
                  </div>
                  <p className="text-slate-400 leading-snug text-[10px]">
                    {algorithm === 'dijkstra'
                      ? "Computes shortest path based on static link metrics. Click for simple explanation."
                      : "Dynamically senses buffer queue occupancy. Click for simple explanation."}
                  </p>
                </button>

                {/* Selected Node Details */}
                <button
                  onClick={() => openFeatureModal('router_hardware')}
                  className="w-full text-left p-2 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-xs font-mono group cursor-pointer transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[9px] block">INSPECTING ROUTER:</span>
                    <Info className="w-2.5 h-2.5 text-slate-600 group-hover:text-sky-400" />
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <span className="text-white font-medium text-[11px]">{selectedNode} ({nodes.find(n => n.id === selectedNode)?.name})</span>
                    <span className="text-sky-400 text-[10px]">{nodes.find(n => n.id === selectedNode)?.ip}</span>
                  </div>
                </button>
              </div>
            )}

            {/* Tab 2: Forwarding Information Base (FIB) */}
            {activeTab === 'routingTable' && (
              <div className="space-y-1.5 text-xs font-mono">
                <span className="text-slate-400 block text-[10px]">FIB Routing Table for {selectedNode}</span>
                <div className="max-h-52 overflow-y-auto border border-slate-800 rounded-lg bg-slate-950">
                  <table className="w-full text-left text-[10px]">
                    <thead className="bg-slate-900 text-slate-500 border-b border-slate-800">
                      <tr>
                        <th className="p-1.5">Prefix</th>
                        <th className="p-1.5">Next-Hop</th>
                        <th className="p-1.5 text-right">Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-400">
                      {currentRoutingTable.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50">
                          <td className="p-1.5 text-slate-200">{row.destSubnet}</td>
                          <td className="p-1.5 text-sky-400">{row.nextHop}</td>
                          <td className="p-1.5 text-right text-slate-400">{row.cost}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab 3: Queue Trace */}
            {activeTab === 'algoTrace' && (
              <div className="space-y-1.5 text-xs font-mono">
                <span className="text-slate-400 block text-[10px]">Algorithmic Queue Trace</span>
                <div className="max-h-52 overflow-y-auto space-y-1 border border-slate-800 rounded-lg bg-slate-950 p-2 text-[9px]">
                  {routingResult.steps.slice(0, 8).map((s, idx) => (
                    <div key={idx} className="p-1 rounded bg-slate-900 text-slate-400">
                      <span className="text-sky-400 font-bold mr-1">#{s.step}</span>
                      <span>{s.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Speed & Status */}
          <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono text-slate-500">
            <div className="flex items-center gap-1">
              <span>Speed:</span>
              {[0.5, 1, 2].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-1 rounded ${
                    speed === s ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
            <span className="text-slate-400">Engine v2.4</span>
          </div>

        </div>

      </div>
    </section>
  );
}
