# Dynamic Routing Optimization Using Graph Algorithms
### Computer Networks Project Based Learning (PBL) Assignment

> A modern, interactive, and responsive educational web application demonstrating how graph algorithms navigate and optimize packet paths at the **Network Layer (Layer 3)** under varying traffic conditions, congestion spikes, and Quality of Service (QoS) requirements.

---

## 🌐 Live Preview & Quick Start

### 1. Development Server
Run the local Vite development server with Hot Module Replacement (HMR):
```bash
npm run dev
```
Open your browser at `http://localhost:3000`.

### 2. Production Build & Preview
To compile the production build:
```bash
npm run build
npm run preview
```

---

## 🚀 Key Project Features

### 1. Cyber/Network Tech Design System
- **Theme**: Dark mode cyber aesthetic (`#060913`) with neon accents (`#00f0ff` cyan, `#a855f7` purple, `#10b981` emerald, and `#ef4444` danger red).
- **Typography**: Inter (sans-serif) for body text and JetBrains Mono / Roboto Mono for technical metrics and routing tables.
- **Hero Section**: Canvas-based animated node mesh with real-time autonomous packet pulses and interactive mouse proximity effects.

### 2. Theoretical Foundation (Syllabus Integration)
- **Network Layer & Routing**: Uni-Cast Routing protocols (Link-State OSPF vs Distance-Vector RIP), Logical Addressing (IPv4 32-bit CIDR vs IPv6 128-bit), and Control Plane vs Data Plane (FIB forwarding).
- **Connection Topologies**: Graph representation $G=(V, E)$, link cost metric formulas, Datagram Networks (connectionless IP) vs Virtual Circuit Networks (MPLS/ATM), and routing loop mitigation (Split Horizon, Poison Reverse).
- **Quality of Service (QoS)**: Traffic policing and shaping with an **interactive Token Bucket visualizer** featuring real-time token accumulation, bucket capacity sliders, and packet burst testing.

### 3. Interactive Routing Simulation (Core Engine)
- **7-Router Mesh Topology**: Realistic interconnected network with Ingress Gateway, Core Spines, Aggregation Node, Backup Transit, Pre-Egress, and Data Center Gateway.
- **Algorithm Comparison**:
  - **Dijkstra's Algorithm (Static Shortest Path)**: Computes minimum latency path based on baseline metrics. Unaware of live congestion; causes severe packet delays (+160ms) and ~38% packet loss when links are congested.
  - **Dynamic / Congestion-Aware (Adaptive Bellman-Ford)**: Senses buffer queue occupancy and link degradation. Automatically applies cost penalties to divert packets through alternate healthy links.
- **Interactive Controls**:
  - Select Source and Destination router nodes.
  - Switch between Dijkstra and Congestion-Aware algorithms in real time.
  - **Click any link directly** on the SVG graph to toggle congestion on/off.
  - **"Simulate Congestion"** button to inject sudden traffic spikes and observe instantaneous dynamic rerouting.
  - Stream packets with adjustable speed (`0.5x`, `1x`, `2x`).
- **Telemetry & Inspection**:
  - Live End-to-End Latency, Hop Count, Bottleneck Bandwidth, and Packet Loss.
  - Interactive **Forwarding Information Base (FIB)** routing table for any selected router.
  - Step-by-step queue execution trace log.

### 4. Data Link & Transport Context (Collapsible Accordion)
- **Process-to-Process Communication (TCP vs UDP)**: Port multiplexing, TCP 3-way handshake, sliding window flow control, and TCP Congestion Control (Slow Start, AIMD) interaction with L3 dynamic routing.
- **Error Detection via CRC (Cyclic Redundancy Check)**:
  - Theoretical overview of Frame Check Sequence (FCS) at Layer 2.
  - **Interactive CRC Binary Calculator**: Enter custom data bits and generator polynomials (e.g., CRC-4 $x^4+x+1$ or CRC-8) to view step-by-step modulo-2 binary XOR division and receiver verification.
- **PDU Encapsulation Journey**: Visual breakdown from Application Message $\rightarrow$ Transport Segment $\rightarrow$ Network Packet $\rightarrow$ Data Link Frame $\rightarrow$ Physical Bits.

### 5. PBL Evaluation & Report Export
- Academic evaluation specification adhering to Unit III & IV Computer Networks curriculum.
- Side-by-side asymptotic time and space complexity comparison table ($O((V+E)\log V)$ vs $O(V \cdot E)$).
- **"Export Simulation Report"** button generating a clean, structured `.txt` report for assignment submission.

---

## 🛠️ Technology Stack
- **Framework**: React 18
- **Styling**: Tailwind CSS with custom neon glow utilities
- **Build Tool**: Vite 6
- **Icons**: Lucide React
- **Visuals**: HTML5 2D Canvas & Scalable Vector Graphics (SVG)
- **FX**: Canvas Confetti

---

## 📂 Project Structure
```
CN-PBL/
├── index.html                  # HTML5 shell with Google Fonts
├── package.json                # Project dependencies & npm scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Cyber palette & glowing animations
├── postcss.config.js           # PostCSS configuration
├── src/
│   ├── main.jsx                # Application root mount
│   ├── App.jsx                 # Main layout assembling all components
│   ├── index.css               # Global styles, cyber grid, scrollbar
│   ├── data/
│   │   └── topology.js         # 7 router nodes & 10 full-duplex edges
│   ├── utils/
│   │   └── algorithms.js       # Dijkstra, Adaptive Bellman-Ford, CRC engine
│   └── components/
│       ├── NetworkBackground.jsx # Animated canvas mesh background
│       ├── Navbar.jsx          # Sticky header with status badge & nav links
│       ├── HeroSection.jsx     # Cyber hero banner, metrics, CTAs
│       ├── TheoryGrid.jsx      # Syllabus cards & interactive Token Bucket
│       ├── RoutingSimulator.jsx# Interactive SVG graph, rerouting & FIB table
│       ├── LayerAccordion.jsx  # TCP/UDP & interactive CRC division calculator
│       └── PblFooter.jsx       # Academic summary, complexity table & export
└── dist/                       # Production build output
```
