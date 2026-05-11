import { useEffect, useRef } from 'react';

interface Star {
  x: number; y: number;
  r: number; alpha: number;
  speed: number; drift: number;
}

export default function Stars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let animId: number;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const COUNT = 180;
    const stars: Star[] = Array.from({ length: COUNT }, () => ({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      r:     Math.random() * 1.6 + 0.2,
      alpha: Math.random() * 0.7 + 0.1,
      speed: Math.random() * 0.3 + 0.05,
      drift: (Math.random() - 0.5) * 0.15,
    }));

    // A few larger "heart" stars (KH motif)
    const hearts: Star[] = Array.from({ length: 6 }, () => ({
      x:     Math.random() * window.innerWidth,
      y:     Math.random() * window.innerHeight,
      r:     Math.random() * 2.5 + 1.5,
      alpha: Math.random() * 0.5 + 0.3,
      speed: Math.random() * 0.15 + 0.02,
      drift: (Math.random() - 0.5) * 0.08,
    }));

    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.008;

      [...stars, ...hearts].forEach((s, i) => {
        const flicker = Math.sin(t * (1.5 + i * 0.3)) * 0.2;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(200,215,255,${Math.max(0, s.alpha + flicker)})`;
        ctx.fill();

        s.y -= s.speed;
        s.x += s.drift;
        if (s.y < -4) { s.y = canvas.height + 4; s.x = Math.random() * canvas.width; }
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas id="stars" ref={canvasRef} />;
}
