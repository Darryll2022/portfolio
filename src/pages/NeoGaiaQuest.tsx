/**
 * Neo Gaia Quest Page — Phase 1
 * Interactive JRPG world map — mobile-first responsive.
 *
 * Phase roadmap:
 *   Phase 1 (live)  : Interactive map, region lore, location tooltips, progress bars
 *   Phase 2         : Browser game — movement, fog of war, quest log
 *   Phase 3         : Combat, inventory, save state
 *   Phase 4         : UE5 vertical slice — Aurelia Prime district
 */
import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── TYPES ────────────────────────────────────────────────────────────────────

type RegionId = 'crown' | 'ironwild' | 'verdant' | 'frostveil' | 'azure' | 'southern';
type LocationType = 'town' | 'dungeon' | 'shrine' | 'observatory' | 'fortress' | 'crystal' | 'questboard';

interface Location {
  id: string;
  name: string;
  type: LocationType;
  x: number; // % of map width
  y: number; // % of map height
  region: RegionId;
  desc: string;
  status: 'active' | 'locked' | 'hidden';
}

interface Region {
  id: RegionId;
  name: string;
  subtitle: string;
  biome: string;
  color: string;
  glow: string;
  progress: number;
  lore: string;
  status: 'active' | 'locked' | 'hidden';
  polygon: string; // SVG points in 1000×600 viewBox
}

// ─── DATA ─────────────────────────────────────────────────────────────────────

const REGIONS: Region[] = [
  {
    id: 'crown',
    name: 'The Crown Dominion',
    subtitle: 'CENTRAL REGION',
    biome: 'Urban Arcane',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.35)',
    progress: 45,
    lore: 'The seat of power at the heart of Neo Gaia. A towering city-state where arcane guilds and merchant lords vie for dominance. Built upon the ruins of the Old Citadel, its spires pierce the perpetual smog. Aurelia Prime — the capital — pulses with mako energy and political intrigue.',
    status: 'active',
    polygon: '430,220 520,210 570,260 560,340 530,390 490,420 450,420 410,390 390,340 390,260',
  },
  {
    id: 'ironwild',
    name: 'Ironwild Frontier',
    subtitle: 'WEST REGION',
    biome: 'Scorched Desert',
    color: '#EF4444',
    glow: 'rgba(239,68,68,0.35)',
    progress: 26,
    lore: 'A vast expanse of crumbling refineries and rusted megaforges. The Ironwild is a lawless frontier where scavenger clans scratch out survival among the ruins of the old industrial empire. The Ferrum Bastion still stands — but barely.',
    status: 'active',
    polygon: '200,240 370,220 390,260 390,340 380,420 340,460 280,470 200,440 150,380 160,300',
  },
  {
    id: 'verdant',
    name: 'Verdant Bloom',
    subtitle: 'NORTH-EAST REGION',
    biome: 'Ancient Forest',
    color: '#22C55E',
    glow: 'rgba(34,197,94,0.35)',
    progress: 38,
    lore: 'A primordial jungle kingdom where nature has reclaimed what civilization abandoned. Ancient spirits walk among the trees of the Sengkang Wilds. The Bloomheart Conservatory is the last refuge of the old druidic order.',
    status: 'active',
    polygon: '560,120 680,100 760,150 780,240 740,300 680,320 600,310 560,270 530,220 540,160',
  },
  {
    id: 'frostveil',
    name: 'Frostveil Barrens',
    subtitle: 'NORTH REGION',
    biome: 'Frozen Tundra',
    color: '#38BDF8',
    glow: 'rgba(56,189,248,0.35)',
    progress: 30,
    lore: 'A land of perpetual winter and ancient ice. The Frostveil Citadel crowns the tallest peak in Neo Gaia. Here, the Mandai Observatory watches the stars for omens of the next great thaw — and what it might unleash.',
    status: 'active',
    polygon: '380,80 430,60 530,50 600,70 620,120 560,120 540,160 530,220 520,210 430,220 390,190 360,150',
  },
  {
    id: 'azure',
    name: 'Azure Coastlands',
    subtitle: 'EAST REGION',
    biome: 'Industrial Coast',
    color: '#818CF8',
    glow: 'rgba(129,140,248,0.35)',
    progress: 33,
    lore: 'A fortified coastal empire of steel and salt. The Azure navy controls all eastern trade routes from the Changi Lighthouse. The Leviathan Shrine marks where the great sea beast was last seen — and where the Junon Naval Fortress keeps eternal watch.',
    status: 'active',
    polygon: '740,300 800,260 860,280 880,360 860,440 820,480 760,490 700,470 680,420 680,340',
  },
  {
    id: 'southern',
    name: 'Southern Isles',
    subtitle: 'HIDDEN REGION',
    biome: 'Sunken Ruins',
    color: '#A78BFA',
    glow: 'rgba(167,139,250,0.25)',
    progress: 0,
    lore: 'A chain of islands cloaked in mystery. Half the Isles lie beneath dark waters. Sentosa Haven appears peaceful — but Lazarus Sanctum beneath it holds secrets that could unravel the entire realm.',
    status: 'hidden',
    polygon: '400,500 480,490 560,510 600,560 560,600 480,610 400,595 360,560 370,520',
  },
];

const LOCATIONS: Location[] = [
  { id: 'aurelia',       name: 'Aurelia Prime',          type: 'town',       x: 47.5, y: 51,   region: 'crown',    desc: 'Capital of Neo Gaia. The political heart of all five kingdoms.',                      status: 'active' },
  { id: 'orchard',       name: 'Orchard Heights',        type: 'town',       x: 42,   y: 40,   region: 'crown',    desc: 'The merchant district. Arcane markets and guild halls.',                              status: 'active' },
  { id: 'queens',        name: 'Queenstown Ward',         type: 'town',       x: 43,   y: 58,   region: 'crown',    desc: 'A residential district with deep ties to the old resistance.',                        status: 'active' },
  { id: 'marina',        name: 'Marina Spire',            type: 'crystal',    x: 50,   y: 67,   region: 'crown',    desc: 'Fast Travel Crystal — connects to all major crystals across Neo Gaia.',               status: 'active' },
  { id: 'downtown',      name: 'Downtown Core',           type: 'questboard', x: 57,   y: 57,   region: 'crown',    desc: 'Quest Board — pick up contracts from across the realm.',                              status: 'active' },
  { id: 'ferrum',        name: 'Ferrum Bastion',          type: 'fortress',   x: 28,   y: 58,   region: 'ironwild', desc: 'The last standing fortress of the western frontier.',                                 status: 'active' },
  { id: 'tuas',          name: 'Tuas Megaforge',          type: 'dungeon',    x: 16,   y: 43,   region: 'ironwild', desc: 'Dungeon — a rusted labyrinth of old industrial machinery.',                           status: 'active' },
  { id: 'jurong',        name: 'Jurong Wastes',           type: 'dungeon',    x: 21,   y: 60,   region: 'ironwild', desc: 'Dungeon — scavengers roam these irradiated lowlands.',                               status: 'active' },
  { id: 'tengah',        name: 'Tengah Outpost',          type: 'town',       x: 36,   y: 33,   region: 'ironwild', desc: 'A frontier outpost and resupply hub for western travellers.',                        status: 'active' },
  { id: 'bloomheart',    name: 'Bloomheart Conservatory', type: 'shrine',     x: 72,   y: 38,   region: 'verdant',  desc: 'Summon Shrine — the last refuge of the druidic order.',                              status: 'active' },
  { id: 'sengkang',      name: 'Sengkang Wilds',          type: 'dungeon',    x: 66,   y: 46,   region: 'verdant',  desc: 'Dungeon — ancient spirits are restless here.',                                        status: 'active' },
  { id: 'hougang',       name: 'Hougang Gardens',         type: 'town',       x: 72,   y: 52,   region: 'verdant',  desc: 'A hidden settlement deep within the Verdant Bloom.',                                 status: 'active' },
  { id: 'punggol',       name: 'Punggol Promenade',       type: 'town',       x: 82,   y: 22,   region: 'verdant',  desc: 'Coastal town at the north-eastern tip of the realm.',                               status: 'active' },
  { id: 'seletar',       name: 'Seletar Skyfields',       type: 'observatory', x: 76,  y: 16,   region: 'verdant',  desc: 'Sky platform used for aerial scouting by the Verdant order.',                       status: 'active' },
  { id: 'frostveil-c',   name: 'Frostveil Citadel',       type: 'fortress',   x: 48,   y: 8,    region: 'frostveil',desc: 'The frozen seat of the northern warlords.',                                          status: 'active' },
  { id: 'mandai',        name: 'Mandai Observatory',      type: 'observatory', x: 58,  y: 18,   region: 'frostveil',desc: 'Star-watching tower — reads omens in the northern lights.',                          status: 'active' },
  { id: 'woodlands',     name: 'Woodlands Bastion',       type: 'town',       x: 33,   y: 27,   region: 'frostveil',desc: 'Northern gateway town — first stop before the Barrens.',                             status: 'active' },
  { id: 'yishun',        name: 'Yishun Depths',           type: 'dungeon',    x: 47,   y: 28,   region: 'frostveil',desc: 'Dungeon — a network of frozen underground caverns.',                                  status: 'active' },
  { id: 'changi',        name: 'Changi Lighthouse',       type: 'crystal',    x: 87,   y: 46,   region: 'azure',    desc: 'Fast Travel Crystal — beacon of the eastern coast.',                                 status: 'active' },
  { id: 'leviathan',     name: 'Leviathan Shrine',        type: 'shrine',     x: 80,   y: 60,   region: 'azure',    desc: 'Summon Shrine — where the great sea beast was last sighted.',                        status: 'active' },
  { id: 'junon',         name: 'Junon Naval Fortress',    type: 'fortress',   x: 84,   y: 70,   region: 'azure',    desc: 'Azure naval HQ — controls all eastern shipping lanes.',                              status: 'active' },
  { id: 'pasir',         name: 'Pasir Ris Shoreline',     type: 'town',       x: 78,   y: 53,   region: 'azure',    desc: 'A quiet shoreline town — deceptively peaceful.',                                     status: 'active' },
  { id: 'sentosa',       name: 'Sentosa Haven',           type: 'town',       x: 42,   y: 78,   region: 'southern', desc: 'The only "safe" island in the Southern chain. Or so they say.',                     status: 'hidden' },
  { id: 'lazarus',       name: 'Lazarus Sanctum',         type: 'dungeon',    x: 51,   y: 82,   region: 'southern', desc: 'Dungeon — a flooded ruin hiding the realm\'s deepest secret.',                      status: 'hidden' },
  { id: 'stjohns',       name: "St. John's Refuge",       type: 'town',       x: 60,   y: 79,   region: 'southern', desc: 'A hermit settlement — the inhabitants have not left in years.',                     status: 'hidden' },
];

const TYPE_ICONS: Record<LocationType, string> = {
  town: '🏰', dungeon: '💀', shrine: '🔮',
  observatory: '🔭', fortress: '⚔️', crystal: '💎', questboard: '📋',
};

const TYPE_COLORS: Record<LocationType, string> = {
  town: '#F59E0B', dungeon: '#EF4444', shrine: '#A78BFA',
  observatory: '#38BDF8', fortress: '#94A3B8', crystal: '#22D3EE', questboard: '#22C55E',
};

// ─── HOOKS ────────────────────────────────────────────────────────────────────

function useIsMobile() {
  const [mobile, setMobile] = useState(window.innerWidth < 640);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 640);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

// ─── COMPASS ─────────────────────────────────────────────────────────────────

function CompassRose({ size = 56 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="28" cy="28" r="26" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.4" />
      <circle cx="28" cy="28" r="4" fill="#F59E0B" fillOpacity="0.9" />
      <polygon points="28,4 24,22 32,22" fill="#F59E0B" />
      <polygon points="28,52 24,34 32,34" fill="#94A3B8" fillOpacity="0.6" />
      <polygon points="52,28 34,24 34,32" fill="#94A3B8" fillOpacity="0.5" />
      <polygon points="4,28 22,24 22,32" fill="#94A3B8" fillOpacity="0.5" />
      <text x="28" y="16" textAnchor="middle" fontSize="7" fill="#F59E0B" fontWeight="bold" fontFamily="Cinzel,serif">N</text>
    </svg>
  );
}

// ─── REGION PROGRESS ─────────────────────────────────────────────────────────

function RegionProgressPanel({ regions, mobile }: { regions: Region[]; mobile: boolean }) {
  if (mobile) {
    // Mobile: horizontal scrolling pill row below map
    return (
      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'flex', gap: 8, minWidth: 'max-content', padding: '4px 2px' }}>
          {regions.map(r => (
            <div key={r.id} style={{
              background: 'rgba(4,6,26,0.88)',
              border: `1px solid ${r.color}30`,
              borderRadius: 8, padding: '6px 10px',
              minWidth: 110,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: '0.55rem', color: r.status === 'hidden' ? '#6B7280' : '#9CA3AF', whiteSpace: 'nowrap' }}>
                  {r.name.split(' ').slice(0, 2).join(' ')}
                </span>
                <span style={{ fontSize: '0.55rem', color: r.color, fontWeight: 700, marginLeft: 4 }}>
                  {r.status === 'hidden' ? '??' : r.progress}%
                </span>
              </div>
              <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
                <div style={{
                  height: '100%', borderRadius: 2,
                  width: r.status === 'hidden' ? '0%' : `${r.progress}%`,
                  background: `linear-gradient(90deg, ${r.color}, ${r.color}60)`,
                  transition: 'width 1.2s ease',
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop: absolute overlay bottom-left
  return (
    <div style={{
      position: 'absolute', bottom: 12, left: 14,
      background: 'rgba(4,6,26,0.88)',
      border: '1px solid rgba(245,158,11,0.25)',
      borderRadius: 10, padding: '10px 14px',
      backdropFilter: 'blur(8px)',
      minWidth: 178,
    }}>
      <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#F59E0B', fontFamily: 'var(--font-title)', marginBottom: 8 }}>
        REGION PROGRESS
      </p>
      {regions.map(r => (
        <div key={r.id} style={{ marginBottom: 5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <span style={{ fontSize: '0.58rem', color: r.status === 'hidden' ? '#6B7280' : '#9CA3AF' }}>{r.name}</span>
            <span style={{ fontSize: '0.58rem', color: r.color, fontWeight: 700 }}>
              {r.status === 'hidden' ? '??%' : `${r.progress}%`}
            </span>
          </div>
          <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 2,
              width: r.status === 'hidden' ? '0%' : `${r.progress}%`,
              background: `linear-gradient(90deg, ${r.color}, ${r.color}88)`,
              transition: 'width 1.2s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── MAP LEGEND ───────────────────────────────────────────────────────────────

function MapLegend({ mobile }: { mobile: boolean }) {
  const items: [LocationType, string][] = [
    ['town', 'Town'], ['dungeon', 'Dungeon'], ['shrine', 'Shrine'],
    ['crystal', 'Fast Travel'], ['observatory', 'Observatory'],
    ['fortress', 'Fortress'], ['questboard', 'Quest Board'],
  ];

  if (mobile) {
    // Mobile: horizontal icon-only row
    return (
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 6,
        padding: '8px 0 2px',
      }}>
        {items.map(([type, label]) => (
          <div key={type} style={{
            display: 'flex', alignItems: 'center', gap: 4,
            background: 'rgba(4,6,26,0.7)',
            border: `1px solid ${TYPE_COLORS[type]}25`,
            borderRadius: 6, padding: '3px 7px',
          }}>
            <span style={{ fontSize: '0.7rem' }}>{TYPE_ICONS[type]}</span>
            <span style={{ fontSize: '0.5rem', color: '#6B7280' }}>{label}</span>
          </div>
        ))}
      </div>
    );
  }

  // Desktop: absolute overlay top-left
  return (
    <div style={{
      position: 'absolute', top: 12, left: 14,
      background: 'rgba(4,6,26,0.88)',
      border: '1px solid rgba(245,158,11,0.25)',
      borderRadius: 10, padding: '10px 14px',
      backdropFilter: 'blur(8px)',
    }}>
      <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#F59E0B', fontFamily: 'var(--font-title)', marginBottom: 8 }}>
        LEGEND
      </p>
      {items.map(([type, label]) => (
        <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: '0.7rem' }}>{TYPE_ICONS[type]}</span>
          <span style={{ fontSize: '0.58rem', color: '#9CA3AF' }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── TOOLTIP ─────────────────────────────────────────────────────────────────

function LocationTooltip({ location, x, y, mobile }: {
  location: Location; x: number; y: number; mobile: boolean;
}) {
  const color = TYPE_COLORS[location.type];

  if (mobile) {
    // Mobile: fixed bottom bar instead of floating tooltip
    return (
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(4,6,26,0.97)',
        borderTop: `2px solid ${color}60`,
        padding: '12px 20px 20px',
        backdropFilter: 'blur(16px)',
        display: 'flex', alignItems: 'flex-start', gap: 12,
      }}>
        <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{TYPE_ICONS[location.type]}</span>
        <div>
          <p style={{ fontSize: '0.85rem', color, fontFamily: 'var(--font-title)', letterSpacing: '0.06em', marginBottom: 4 }}>
            {location.name}
          </p>
          <p style={{ fontSize: '0.72rem', color: '#9CA3AF', lineHeight: 1.6 }}>{location.desc}</p>
          <p style={{ fontSize: '0.55rem', letterSpacing: '0.15em', color, opacity: 0.6, marginTop: 4 }}>
            {location.type.toUpperCase()} · TAP ELSEWHERE TO DISMISS
          </p>
        </div>
      </div>
    );
  }

  // Desktop: floating tooltip
  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`, top: `${y}%`,
      transform: 'translate(-50%, -120%)',
      background: 'rgba(4,6,26,0.97)',
      border: `1px solid ${color}50`,
      borderRadius: 10, padding: '10px 14px',
      minWidth: 180, maxWidth: 240,
      pointerEvents: 'none', zIndex: 30,
      boxShadow: `0 0 24px ${color}30, 0 8px 32px rgba(0,0,0,0.7)`,
      backdropFilter: 'blur(12px)',
    }}>
      <div style={{ position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
        borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
        borderTop: `6px solid ${color}50`,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: '1rem' }}>{TYPE_ICONS[location.type]}</span>
        <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-title)', color, letterSpacing: '0.05em' }}>
          {location.name}
        </span>
      </div>
      <p style={{ fontSize: '0.68rem', color: '#9CA3AF', lineHeight: 1.6 }}>{location.desc}</p>
      <div style={{ marginTop: 6, fontSize: '0.55rem', letterSpacing: '0.15em', color, opacity: 0.6 }}>
        {location.type.toUpperCase()}
      </div>
    </div>
  );
}

// ─── REGION DETAIL PANEL ─────────────────────────────────────────────────────

function RegionDetailPanel({ region, onClose, mobile }: {
  region: Region; onClose: () => void; mobile: boolean;
}) {
  const locations = LOCATIONS.filter(l => l.region === region.id);

  if (mobile) {
    // Mobile: slide-up modal overlay
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 60,
        background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'flex-end',
      }} onClick={onClose}>
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%',
            background: 'linear-gradient(to top, #04061a, #080d2e)',
            borderTop: `2px solid ${region.color}60`,
            borderRadius: '20px 20px 0 0',
            padding: '20px 20px 32px',
            maxHeight: '80vh',
            overflowY: 'auto',
            animation: 'slideUp 0.3s ease',
          }}
        >
          {/* Drag handle */}
          <div style={{
            width: 40, height: 4, borderRadius: 2,
            background: 'rgba(255,255,255,0.15)',
            margin: '0 auto 16px',
          }} />

          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
              <p style={{ fontSize: '0.55rem', letterSpacing: '0.2em', color: region.color, marginBottom: 4, opacity: 0.8 }}>
                {region.subtitle} · {region.biome}
              </p>
              <h2 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-title)', color: region.color,
                letterSpacing: '0.08em', textShadow: `0 0 20px ${region.glow}` }}>
                {region.name}
              </h2>
            </div>
            <button onClick={onClose} style={{
              background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8, color: '#9CA3AF', fontSize: '1rem',
              width: 32, height: 32, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>✕</button>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ fontSize: '0.6rem', color: '#6B7280', letterSpacing: '0.1em' }}>COMPLETION</span>
              <span style={{ fontSize: '0.6rem', color: region.color, fontWeight: 700 }}>
                {region.status === 'hidden' ? '??%' : `${region.progress}%`}
              </span>
            </div>
            <div style={{ height: 5, borderRadius: 4, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 4,
                width: region.status === 'hidden' ? '0%' : `${region.progress}%`,
                background: `linear-gradient(90deg, ${region.color}, ${region.color}60)`,
                boxShadow: `0 0 8px ${region.color}40`,
              }} />
            </div>
          </div>

          {/* Lore */}
          <p style={{
            fontSize: '0.8rem', color: '#9CA3AF', lineHeight: 1.9, marginBottom: 16,
            borderLeft: `2px solid ${region.color}40`, paddingLeft: 12,
          }}>
            {region.status === 'hidden'
              ? '⚠️ Region data classified. Complete the Southern questline to unlock.'
              : region.lore}
          </p>

          {/* Locations */}
          {region.status !== 'hidden' && (
            <div>
              <p style={{ fontSize: '0.55rem', letterSpacing: '0.2em', color: '#6B7280', fontFamily: 'var(--font-title)', marginBottom: 8 }}>
                KNOWN LOCATIONS
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {locations.map(loc => (
                  <div key={loc.id} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    background: 'rgba(255,255,255,0.04)',
                    border: `1px solid ${TYPE_COLORS[loc.type]}25`,
                    borderRadius: 8, padding: '4px 9px',
                  }}>
                    <span style={{ fontSize: '0.7rem' }}>{TYPE_ICONS[loc.type]}</span>
                    <span style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>{loc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Desktop: inline panel below map
  return (
    <div style={{
      border: `1px solid ${region.color}40`,
      borderRadius: 16,
      background: 'linear-gradient(135deg, rgba(4,6,26,0.97), rgba(8,13,46,0.9))',
      padding: '24px 28px',
      backdropFilter: 'blur(16px)',
      boxShadow: `0 0 60px ${region.glow}, 0 24px 80px rgba(0,0,0,0.7)`,
      position: 'relative', overflow: 'hidden',
      animation: 'fadeUp 0.4s ease',
    }}>
      <div style={{
        position: 'absolute', top: 0, right: 0, width: 200, height: 200,
        background: `radial-gradient(circle at top right, ${region.color}15, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: region.color, fontFamily: 'var(--font-title)', marginBottom: 4, opacity: 0.8 }}>
            {region.subtitle} · {region.biome}
          </p>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-title)', color: region.color,
            letterSpacing: '0.08em', textShadow: `0 0 30px ${region.glow}` }}>
            {region.name}
          </h2>
        </div>
        <button onClick={onClose} style={{
          background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 8, color: '#9CA3AF', fontSize: '1rem',
          width: 32, height: 32, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>✕</button>
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
          <span style={{ fontSize: '0.65rem', color: '#6B7280', letterSpacing: '0.1em' }}>COMPLETION</span>
          <span style={{ fontSize: '0.65rem', color: region.color, fontWeight: 700 }}>
            {region.status === 'hidden' ? '??%' : `${region.progress}%`}
          </span>
        </div>
        <div style={{ height: 6, borderRadius: 4, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 4,
            width: region.status === 'hidden' ? '0%' : `${region.progress}%`,
            background: `linear-gradient(90deg, ${region.color}, ${region.color}60)`,
            boxShadow: `0 0 10px ${region.color}50`,
          }} />
        </div>
      </div>

      <p style={{
        fontSize: '0.82rem', color: '#9CA3AF', lineHeight: 1.9, marginBottom: 20,
        borderLeft: `2px solid ${region.color}40`, paddingLeft: 14,
      }}>
        {region.status === 'hidden'
          ? '⚠️ Region data classified. Complete the Southern questline to unlock.'
          : region.lore}
      </p>

      {region.status !== 'hidden' && (
        <div>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: '#6B7280', fontFamily: 'var(--font-title)', marginBottom: 10 }}>
            KNOWN LOCATIONS
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {locations.map(loc => (
              <div key={loc.id} style={{
                display: 'flex', alignItems: 'center', gap: 5,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${TYPE_COLORS[loc.type]}25`,
                borderRadius: 8, padding: '5px 10px',
              }}>
                <span style={{ fontSize: '0.75rem' }}>{TYPE_ICONS[loc.type]}</span>
                <span style={{ fontSize: '0.68rem', color: '#9CA3AF' }}>{loc.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SVG MAP ─────────────────────────────────────────────────────────────────

function WorldMapSVG({
  activeRegion, setActiveRegion,
  hoveredLocation, setHoveredLocation,
  mobile,
}: {
  activeRegion: RegionId | null;
  setActiveRegion: (r: RegionId | null) => void;
  hoveredLocation: Location | null;
  setHoveredLocation: (l: Location | null) => void;
  mobile: boolean;
}) {
  const handleLocationInteract = useCallback((loc: Location) => {
    if (mobile) {
      // On mobile, tap toggles the bottom sheet
      setHoveredLocation(hoveredLocation?.id === loc.id ? null : loc);
    }
  }, [mobile, hoveredLocation, setHoveredLocation]);

  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: '60%' }}>
      <svg
        viewBox="0 0 1000 600"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
        xmlns="http://www.w3.org/2000/svg"
        // Mobile: tap anywhere on map to dismiss location tooltip
        onClick={mobile ? () => setHoveredLocation(null) : undefined}
      >
        <defs>
          <radialGradient id="oceanGrad" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#0c1a3a" />
            <stop offset="100%" stopColor="#040914" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="softglow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <rect width="1000" height="600" fill="url(#oceanGrad)" />

        {/* Grid lines */}
        {[...Array(10)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 60} x2="1000" y2={i * 60}
            stroke="#1a2a4a" strokeWidth="0.5" strokeOpacity="0.4" />
        ))}
        {[...Array(17)].map((_, i) => (
          <line key={`v${i}`} x1={i * 60} y1="0" x2={i * 60} y2="600"
            stroke="#1a2a4a" strokeWidth="0.5" strokeOpacity="0.4" />
        ))}

        {/* Region polygons */}
        {REGIONS.map(region => {
          const isActive = activeRegion === region.id;
          const isHidden = region.status === 'hidden';
          const pts = region.polygon.split(' ').map(p => p.split(',').map(Number));
          const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
          const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
          return (
            <g key={region.id}>
              {isActive && (
                <polygon points={region.polygon} fill={region.color} fillOpacity="0.15" filter="url(#softglow)" />
              )}
              <polygon
                points={region.polygon}
                fill={isHidden ? '#1a0a2e' : isActive ? `${region.color}22` : `${region.color}0d`}
                stroke={region.color}
                strokeWidth={isActive ? 2 : 1}
                strokeOpacity={isHidden ? 0.5 : isActive ? 0.9 : 0.45}
                strokeDasharray={isHidden ? '8 4' : undefined}
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={e => { e.stopPropagation(); setActiveRegion(isActive ? null : region.id); }}
                onMouseEnter={mobile ? undefined : () => !isActive && setActiveRegion(region.id)}
              />
              <text x={cx} y={cy - 4} textAnchor="middle"
                fontSize={mobile ? 10 : 13} fontFamily="Cinzel,serif"
                fill={region.color} fillOpacity={isActive ? 1 : 0.75}
                fontWeight="bold" style={{ pointerEvents: 'none', userSelect: 'none' }}>
                {mobile ? region.name.split(' ').slice(-1)[0] : region.name.toUpperCase()}
              </text>
              {!mobile && (
                <text x={cx} y={cy + 10} textAnchor="middle"
                  fontSize="8" fontFamily="Cinzel,serif"
                  fill={region.color} fillOpacity="0.5"
                  style={{ pointerEvents: 'none', userSelect: 'none' }}>
                  ({region.subtitle})
                </text>
              )}
            </g>
          );
        })}

        {/* MRT Crystal Lines */}
        <g strokeDasharray="6 3" strokeOpacity="0.35" fill="none">
          <path d="M 475,510 Q 600,490 780,460" stroke="#22D3EE" strokeWidth="1.2" />
          <path d="M 390,340 Q 300,340 280,470" stroke="#F59E0B" strokeWidth="1.2" />
          <path d="M 460,220 Q 460,160 480,80" stroke="#38BDF8" strokeWidth="1.2" />
          <path d="M 590,80 Q 620,100 620,110" stroke="#38BDF8" strokeWidth="1.2" />
        </g>

        {/* Location nodes */}
        {LOCATIONS.map(loc => {
          const x = (loc.x / 100) * 1000;
          const y = (loc.y / 100) * 600;
          const isHidden = loc.status === 'hidden';
          const color = isHidden ? '#A78BFA' : TYPE_COLORS[loc.type];
          const isHovered = hoveredLocation?.id === loc.id;
          const nodeR = mobile ? 6 : (isHovered ? 7 : 5);

          return (
            <g
              key={loc.id}
              transform={`translate(${x},${y})`}
              style={{ cursor: 'pointer' }}
              onClick={e => { e.stopPropagation(); handleLocationInteract(loc); }}
              onMouseEnter={mobile ? undefined : () => setHoveredLocation(loc)}
              onMouseLeave={mobile ? undefined : () => setHoveredLocation(null)}
            >
              {isHovered && (
                <circle r="14" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5">
                  <animate attributeName="r" from="10" to="20" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="1s" repeatCount="indefinite" />
                </circle>
              )}
              <circle r={nodeR} fill={color} fillOpacity={isHidden ? 0.4 : 0.9}
                stroke="#04061a" strokeWidth="1.5"
                filter={isHovered ? 'url(#glow)' : undefined}
                style={{ transition: 'r 0.2s ease' }}
              />
              <text textAnchor="middle" dominantBaseline="middle"
                fontSize={mobile ? 8 : 7}
                style={{ pointerEvents: 'none', userSelect: 'none' }}>
                {isHidden ? '?' : TYPE_ICONS[loc.type]}
              </text>
            </g>
          );
        })}

        {/* Player marker — Aurelia Prime */}
        <g transform="translate(475,306)">
          <polygon points="0,-11 8,5 -8,5" fill="#F59E0B" stroke="#04061a" strokeWidth="1.5" filter="url(#glow)" />
        </g>
      </svg>

      {/* Desktop overlays */}
      {!mobile && (
        <>
          <MapLegend mobile={false} />
          <div style={{ position: 'absolute', top: 12, right: 14, opacity: 0.7, pointerEvents: 'none' }}>
            <CompassRose size={56} />
          </div>
          <RegionProgressPanel regions={REGIONS} mobile={false} />
          {hoveredLocation && (
            <LocationTooltip
              location={hoveredLocation}
              x={hoveredLocation.x}
              y={hoveredLocation.y}
              mobile={false}
            />
          )}
        </>
      )}

      {/* Mobile compass — top right, small */}
      {mobile && (
        <div style={{ position: 'absolute', top: 6, right: 6, opacity: 0.6, pointerEvents: 'none' }}>
          <CompassRose size={36} />
        </div>
      )}
    </div>
  );
}

// ─── PHASE ROADMAP ────────────────────────────────────────────────────────────

const PHASES = [
  { phase: 'Phase 1', label: 'Interactive World Bible', status: 'live',    color: '#22C55E',
    detail: 'Clickable SVG map, region lore, 24 location nodes, progress tracking. Live now.' },
  { phase: 'Phase 2', label: 'Browser Map Game',        status: 'planned', color: '#F59E0B',
    detail: 'Character movement, fog of war, quest log, encounter triggers. Built in TypeScript + Canvas.' },
  { phase: 'Phase 3', label: 'Combat & Save State',     status: 'planned', color: '#EF4444',
    detail: 'Turn-based encounters, inventory, persistent save via localStorage.' },
  { phase: 'Phase 4', label: 'UE5 Vertical Slice',      status: 'vision',  color: '#818CF8',
    detail: 'Aurelia Prime district built in Unreal Engine 5 using real Singapore GeoJSON data. Lumen + Nanite + World Partition.' },
];

function PhaseRoadmap({ mobile }: { mobile: boolean }) {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {PHASES.map((p, i) => {
        const isOpen = expanded === i;
        return (
          <div
            key={p.phase}
            onClick={() => setExpanded(isOpen ? null : i)}
            style={{
              background: isOpen ? `rgba(${p.color === '#22C55E' ? '34,197,94' : p.color === '#F59E0B' ? '245,158,11' : p.color === '#EF4444' ? '239,68,68' : '129,140,248'},0.07)` : 'rgba(255,255,255,0.03)',
              border: `1px solid ${p.color}${isOpen ? '50' : '20'}`,
              borderRadius: 12, padding: '12px 16px',
              cursor: 'pointer', transition: 'all 0.25s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 9, height: 9, borderRadius: '50%', flexShrink: 0,
                background: p.color,
                boxShadow: p.status === 'live' ? `0 0 10px ${p.color}` : 'none',
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.7rem', color: p.color, fontFamily: 'var(--font-title)', letterSpacing: '0.1em' }}>
                    {p.phase}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#D1D5DB' }}>{p.label}</span>
                </div>
              </div>
              {p.status === 'live' && (
                <span style={{
                  fontSize: '0.5rem', letterSpacing: '0.18em', color: '#22C55E',
                  border: '1px solid #22C55E40', borderRadius: 20, padding: '2px 7px',
                  flexShrink: 0,
                }}>LIVE</span>
              )}
              {p.status === 'vision' && (
                <span style={{
                  fontSize: '0.5rem', letterSpacing: '0.15em', color: '#818CF8',
                  border: '1px solid #818CF840', borderRadius: 20, padding: '2px 7px',
                  flexShrink: 0,
                }}>UE5</span>
              )}
              <span style={{ color: '#4B5563', fontSize: '0.7rem', transition: 'transform 0.2s',
                transform: isOpen ? 'rotate(90deg)' : 'none' }}>›</span>
            </div>

            {/* Expandable detail */}
            <div style={{
              overflow: 'hidden', maxHeight: isOpen ? '120px' : '0',
              transition: 'max-height 0.35s cubic-bezier(0.4,0,0.2,1)',
            }}>
              <p style={{
                fontSize: '0.75rem', color: '#6B7280', lineHeight: 1.7,
                marginTop: 10, paddingTop: 10,
                borderTop: `1px solid ${p.color}20`,
              }}>
                {p.detail}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── UE5 TECH STACK SECTION ───────────────────────────────────────────────────

function TechStackSection({ mobile }: { mobile: boolean }) {
  const stack = [
    { layer: 'Engine',      tech: 'Unreal Engine 5',          note: 'Lumen · Nanite · World Partition' },
    { layer: 'Code',        tech: 'C++ + Blueprints',         note: 'Core systems + rapid iteration' },
    { layer: 'Terrain',     tech: 'GeoJSON → GDAL → UE5',     note: 'Real Singapore spatial data' },
    { layer: 'Backend',     tech: 'NestJS + PostgreSQL',       note: 'PostGIS for spatial queries' },
    { layer: 'Realtime',    tech: 'Socket.IO',                 note: 'Future multiplayer layer' },
    { layer: 'AI Pipeline', tech: 'Midjourney + Meshy + EL',  note: 'Concept · 3D assets · Voice' },
    { layer: 'Infra',       tech: 'DigitalOcean + Cloudflare', note: 'R2 asset storage · CDN' },
  ];

  return (
    <div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: mobile ? '1fr' : '1fr 1fr',
        gap: 8,
      }}>
        {stack.map(s => (
          <div key={s.layer} style={{
            display: 'flex', gap: 12, alignItems: 'flex-start',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(129,140,248,0.15)',
            borderRadius: 10, padding: '10px 14px',
          }}>
            <span style={{
              fontSize: '0.55rem', letterSpacing: '0.15em',
              color: '#818CF8', fontFamily: 'var(--font-title)',
              minWidth: 56, paddingTop: 2, opacity: 0.8,
            }}>{s.layer.toUpperCase()}</span>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#E5E7EB', fontWeight: 600, marginBottom: 2 }}>{s.tech}</p>
              <p style={{ fontSize: '0.65rem', color: '#6B7280' }}>{s.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MVP advice callout */}
      <div style={{
        marginTop: 14,
        background: 'rgba(245,158,11,0.07)',
        border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: 10, padding: '12px 16px',
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚔️</span>
        <p style={{ fontSize: '0.75rem', color: '#9CA3AF', lineHeight: 1.7 }}>
          <strong style={{ color: '#F59E0B' }}>MVP principle:</strong>{' '}
          One unforgettable region beats a half-built world. Build Aurelia Prime first.
          Get the traversal, atmosphere, and combat loop right — then expand outward.
          A strong 20–30 minute vertical slice is enough to validate the whole game concept.
        </p>
      </div>
    </div>
  );
}

// ─── PAGE ROOT ────────────────────────────────────────────────────────────────

export default function NeoGaiaQuest() {
  const navigate = useNavigate();
  const mobile = useIsMobile();
  const [activeRegion, setActiveRegion] = useState<RegionId | null>(null);
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMapLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  const region = REGIONS.find(r => r.id === activeRegion) ?? null;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--midnight)',
      color: 'var(--star-white)',
      fontFamily: 'var(--font-body)',
      position: 'relative',
      // Prevent horizontal scroll on mobile
      overflowX: 'hidden',
    }}>

      {/* Back nav */}
      <div style={{ position: 'fixed', top: mobile ? 12 : 20, left: mobile ? 12 : 24, zIndex: 100 }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(4,6,26,0.85)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 10, padding: mobile ? '7px 12px' : '8px 16px',
            color: '#F59E0B', fontSize: mobile ? '0.65rem' : '0.75rem',
            fontFamily: 'var(--font-title)', letterSpacing: '0.12em',
            cursor: 'pointer', backdropFilter: 'blur(8px)',
          }}
        >
          ← MAP
        </button>
      </div>

      {/* ── HERO ── */}
      <div style={{
        paddingTop: mobile ? 64 : 80, paddingBottom: mobile ? 20 : 32,
        textAlign: 'center',
        background: 'linear-gradient(to bottom, rgba(8,13,46,0.6), transparent)',
        padding: `${mobile ? 64 : 80}px 20px ${mobile ? 20 : 32}px`,
      }}>
        <div style={{
          width: mobile ? 52 : 64, height: mobile ? 52 : 64, borderRadius: '50%',
          border: '2px solid rgba(245,158,11,0.5)',
          background: 'rgba(245,158,11,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px',
          boxShadow: '0 0 40px rgba(245,158,11,0.25)',
        }}>
          <span style={{
            fontFamily: 'var(--font-title)', color: '#F59E0B',
            fontSize: mobile ? '0.9rem' : '1.1rem', fontWeight: 900, letterSpacing: '0.1em',
          }}>NG</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-title)',
          fontSize: mobile ? '2rem' : 'clamp(2rem, 6vw, 3.5rem)',
          color: '#F59E0B', letterSpacing: '0.18em',
          textShadow: '0 0 60px rgba(245,158,11,0.5)',
          marginBottom: 8,
        }}>NEO GAIA</h1>

        <p style={{
          fontSize: mobile ? '0.75rem' : '0.85rem',
          color: '#6B7280', letterSpacing: '0.12em', fontStyle: 'italic',
        }}>
          Five kingdoms. One fractured world.
        </p>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: mobile ? 6 : 12, marginTop: 12, flexWrap: 'wrap',
        }}>
          {['JRPG', 'Open World', 'Singapore GIS', 'UE5 Vision'].map(tag => (
            <span key={tag} style={{
              fontSize: '0.55rem', letterSpacing: '0.15em',
              color: '#F59E0B', opacity: 0.6,
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 20, padding: '3px 9px',
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* ── INTERACTIVE MAP ── */}
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: mobile ? '0 12px 8px' : '0 24px 40px',
        opacity: mapLoaded ? 1 : 0,
        transform: mapLoaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}>
        <div style={{
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: mobile ? 12 : 18,
          overflow: 'hidden',
          boxShadow: '0 0 80px rgba(245,158,11,0.08), 0 32px 100px rgba(0,0,0,0.8)',
        }}>
          <WorldMapSVG
            activeRegion={activeRegion}
            setActiveRegion={setActiveRegion}
            hoveredLocation={hoveredLocation}
            setHoveredLocation={setHoveredLocation}
            mobile={mobile}
          />
        </div>

        {/* Mobile extras below map */}
        {mobile && (
          <div style={{ marginTop: 12, padding: '0 2px' }}>
            <p style={{ fontSize: '0.55rem', letterSpacing: '0.15em', color: '#374151', marginBottom: 8, textAlign: 'center' }}>
              TAP REGIONS · TAP LOCATIONS
            </p>
            <MapLegend mobile={true} />
            <div style={{ marginTop: 10 }}>
              <RegionProgressPanel regions={REGIONS} mobile={true} />
            </div>
          </div>
        )}

        {/* Desktop hint */}
        {!mobile && (
          <p style={{
            textAlign: 'center', fontSize: '0.65rem',
            color: '#374151', letterSpacing: '0.12em', marginTop: 12,
          }}>
            HOVER LOCATIONS · CLICK REGIONS TO EXPLORE
          </p>
        )}

        {/* Desktop region detail panel */}
        {!mobile && region && (
          <div style={{ marginTop: 28 }}>
            <RegionDetailPanel region={region} onClose={() => setActiveRegion(null)} mobile={false} />
          </div>
        )}
      </div>

      {/* ── ABOUT & ROADMAP ── */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: mobile ? '12px 16px 40px' : '0 24px 40px' }}>

        {/* About */}
        <div style={{
          border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 16, padding: mobile ? '20px 18px' : '28px 32px',
          background: 'rgba(8,13,46,0.5)', backdropFilter: 'blur(12px)',
          marginBottom: 20,
        }}>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: '#F59E0B', fontFamily: 'var(--font-title)', marginBottom: 12, opacity: 0.7 }}>
            THE VISION
          </p>
          <p style={{ fontSize: mobile ? '0.82rem' : '0.9rem', color: '#9CA3AF', lineHeight: 2.0, marginBottom: 14 }}>
            Neo Gaia is a cinematic JRPG open-world project — a dark fantasy realm built on top of
            Singapore's real geospatial data from Data.gov.sg. Planning regions, subzones, road systems,
            and reservoirs become kingdoms, wastelands, and summon shrines.
          </p>
          <p style={{ fontSize: mobile ? '0.82rem' : '0.9rem', color: '#9CA3AF', lineHeight: 2.0 }}>
            Inspired by <strong style={{ color: '#F59E0B' }}>Final Fantasy VII Rebirth</strong> and{' '}
            <strong style={{ color: '#F59E0B' }}>Crisis Core</strong>, the game follows a Zack Fair-like
            protagonist across a fractured world powered by Aether Wells. The long-term target stack is
            Unreal Engine 5 with real GeoJSON terrain — but you have to walk before you can fly.
          </p>
        </div>

        {/* Phase Roadmap */}
        <div style={{
          border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 16, padding: mobile ? '20px 18px' : '28px 32px',
          background: 'rgba(8,13,46,0.5)', backdropFilter: 'blur(12px)',
          marginBottom: 20,
        }}>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: '#F59E0B', fontFamily: 'var(--font-title)', marginBottom: 16, opacity: 0.7 }}>
            DEVELOPMENT ROADMAP
          </p>
          <PhaseRoadmap mobile={mobile} />
        </div>

        {/* UE5 Tech Stack */}
        <div style={{
          border: '1px solid rgba(129,140,248,0.2)',
          borderRadius: 16, padding: mobile ? '20px 18px' : '28px 32px',
          background: 'rgba(8,13,46,0.5)', backdropFilter: 'blur(12px)',
        }}>
          <p style={{ fontSize: '0.6rem', letterSpacing: '0.25em', color: '#818CF8', fontFamily: 'var(--font-title)', marginBottom: 4, opacity: 0.7 }}>
            PHASE 4 TECH STACK
          </p>
          <p style={{ fontSize: '0.7rem', color: '#6B7280', marginBottom: 16 }}>
            Target architecture for the UE5 vertical slice
          </p>
          <TechStackSection mobile={mobile} />
        </div>
      </div>

      {/* Mobile region modal */}
      {mobile && region && (
        <RegionDetailPanel region={region} onClose={() => setActiveRegion(null)} mobile={true} />
      )}

      {/* Mobile location tooltip (fixed bottom bar) */}
      {mobile && hoveredLocation && (
        <LocationTooltip location={hoveredLocation} x={0} y={0} mobile={true} />
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
