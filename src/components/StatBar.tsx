import { useEffect, useRef, useState } from 'react';

interface Props {
  label: string;
  value: number;
  icon: string;
  delay?: number;
}

export default function StatBar({ label, value, icon, delay = 0 }: Props) {
  const [width, setWidth] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTimeout(() => setWidth(value), delay); },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value, delay]);

  return (
    <div ref={ref} style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '0.82rem' }}>
        <span style={{ color: '#8899cc' }}>{icon} {label}</span>
        <span style={{ color: '#f0c040', fontWeight: 600 }}>{value}</span>
      </div>
      <div style={{
        height: 6, borderRadius: 3,
        background: 'rgba(77,139,255,0.15)',
        border: '1px solid rgba(77,139,255,0.2)',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', borderRadius: 3,
          width: `${width}%`,
          background: 'linear-gradient(90deg, #1a3aad, #4d8bff)',
          boxShadow: '0 0 8px rgba(77,139,255,0.6)',
          transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
        }} />
      </div>
    </div>
  );
}
