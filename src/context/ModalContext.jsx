import React, { createContext, useContext, useState } from 'react';
import { 
  Network, Activity, Zap, Sliders, Shield, Cpu, 
  Layers, GitBranch, ArrowRight, X, Info, CheckCircle2 
} from 'lucide-react';

// Knowledge base of simple explanations for all features
const FEATURE_EXPLANATIONS = {
  // Hero Concepts
  'topology_graph': {
    title: 'Network Topology Graph',
    tag: 'GRAPH THEORY • NETWORK MODEL',
    icon: Network,
    iconColor: 'text-sky-400',
    simple: 'Think of a network topology like a roadmap. Routers are cities (nodes), and cables connecting them are highways (edges). Each road has its own speed limit and traffic delay.',
    howItWorks: [
      'Our network graph models 7 router nodes and 10 bi-directional links.',
      'Cables are weighted by round-trip latency (e.g., 6ms to 22ms) and bandwidth capacity (10 Gbps).'
    ]
  },
  'dijkstra': {
    title: "Dijkstra's Algorithm (Shortest Path)",
    tag: 'STATIC ROUTING • LINK-STATE (OSPF)',
    icon: Activity,
    iconColor: 'text-purple-400',
    simple: 'Imagine using an old GPS that only knows official highway speed limits, but has zero live traffic updates. It always picks the shortest road on paper, even if there is a massive traffic jam ahead.',
    howItWorks: [
      'Calculates the fastest route once based only on baseline cable delays.',
      'When a link gets congested or broken, Dijkstra stays on that link, causing high latency (+160ms) and ~38% packet loss!'
    ]
  },
  'dynamic_routing': {
    title: 'Dynamic Routing (Adaptive Bellman-Ford)',
    tag: 'DYNAMIC ROUTING • CONGESTION-AWARE',
    icon: Zap,
    iconColor: 'text-emerald-400',
    simple: 'Imagine using Google Maps or Waze with live satellite traffic. The moment an accident or bottleneck appears on your route, the GPS immediately diverts you through open side streets.',
    howItWorks: [
      'Continually checks router buffer queues and link latency in real time.',
      'Applies a cost penalty when traffic builds up, instantly discovering and switching to alternate green routes.'
    ]
  },
  'token_bucket': {
    title: 'Token Bucket Traffic Shaper',
    tag: 'QUALITY OF SERVICE (QoS) • TRAFFIC POLICING',
    icon: Sliders,
    iconColor: 'text-amber-400',
    simple: 'Think of a ticket dispenser at a theme park ride. Tickets drip in at a steady rate. You can only enter if you have a ticket. If a huge crowd arrives and tickets run out, people must wait or get turned away.',
    howItWorks: [
      'Smooths out sudden bursts of internet traffic so router memory buffers do not overflow.',
      'Conforming packets pass through smoothly; non-conforming packets beyond bucket capacity are dropped.'
    ]
  },

  // Syllabus Concepts
  'unicast_routing': {
    title: 'Uni-Cast Routing Protocols',
    tag: 'NETWORK LAYER • 1-TO-1 FORWARDING',
    icon: Network,
    iconColor: 'text-sky-400',
    simple: 'Sending a private message directly from one sender to one specific recipient. Unlike a broadcast where everyone hears it, unicast packets travel strictly from node A to node B.',
    howItWorks: [
      'Implemented via Link-State protocols (like OSPF) or Distance-Vector protocols (like RIP).',
      'Routers build internal forwarding tables to determine which port forwards the packet closer to destination.'
    ]
  },
  'logical_addressing': {
    title: 'Logical Addressing (IPv4 / IPv6)',
    tag: 'NETWORK LAYER • GLOBAL IP ADDRESSES',
    icon: Info,
    iconColor: 'text-sky-400',
    simple: 'Just like your house has a street address so mail carriers can deliver letters, every computer on the internet has a unique IP address so packets know where to go.',
    howItWorks: [
      'IPv4 uses 32-bit addresses (e.g. 192.168.1.1), while IPv6 uses 128-bit hexadecimal addresses.',
      'Allows routers to forward packets hierarchically across different networks and autonomous systems.'
    ]
  },
  'routing_vs_forwarding': {
    title: 'Routing vs. Forwarding',
    tag: 'CONTROL PLANE vs DATA PLANE',
    icon: GitBranch,
    iconColor: 'text-sky-400',
    simple: 'Routing is making the roadmap; forwarding is driving on it. Routing (Control Plane) figures out the whole journey, while Forwarding (Data Plane) physically pushes packets out of ports.',
    howItWorks: [
      'Control Plane: Routing algorithms calculate the best paths in software.',
      'Data Plane: High-speed hardware switches read the IP header and push packets in nanoseconds.'
    ]
  },
  'datagram_networks': {
    title: 'Datagram Networks (Connectionless IP)',
    tag: 'PACKET SWITCHING • RESILIENCE',
    icon: Layers,
    iconColor: 'text-purple-400',
    simple: 'Every packet travels like an individual postcard. Each postcard has the full destination address written on it, so if one mail truck breaks down, other postcards can take another route.',
    howItWorks: [
      'Packets can take different paths and arrive out of order, but the network never collapses if one router fails.',
      'Contrasts with Virtual Circuits (like telephone lines) where an entire path is locked in advance.'
    ]
  },
  'loop_prevention': {
    title: 'Routing Loop Prevention',
    tag: 'FAULT TOLERANCE • COUNT-TO-INFINITY',
    icon: Activity,
    iconColor: 'text-purple-400',
    simple: 'Prevents data packets from running in circles forever between confused routers when a cable breaks. Techniques like Split Horizon prevent routers from advertising false shortcuts.',
    howItWorks: [
      'Distance-vector protocols use Split Horizon and Poison Reverse to kill bad routing information.',
      'IP packets also carry a "Time to Live" (TTL) counter so looping packets are cleanly deleted after ~64 hops.'
    ]
  },
  'dynamic_cost_metric': {
    title: 'Dynamic Cost Metric Function',
    tag: 'QoS ALGORITHM • CONGESTION PENALTY',
    icon: Zap,
    iconColor: 'text-emerald-400',
    simple: 'A math formula that automatically increases the "cost" of using a cable as its traffic builds up. Routers seeing the high cost will choose an open, cheaper road instead.',
    howItWorks: [
      'Formula: Cost = BaseLatency + 4 × (QueueDepth / Capacity)² + CongestionPenalty.',
      'As router memory queues hit 90%+, the cost spikes massively, triggering automatic rerouting.'
    ]
  },

  // Simulator Features
  'rtt_metric': {
    title: 'Round-Trip Time (RTT / Latency)',
    tag: 'PERFORMANCE TELEMETRY',
    icon: Activity,
    iconColor: 'text-sky-400',
    simple: 'The time (in milliseconds) it takes for a data packet to travel from the sender to the receiver. Lower latency means instantaneous page loads and lag-free gaming.',
    howItWorks: [
      'Under normal conditions, our 7-router path takes ~22ms to 35ms.',
      'When a trunk congests, RTT jumps to 180ms+ unless the dynamic algorithm reroutes traffic.'
    ]
  },
  'hop_count': {
    title: 'Hop Count',
    tag: 'PATH LENGTH',
    icon: ArrowRight,
    iconColor: 'text-purple-400',
    simple: 'The number of routers a packet must pass through on its journey. Every time a packet leaves one router and enters the next, it counts as one "hop".',
    howItWorks: [
      'Fewer hops usually mean faster delivery, but a longer 4-hop clear path is often much faster than a 2-hop jammed path!'
    ]
  },
  'packet_loss': {
    title: 'Packet Loss Percentage',
    tag: 'NETWORK BUFFER HEALTH',
    icon: Activity,
    iconColor: 'text-rose-400',
    simple: 'When a router receives more data than its memory can store, excess packets fall off and disappear. This is packet loss, and it causes dropped calls and video buffering.',
    howItWorks: [
      'Normal healthy links experience 0% to 1% packet loss.',
      'Congested links drop up to 38% of packets because buffer queues are 95%+ full.'
    ]
  },
  'simulate_congestion': {
    title: 'Simulate Link Congestion',
    tag: 'NETWORK STRESS TESTING',
    icon: Zap,
    iconColor: 'text-rose-400',
    simple: 'Injects a sudden surge of heavy traffic onto a cable, turning it red. This lets you test whether your routing algorithm is smart enough to find a detour or dumb enough to stay stuck.',
    howItWorks: [
      'Spikes the link delay by +160ms and fills the router buffer to 95%.',
      'Watch how Dijkstra stays stuck while the Dynamic algorithm immediately finds a clear path!'
    ]
  },
  'router_hardware': {
    title: 'Router Node (Cisco/Juniper Style)',
    tag: 'ROUTING HARDWARE',
    icon: Network,
    iconColor: 'text-sky-400',
    simple: 'A high-speed networking device with multiple network ports. It reads the destination IP on incoming packets and immediately directs them toward the correct output port.',
    howItWorks: [
      'Maintains its own Forwarding Information Base (FIB) table.',
      'Our 7 routers include Edge Gateways (R1, R7), Core Spines (R2, R3, R6), and Aggregation Nodes (R4, R5).'
    ]
  },

  // Layer Context
  'tcp': {
    title: 'TCP (Transmission Control Protocol)',
    tag: 'TRANSPORT LAYER • RELIABLE',
    icon: Cpu,
    iconColor: 'text-sky-400',
    simple: 'The certified mail carrier of the internet. It calls ahead to establish a connection (3-way handshake), numbers every piece of data, and asks for a receipt (ACK). If anything gets lost, it resends it.',
    howItWorks: [
      'Guarantees 100% in-order packet delivery for web pages, file downloads, and banking.',
      'Throttles its sending speed (Congestion Window) automatically if packets start dropping.'
    ]
  },
  'udp': {
    title: 'UDP (User Datagram Protocol)',
    tag: 'TRANSPORT LAYER • REAL-TIME',
    icon: Cpu,
    iconColor: 'text-purple-400',
    simple: 'A fast walkie-talkie broadcast. It blasts packets out immediately with zero connection setup and never waits for receipts. Perfect when speed matters more than perfection.',
    howItWorks: [
      'Has a tiny 8-byte header with almost zero processing overhead.',
      'Used for live video streaming, multiplayer gaming, and voice calls where a dropped frame is better than delay.'
    ]
  },
  'crc': {
    title: 'Cyclic Redundancy Check (CRC)',
    tag: 'DATA LINK LAYER • ERROR DETECTION',
    icon: Shield,
    iconColor: 'text-emerald-400',
    simple: 'A mathematical digital seal. Before sending data down a wire, the sender does binary math and attaches a code (FCS) at the end. The receiver checks the math. If it does not match, the packet was damaged by cable noise and gets discarded!',
    howItWorks: [
      'Uses binary polynomial modulo-2 XOR division.',
      'If the receiver divides the incoming frame by the generator and gets remainder = 0000, the data is 100% error-free!'
    ]
  },
  'encapsulation': {
    title: 'Protocol Encapsulation Stack',
    tag: 'OSI 5-LAYER STACK',
    icon: Layers,
    iconColor: 'text-purple-400',
    simple: 'Like nesting Russian dolls. Your application message gets wrapped inside a Transport segment, which gets wrapped inside an IP packet, which gets wrapped in an Ethernet frame before hitting the wire.',
    howItWorks: [
      'Layer 7 (Application) → Layer 4 (TCP/UDP Port) → Layer 3 (IP Address) → Layer 2 (MAC/CRC) → Layer 1 (Physical Bits).'
    ]
  }
};

const ModalContext = createContext(null);

export function ModalProvider({ children }) {
  const [activeFeatureKey, setActiveFeatureKey] = useState(null);

  const openFeatureModal = (featureKey) => {
    setActiveFeatureKey(featureKey);
  };

  const closeModal = () => {
    setActiveFeatureKey(null);
  };

  const feature = activeFeatureKey ? FEATURE_EXPLANATIONS[activeFeatureKey] : null;

  return (
    <ModalContext.Provider value={{ openFeatureModal, closeModal }}>
      {children}

      {/* Global Interactive Explanation Popup Modal */}
      {feature && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-lg rounded-2xl bg-[#0d131f] border border-slate-700/80 shadow-2xl p-5 sm:p-6 text-left select-text"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-center shrink-0">
                {feature.icon && <feature.icon className={`w-5 h-5 ${feature.iconColor}`} />}
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold tracking-wider px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 uppercase">
                  {feature.tag}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-white mt-1">
                  {feature.title}
                </h3>
              </div>
            </div>

            {/* In Simple Words Box */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 mb-4">
              <span className="text-[10px] font-mono uppercase text-sky-400 font-bold block mb-1">
                💡 IN SIMPLE WORDS:
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {feature.simple}
              </p>
            </div>

            {/* How It Works in This Project */}
            {feature.howItWorks && (
              <div className="mb-5">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold block mb-2">
                  HOW IT WORKS IN THIS SIMULATOR:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {feature.howItWorks.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
              <span className="text-slate-500 font-mono text-[11px]">Click anywhere outside to close</span>
              <button
                onClick={closeModal}
                className="px-4 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs font-mono transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
}

export function useFeatureModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useFeatureModal must be used within a ModalProvider');
  }
  return context;
}
