/**
 * Quest Page — project deep dive.
 * Nexus Hub gets a full showcase section (mockup + feature cards).
 * Other quests get the standard story layout.
 *
 * Level 2 upgrade path:
 *   - Set quest.demoReady = true in data.ts
 *   - Set quest.liveUrl to the deployed URL
 *   - The CTA section will automatically show the iframe + key prompt
 */
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { QUESTS, Feature } from '../data';

/* ─── Chapter block (scroll-revealed) ─── */
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

/* ─── Feature card ─── */
function FeatureCard({ feature, delay }: { feature: Feature; delay: number }) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      onClick={() => setExpanded(v => !v)}
      style={{
        flex: '1 1 260px',
        background: 'rgba(8,13,46,0.7)',
        border: `1px solid ${expanded ? feature.color + '60' : 'rgba(77,139,255,0.15)'}`,
        borderRadius: 16,
        padding: '24px 22px',
        cursor: 'pointer',
        transition: `all 0.4s ease ${delay}ms`,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(20px)',
        boxShadow: expanded ? `0 0 28px ${feature.color}20` : 'none',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Top accent line */}
      <div style={{
        height: 3, borderRadius: 2, marginBottom: 20,
        background: `linear-gradient(90deg, ${feature.color}, transparent)`,
        transition: 'opacity 0.3s',
        opacity: expanded ? 1 : 0.5,
      }} />

      <div style={{ fontSize: '2rem', marginBottom: 14 }}>{feature.icon}</div>

      <div style={{
        fontFamily: 'var(--font-title)', fontSize: '0.95rem',
        color: '#e8eeff', marginBottom: 8, letterSpacing: '0.04em',
      }}>
        {feature.title}
      </div>

      <div style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6, marginBottom: expanded ? 14 : 0 }}>
        {feature.desc}
      </div>

      {/* Expanded detail */}
      <div style={{
        overflow: 'hidden',
        maxHeight: expanded ? '200px' : '0',
        transition: 'max-height 0.4s ease',
      }}>
        <div style={{
          paddingTop: 14,
          borderTop: `1px solid ${feature.color}20`,
          fontSize: '0.8rem', color: '#8899cc', lineHeight: 1.8,
        }}>
          {feature.detail}
        </div>
      </div>

      <div style={{
        marginTop: 16, fontSize: '0.68rem', letterSpacing: '0.2em',
        color: feature.color, opacity: 0.7,
      }}>
        {expanded ? '▲ LESS' : '▼ MORE'}
      </div>
    </div>
  );
}

/* ─── Browser mockup frame ─── */
function BrowserMockup({ color, screenshotUrl }: { color: string; screenshotUrl?: string }) {
  return (
    <div style={{
      borderRadius: 12, overflow: 'hidden',
      border: `1px solid ${color}30`,
      boxShadow: `0 0 40px ${color}20, 0 20px 60px rgba(0,0,0,0.5)`,
      background: '#0d1117',
      maxWidth: 560, width: '100%',
    }}>
      {/* Browser chrome */}
      <div style={{
        background: '#161b22', padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: `1px solid ${color}20`,
      }}>
        {/* Traffic lights */}
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ff5f57','#febc2e','#28c840'].map(c => (
            <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c, opacity: 0.8 }} />
          ))}
        </div>
        {/* Address bar */}
        <div style={{
          flex: 1, background: '#0d1117', borderRadius: 6,
          padding: '5px 12px', fontSize: '0.72rem', color: '#4a5568',
          border: '1px solid #2d3748', letterSpacing: '0.02em',
        }}>
          nexus-hub.vercel.app
        </div>
      </div>

      {/* App UI mockup */}
      {screenshotUrl ? (
        <img src={screenshotUrl} alt="Nexus Hub UI" style={{ width: '100%', display: 'block' }} />
      ) : (
        <div style={{
          display: 'flex', height: 320,
          fontFamily: 'var(--font-body)',
        }}>
          {/* Sidebar */}
          <div style={{
            width: 200, background: '#0a0f1e',
            borderRight: `1px solid ${color}15`,
            padding: '16px 0', flexShrink: 0,
          }}>
            <div style={{ padding: '0 14px 14px', fontSize: '0.62rem', letterSpacing: '0.25em', color: '#3a4a6a' }}>
              AGENTS
            </div>
            {[
              { name: 'Atlas', icon: '🔍', color: '#4d8bff', active: true },
              { name: 'General', icon: '💬', color: '#34D399', active: false },
              { name: 'Research', icon: '📚', color: '#a78bfa', active: false },
            ].map(a => (
              <div key={a.name} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', cursor: 'pointer',
                background: a.active ? `${a.color}15` : 'transparent',
                borderLeft: a.active ? `2px solid ${a.color}` : '2px solid transparent',
              }}>
                <span style={{ fontSize: '1rem' }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: '0.78rem', color: a.active ? '#e8eeff' : '#4a5568' }}>{a.name}</div>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.color, marginTop: 3, opacity: a.active ? 1 : 0.3 }} />
                </div>
              </div>
            ))}
          </div>

          {/* Chat area */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#080d2e' }}>
            {/* Messages */}
            <div style={{ flex: 1, padding: '16px', display: 'flex', flexDirection: 'column', gap: 10, overflow: 'hidden' }}>
              {/* User message */}
              <div style={{ alignSelf: 'flex-end', maxWidth: '70%' }}>
                <div style={{
                  background: `${color}20`, border: `1px solid ${color}30`,
                  borderRadius: '12px 12px 2px 12px', padding: '8px 12px',
                  fontSize: '0.75rem', color: '#c8d8ff', lineHeight: 1.5,
                }}>
                  Review this PR for me
                </div>
              </div>
              {/* Atlas reply */}
              <div style={{ alignSelf: 'flex-start', maxWidth: '80%' }}>
                <div style={{
                  fontSize: '0.6rem', color: '#4d8bff', marginBottom: 4, letterSpacing: '0.1em',
                }}>
                  ATLAS
                </div>
                <div style={{
                  background: 'rgba(77,139,255,0.08)', border: '1px solid rgba(77,139,255,0.2)',
                  borderRadius: '2px 12px 12px 12px', padding: '10px 12px',
                  fontSize: '0.75rem', color: '#8899cc', lineHeight: 1.6,
                }}>
                  <div style={{ color: '#34D399', marginBottom: 4, fontSize: '0.7rem' }}>✦ Summary</div>
                  Clean implementation. One security note on line 42...
                  <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {['correctness','security','performance'].map(t => (
                      <span key={t} style={{
                        padding: '2px 7px', borderRadius: 10, fontSize: '0.6rem',
                        background: 'rgba(77,139,255,0.1)', border: '1px solid rgba(77,139,255,0.2)',
                        color: '#4d8bff',
                      }}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Input */}
            <div style={{
              padding: '10px 14px', borderTop: `1px solid ${color}15`,
              display: 'flex', gap: 8, alignItems: 'center',
            }}>
              <div style={{
                flex: 1, background: 'rgba(77,139,255,0.06)',
                border: '1px solid rgba(77,139,255,0.15)', borderRadius: 8,
                padding: '7px 12px', fontSize: '0.72rem', color: '#3a4a6a',
              }}>
                Message Atlas...
              </div>
              <div style={{
                width: 30, height: 30, borderRadius: 8,
                background: `${color}20`, border: `1px solid ${color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', color: color,
              }}>↑</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Level 2 CTA (coming soon) ─── */
function DemoCTA({ demoReady, liveUrl, color }: {
  demoReady: boolean;
  liveUrl: string | null;
  color: string;
}) {
  if (demoReady && liveUrl) {
    // Level 2: show launch button (+ key prompt when clicked)
    // TODO: implement BringYourKeyModal when demoReady = true
    return (
      <a href={liveUrl} target="_blank" rel="noreferrer" className="btn-kh">
        LAUNCH NEXUS HUB ↗
      </a>
    );
  }

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 12,
      padding: '12px 28px', borderRadius: 6,
      border: `1px solid ${color}30`,
      background: `${color}08`,
      color: color, opacity: 0.6, fontSize: '0.82rem',
      letterSpacing: '0.12em', fontFamily: 'var(--font-title)',
    }}>
      <span style={{
        width: 8, height: 8, borderRadius: '50%',
        background: color, opacity: 0.5,
        animation: 'pulse-glow 2s ease-in-out infinite',
        flexShrink: 0,
        display: 'inline-block',
      }} />
      TRY IT LIVE — COMING SOON
    </div>
  );
}

/* ─── Nexus Hub showcase section ─── */
function NexusShowcase({ quest }: { quest: typeof QUESTS[0] }) {
  return (
    <div style={{ padding: '0 0 20px' }}>
      {/* Mockup + features side by side */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 36,
        alignItems: 'flex-start',
        padding: '48px 40px',
        borderBottom: `1px solid ${quest.color}15`,
      }}>
        {/* Browser mockup */}
        <div style={{ flex: '1 1 340px', display: 'flex', justifyContent: 'center' }}>
          <BrowserMockup color={quest.color} />
        </div>

        {/* Feature cards */}
        <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            fontSize: '0.65rem', letterSpacing: '0.3em',
            color: 'var(--muted)', marginBottom: 4,
          }}>
            WHAT IT DOES
          </div>
          {quest.features.map((f, i) => (
            <FeatureCard key={f.title} feature={f} delay={i * 120} />
          ))}

          {/* CTA */}
          <div style={{ marginTop: 8 }}>
            <DemoCTA demoReady={quest.demoReady} liveUrl={quest.liveUrl} color={quest.color} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ─── */
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

      {/* ── Nexus Hub showcase (only for nexus-hub) ── */}
      {quest.features.length > 0 && <NexusShowcase quest={quest} />}

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
