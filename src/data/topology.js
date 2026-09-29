// Network Graph Topology Data
// 7 interconnected router nodes positioned cleanly on a normalized coordinate grid (0-1000 x, 0-600 y)

export const INITIAL_NODES = [
  {
    id: 'R1',
    label: 'Router 1 (Ingress)',
    name: 'R1-Edge-A',
    type: 'ingress',
    ip: '192.168.1.1',
    subnet: '192.168.1.0/24',
    x: 120,
    y: 280,
    role: 'Source Edge Gateway',
    capacity: 1000, // Mbps
    bufferQueue: 12, // Packets in queue
    status: 'ONLINE'
  },
  {
    id: 'R2',
    label: 'Router 2 (Spine North)',
    name: 'R2-Core-N',
    type: 'core',
    ip: '10.0.1.1',
    subnet: '10.0.1.0/24',
    x: 350,
    y: 120,
    role: 'High-Speed Core Spine',
    capacity: 10000,
    bufferQueue: 28,
    status: 'ONLINE'
  },
  {
    id: 'R3',
    label: 'Router 3 (Spine South)',
    name: 'R3-Core-S',
    type: 'core',
    ip: '10.0.2.1',
    subnet: '10.0.2.0/24',
    x: 350,
    y: 440,
    role: 'Redundant Transit Spine',
    capacity: 10000,
    bufferQueue: 15,
    status: 'ONLINE'
  },
  {
    id: 'R4',
    label: 'Router 4 (Central Aggregation)',
    name: 'R4-Agg-Central',
    type: 'agg',
    ip: '10.0.3.1',
    subnet: '10.0.3.0/24',
    x: 550,
    y: 280,
    role: 'Aggregation Core Node',
    capacity: 5000,
    bufferQueue: 35,
    status: 'ONLINE'
  },
  {
    id: 'R5',
    label: 'Router 5 (Backup Transit)',
    name: 'R5-Transit-Alt',
    type: 'transit',
    ip: '10.0.4.1',
    subnet: '10.0.4.0/24',
    x: 620,
    y: 470,
    role: 'Alternate Bypass Relay',
    capacity: 2500,
    bufferQueue: 8,
    status: 'ONLINE'
  },
  {
    id: 'R6',
    label: 'Router 6 (Pre-Egress)',
    name: 'R6-PreEgress',
    type: 'core',
    ip: '10.0.5.1',
    subnet: '10.0.5.0/24',
    x: 750,
    y: 160,
    role: 'Core Egress Distribution',
    capacity: 10000,
    bufferQueue: 20,
    status: 'ONLINE'
  },
  {
    id: 'R7',
    label: 'Router 7 (Egress)',
    name: 'R7-DC-Gateway',
    type: 'egress',
    ip: '172.16.0.1',
    subnet: '172.16.0.0/16',
    x: 920,
    y: 280,
    role: 'Destination DC Gateway',
    capacity: 1000,
    bufferQueue: 10,
    status: 'ONLINE'
  }
];

export const INITIAL_EDGES = [
  // Primary top path from R1
  {
    id: 'e-R1-R2',
    source: 'R1',
    target: 'R2',
    baseLatency: 8, // ms
    bandwidth: 10, // Gbps
    isCongested: false,
    queueOccupancy: 20, // percentage
    lossRate: 0.01 // percentage
  },
  // Primary bottom path from R1
  {
    id: 'e-R1-R3',
    source: 'R1',
    target: 'R3',
    baseLatency: 12,
    bandwidth: 10,
    isCongested: false,
    queueOccupancy: 15,
    lossRate: 0.01
  },
  // R2 to R4
  {
    id: 'e-R2-R4',
    source: 'R2',
    target: 'R4',
    baseLatency: 6,
    bandwidth: 10,
    isCongested: false,
    queueOccupancy: 30,
    lossRate: 0.02
  },
  // R2 to R6 (High speed bypass link)
  {
    id: 'e-R2-R6',
    source: 'R2',
    target: 'R6',
    baseLatency: 22,
    bandwidth: 10,
    isCongested: false,
    queueOccupancy: 10,
    lossRate: 0.00
  },
  // R3 to R4
  {
    id: 'e-R3-R4',
    source: 'R3',
    target: 'R4',
    baseLatency: 9,
    bandwidth: 10,
    isCongested: false,
    queueOccupancy: 18,
    lossRate: 0.01
  },
  // R3 to R5
  {
    id: 'e-R3-R5',
    source: 'R3',
    target: 'R5',
    baseLatency: 7,
    bandwidth: 5,
    isCongested: false,
    queueOccupancy: 12,
    lossRate: 0.00
  },
  // R4 to R6
  {
    id: 'e-R4-R6',
    source: 'R4',
    target: 'R6',
    baseLatency: 7,
    bandwidth: 10,
    isCongested: false,
    queueOccupancy: 25,
    lossRate: 0.02
  },
  // R4 to R5
  {
    id: 'e-R4-R5',
    source: 'R4',
    target: 'R5',
    baseLatency: 8,
    bandwidth: 5,
    isCongested: false,
    queueOccupancy: 14,
    lossRate: 0.01
  },
  // R5 to R7
  {
    id: 'e-R5-R7',
    source: 'R5',
    target: 'R7',
    baseLatency: 14,
    bandwidth: 5,
    isCongested: false,
    queueOccupancy: 16,
    lossRate: 0.01
  },
  // R6 to R7
  {
    id: 'e-R6-R7',
    source: 'R6',
    target: 'R7',
    baseLatency: 5,
    bandwidth: 10,
    isCongested: false,
    queueOccupancy: 22,
    lossRate: 0.01
  }
];
