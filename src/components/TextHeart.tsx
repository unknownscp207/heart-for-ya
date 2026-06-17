import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
  alpha: number;
  targetAlpha: number;
  delay: number;
}

export default function TextHeart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let points: Point[] = [];

    const text = "i love you";
    const fontSize = 14;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPoints();
    };

    const initPoints = () => {
      points = [];

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const scale = Math.min(canvas.width, canvas.height) / 45;

      for (let t = 0; t < Math.PI * 2; t += 0.05) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y =
          -(13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t));

        points.push({
          x: centerX + x * scale,
          y: centerY + y * scale,
          alpha: 0,
          targetAlpha: 0.8 + Math.random() * 0.2,
          delay: Math.random() * 2000,
        });
      }

      for (let s = 0.2; s < 1; s += 0.2) {
        for (let t = 0; t < Math.PI * 2; t += 0.1) {
          const x = 16 * Math.pow(Math.sin(t), 3);
          const y =
            -(13 * Math.cos(t) -
              5 * Math.cos(2 * t) -
              2 * Math.cos(3 * t) -
              Math.cos(4 * t));

          points.push({
            x: centerX + x * scale * s,
            y: centerY + y * scale * s,
            alpha: 0,
            targetAlpha: 0.4 + Math.random() * 0.4,
            delay: Math.random() * 3000,
          });
        }
      }
    };

    let start: number | null = null;

    const draw = (time: number) => {
      if (!start) start = time;

      const elapsed = time - start;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      const pulse = 1 + Math.sin(elapsed * 0.002) * 0.05;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px "Fira Code", monospace`;

      ctx.shadowBlur = 12;
      ctx.shadowColor = "#ff4d6d";

      points.forEach((p) => {
        if (elapsed > p.delay) {
          p.alpha += (p.targetAlpha - p.alpha) * 0.002;
        }

        const drawX =
          centerX + (p.x - centerX) * pulse;

        const drawY =
          centerY + (p.y - centerY) * pulse;

        ctx.fillStyle = `rgba(255, 77, 109, ${p.alpha})`;

        ctx.fillText(
          text,
          drawX - ctx.measureText(text).width / 2,
          drawY
        );
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);

    resize();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
    />
  );
}