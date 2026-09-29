import React, { useEffect, useRef } from 'react';

/**
 * Minimalist Realistic NOC (Network Operations Center) Topology Canvas
 * Subtle grid with stationary topological relay points and calm data pulses.
 */
export default function NetworkBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Fixed realistic grid points
    const points = [];
    const spacing = 120;
    const cols = Math.ceil(width / spacing) + 1;
    const rows = Math.ceil(height / spacing) + 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        points.push({
          x: i * spacing + (j % 2 === 0 ? 0 : spacing * 0.5),
          y: j * spacing,
          baseRadius: 1,
          pulse: Math.random() * Math.PI * 2
        });
      }
    }

    let time = 0;

    const render = () => {
      time += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Deep dark background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, width, height);

      // Draw subtle telemetry points and connecting matrix
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
      ctx.lineWidth = 1;

      for (let i = 0; i < points.length; i++) {
        const p = points[i];
        const pulse = Math.sin(time + p.pulse) * 0.5 + 0.5;

        // Draw faint point
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.baseRadius + pulse * 0.8, 0, Math.PI * 2);
        ctx.fillStyle = pulse > 0.85 ? 'rgba(56, 189, 248, 0.3)' : 'rgba(148, 163, 184, 0.12)';
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-100"
      aria-hidden="true"
    />
  );
}
