/**
 * Character Screen — Darryll's stats, class, abilities.
 * Styled like a KH character menu.
 */
import { useNavigate } from 'react-router-dom';
import { CHARACTER } from '../data';
import StatBar from '../components/StatBar';

export default function CharacterScreen() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', padding: '0 20px', animation: 'fadeInUp 0.5s ease' }}>

      {/* Back */}
      <div style={{ padding: '24px 20px 0' }}>
        <button onClick={() => navigate('/')} aria-label="Return to World Map" style={{
          background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer',
          fontSize: '0.8rem', letterSpacing: '0.15em', display: 'flex', alignItems: 'center', gap: 8,
        }}>
          ← WORLD MAP
        </button>
      </div>

      <div style={{
        maxWidth: 900, margin: '0 auto', padding: '40px 0 80px',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: 24,
      }}>

        {/* ── Identity card ── */}
        <div className="glass" style={{ padding: 32, animation: 'fadeInUp 0.5s ease 0.1s both' }}>
          {/* Avatar placeholder */}
          <div style={{
            width: 90, height: 90, borderRadius: '50%', marginBottom: 20,
            background: 'linear-gradient(135deg, #1a3aad, #4d8bff)',
            border: '2px solid rgba(77,139,255,0.4)',
            boxShadow: '0 0 30px rgba(77,139,255,0.3)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2.5rem',
          }}>
            🧑‍💻
          </div>

          <div style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--muted)', marginBottom: 6 }}>
            CHARACTER
          </div>
          <h1 style={{
            fontFamily: 'var(--font-title)', fontSize: '2rem',
            color: '#e8eeff', marginBottom: 4,
            textShadow: '0 0 20px rgba(77,139,255,0.5)',
          }}>
            {CHARACTER.name}
          </h1>
          <div style={{
            display: 'inline-block', padding: '4px 14px', borderRadius: 20,
            border: '1px solid rgba(240,192,64,0.4)',
            background: 'rgba(240,192,64,0.08)',
            color: '#f0c040', fontSize: '0.78rem', letterSpacing: '0.15em',
            marginBottom: 20,
          }}>
            {CHARACTER.class} · LV {CHARACTER.level}
          </div>

          <p style={{ color: 'var(--muted)', fontSize: '0.88rem', lineHeight: 1.8, marginBottom: 28 }}>
            {CHARACTER.lore}
          </p>

          {/* Abilities */}
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--muted)', marginBottom: 14 }}>
            ABILITIES
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {CHARACTER.abilities.map(a => (
              <div key={a.name} style={{
                padding: '10px 14px', borderRadius: 10,
                background: 'rgba(77,139,255,0.06)',
                border: '1px solid rgba(77,139,255,0.12)',
              }}>
                <div style={{ fontSize: '0.82rem', color: '#e8eeff', fontWeight: 600, marginBottom: 2 }}>
                  ✦ {a.name}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                  {a.desc}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Stats card ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="glass" style={{ padding: 32, animation: 'fadeInUp 0.5s ease 0.2s both' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--muted)', marginBottom: 20 }}>
              STAT PANEL
            </div>
            {CHARACTER.stats.map((s, i) => (
              <StatBar key={s.label} label={s.label} value={s.value} icon={s.icon} delay={i * 100} />
            ))}
          </div>

          {/* Quest summary */}
          <div className="glass" style={{ padding: 32, animation: 'fadeInUp 0.5s ease 0.3s both' }}>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.3em', color: 'var(--muted)', marginBottom: 16 }}>
              QUEST LOG
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Main Quests Active', value: '1' },
                { label: 'Side Quests Resting', value: '1' },
                { label: 'Worlds Explored', value: '2' },
                { label: 'Technologies Mastered', value: '12+' },
              ].map(r => (
                <div key={r.label} style={{
                  display: 'flex', justifyContent: 'space-between',
                  fontSize: '0.82rem', padding: '8px 0',
                  borderBottom: '1px solid rgba(77,139,255,0.08)',
                }}>
                  <span style={{ color: 'var(--muted)' }}>{r.label}</span>
                  <span style={{ color: '#f0c040', fontWeight: 600 }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="glass" style={{ padding: 24, textAlign: 'center', animation: 'fadeInUp 0.5s ease 0.4s both' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', marginBottom: 14, lineHeight: 1.6 }}>
              Want to collaborate on a quest?
            </div>
            <a
              href="https://github.com/Darryll2022"
              target="_blank"
              rel="noreferrer"
              className="btn-kh"
            >
              GITHUB ↗
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
