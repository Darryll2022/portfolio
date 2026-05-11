/**
 * Quest Page — individual project deep dive.
 * Each chapter is a scroll-revealed story beat.
 * The viewer lives the journey through Darryll's eyes.
 */
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { QUESTS } from '../data';

function ChapterBlock({ chapter, index, accentColor }: {
  chapter: { title: string; text: string };
  index: number;
  accentColor: string;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      display: 'flex', gap: 24, marginBottom: 48,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
    }}>
      {/* Timeline line */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: `radial-gradient(circle, ${accentColor}30, transparent)`,
          border: `2px solid ${accentColor}60`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: accentColor, fontSize: '0.75rem', fontWeight: 700,
          boxShadow: `0 0 12px ${accentColor}40`,
          flexShrink: 0,
        }}>
          {index + 1}
        </div>
        <div style={{
          width: 1, flex: 1, marginTop: 8,
          background: `linear-gradient(to bottom, ${accentColor}40, transparent)`,
        }} />
      </div>

      {/* Content */}
      <div style={{ paddingBottom: 16, flex: 1 }}>
        <h3 style={{
          fontFamily: 'var(--font-title)', fontSize: '1rem',
          color: accentColor, marginBottom: 12, letterSpacing: '0.05em',
        }}>
          {chapter.title}
        </h3>
        <p style={{ color: 'var(--muted)', lineHeight: 1.9, fontSize: '0.93rem' }}>
          {chapter.text}
        </p>
      </div>
    </div>
  );
}

export default function QuestPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quest = QUESTS.find(q => q.id === id);

  if (!quest) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', color: 'var(--muted)' }}>World Not Found</div>
        <button className="btn-kh" onClick={() => navigate('/')}>Return to Map</button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', animation: 'fadeInUp 0.5s ease' }}>

      {/* ── Hero banner ── */}
      <div style={{
        position: 'relative', overflow: 'hidden',
        padding: '80px 40px 60px',
        background: `radial-gradient(ellipse 80% 100% at 50% 0%, ${quest.glow} 0%, transparent 70%)`,
        borderBottom: `1px solid ${quest.color}20`,
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.35em', color: 'var(--muted)', marginBottom: 12 }}>
          {quest.type.toUpperCase()} · {quest.world.toUpperCase()}
        </div>
        <div style={{ fontSize: '4rem', marginBottom: 16, filter: `drop-shadow(0 0 20px ${quest.color})` }}>
          {quest.icon}
        </div>
        <h1 style={{
          fontFamily: 'var(--font-title)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
          color: '#e8eeff', marginBottom: 10,
          textShadow: `0 0 30px ${quest.glow}`,
        }}>
          {quest.name}
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginBottom: 24 }}>
          {quest.tagline}
        </p>

        {/* Stack tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 28 }}>
          {quest.stack.map(s => (
            <span key={s} style={{
              padding: '4px 12px', borderRadius: 20, fontSize: '0.72rem',
              border: `1px solid ${quest.color}40`,
              background: `${quest.color}10`, color: quest.color,
              letterSpacing: '0.05em',
            }}>
              {s}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          {quest.githubUrl && (
            <a href={quest.githubUrl} target="_blank" rel="noreferrer" className="btn-kh">
              VIEW ON GITHUB ↗
            </a>
          )}
          {quest.liveUrl && (
            <a href={quest.liveUrl} target="_blank" rel="noreferrer" className="btn-kh">
              PLAY LIVE ↗
            </a>
          )}
        </div>
      </div>

      {/* ── Back nav ── */}
      <div style={{ padding: '20px 40px 0' }}>
        <button onClick={() => navigate('/')} style={{
          background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer',
          fontSize: '0.78rem', letterSpacing: '0.15em',
        }}>
          ← WORLD MAP
        </button>
      </div>

      {/* ── Story chapters ── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 32px 80px' }}>
        <div style={{
          fontSize: '0.65rem', letterSpacing: '0.3em',
          color: 'var(--muted)', marginBottom: 40,
        }}>
          THE STORY
        </div>

        {quest.chapters.map((ch, i) => (
          <ChapterBlock key={i} chapter={ch} index={i} accentColor={quest.color} />
        ))}

        {/* Status badge */}
        <div className="glass" style={{ padding: '20px 28px', marginTop: 16, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{
            width: 10, height: 10, borderRadius: '50%',
            background: quest.status === 'active' ? '#34D399' : '#F59E0B',
            boxShadow: `0 0 8px ${quest.status === 'active' ? '#34D399' : '#F59E0B'}`,
            animation: 'pulse-glow 2s ease-in-out infinite',
          }} />
          <div>
            <div style={{ fontSize: '0.78rem', color: '#e8eeff', fontWeight: 600 }}>
              {quest.status === 'active' ? 'Quest Active — Journey Ongoing' : 'Quest Resting — Will Return'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--muted)', marginTop: 2 }}>
              {quest.status === 'active'
                ? 'This project is under active development.'
                : 'This project is paused. A comeback is planned.'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
