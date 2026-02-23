import { Profile } from "@/types";

export interface GraphNode {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  profile: Profile | null; // null = ghost node
  radius: number;
}

export interface GraphEdge {
  source: number;
  target: number;
}

export interface Graph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

/**
 * Build a graph from profiles. Nodes = profiles, edges = shared major or grad year.
 * Ghost nodes are added when there are too few real profiles.
 */
export function buildGraph(
  profiles: Profile[],
  width: number,
  height: number
): Graph {
  const n = profiles.length;
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Determine node radius based on count
  const radius = n <= 5 ? 10 : 6;

  // Create real nodes
  for (let i = 0; i < n; i++) {
    nodes.push({
      id: i,
      // Start clustered near center with small random offset
      x: width / 2 + (Math.random() - 0.5) * width * 0.3,
      y: height / 2 + (Math.random() - 0.5) * height * 0.3,
      vx: 0,
      vy: 0,
      profile: profiles[i],
      radius,
    });
  }

  // Build edges: connect profiles sharing major or grad year
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = profiles[i];
      const b = profiles[j];
      const sameMajor =
        a.major && b.major && a.major.toLowerCase() === b.major.toLowerCase();
      const sameYear =
        a.gradYear && b.gradYear && a.gradYear === b.gradYear;
      if (sameMajor || sameYear) {
        edges.push({ source: i, target: j });
      }
    }
  }

  // Add ghost nodes if fewer than 6 real profiles
  const ghostCount = n === 0 ? 10 : Math.max(0, 6 - n);
  for (let i = 0; i < ghostCount; i++) {
    nodes.push({
      id: nodes.length,
      x: width / 2 + (Math.random() - 0.5) * width * 0.5,
      y: height / 2 + (Math.random() - 0.5) * height * 0.5,
      vx: 0,
      vy: 0,
      profile: null,
      radius: 4,
    });
  }

  return { nodes, edges };
}

const CENTER_GRAVITY = 0.0003;
const REPULSION = 800;
const EDGE_SPRING = 0.0004;
const EDGE_REST_LENGTH = 80;
const DAMPING = 0.92;
const DRIFT_FORCE = 0.02;

/**
 * Run one tick of the force simulation. Mutates node positions in place.
 * Returns true if the system has mostly settled (for fade-in timing).
 */
export function tickSimulation(graph: Graph, width: number, height: number): boolean {
  const { nodes, edges } = graph;
  const n = nodes.length;
  let totalMotion = 0;

  // Center gravity
  const cx = width / 2;
  const cy = height / 2;
  for (const node of nodes) {
    node.vx += (cx - node.x) * CENTER_GRAVITY;
    node.vy += (cy - node.y) * CENTER_GRAVITY;
  }

  // Node repulsion (O(n^2), fine for n <= ~100)
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = nodes[i];
      const b = nodes[j];
      let dx = a.x - b.x;
      let dy = a.y - b.y;
      const distSq = dx * dx + dy * dy + 1; // +1 avoids zero
      const force = REPULSION / distSq;
      dx *= force;
      dy *= force;
      a.vx += dx;
      a.vy += dy;
      b.vx -= dx;
      b.vy -= dy;
    }
  }

  // Edge springs
  for (const edge of edges) {
    const a = nodes[edge.source];
    const b = nodes[edge.target];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const displacement = dist - EDGE_REST_LENGTH;
    const force = displacement * EDGE_SPRING;
    const fx = (dx / dist) * force;
    const fy = (dy / dist) * force;
    a.vx += fx;
    a.vy += fy;
    b.vx -= fx;
    b.vy -= fy;
  }

  // Gentle random drift for ambient motion
  for (const node of nodes) {
    node.vx += (Math.random() - 0.5) * DRIFT_FORCE;
    node.vy += (Math.random() - 0.5) * DRIFT_FORCE;
  }

  // Apply velocity, damping, boundary clamping
  const pad = 30;
  for (const node of nodes) {
    node.vx *= DAMPING;
    node.vy *= DAMPING;
    node.x += node.vx;
    node.y += node.vy;
    node.x = Math.max(pad, Math.min(width - pad, node.x));
    node.y = Math.max(pad, Math.min(height - pad, node.y));
    totalMotion += Math.abs(node.vx) + Math.abs(node.vy);
  }

  return totalMotion / n < 0.1;
}
