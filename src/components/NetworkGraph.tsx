"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { Profile } from "@/types";
import { buildGraph, tickSimulation, Graph, GraphNode } from "@/lib/graph";

const CRIMSON = "#862334";
const GOLD = "#b8822e";

interface Props {
  profiles: Profile[];
  visible: boolean;
}

export function NetworkGraph({ profiles, visible }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const graphRef = useRef<Graph | null>(null);
  const rafRef = useRef<number>(0);
  const fadeRef = useRef(0); // 0..1 fade-in progress
  const hoveredRef = useRef<GraphNode | null>(null);
  const [tooltip, setTooltip] = useState<{
    name: string;
    major: string;
    x: number;
    y: number;
  } | null>(null);

  // Initialize graph when profiles or canvas size changes
  const initGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    canvas.width = w * devicePixelRatio;
    canvas.height = h * devicePixelRatio;
    graphRef.current = buildGraph(profiles, w, h);
    fadeRef.current = 0;
  }, [profiles]);

  // Hover detection
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      const graph = graphRef.current;
      if (!canvas || !graph) return;

      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      let closest: GraphNode | null = null;
      let closestDist = Infinity;

      for (const node of graph.nodes) {
        const dx = node.x - mx;
        const dy = node.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < node.radius + 12 && dist < closestDist) {
          closest = node;
          closestDist = dist;
        }
      }

      hoveredRef.current = closest;

      if (closest?.profile) {
        setTooltip({
          name: closest.profile.name,
          major: closest.profile.major,
          x: closest.x,
          y: closest.y,
        });
      } else {
        setTooltip(null);
      }
    },
    []
  );

  const handleMouseLeave = useCallback(() => {
    hoveredRef.current = null;
    setTooltip(null);
  }, []);

  // Animation loop
  useEffect(() => {
    initGraph();

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    function draw() {
      if (!running || !ctx || !canvas) return;

      const graph = graphRef.current;
      if (!graph) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const dpr = devicePixelRatio;

      // Resize check
      if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
        canvas.width = w * dpr;
        canvas.height = h * dpr;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      // Fade in after hero typing finishes
      if (visible && fadeRef.current < 1) {
        fadeRef.current = Math.min(1, fadeRef.current + 0.012);
      }
      const alpha = fadeRef.current;
      if (alpha <= 0) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }

      // Tick physics
      tickSimulation(graph, w, h);

      const hovered = hoveredRef.current;
      const manyProfiles = profiles.length > 50;

      // Build set of hovered-connected node IDs
      const connectedIds = new Set<number>();
      if (hovered) {
        connectedIds.add(hovered.id);
        for (const edge of graph.edges) {
          if (edge.source === hovered.id) connectedIds.add(edge.target);
          if (edge.target === hovered.id) connectedIds.add(edge.source);
        }
      }

      // Draw edges
      for (const edge of graph.edges) {
        const a = graph.nodes[edge.source];
        const b = graph.nodes[edge.target];
        const isConnected =
          hovered &&
          (edge.source === hovered.id || edge.target === hovered.id);

        // For 50+ profiles, only show edges near hovered node
        if (manyProfiles && !isConnected) continue;

        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = isConnected
          ? `rgba(184, 130, 46, ${0.35 * alpha})`
          : `rgba(255, 255, 255, ${0.06 * alpha})`;
        ctx.lineWidth = isConnected ? 1.2 : 0.5;
        ctx.stroke();
      }

      // Draw nodes
      for (const node of graph.nodes) {
        const isGhost = node.profile === null;
        const isHovered = hovered === node;
        const isConnected = connectedIds.has(node.id);

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);

        if (isGhost) {
          ctx.fillStyle = `rgba(255, 255, 255, ${0.08 * alpha})`;
        } else if (isHovered) {
          // Gold glow
          ctx.shadowColor = GOLD;
          ctx.shadowBlur = 18;
          ctx.fillStyle = `rgba(184, 130, 46, ${0.9 * alpha})`;
        } else if (isConnected) {
          ctx.fillStyle = `rgba(184, 130, 46, ${0.5 * alpha})`;
        } else {
          ctx.fillStyle = `rgba(134, 35, 52, ${0.65 * alpha})`;
        }

        ctx.fill();
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
      }

      // "// connecting..." text when 0 real profiles
      if (profiles.length === 0) {
        ctx.font = "11px monospace";
        ctx.fillStyle = `rgba(255, 255, 255, ${0.12 * alpha})`;
        ctx.textAlign = "center";
        ctx.fillText("// connecting...", w / 2, h / 2);
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      running = false;
      cancelAnimationFrame(rafRef.current);
    };
  }, [visible, profiles, initGraph]);

  // Resize handler
  useEffect(() => {
    const handleResize = () => initGraph();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [initGraph]);

  return (
    <div className="hidden lg:block relative shrink-0 w-[320px] h-[260px]">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
      {tooltip && (
        <div
          className="absolute pointer-events-none z-10 px-2.5 py-1.5 rounded bg-black/80 border border-white/10 backdrop-blur-sm"
          style={{
            left: Math.min(tooltip.x, 260),
            top: tooltip.y - 36,
          }}
        >
          <p className="text-xs text-white/85 font-medium whitespace-nowrap">
            {tooltip.name}
          </p>
          <p className="text-[10px] text-white/40 whitespace-nowrap">
            {tooltip.major}
          </p>
        </div>
      )}
    </div>
  );
}
