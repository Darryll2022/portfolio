/**
 * Quest Page — project deep dive.
 * Nexus Hub gets a full showcase section with upgraded UI.
 *
 * Level 2 upgrade path:
 *   - Set quest.demoReady = true in data.ts
 *   - Set quest.liveUrl to the deployed URL
 *   - The CTA section will show the launch button
 */
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState, useCallback } from 'react';
import { QUESTS, Feature } from '../data';

/* ─── Animated typing text ─── */
function TypewriterText({ text, delay = 0 }: { text: string; delay?: number }) {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    let i = 0;
    const interval = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 28);
    return () => clearInterval(interval);
  }, [started, text]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && started && (
        <span style={{ animation: 'blink 1s step-end infinite', opacity: 1 }}>▌</span>
      )}
    </span>
  );
}

/* ─── Scroll-reveal wrapper ─── */
function Reveal({ children, delay = 0, style = {} }: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(28px)',
      transition: `opacity 0.65s ease ${delay}ms, transform 0.65s ease ${delay}ms`,
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ─── Chapter block ─── */
function ChapterBlock({ chapter, index, accentColor }: {
  chapter: { title: string; text: string };
  index: number;
  accentColor: string;
}) {
  return (
    <Reveal delay={index * 120}>
      <div style={{ display: 'flex', gap: 28, marginBottom: 52 }}>
        {/* Timeline column */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0, width: 40 }}>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: `radial-gradient(circle at 40% 40%, ${accentColor}40, ${accentColor}10)`,
            border: `2px solid ${accentColor}70`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: accentColor, fontSize: '0.8rem', fontWeight: 700,
            boxShadow: `0 0 18px ${accentColor}40, inset 0 1px 0 ${accentColor}50`,
            flexShrink: 0,
            fontFamily: 'var(--font-title)',
          }}>
            {index + 1}
          </div>
          <div style={{
            width: 2, flex: 1, marginTop: 10,
            background: `linear-gradient(to bottom, ${accentColor}50, transparent)`,
          }} />
        </div>

        {/* Content */}
        <div style={{ paddingBottom: 16, flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontFamily: 'var(--font-title)', fontSize: '1.05rem',
            color: accentColor, marginBottom: 14, letterSpacing: '0.06em',
            textShadow: `0 0 20px ${accentColor}40`,
          }}>
            {chapter.title}
          </h3>
          <p style={{
            color: '#a8b8d8', lineHeight: 2.0, fontSize: '0.94rem',
            maxWidth: 620,
          }}>
            {chapter.text}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

/* ─── Ability card (replaces feature card) ─── */
function AbilityCard({ feature, index }: { feature: Feature; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <Reveal delay={index * 150}>
      <div
        onClick={() => setExpanded(v => !v)}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: hovered || expanded
            ? `linear-gradient(135deg, ${feature.color}12, ${feature.color}06)`
            : 'rgba(8,13,46,0.6)',
          border: `1px solid ${expanded ? feature.color + '50' : hovered ? feature.color + '35' : 'rgba(77,139,255,0.12)'}`,
          borderRadius: 16,
          padding: '26px 24px',
          cursor: 'pointer',
          transition: 'all 0.35s ease',
          boxShadow: expanded
            ? `0 0 40px ${feature.color}18, 0 8px 32px rgba(0,0,0,0.3)`
            : hovered ? `0 4px 20px ${feature.color}12` : 'none',
          backdropFilter: 'blur(12px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Corner glow accent */}
        <div style={{
          position: 'absolute', top: 0, right: 0,
          width: 120, height: 120,
          background: `radial-gradient(circle at top right, ${feature.color}18, transparent 70%)`,
          pointerEvents: 'none',
          opacity: hovered || expanded ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }} />

        {/* Top accent bar */}
        <div style={{
          height: 2, borderRadius: 2, marginBottom: 22,
          background: `linear-gradient(90deg, ${feature.color}, ${feature.color}40, transparent)`,
          opacity: expanded || hovered ? 1 : 0.4,
          transition: 'opacity 0.3s',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          {/* Icon */}
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            background: `${feature.color}15`,
            border: `1px solid ${feature.color}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '1.4rem', flexShrink: 0,
            boxShadow: expanded ? `0 0 16px ${feature.color}30` : 'none',
            transition: 'box-shadow 0.3s',
          }}>
            {feature.icon}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-title)', fontSize: '0.98rem',
              color: '#e8eeff', marginBottom: 6, letterSpacing: '0.04em',
            }}>
              {feature.title}
            </div>
            <div style={{
              fontSize: '0.83rem', color: '#7a8aaa', lineHeight: 1.65,
            }}>
              {feature.desc}
            </div>
          </div>
        </div>

        {/* Expandable detail */}
        <div style={{
          overflow: 'hidden',
          maxHeight: expanded ? '300px' : '0',
          transition: 'max-height 0.45s cubic-bezier(0.4,0,0.2,1)',
        }}>
          <div style={{
            marginTop: 20,
            paddingTop: 18,
            borderTop: `1px solid ${feature.color}20`,
            fontSize: '0.83rem', color: '#8899bb', lineHeight: 1.85,
          }}>
            {feature.detail}
          </div>
        </div>

        <div style={{
          marginTop: 16, fontSize: '0.65rem', letterSpacing: '0.22em',
          color: feature.color, opacity: 0.65,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <div style={{
            width: 12, height: 1,
            background: feature.color, opacity: 0.5,
          }} />
          {expanded ? 'COLLAPSE' : 'EXPAND'}
        </div>
      </div>
    </Reveal>
  );
}

/* ─── Animated browser mockup ─── */
function BrowserMockup({ color }: { color: string }) {
  const [activeAgent, setActiveAgent] = useState(0);
  const agents = [
    { name: 'Atlas', icon: '🔍', color: '#4d8bff' },
    { name: 'General', icon: '💬', color: '#34D399' },
    { name: 'Research', icon: '📚', color: '#a78bfa' },
  ];

  // Cycle active agent for demo effect
  useEffect(() => {
    const t = setInterval(() => {
      setActiveAgent(v => (v + 1) % agents.length);
    }, 3200);
    return () => clearInterval(t);
  }, []);

  const current = agents[activeAgent];

  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden',
      border: `1px solid ${color}25`,
      boxShadow: `0 0 60px ${color}15, 0 24px 80px rgba(0,0,0,0.6)`,
      background: '#0a0e1a',
      maxWidth: 540, width: '100%',
    }}>
      {/* Browser chrome */}
      <div style={{
        background: '#131a28', padding: '11px 16px',
        display: 'flex', alignItems: 'center', gap: 10,
        borderBottom: `1px solid rgba(255,255,255,0.05)`,
      }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {['#ff5f57','#febc2e','#28c840'].map(c => (
            <div key={c} style={{
              width: 11, height: 11, borderRadius: '50%',
              background: c, opacity: 0.75,
            }} />
          ))}
        </div>
        <div style={{
          flex: 1, background: '#0d1117', borderRadius: 6,
          padding: '5px 12px', fontSize: '0.7rem', color: '#3a4a6a',
          border: '1px solid #1e2738', letterSpacing: '0.02em',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ color: '#2a3a5a' }}>🔒</span>
          nexus-hub.vercel.app
        </div>
      </div>

      {/* App body */}
      <div style={{ display: 'flex', height: 300 }}>
        {/* Sidebar */}
        <div style={{
          width: 188, background: '#090e1c',
          borderRight: `1px solid rgba(255,255,255,0.04)`,
          padding: '14px 0', flexShrink: 0,
          display: 'flex', flexDirection: 'column',
        }}>
          <div style={{
            padding: '0 14px 12px',
            fontSize: '0.58rem', letterSpacing: '0.28em', color: '#2a3a5a',
          }}>
            AGENTS
          </div>
          {agents.map((a, i) => (
            <div
              key={a.name}
              onClick={() => setActiveAgent(i)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', cursor: 'pointer',
                background: i === activeAgent ? `${a.color}12` : 'transparent',
                borderLeft: `2px solid ${i === activeAgent ? a.color : 'transparent'}`,
                transition: 'all 0.25s ease',
              }}
            >
              <span style={{ fontSize: '0.95rem' }}>{a.icon}</span>
              <div>
                <div style={{
                  fontSize: '0.76rem',
                  color: i === activeAgent ? '#d8e8ff' : '#3a4a6a',
                  transition: 'color 0.25s',
                }}>
                  {a.name}
                </div>
                <div style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: a.color, marginTop: 3,
                  opacity: i === activeAgent ? 1 : 0.2,
                  boxShadow: i === activeAgent ? `0 0 6px ${a.color}` : 'none',
                  transition: 'all 0.25s',
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#07091a' }}>
          {/* Agent header */}
          <div style={{
            padding: '10px 14px',
            borderBottom: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span style={{ fontSize: '0.85rem' }}>{current.icon}</span>
            <span style={{
              fontSize: '0.72rem', color: current.color,
              fontFamily: 'var(--font-title)', letterSpacing: '0.08em',
              transition: 'color 0.25s',
            }}>
              {current.name.toUpperCase()}
            </span>
            <div style={{
              marginLeft: 'auto', display: 'flex', gap: 4, alignItems: 'center',
              fontSize: '0.58rem', color: '#34D39980',
            }}>
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: '#34D399',
                boxShadow: '0 0 6px #34D399',
                animation: 'pulse-glow 2s ease-in-out infinite',
              }} />
              LIVE
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, padding: '14px', overflow: 'hidden',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            <div style={{ alignSelf: 'flex-end', maxWidth: '72%' }}>
              <div style={{
                background: `${current.color}18`,
                border: `1px solid ${current.color}28`,
                borderRadius: '12px 12px 2px 12px',
                padding: '8px 12px',
                fontSize: '0.72rem', color: '#c8d8ff', lineHeight: 1.55,
                transition: 'all 0.25s',
              }}>
                Review this PR for me
              </div>
            </div>

            <div style={{ alignSelf: 'flex-start', maxWidth: '85%' }}>
              <div style={{
                fontSize: '0.58rem', color: current.color,
                marginBottom: 5, letterSpacing: '0.12em',
                transition: 'color 0.25s',
              }}>
                {current.name.toUpperCase()}
              </div>
              <div style={{
                background: `${current.color}0a`,
                border: `1px solid ${current.color}20`,
                borderRadius: '2px 12px 12px 12px',
                padding: '10px 12px',
                fontSize: '0.72rem', color: '#7a8aaa', lineHeight: 1.65,
                transition: 'all 0.25s',
              }}>
                <div style={{ color: '#34D399', marginBottom: 5, fontSize: '0.65rem', fontWeight: 600 }}>
                  ✦ Summary
                </div>
                Clean implementation. One security note on line 42...
                <div style={{ marginTop: 8, display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  {['correctness','security','performance'].map(t => (
                    <span key={t} style={{
                      padding: '2px 7px', borderRadius: 10, fontSize: '0.58rem',
                      background: `${current.color}12`,
                      border: `1px solid ${current.color}20`,
                      color: current.color, transition: 'all 0.25s',
                    }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Input bar */}
          <div style={{
            padding: '9px 12px',
            borderTop: '1px solid rgba(255,255,255,0.04)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <div style={{
              flex: 1, background: '#0d1117', borderRadius: 8,
              padding: '7px 12px', fontSize: '0.7rem', color: '#2a3a5a',
              border: '1px solid rgba(255,255,255,0.05)',
            }}>
              Message {current.name}...
            </div>
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              background: `${current.color}20`,
              border: `1px solid ${current.color}30`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', color: current.color,
              transition: 'all 0.25s',
            }}>↑</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Tech stack pill with icon ─── */
function StackPill({ name, color }: { name: string; color: string }) {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '5px 14px', borderRadius: 20,
        fontSize: '0.73rem',
        border: `1px solid ${hovered ? color + '70' : color + '35'}`,
        background: hovered ? `${color}18` : `${color}08`,
        color: hovered ? color : color + 'cc',
        letterSpacing: '0.05em',
        transition: 'all 0.2s ease',
        cursor: 'default',
        boxShadow: hovered ? `0 0 12px ${color}20` : 'none',
      }}
    >
      {name}
    </span>
  );
}

/* ─── Level 2 CTA ─── */
function DemoCTA({ demoReady, liveUrl, color }: {
  demoReady: boolean;
  liveUrl: string | null;
  color: string;
}) {
  if (demoReady && liveUrl) {
    return (
      <a href={liveUrl} target="_blank" rel="noreferrer" className="btn-kh">
        LAUNCH NEXUS HUB ↗
      </a>
    );
  }
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      padding: '11px 24px', borderRadius: 6,
      border: `1px solid ${color}25`,
      background: `${color}06`,
      color: color + '99',
      fontSize: '0.78rem', letterSpacing: '0.14em',
      fontFamily: 'var(--font-title)',
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: '50%',
        background: color, opacity: 0.45,
        animation: 'pulse-glow 2s ease-in-out infinite',
        display: 'inline-block', flexShrink: 0,
      }} />
      LIVE DEMO — COMING SOON
    </div>
  );
}

/* ─── Section divider ─── */
function SectionLabel({ label, color }: { label: string; color: string }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14, marginBottom: 36,
    }}>
      <div style={{
        fontSize: '0.62rem', letterSpacing: '0.34em',
        color: color, fontFamily: 'var(--font-title)',
        opacity: 0.8,
      }}>
        {label}
      </div>
      <div style={{
        flex: 1, height: 1,
        background: `linear-gradient(90deg, ${color}30, transparent)`,
      }} />
    </div>
  );
}

/* ─── Nexus Hub showcase section ─── */
function NexusShowcase({ quest }: { quest: typeof QUESTS[0] }) {
  return (
    <div>
      {/* Showcase: mockup + abilities */}
      <div style={{
        padding: '56px 40px 52px',
        borderBottom: `1px solid rgba(255,255,255,0.05)`,
        maxWidth: 1100, margin: '0 auto',
      }}>
        <Reveal>
          <SectionLabel label="WHAT IT DOES" color={quest.color} />
        </Reveal>

        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 48,
          alignItems: 'flex-start',
        }}>
          {/* Browser mockup */}
          <div style={{ flex: '1 1 340px', display: 'flex', justifyContent: 'center' }}>
            <Reveal delay={100} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <BrowserMockup color={quest.color} />
            </Reveal>
          </div>

          {/* Ability cards + CTA */}
          <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column', gap: 14 }}>
            {quest.features.map((f, i) => (
              <AbilityCard key={f.title} feature={f} index={i} />
            ))}
            <Reveal delay={350}>
              <div style={{ marginTop: 10 }}>
                <DemoCTA demoReady={quest.demoReady} liveUrl={quest.liveUrl} color={quest.color} />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Status badge ─── */
function StatusBadge({ quest }: { quest: typeof QUESTS[0] }) {
  const isActive = quest.status === 'active';
  const badgeColor = isActive ? '#34D399' : '#F59E0B';

  return (
    <Reveal>
      <div style={{
        background: `linear-gradient(135deg, ${badgeColor}08, transparent)`,
        border: `1px solid ${badgeColor}25`,
        borderRadius: 16, padding: '24px 28px',
        display: 'flex', alignItems: 'flex-start', gap: 20,
        backdropFilter: 'blur(10px)',
        boxShadow: `0 0 30px ${badgeColor}08`,
        marginTop: 16,
      }}>
        {/* Animated indicator */}
        <div style={{ position: 'relative', flexShrink: 0, marginTop: 4 }}>
          <div style={{
            width: 12, height: 12, borderRadius: '50%',
            background: badgeColor,
            boxShadow: `0 0 10px ${badgeColor}`,
            animation: 'pulse-glow 2s ease-in-out infinite',
          }} />
          {isActive && (
            <div style={{
              position: 'absolute', inset: -4,
              borderRadius: '50%',
              border: `1px solid ${badgeColor}40`,
              animation: 'ping 1.5s cubic-bezier(0,0,0.2,1) infinite',
            }} />
          )}
        </div>

        <div>
          <div style={{
            fontSize: '0.82rem', color: '#e8eeff',
            fontWeight: 600, fontFamily: 'var(--font-title)',
            letterSpacing: '0.04em', marginBottom: 6,
          }}>
            {isActive ? 'Quest Active — Journey Ongoing' : 'Quest Resting — Will Return'}
          </div>
          <div style={{ fontSize: '0.78rem', color: '#6a7a9a', lineHeight: 1.6 }}>
            {isActive
              ? 'This project is under active development. New chapters are being written.'
              : 'This project is paused. The fighter will return — stronger.'}
          </div>
        </div>

        {/* Status badge pill */}
        <div style={{
          marginLeft: 'auto', flexShrink: 0,
          padding: '5px 14px', borderRadius: 20,
          background: `${badgeColor}15`,
          border: `1px solid ${badgeColor}30`,
          fontSize: '0.65rem', color: badgeColor,
          letterSpacing: '0.15em', fontFamily: 'var(--font-title)',
          whiteSpace: 'nowrap',
        }}>
          {isActive ? '● ACTIVE' : '◉ RESTING'}
        </div>
      </div>
    </Reveal>
  );
}

/* ─── Main page ─── */
export default function QuestPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quest = QUESTS.find(q => q.id === id);

  if (!quest) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
      }}>
        <div style={{ fontFamily: 'var(--font-title)', fontSize: '1.5rem', color: 'var(--muted)' }}>
          World Not Found
        </div>
        <button className="btn-kh" onClick={() => navigate('/')}>Return to Map</button>
      </div>
    );
  }

  return (
    <>
      {/* Extra keyframe animations */}
      <style>{`
        @keyframes blink { 0%,100% { opacity:1 } 50% { opacity:0 } }
        @keyframes ping {
          75%, 100% { transform: scale(2.2); opacity: 0; }
        }
        @keyframes heroFloat {
          0%,100% { transform: translateY(0px) scale(1); }
          50%      { transform: translateY(-10px) scale(1.04); }
        }
        @keyframes orbPulse {
          0%,100% { opacity:0.35; transform: scale(1); }
          50%      { opacity:0.6; transform: scale(1.08); }
        }
      `}</style>

      <div style={{ minHeight: '100vh', animation: 'fadeInUp 0.5s ease' }}>

        {/* ── Hero ── */}
        <div style={{
          position: 'relative', overflow: 'hidden',
          padding: '100px 40px 72px',
          background: `
            radial-gradient(ellipse 70% 80% at 50% -10%, ${quest.glow} 0%, transparent 65%),
            radial-gradient(ellipse 40% 40% at 80% 80%, ${quest.color}10 0%, transparent 60%)
          `,
          borderBottom: `1px solid ${quest.color}18`,
          textAlign: 'center',
        }}>
          {/* Background orb */}
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -60%)',
            width: 400, height: 400,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${quest.color}15 0%, transparent 70%)`,
            animation: 'orbPulse 4s ease-in-out infinite',
            pointerEvents: 'none',
          }} />

          {/* Breadcrumb */}
          <div style={{
            fontSize: '0.68rem', letterSpacing: '0.38em',
            color: 'var(--muted)', marginBottom: 20,
            opacity: 0.7,
          }}>
            {quest.type.toUpperCase()} · {quest.world.toUpperCase()}
          </div>

          {/* Icon */}
          <div style={{
            fontSize: '4.5rem', marginBottom: 20,
            filter: `drop-shadow(0 0 24px ${quest.color})`,
            animation: 'heroFloat 5s ease-in-out infinite',
            display: 'inline-block',
          }}>
            {quest.icon}
          </div>

          {/* Title */}
          <h1 style={{
            fontFamily: 'var(--font-title)',
            fontSize: 'clamp(2rem, 5vw, 3.2rem)',
            color: '#e8eeff', marginBottom: 12,
            textShadow: `0 0 40px ${quest.glow}, 0 2px 0 rgba(0,0,0,0.5)`,
            letterSpacing: '0.04em',
          }}>
            {quest.name}
          </h1>

          {/* Tagline with typewriter */}
          <p style={{
            color: '#6a7aaa', fontSize: '1rem', marginBottom: 28,
            fontStyle: 'italic', letterSpacing: '0.02em',
          }}>
            <TypewriterText text={quest.tagline} delay={400} />
          </p>

          {/* Stack pills */}
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8,
            justifyContent: 'center', marginBottom: 36,
          }}>
            {quest.stack.map(s => (
              <StackPill key={s} name={s} color={quest.color} />
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            {quest.githubUrl && (
              <a href={quest.githubUrl} target="_blank" rel="noreferrer" className="btn-kh">
                VIEW ON GITHUB ↗
              </a>
            )}
            {quest.liveUrl && quest.demoReady && (
              <a href={quest.liveUrl} target="_blank" rel="noreferrer"
                style={{
                  fontFamily: 'var(--font-title)', fontSize: '0.85rem',
                  letterSpacing: '0.1em', padding: '10px 28px', borderRadius: 4,
                  border: `1px solid ${quest.color}`,
                  background: `linear-gradient(135deg, ${quest.color}25, ${quest.color}10)`,
                  color: quest.color, textDecoration: 'none', display: 'inline-block',
                  transition: 'all 0.2s',
                  boxShadow: `0 0 20px ${quest.color}20`,
                }}
              >
                PLAY LIVE ↗
              </a>
            )}
          </div>
        </div>

        {/* ── Back nav ── */}
        <div style={{ padding: '18px 40px 0', maxWidth: 1100, margin: '0 auto' }}>
          <button onClick={() => navigate('/')} style={{
            background: 'none', border: 'none', color: '#4a5a7a', cursor: 'pointer',
            fontSize: '0.75rem', letterSpacing: '0.18em',
            display: 'flex', alignItems: 'center', gap: 8,
            transition: 'color 0.2s',
            fontFamily: 'var(--font-title)',
          }}
            onMouseEnter={e => (e.currentTarget.style.color = quest.color)}
            onMouseLeave={e => (e.currentTarget.style.color = '#4a5a7a')}
          >
            ← WORLD MAP
          </button>
        </div>

        {/* ── Nexus Hub showcase ── */}
        {quest.features.length > 0 && <NexusShowcase quest={quest} />}

        {/* ── Story ── */}
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '60px 40px 88px' }}>
          <Reveal>
            <SectionLabel label="THE STORY" color={quest.color} />
          </Reveal>

          {quest.chapters.map((ch, i) => (
            <ChapterBlock key={i} chapter={ch} index={i} accentColor={quest.color} />
          ))}

          <StatusBadge quest={quest} />
        </div>

      </div>
    </>
  );
}
