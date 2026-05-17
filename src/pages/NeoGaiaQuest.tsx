/**
 * Neo Gaia Quest Page — Phase 1
 * Interactive JRPG world map with 6 regions, location nodes, tooltips,
 * region progress tracker, and a minimap legend. All static — no backend.
 *
 * Phase roadmap:
 *   Phase 1 (this): Interactive map, region lore, location tooltips, progress bars
 *   Phase 2: Character movement, fog of war, quest log
 *   Phase 3: Turn-based encounters, inventory, save state
 */
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// ─── DATA ────────────────────────────────────────────────────────────────────

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
  color: string;          // accent hex
  glow: string;           // rgba glow
  borderColor: string;
  progress: number;       // 0–100
  lore: string;
  status: 'active' | 'locked' | 'hidden';
  // SVG polygon points as "x,y x,y ..." (% of 1000x600 viewBox)
  polygon: string;
}

const REGIONS: Region[] = [
  {
    id: 'crown',
    name: 'The Crown Dominion',
    subtitle: 'CENTRAL REGION',
    biome: 'Urban Arcane',
    color: '#F59E0B',
    glow: 'rgba(245,158,11,0.35)',
    borderColor: '#F59E0B',
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
    borderColor: '#EF4444',
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
    borderColor: '#22C55E',
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
    borderColor: '#38BDF8',
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
    borderColor: '#818CF8',
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
    borderColor: '#A78BFA',
    progress: 0,
    lore: 'A chain of islands cloaked in mystery. Half the Isles lie beneath dark waters. Sentosa Haven appears peaceful — but Lazarus Sanctum beneath it holds secrets that could unravel the entire realm. Approach only when ready.',
    status: 'hidden',
    polygon: '400,500 480,490 560,510 600,560 560,600 480,610 400,595 360,560 370,520',
  },
];

const LOCATIONS: Location[] = [
  // Crown Dominion
  { id: 'aurelia', name: 'Aurelia Prime', type: 'town', x: 47.5, y: 51, region: 'crown', desc: 'Capital of Neo Gaia. The political heart of all five kingdoms.', status: 'active' },
  { id: 'orchard', name: 'Orchard Heights', type: 'town', x: 42, y: 40, region: 'crown', desc: 'The merchant district. Arcane markets and guild halls line every street.', status: 'active' },
  { id: 'queens', name: 'Queenstown Ward', type: 'town', x: 43, y: 58, region: 'crown', desc: 'A residential district with deep ties to the old resistance.', status: 'active' },
  { id: 'marina', name: 'Marina Spire', type: 'crystal', x: 50, y: 67, region: 'crown', desc: 'Fast Travel Crystal. Connects to all major crystals across Neo Gaia.', status: 'active' },
  { id: 'downtown', name: 'Downtown Core', type: 'questboard', x: 57, y: 57, region: 'crown', desc: 'Quest Board. Pick up contracts from across the realm.', status: 'active' },
  // Ironwild
  { id: 'ferrum', name: 'Ferrum Bastion', type: 'fortress', x: 28, y: 58, region: 'ironwild', desc: 'The last standing fortress of the western frontier.', status: 'active' },
  { id: 'tuas', name: 'Tuas Megaforge', type: 'dungeon', x: 16, y: 43, region: 'ironwild', desc: 'Dungeon. A rusted labyrinth of old industrial machinery.', status: 'active' },
  { id: 'jurong', name: 'Jurong Wastes', type: 'dungeon', x: 21, y: 60, region: 'ironwild', desc: 'Dungeon. Scavengers roam these irradiated lowlands.', status: 'active' },
  { id: 'tengah', name: 'Tengah Outpost', type: 'town', x: 36, y: 33, region: 'ironwild', desc: 'A frontier outpost and resupply hub for western travellers.', status: 'active' },
  // Verdant Bloom
  { id: 'bloomheart', name: 'Bloomheart Conservatory', type: 'shrine', x: 72, y: 38, region: 'verdant', desc: 'Summon Shrine. The last refuge of the druidic order.', status: 'active' },
  { id: 'sengkang', name: 'Sengkang Wilds', type: 'dungeon', x: 66, y: 46, region: 'verdant', desc: 'Dungeon. Ancient spirits are restless here.', status: 'active' },
  { id: 'hougang', name: 'Hougang Gardens', type: 'town', x: 72, y: 52, region: 'verdant', desc: 'A hidden settlement deep within the Verdant Bloom.', status: 'active' },
  { id: 'punggol', name: 'Punggol Promenade', type: 'town', x: 82, y: 22, region: 'verdant', desc: 'Coastal town at the north-eastern tip of the realm.', status: 'active' },
  { id: 'seletar', name: 'Seletar Skyfields', type: 'observatory', x: 76, y: 16, region: 'verdant', desc: 'Sky platform used by the Verdant order for aerial scouting.', status: 'active' },
  // Frostveil
  { id: 'frostveil-city', name: 'Frostveil Citadel', type: 'fortress', x: 48, y: 8, region: 'frostveil', desc: 'The frozen seat of the northern warlords.', status: 'active' },
  { id: 'mandai', name: 'Mandai Observatory', type: 'observatory', x: 58, y: 18, region: 'frostveil', desc: 'Star-watching tower. Reads omens in the northern lights.', status: 'active' },
  { id: 'woodlands', name: 'Woodlands Bastion', type: 'town', x: 33, y: 27, region: 'frostveil', desc: 'Northern gateway town. First stop before the Barrens.', status: 'active' },
  { id: 'yishun', name: 'Yishun Depths', type: 'dungeon', x: 47, y: 28, region: 'frostveil', desc: 'Dungeon. A network of frozen underground caverns.', status: 'active' },
  // Azure Coastlands
  { id: 'changi', name: 'Changi Lighthouse', type: 'crystal', x: 87, y: 46, region: 'azure', desc: 'Fast Travel Crystal. Beacon of the eastern coast.', status: 'active' },
  { id: 'leviathan', name: 'Leviathan Shrine', type: 'shrine', x: 80, y: 60, region: 'azure', desc: 'Summon Shrine. Where the great sea beast was last sighted.', status: 'active' },
  { id: 'junon', name: 'Junon Naval Fortress', type: 'fortress', x: 84, y: 70, region: 'azure', desc: 'Azure naval HQ. Controls all eastern shipping lanes.', status: 'active' },
  { id: 'pasir', name: 'Pasir Ris Shoreline', type: 'town', x: 78, y: 53, region: 'azure', desc: 'A quiet shoreline town — deceptively peaceful.', status: 'active' },
  // Southern Isles
  { id: 'sentosa', name: 'Sentosa Haven', type: 'town', x: 42, y: 78, region: 'southern', desc: 'The only "safe" island in the Southern chain. Or so they say.', status: 'hidden' },
  { id: 'lazarus', name: 'Lazarus Sanctum', type: 'dungeon', x: 51, y: 82, region: 'southern', desc: 'Dungeon. A flooded ruin hiding the realm\'s deepest secret.', status: 'hidden' },
  { id: 'stjohns', name: "St. John's Refuge", type: 'town', x: 60, y: 79, region: 'southern', desc: 'A hermit settlement. The inhabitants have not left in years.', status: 'hidden' },
];

const TYPE_ICONS: Record<LocationType, string> = {
  town: '🏰',
  dungeon: '💀',
  shrine: '🔮',
  observatory: '🔭',
  fortress: '⚔️',
  crystal: '💎',
  questboard: '📋',
};

const TYPE_COLORS: Record<LocationType, string> = {
  town: '#F59E0B',
  dungeon: '#EF4444',
  shrine: '#A78BFA',
  observatory: '#38BDF8',
  fortress: '#94A3B8',
  crystal: '#22D3EE',
  questboard: '#22C55E',
};

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function CompassRose() {
  return (
    <div style={{
      position: 'absolute', top: 12, right: 14,
      width: 56, height: 56, opacity: 0.7,
      userSelect: 'none', pointerEvents: 'none',
    }}>
      <svg viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28" cy="28" r="26" stroke="#F59E0B" strokeWidth="1" strokeOpacity="0.4" />
        <circle cx="28" cy="28" r="4" fill="#F59E0B" fillOpacity="0.9" />
        {/* N */}
        <polygon points="28,4 24,22 32,22" fill="#F59E0B" />
        {/* S */}
        <polygon points="28,52 24,34 32,34" fill="#94A3B8" fillOpacity="0.6" />
        {/* E */}
        <polygon points="52,28 34,24 34,32" fill="#94A3B8" fillOpacity="0.5" />
        {/* W */}
        <polygon points="4,28 22,24 22,32" fill="#94A3B8" fillOpacity="0.5" />
        <text x="28" y="16" textAnchor="middle" fontSize="7" fill="#F59E0B" fontWeight="bold" fontFamily="Cinzel,serif">N</text>
      </svg>
    </div>
  );
}

function RegionProgress({ regions }: { regions: Region[] }) {
  return (
    <div style={{
      position: 'absolute', bottom: 12, left: 14,
      background: 'rgba(4,6,26,0.85)',
      border: '1px solid rgba(245,158,11,0.25)',
      borderRadius: 10, padding: '10px 14px',
      backdropFilter: 'blur(8px)',
      minWidth: 180,
    }}>
      <p style={{
        fontSize: '0.6rem', letterSpacing: '0.2em',
        color: '#F59E0B', fontFamily: 'var(--font-title)',
        marginBottom: 8, opacity: 0.9,
      }}>REGION PROGRESS</p>
      {regions.map(r => (
        <div key={r.id} style={{ marginBottom: 5 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
            <span style={{ fontSize: '0.58rem', color: r.status === 'hidden' ? '#6B7280' : '#9CA3AF' }}>
              {r.name}
            </span>
            <span style={{ fontSize: '0.58rem', color: r.color, fontWeight: 700 }}>
              {r.status === 'hidden' ? '??%' : `${r.progress}%`}
            </span>
          </div>
          <div style={{
            height: 3, borderRadius: 2,
            background: 'rgba(255,255,255,0.08)',
            overflow: 'hidden',
          }}>
            <div style={{
              height: '100%', borderRadius: 2,
              width: r.status === 'hidden' ? '0%' : `${r.progress}%`,
              background: r.status === 'hidden'
                ? 'transparent'
                : `linear-gradient(90deg, ${r.color}, ${r.color}88)`,
              transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function MapLegend() {
  const items: [LocationType, string][] = [
    ['town', 'Town / City'],
    ['dungeon', 'Dungeon'],
    ['shrine', 'Summon Shrine'],
    ['crystal', 'Fast Travel Crystal'],
    ['observatory', 'Observatory'],
    ['fortress', 'Fortress'],
    ['questboard', 'Quest Board'],
  ];
  return (
    <div style={{
      position: 'absolute', top: 12, left: 14,
      background: 'rgba(4,6,26,0.85)',
      border: '1px solid rgba(245,158,11,0.25)',
      borderRadius: 10, padding: '10px 14px',
      backdropFilter: 'blur(8px)',
    }}>
      <p style={{
        fontSize: '0.6rem', letterSpacing: '0.2em',
        color: '#F59E0B', fontFamily: 'var(--font-title)',
        marginBottom: 8,
      }}>LEGEND</p>
      {items.map(([type, label]) => (
        <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
          <span style={{ fontSize: '0.7rem' }}>{TYPE_ICONS[type]}</span>
          <span style={{ fontSize: '0.58rem', color: '#9CA3AF' }}>{label}</span>
        </div>
      ))}
    </div>
  );
}

interface TooltipProps {
  location: Location | null;
  x: number;
  y: number;
}

function LocationTooltip({ location, x, y }: TooltipProps) {
  if (!location) return null;
  const color = TYPE_COLORS[location.type];
  return (
    <div style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      transform: 'translate(-50%, -120%)',
      background: 'rgba(4,6,26,0.97)',
      border: `1px solid ${color}50`,
      borderRadius: 10,
      padding: '10px 14px',
      minWidth: 180, maxWidth: 240,
      pointerEvents: 'none',
      zIndex: 30,
      boxShadow: `0 0 24px ${color}30, 0 8px 32px rgba(0,0,0,0.7)`,
      backdropFilter: 'blur(12px)',
    }}>
      {/* Arrow */}
      <div style={{
        position: 'absolute', bottom: -6, left: '50%', transform: 'translateX(-50%)',
        width: 0, height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: `6px solid ${color}50`,
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: '1rem' }}>{TYPE_ICONS[location.type]}</span>
        <span style={{
          fontSize: '0.75rem', fontFamily: 'var(--font-title)',
          color, letterSpacing: '0.05em',
        }}>{location.name}</span>
      </div>
      <p style={{ fontSize: '0.68rem', color: '#9CA3AF', lineHeight: 1.6 }}>{location.desc}</p>
      <div style={{
        marginTop: 6, fontSize: '0.55rem', letterSpacing: '0.15em',
        color: color, opacity: 0.6,
      }}>
        {location.type.toUpperCase().replace('questboard', 'QUEST BOARD')}
      </div>
    </div>
  );
}

// ─── MAIN MAP COMPONENT ───────────────────────────────────────────────────────

function WorldMapCanvas({
  activeRegion,
  setActiveRegion,
  hoveredLocation,
  setHoveredLocation,
}: {
  activeRegion: RegionId | null;
  setActiveRegion: (r: RegionId | null) => void;
  hoveredLocation: Location | null;
  setHoveredLocation: (l: Location | null) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <div style={{ position: 'relative', width: '100%', paddingBottom: '60%' }}>
      <svg
        ref={svgRef}
        viewBox="0 0 1000 600"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          overflow: 'visible',
        }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Ocean background */}
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
          {/* Dashed border for Southern Isles */}
          <pattern id="dash" patternUnits="userSpaceOnUse" width="12" height="1">
            <line x1="0" y1="0" x2="8" y2="0" stroke="#A78BFA" strokeWidth="1.5" />
          </pattern>
        </defs>

        <rect width="1000" height="600" fill="url(#oceanGrad)" />

        {/* Ocean grid lines (subtle) */}
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
          return (
            <g key={region.id}>
              {/* Glow layer */}
              {isActive && (
                <polygon
                  points={region.polygon}
                  fill={region.color}
                  fillOpacity="0.15"
                  filter="url(#softglow)"
                />
              )}
              {/* Main fill */}
              <polygon
                points={region.polygon}
                fill={isHidden
                  ? '#1a0a2e'
                  : isActive ? `${region.color}22` : `${region.color}0d`}
                stroke={isHidden ? '#A78BFA' : region.color}
                strokeWidth={isActive ? 2 : 1}
                strokeOpacity={isHidden ? 0.5 : isActive ? 0.9 : 0.45}
                strokeDasharray={isHidden ? '8 4' : undefined}
                style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                onClick={() => setActiveRegion(isActive ? null : region.id)}
                onMouseEnter={() => !isActive && setActiveRegion(region.id)}
              />
              {/* Region label */}
              {(() => {
                // Find centroid roughly from polygon
                const pts = region.polygon.split(' ').map(p => p.split(',').map(Number));
                const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
                const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
                return (
                  <g>
                    <text
                      x={cx} y={cy - 6}
                      textAnchor="middle"
                      fontSize={isHidden ? 11 : 13}
                      fontFamily="Cinzel,serif"
                      fill={isHidden ? '#A78BFA' : region.color}
                      fillOpacity={isActive ? 1 : 0.75}
                      fontWeight="bold"
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      {region.name.toUpperCase()}
                    </text>
                    <text
                      x={cx} y={cy + 10}
                      textAnchor="middle"
                      fontSize={8}
                      fontFamily="Cinzel,serif"
                      fill={region.color}
                      fillOpacity={0.5}
                      style={{ pointerEvents: 'none', userSelect: 'none' }}
                    >
                      ({region.subtitle})
                    </text>
                  </g>
                );
              })()}
            </g>
          );
        })}

        {/* MRT Crystal Lines — dashed paths between crystals/towns */}
        <g strokeDasharray="6 3" strokeOpacity="0.35" fill="none">
          {/* Crown → Azure */}
          <path d="M 475,510 Q 600,490 780,460" stroke="#22D3EE" strokeWidth="1.2" />
          {/* Crown → Ironwild */}
          <path d="M 390,340 Q 300,340 280,470" stroke="#F59E0B" strokeWidth="1.2" />
          {/* Crown → Frostveil */}
          <path d="M 460,220 Q 460,160 480,80" stroke="#38BDF8" strokeWidth="1.2" />
          {/* Frostveil → Verdant */}
          <path d="M 590,80 Q 620,100 620,110" stroke="#38BDF8" strokeWidth="1.2" />
        </g>

        {/* Location nodes */}
        {LOCATIONS.map(loc => {
          const x = (loc.x / 100) * 1000;
          const y = (loc.y / 100) * 600;
          const isHidden = loc.status === 'hidden';
          const color = isHidden ? '#A78BFA' : TYPE_COLORS[loc.type];
          const isHovered = hoveredLocation?.id === loc.id;

          return (
            <g
              key={loc.id}
              transform={`translate(${x},${y})`}
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredLocation(loc)}
              onMouseLeave={() => setHoveredLocation(null)}
            >
              {/* Pulse ring when hovered */}
              {isHovered && (
                <circle r="14" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5">
                  <animate attributeName="r" from="10" to="20" dur="1s" repeatCount="indefinite" />
                  <animate attributeName="opacity" from="0.6" to="0" dur="1s" repeatCount="indefinite" />
                </circle>
              )}
              {/* Node circle */}
              <circle
                r={isHovered ? 7 : 5}
                fill={color}
                fillOpacity={isHidden ? 0.4 : 0.9}
                stroke={isHidden ? '#A78BFA' : '#04061a'}
                strokeWidth="1.5"
                filter={isHovered ? 'url(#glow)' : undefined}
                style={{ transition: 'r 0.2s ease' }}
              />
              {/* Icon */}
              <text
                textAnchor="middle" dominantBaseline="middle"
                fontSize="7" style={{ pointerEvents: 'none', userSelect: 'none' }}
              >
                {isHidden ? '?' : TYPE_ICONS[loc.type]}
              </text>
            </g>
          );
        })}

        {/* Player marker — Aurelia Prime */}
        <g transform="translate(475,306)">
          <polygon points="0,-10 7,4 -7,4" fill="#F59E0B" stroke="#04061a" strokeWidth="1.5" filter="url(#glow)" />
          <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
        </g>
      </svg>

      {/* HTML overlay: tooltip */}
      {hoveredLocation && (
        <LocationTooltip
          location={hoveredLocation}
          x={hoveredLocation.x}
          y={hoveredLocation.y}
        />
      )}

      {/* Legend overlay */}
      <MapLegend />

      {/* Compass */}
      <CompassRose />

      {/* Region progress */}
      <RegionProgress regions={REGIONS} />
    </div>
  );
}

// ─── REGION DETAIL PANEL ──────────────────────────────────────────────────────

function RegionDetailPanel({ region, onClose }: { region: Region; onClose: () => void }) {
  const locations = LOCATIONS.filter(l => l.region === region.id);
  return (
    <div style={{
      border: `1px solid ${region.color}40`,
      borderRadius: 16,
      background: `linear-gradient(135deg, rgba(4,6,26,0.97), rgba(8,13,46,0.9))`,
      padding: '24px 28px',
      backdropFilter: 'blur(16px)',
      boxShadow: `0 0 60px ${region.glow}, 0 24px 80px rgba(0,0,0,0.7)`,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Corner accent */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: 200, height: 200,
        background: `radial-gradient(circle at top right, ${region.color}15, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <p style={{
            fontSize: '0.6rem', letterSpacing: '0.25em',
            color: region.color, fontFamily: 'var(--font-title)',
            marginBottom: 4, opacity: 0.8,
          }}>{region.subtitle} · {region.biome}</p>
          <h2 style={{
            fontSize: '1.4rem', fontFamily: 'var(--font-title)',
            color: region.color, letterSpacing: '0.08em',
            textShadow: `0 0 30px ${region.glow}`,
          }}>{region.name}</h2>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 8, color: '#9CA3AF', fontSize: '1rem',
            width: 32, height: 32, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}
        >✕</button>
      </div>

      {/* Progress bar */}
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
            transition: 'width 1s ease',
          }} />
        </div>
      </div>

      {/* Lore */}
      <p style={{
        fontSize: '0.82rem', color: '#9CA3AF', lineHeight: 1.9,
        marginBottom: 20, borderLeft: `2px solid ${region.color}40`,
        paddingLeft: 14,
      }}>
        {region.status === 'hidden'
          ? '⚠️ Region data classified. Complete the Southern questline to unlock.'
          : region.lore}
      </p>

      {/* Locations */}
      {region.status !== 'hidden' && (
        <div>
          <p style={{
            fontSize: '0.6rem', letterSpacing: '0.2em', color: '#6B7280',
            fontFamily: 'var(--font-title)', marginBottom: 10,
          }}>KNOWN LOCATIONS</p>
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

// ─── PAGE ROOT ────────────────────────────────────────────────────────────────

export default function NeoGaiaQuest() {
  const navigate = useNavigate();
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
    }}>

      {/* Back nav */}
      <div style={{
        position: 'fixed', top: 20, left: 24, zIndex: 100,
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(4,6,26,0.85)',
            border: '1px solid rgba(245,158,11,0.3)',
            borderRadius: 10, padding: '8px 16px',
            color: '#F59E0B', fontSize: '0.75rem',
            fontFamily: 'var(--font-title)', letterSpacing: '0.12em',
            cursor: 'pointer', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          ← WORLD MAP
        </button>
      </div>

      {/* Page header */}
      <div style={{
        paddingTop: 80, paddingBottom: 32,
        textAlign: 'center',
        background: 'linear-gradient(to bottom, rgba(8,13,46,0.6), transparent)',
      }}>
        {/* Sigil */}
        <div style={{
          width: 64, height: 64, borderRadius: '50%',
          border: '2px solid rgba(245,158,11,0.5)',
          background: 'rgba(245,158,11,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 0 40px rgba(245,158,11,0.25)',
        }}>
          <span style={{
            fontFamily: 'var(--font-title)', color: '#F59E0B',
            fontSize: '1.1rem', fontWeight: 900, letterSpacing: '0.1em',
          }}>NG</span>
        </div>

        <h1 style={{
          fontFamily: 'var(--font-title)',
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          color: '#F59E0B', letterSpacing: '0.18em',
          textShadow: '0 0 60px rgba(245,158,11,0.5)',
          marginBottom: 8,
        }}>NEO GAIA</h1>

        <p style={{
          fontSize: '0.85rem', color: '#6B7280',
          letterSpacing: '0.15em', fontStyle: 'italic',
          marginBottom: 6,
        }}>
          Five kingdoms. One fractured world. The age of reckoning begins.
        </p>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
          marginTop: 12,
        }}>
          {['JRPG', 'Open World', 'Phase 1'].map(tag => (
            <span key={tag} style={{
              fontSize: '0.58rem', letterSpacing: '0.18em',
              color: '#F59E0B', opacity: 0.6,
              border: '1px solid rgba(245,158,11,0.2)',
              borderRadius: 20, padding: '3px 10px',
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* ── INTERACTIVE MAP ── */}
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '0 24px 40px',
        opacity: mapLoaded ? 1 : 0,
        transform: mapLoaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'opacity 0.8s ease, transform 0.8s ease',
      }}>
        <div style={{
          border: '1px solid rgba(245,158,11,0.2)',
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: '0 0 80px rgba(245,158,11,0.08), 0 32px 100px rgba(0,0,0,0.8)',
          position: 'relative',
        }}>
          <WorldMapCanvas
            activeRegion={activeRegion}
            setActiveRegion={setActiveRegion}
            hoveredLocation={hoveredLocation}
            setHoveredLocation={setHoveredLocation}
          />
        </div>

        {/* Hint */}
        <p style={{
          textAlign: 'center', fontSize: '0.65rem',
          color: '#374151', letterSpacing: '0.12em',
          marginTop: 12,
        }}>
          HOVER LOCATIONS · CLICK REGIONS TO EXPLORE
        </p>

        {/* Region detail panel */}
        {region && (
          <div style={{
            marginTop: 28,
            opacity: 1,
            transform: 'translateY(0)',
            animation: 'fadeUp 0.4s ease',
          }}>
            <RegionDetailPanel region={region} onClose={() => setActiveRegion(null)} />
          </div>
        )}
      </div>

      {/* ── LORE / ABOUT ── */}
      <div style={{
        maxWidth: 800, margin: '0 auto',
        padding: '0 24px 40px',
      }}>
        <div style={{
          border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 16, padding: '28px 32px',
          background: 'rgba(8,13,46,0.5)',
          backdropFilter: 'blur(12px)',
        }}>
          <p style={{
            fontSize: '0.6rem', letterSpacing: '0.25em',
            color: '#F59E0B', fontFamily: 'var(--font-title)',
            marginBottom: 12, opacity: 0.7,
          }}>THE VISION</p>
          <p style={{ fontSize: '0.9rem', color: '#9CA3AF', lineHeight: 2.0, marginBottom: 16 }}>
            Neo Gaia is a JRPG open-world project — a dark fantasy realm inspired by Singapore's geography.
            Five sovereign territories, each scarred by war, myth, and ambition.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#9CA3AF', lineHeight: 2.0, marginBottom: 16 }}>
            <strong style={{ color: '#F59E0B' }}>Phase 1</strong> — the interactive world map you're looking at — is live.
            Regions, locations, lore, and region progress are all explorable.
          </p>
          <p style={{ fontSize: '0.9rem', color: '#9CA3AF', lineHeight: 2.0 }}>
            <strong style={{ color: '#F59E0B' }}>Phase 2</strong> brings character movement and fog of war.{' '}
            <strong style={{ color: '#F59E0B' }}>Phase 3</strong> brings turn-based encounters, inventory, and persistent save state.
            The age of reckoning is coming.
          </p>

          {/* Phase roadmap */}
          <div style={{ marginTop: 24, display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {[
              { phase: 'Phase 1', label: 'Interactive Map', status: 'active', color: '#22C55E' },
              { phase: 'Phase 2', label: 'Movement & Fog', status: 'planned', color: '#F59E0B' },
              { phase: 'Phase 3', label: 'Combat & Save', status: 'planned', color: '#EF4444' },
            ].map(p => (
              <div key={p.phase} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'rgba(255,255,255,0.04)',
                border: `1px solid ${p.color}${p.status === 'active' ? '50' : '20'}`,
                borderRadius: 10, padding: '8px 14px',
                flex: '1 1 160px',
              }}>
                <div style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: p.color,
                  boxShadow: p.status === 'active' ? `0 0 8px ${p.color}` : 'none',
                }} />
                <div>
                  <p style={{
                    fontSize: '0.65rem', color: p.color,
                    fontFamily: 'var(--font-title)', letterSpacing: '0.1em',
                  }}>{p.phase}</p>
                  <p style={{ fontSize: '0.68rem', color: '#6B7280' }}>{p.label}</p>
                </div>
                {p.status === 'active' && (
                  <span style={{
                    marginLeft: 'auto', fontSize: '0.5rem', letterSpacing: '0.18em',
                    color: '#22C55E', border: '1px solid #22C55E40',
                    borderRadius: 20, padding: '2px 7px',
                  }}>LIVE</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
