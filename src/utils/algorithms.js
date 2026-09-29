// Graph Routing Algorithms & Network Math Helpers

/**
 * Builds adjacency list from nodes and edges
 */
export function buildGraph(nodes, edges, useDynamicCosts = false) {
  const adj = {};
  nodes.forEach(n => {
    adj[n.id] = [];
  });

  edges.forEach(edge => {
    // Dynamic cost function incorporates congestion penalty & queue latency
    let metric;
    let actualLatency;

    if (edge.isCongested) {
      actualLatency = edge.baseLatency + 160; // Congestion spikes delay heavily
    } else {
      actualLatency = edge.baseLatency + (edge.queueOccupancy * 0.08);
    }

    if (useDynamicCosts) {
      // Dynamic Bellman-Ford/Adaptive routing factors in latency + heavy congestion penalty + queue factor
      const congestionPenalty = edge.isCongested ? 250 : 0;
      const queuePenalty = (edge.queueOccupancy / 100) * 20;
      metric = edge.baseLatency + congestionPenalty + queuePenalty;
    } else {
      // Static Dijkstra only considers baseline configured link metric (static cost)
      metric = edge.baseLatency;
    }

    // Bidirectional links
    adj[edge.source].push({
      target: edge.target,
      edgeId: edge.id,
      metric: metric,
      actualLatency: actualLatency,
      isCongested: edge.isCongested,
      bandwidth: edge.bandwidth,
      lossRate: edge.isCongested ? 0.38 : edge.lossRate
    });

    adj[edge.target].push({
      target: edge.source,
      edgeId: edge.id,
      metric: metric,
      actualLatency: actualLatency,
      isCongested: edge.isCongested,
      bandwidth: edge.bandwidth,
      lossRate: edge.isCongested ? 0.38 : edge.lossRate
    });
  });

  return adj;
}

/**
 * Dijkstra's Algorithm (Static Shortest Path)
 * Unaware of real-time congestion or packet queue spikes
 */
export function runDijkstra(nodes, edges, sourceId, destId) {
  const adj = buildGraph(nodes, edges, false); // false = static baseline costs
  const distances = {};
  const previous = {};
  const edgeUsed = {};
  const unvisited = new Set();
  const steps = [];

  nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    edgeUsed[node.id] = null;
    unvisited.add(node.id);
  });

  distances[sourceId] = 0;
  steps.push({
    step: 1,
    action: `Initialize Dijkstra: Set distance to source ${sourceId} = 0ms, all others = ∞`,
    currentNode: sourceId,
    tableState: { ...distances }
  });

  let stepCount = 1;

  while (unvisited.size > 0) {
    // Find unvisited node with smallest distance
    let curr = null;
    let minDistance = Infinity;

    for (const node of unvisited) {
      if (distances[node] < minDistance) {
        minDistance = distances[node];
        curr = node;
      }
    }

    if (!curr || distances[curr] === Infinity) {
      break; // All remaining nodes unreachable
    }

    unvisited.delete(curr);
    stepCount++;

    steps.push({
      step: stepCount,
      action: `Extract minimum node: Selected ${curr} (Distance: ${distances[curr].toFixed(1)}ms)`,
      currentNode: curr,
      tableState: { ...distances }
    });

    if (curr === destId) {
      steps.push({
        step: ++stepCount,
        action: `Destination ${destId} reached! Path finalized with static minimum delay metric.`,
        currentNode: curr,
        tableState: { ...distances }
      });
      break;
    }

    // Relax neighbors
    for (const neighbor of adj[curr]) {
      if (!unvisited.has(neighbor.target)) continue;

      const alt = distances[curr] + neighbor.metric;
      if (alt < distances[neighbor.target]) {
        distances[neighbor.target] = alt;
        previous[neighbor.target] = curr;
        edgeUsed[neighbor.target] = neighbor.edgeId;

        steps.push({
          step: ++stepCount,
          action: `Relax edge ${curr} → ${neighbor.target}: Updated distance to ${alt.toFixed(1)}ms (via link metric ${neighbor.metric.toFixed(1)}ms)`,
          currentNode: curr,
          neighborNode: neighbor.target,
          tableState: { ...distances }
        });
      }
    }
  }

  // Reconstruct path
  const path = [];
  const pathEdges = [];
  let curr = destId;

  if (distances[destId] !== Infinity) {
    while (curr) {
      path.unshift(curr);
      if (edgeUsed[curr]) {
        pathEdges.unshift(edgeUsed[curr]);
      }
      curr = previous[curr];
    }
  }

  // Calculate actual experienced latency and congestion impact
  let totalActualLatency = 0;
  let encounteredCongestion = false;
  let minBandwidth = Infinity;
  let cumulativeLoss = 0;

  for (const edgeId of pathEdges) {
    const edgeObj = edges.find(e => e.id === edgeId);
    if (edgeObj) {
      if (edgeObj.isCongested) {
        encounteredCongestion = true;
        totalActualLatency += (edgeObj.baseLatency + 160);
        cumulativeLoss += 0.35;
      } else {
        totalActualLatency += edgeObj.baseLatency;
        cumulativeLoss += edgeObj.lossRate;
      }
      if (edgeObj.bandwidth < minBandwidth) {
        minBandwidth = edgeObj.bandwidth;
      }
    }
  }

  return {
    algorithm: "Dijkstra's (Static Shortest Path)",
    path,
    pathEdges,
    totalMetric: distances[destId] === Infinity ? 0 : distances[destId],
    actualLatency: Math.round(totalActualLatency),
    hopCount: Math.max(0, path.length - 1),
    encounteredCongestion,
    minBandwidth: minBandwidth === Infinity ? 10 : minBandwidth,
    packetLoss: Math.min(100, Math.round(cumulativeLoss * 100)),
    steps
  };
}

/**
 * Dynamic Congestion-Aware Algorithm (Adaptive Bellman-Ford)
 * Evaluates queue occupancy and dynamically reroutes around congested bottlenecks
 */
export function runDynamicRouting(nodes, edges, sourceId, destId) {
  const adj = buildGraph(nodes, edges, true); // true = dynamic metric with congestion penalty
  const distances = {};
  const previous = {};
  const edgeUsed = {};
  const steps = [];

  nodes.forEach(node => {
    distances[node.id] = Infinity;
    previous[node.id] = null;
    edgeUsed[node.id] = null;
  });

  distances[sourceId] = 0;
  let stepCount = 1;

  steps.push({
    step: 1,
    action: `Initialize Dynamic Routing (Bellman-Ford): Distance to ${sourceId} = 0. Sensing link telemetry & queue depths...`,
    currentNode: sourceId,
    tableState: { ...distances }
  });

  // Bellman-Ford relaxes all edges |V| - 1 times
  const numVertices = nodes.length;
  let hasConvergedEarly = false;

  for (let i = 1; i < numVertices; i++) {
    let changed = false;

    for (const u of nodes) {
      if (distances[u.id] === Infinity) continue;

      for (const neighbor of adj[u.id]) {
        const v = neighbor.target;
        const weight = neighbor.metric;

        if (distances[u.id] + weight < distances[v]) {
          distances[v] = distances[u.id] + weight;
          previous[v] = u.id;
          edgeUsed[v] = neighbor.edgeId;
          changed = true;

          const congestionNote = neighbor.isCongested 
            ? ` [CONGESTION DETECTED: +250ms penalty applied!]` 
            : ` [Optimal link state]`;

          steps.push({
            step: ++stepCount,
            action: `Iteration ${i}: Updated vector ${u.id} → ${v}: Metric = ${distances[v].toFixed(1)}ms${congestionNote}`,
            currentNode: u.id,
            neighborNode: v,
            tableState: { ...distances }
          });
        }
      }
    }

    if (!changed) {
      hasConvergedEarly = true;
      steps.push({
        step: ++stepCount,
        action: `Distance vectors converged at iteration ${i}. Routing tables stabilized.`,
        currentNode: destId,
        tableState: { ...distances }
      });
      break;
    }
  }

  // Reconstruct path
  const path = [];
  const pathEdges = [];
  let curr = destId;

  if (distances[destId] !== Infinity) {
    while (curr) {
      path.unshift(curr);
      if (edgeUsed[curr]) {
        pathEdges.unshift(edgeUsed[curr]);
      }
      curr = previous[curr];
    }
  }

  // Calculate actual experienced latency and metrics
  let totalActualLatency = 0;
  let encounteredCongestion = false;
  let minBandwidth = Infinity;
  let cumulativeLoss = 0;

  for (const edgeId of pathEdges) {
    const edgeObj = edges.find(e => e.id === edgeId);
    if (edgeObj) {
      if (edgeObj.isCongested) {
        encounteredCongestion = true;
        totalActualLatency += (edgeObj.baseLatency + 160);
        cumulativeLoss += 0.35;
      } else {
        totalActualLatency += edgeObj.baseLatency + (edgeObj.queueOccupancy * 0.08);
        cumulativeLoss += edgeObj.lossRate;
      }
      if (edgeObj.bandwidth < minBandwidth) {
        minBandwidth = edgeObj.bandwidth;
      }
    }
  }

  return {
    algorithm: "Dynamic / Congestion-Aware (Adaptive Bellman-Ford)",
    path,
    pathEdges,
    totalMetric: distances[destId] === Infinity ? 0 : Math.round(distances[destId]),
    actualLatency: Math.round(totalActualLatency),
    hopCount: Math.max(0, path.length - 1),
    encounteredCongestion,
    minBandwidth: minBandwidth === Infinity ? 10 : minBandwidth,
    packetLoss: Math.min(100, Math.round(cumulativeLoss * 100)),
    steps
  };
}

/**
 * Generate Forwarding Routing Table for any router
 */
export function generateRoutingTable(routerId, nodes, edges, useDynamic) {
  const table = [];
  
  nodes.forEach(dest => {
    if (dest.id === routerId) {
      table.push({
        destination: `${dest.ip} (${dest.id})`,
        destSubnet: dest.subnet,
        nextHop: 'Direct (Local)',
        interface: 'lo0',
        cost: 0,
        hops: 0,
        status: 'CONNECTED'
      });
      return;
    }

    const result = useDynamic 
      ? runDynamicRouting(nodes, edges, routerId, dest.id)
      : runDijkstra(nodes, edges, routerId, dest.id);

    if (result.path && result.path.length > 1) {
      const nextHopId = result.path[1];
      const nextHopNode = nodes.find(n => n.id === nextHopId);
      const edge = edges.find(e => 
        (e.source === routerId && e.target === nextHopId) ||
        (e.target === routerId && e.source === nextHopId)
      );

      table.push({
        destination: `${dest.ip} (${dest.id})`,
        destSubnet: dest.subnet,
        nextHop: nextHopNode ? `${nextHopNode.ip} (${nextHopId})` : nextHopId,
        interface: edge ? `eth-${edge.id.replace('e-', '')}` : 'eth0',
        cost: result.totalMetric,
        hops: result.hopCount,
        status: edge && edge.isCongested ? 'CONGESTED' : 'ACTIVE'
      });
    } else {
      table.push({
        destination: `${dest.ip} (${dest.id})`,
        destSubnet: dest.subnet,
        nextHop: 'Unreachable',
        interface: '--',
        cost: '∞',
        hops: '--',
        status: 'DOWN'
      });
    }
  });

  return table;
}

/**
 * Binary XOR helper for CRC
 */
function xor(a, b) {
  let result = '';
  for (let i = 1; i < b.length; i++) {
    result += (a[i] === b[i]) ? '0' : '1';
  }
  return result;
}

/**
 * Perform modulo-2 binary division for Cyclic Redundancy Check (CRC)
 */
export function computeCRC(dataBits, generatorPolynomial) {
  // Validate binary input
  const cleanData = (dataBits || '').replace(/[^01]/g, '');
  const cleanGen = (generatorPolynomial || '').replace(/[^01]/g, '');

  if (!cleanData || !cleanGen || cleanGen.length < 2 || cleanGen[0] !== '1') {
    return {
      isValid: false,
      error: 'Invalid input: Both fields must be binary strings, and generator must start with 1 (degree >= 1).'
    };
  }

  const k = cleanGen.length - 1; // degree of generator
  // Appending k zeros to data bits
  const augmentedData = cleanData + '0'.repeat(k);
  const steps = [];

  let pick = cleanGen.length;
  let tmp = augmentedData.substring(0, pick);

  steps.push({
    dividendPart: tmp,
    generator: cleanGen,
    quotientBit: tmp[0] === '1' ? '1' : '0',
    description: `Initial bit window: ${tmp}`
  });

  while (pick < augmentedData.length) {
    if (tmp[0] === '1') {
      tmp = xor(cleanGen, tmp) + augmentedData[pick];
    } else {
      tmp = xor('0'.repeat(pick), tmp) + augmentedData[pick];
    }
    pick++;
    steps.push({
      dividendPart: tmp,
      remainderSoFar: tmp.substring(0, tmp.length - 1),
      nextBit: augmentedData[pick - 1],
      description: `Brought down next bit (${augmentedData[pick - 1]}) → Current: ${tmp}`
    });
  }

  // Final XOR on last block
  let fcs;
  if (tmp[0] === '1') {
    fcs = xor(cleanGen, tmp);
  } else {
    fcs = xor('0'.repeat(cleanGen.length), tmp);
  }

  const transmittedCodeword = cleanData + fcs;

  return {
    isValid: true,
    dataBits: cleanData,
    generator: cleanGen,
    augmentedData,
    fcs, // Frame Check Sequence
    transmittedCodeword,
    redundantBitsCount: k,
    steps
  };
}
