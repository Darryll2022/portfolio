/**
 * World Map — the homepage.
 * Kingdom Hearts-style world selector with floating orbs.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CHARACTER, QUESTS } from '../data';

const STATUS_LABEL = { active: 'In Progress', resting: 'Resting', complete: 'Complete' };

export default function WorldMap() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* ── Top bar ── */}
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '20px 40px',
        borderBottom: '1px solid rgba(77,139,255,0.12)',
        background: 'rgba(4,6,26,0.6)', backdropFilter: 'blur(12px)',
      }}>
        <div>
          <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.1rem', color: '#f0c040' }}>
            ✦ NEXUS
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--muted)', letterSpacing: '0.2em' }}>
            PORTFOLIO — SELECT YOUR WORLD
          </div>
        </div>
        <button
          onClick={() => navigate('/character')}
          aria-label="View character screen"
          style={{
            background: 'none', border: '1px solid rgba(77,139,255,0.3)',
            borderRadius: 8, padding: '8px 20px', color: 'var(--muted)',
            cursor: 'pointer', fontSize: '0.8rem', letterSpacing: '0.1em',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#4d8bff', e.currentTarget.style.color = '#e8eeff')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(77,139,255,0.3)', e.currentTarget.style.color = 'var(--muted)')}
        >
          CHARACTER
        </button>
      </header>

      {/* ── Hero ── */}
      <div style={{ textAlign: 'center', padding: '80px 20px 40px', animation: 'fadeInUp 0.8s ease' }}>
        <div style={{ fontSize: '0.75rem', letterSpacing: '0.4em', color: 'var(--muted)', marginBottom: 16 }}>
          WELCOME TO THE WORLD MAP
        </div>
        <h1 style={{
          fontFamily: 'var(--font-title)', fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          background: 'linear-gradient(135deg, #e8eeff 0%, #4d8bff 50%, #f0c040 100%)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          marginBottom: 16, lineHeight: 1.2,
        }}>
          {CHARACTER.title}
        </h1>
        <p style={{ color: 'var(--muted)', maxWidth: 480, margin: '0 auto', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {CHARACTER.lore}
        </p>
      </div>

      {/* ── World orbs ── */}
      <div style={{
        flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center',
        flexWrap: 'wrap', gap: 60, padding: '40px 40px 80px',
      }}>
        {QUESTS.map((q, i) => {
          const isHovered = hovered === q.id;
          return (
            <button
              key={q.id}
              onMouseEnter={() => setHovered(q.id)}
              onMouseLeave={() => setHovered(null)}
              onClick={() => navigate(`/quest/${q.id}`)}
              aria-label={`Open ${q.name} — ${q.type}, ${STATUS_LABEL[q.status]}`}
              style={{
                cursor: 'pointer', background: 'none', border: 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20,
                animation: `fadeInUp 0.6s ease ${i * 0.15 + 0.3}s both`,
                padding: 0,
              }}
            >
              {/* Orb */}
              <div style={{
                width: 180, height: 180, borderRadius: '50%',
                background: `radial-gradient(circle at 35% 35%, ${q.color}40, ${q.color}10, rgba(4,6,26,0.8))`,
                border: `2px solid ${isHovered ? q.color : q.color + '40'}`,
                boxShadow: isHovered
                  ? `0 0 60px ${q.glow}, 0 0 120px ${q.glow}, inset 0 0 40px ${q.glow}`
                  : `0 0 30px ${q.glow}, inset 0 0 20px rgba(0,0,0,0.3)`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 10,
                animation: `float ${3 + i * 0.5}s ease-in-out infinite`,
                transition: 'all 0.4s cubic-bezier(0.4,0,0.2,1)',
                transform: isHovered ? 'scale(1.08)' : 'scale(1)',
                position: 'relative',
              }}>
                {/* Inner glow ring */}
                <div style={{
                  position: 'absolute', inset: 12, borderRadius: '50%',
                  border: `1px solid ${q.color}30`,
                  transition: 'all 0.4s',
                  opacity: isHovered ? 1 : 0.4,
                }} />
                <span style={{ fontSize: '2.8rem', filter: isHovered ? `drop-shadow(0 0 12px ${q.color})` : 'none', transition: 'filter 0.3s' }}>
                  {q.icon}
                </span>
                <div style={{
                  fontSize: '0.6rem', letterSpacing: '0.25em',
                  color: isHovered ? q.color : 'var(--muted)',
                  transition: 'color 0.3s', textAlign: 'center', padding: '0 16px',
                  fontFamily: 'var(--font-title)',
                }}>
                  {q.type.toUpperCase()}
                </div>
              </div>

              {/* Label */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: 'var(--font-title)', fontSize: '1.1rem',
                  color: isHovered ? '#e8eeff' : 'var(--muted)',
                  transition: 'color 0.3s', marginBottom: 4,
                }}>
                  {q.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: isHovered ? q.color : '#556', letterSpacing: '0.1em' }}>
                  {STATUS_LABEL[q.status]}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Footer hint ── */}
      <div style={{ textAlign: 'center', padding: '0 20px 32px', color: '#334', fontSize: '0.7rem', letterSpacing: '0.2em' }}>
        MORE WORLDS COMING
      </div>
    </div>
  );
}
