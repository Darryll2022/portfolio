/**
 * 🌑 HIDDEN — Midgar / FF7 CI/CD World
 * Accessible via /?world=darkness
 * Locked message shown until dark mode ships.
 * When dark mode arrives: fill in the CI/CD content below.
 */
import { useNavigate } from 'react-router-dom';

const UNLOCKED = false; // flip to true when dark mode ships

export default function MidgarPage() {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: 32,
      background: 'radial-gradient(ellipse at 50% 40%, #1a0a00 0%, #0d0500 60%, #000 100%)',
      animation: 'fadeInUp 0.8s ease',
    }}>
      {/* FF7 reactor glow */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 600, height: 600, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(80,200,80,0.04) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ textAlign: 'center', maxWidth: 560, position: 'relative' }}>
        <div style={{
          fontSize: '0.65rem', letterSpacing: '0.5em',
          color: '#3a5a3a', marginBottom: 24,
        }}>
          SHINRA ELECTRIC POWER COMPANY — SECTOR 7
        </div>

        <div style={{ fontSize: '3rem', marginBottom: 20, filter: 'drop-shadow(0 0 20px #50c850)' }}>
          ⚙️
        </div>

        <h1 style={{
          fontFamily: 'var(--font-title)', fontSize: 'clamp(1.4rem, 3vw, 2rem)',
          color: '#50c850', marginBottom: 16,
          textShadow: '0 0 20px rgba(80,200,80,0.5)',
        }}>
          Midgar Infrastructure
        </h1>

        {UNLOCKED ? (
          /* ── UNLOCKED: CI/CD content goes here ── */
          <div style={{ color: '#8ab88a', lineHeight: 1.9, fontSize: '0.92rem' }}>
            <p style={{ marginBottom: 16 }}>
              Below the plate, the pipelines run continuously. This is the infrastructure that keeps everything alive.
            </p>
            {/* TODO: CI/CD architecture docs */}
            <div style={{
              background: 'rgba(80,200,80,0.05)', border: '1px solid rgba(80,200,80,0.2)',
              borderRadius: 12, padding: 24, fontFamily: 'monospace', fontSize: '0.82rem',
              textAlign: 'left', color: '#50c850',
            }}>
              {`# CI/CD Pipeline — Nexus Hub\n\n[Content coming when dark mode ships]`}
            </div>
          </div>
        ) : (
          /* ── LOCKED ── */
          <div>
            <div style={{
              background: 'rgba(80,200,80,0.04)', border: '1px solid rgba(80,200,80,0.15)',
              borderRadius: 12, padding: 28, marginBottom: 28,
            }}>
              <div style={{ fontSize: '1.5rem', marginBottom: 12 }}>🔒</div>
              <p style={{ color: '#3a5a3a', lineHeight: 1.8, fontSize: '0.88rem' }}>
                This world is sealed beneath the plate.
              </p>
              <p style={{ color: '#3a5a3a', lineHeight: 1.8, fontSize: '0.88rem', marginTop: 8 }}>
                Return when dark mode has been activated across the surface world. The infrastructure docs will be waiting.
              </p>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#2a3a2a', letterSpacing: '0.2em' }}>
              UNLOCK CONDITION: DARK MODE · FF7 THEME
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          style={{
            marginTop: 36, background: 'none', cursor: 'pointer',
            border: '1px solid rgba(80,200,80,0.25)', borderRadius: 6,
            padding: '10px 24px', color: '#3a5a3a',
            fontSize: '0.78rem', letterSpacing: '0.15em', transition: 'all 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = '#50c850', e.currentTarget.style.color = '#50c850')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(80,200,80,0.25)', e.currentTarget.style.color = '#3a5a3a')}
        >
          ← ASCEND TO SURFACE
        </button>
      </div>
    </div>
  );
}
