/**
 * Neo Gaia Quest Page — Phase 1 (Real Map Edition)
 * Interactive JRPG world map — inline styles, no Tailwind.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

type RegionId = 'crown' | 'ironwild' | 'verdant' | 'frostveil' | 'azure' | 'southern';
type LocationType = 'town' | 'dungeon' | 'shrine' | 'outpost' | 'observatory' | 'fortress' | 'wilderness' | 'crystal';

interface Location {
  id: string; name: string; type: LocationType;
  x: number; y: number; region: RegionId;
  desc: string; status: 'active' | 'locked' | 'hidden';
  isPlayerStart?: boolean;
}
interface Region {
  id: RegionId; name: string; subtitle: string;
  progress: number; color: string; bgColor: string;
  icon: string; lore: string; status: 'active' | 'locked' | 'hidden';
}

// ── Region Data ───────────────────────────────────────────────────────────────
const REGIONS: Region[] = [
  { id:'crown',     name:'The Crown Dominion', subtitle:'Central Region',   progress:45, color:'#F59E0B', bgColor:'rgba(245,158,11,0.12)', icon:'👑', status:'active',
    lore:'The seat of power at the heart of Neo Gaia. Arcane guilds and merchant lords vie for dominance. Aurelia Prime pulses with mako energy and political intrigue.' },
  { id:'verdant',   name:'Verdant Bloom',       subtitle:'North-East Region', progress:38, color:'#22C55E', bgColor:'rgba(34,197,94,0.12)',   icon:'🌿', status:'active',
    lore:'Giant botanical ecosystems tower over overgrown ruins. Magical conservatories house species found nowhere else. The Bloomheart Conservatory holds secrets older than the Aether Wells.' },
  { id:'ironwild',  name:'Ironwild Frontier',   subtitle:'West Region',      progress:26, color:'#F97316', bgColor:'rgba(249,115,22,0.12)',  icon:'⚔️', status:'active',
    lore:'An industrial wasteland scarred by centuries of magitek excavation. Mako reactors burn day and night. Ferrum Bastion stands as the last city before the Tuas Wastelands.' },
  { id:'frostveil', name:'Frostveil Barrens',   subtitle:'North Region',     progress:30, color:'#60A5FA', bgColor:'rgba(96,165,250,0.12)',  icon:'❄️', status:'active',
    lore:'Frozen mountains hide abandoned SOLDIER labs and dimensional anomalies. Frostveil Citadel overlooks an endless white expanse. Few venture here willingly.' },
  { id:'azure',     name:'Azure Coastlands',    subtitle:'East Region',      progress:33, color:'#38BDF8', bgColor:'rgba(56,189,248,0.12)',  icon:'⚓', status:'active',
    lore:'Crystal oceans and flooded temples stretch along the eastern coast. Naval kingdoms rule from above the waterline. Leviathan stirs in the deep.' },
  { id:'southern',  name:'Southern Isles',      subtitle:'Hidden Region',    progress:0,  color:'#A78BFA', bgColor:'rgba(167,139,250,0.12)', icon:'👁️', status:'hidden',
    lore:'A scattered archipelago sealed from the main continent. Rumours speak of an ancient pact. Access requires the Lazarus Key — its whereabouts unknown.' },
];

// ── Location Data ─────────────────────────────────────────────────────────────
const LOCATIONS: Location[] = [
  // Crown Dominion
  { id:'aurelia_prime',   name:'Aurelia Prime',          type:'town',        x:49.5, y:55.0, region:'crown',    isPlayerStart:true, status:'active', desc:'Capital of Neo Gaia. Hub of all political power. The Aether Spire reaches beyond the clouds.' },
  { id:'orchard_heights', name:'Orchard Heights',        type:'town',        x:43.5, y:47.5, region:'crown',    status:'active', desc:'Affluent upper district. Home to the Arcane Merchant Guild and the Grand Bazaar.' },
  { id:'queenstown_ward', name:'Queenstown Ward',        type:'outpost',     x:43.5, y:62.5, region:'crown',    status:'active', desc:'Industrial lower district. SOLDIER recruitment offices and black-market trade.' },
  { id:'marina_spire',    name:'Marina Spire',           type:'crystal',     x:50.5, y:70.5, region:'crown',    status:'active', desc:'Fast Travel Crystal hub. MRT Crystal Lines converge at this coastal terminus.' },
  { id:'downtown_core',   name:'Downtown Core',          type:'town',        x:57.0, y:62.0, region:'crown',    status:'active', desc:'Financial district controlled by the Shinra Trading Consortium.' },
  // Ironwild Frontier
  { id:'ferrum_bastion',  name:'Ferrum Bastion',         type:'fortress',    x:30.5, y:66.5, region:'ironwild', status:'active', desc:'Fortress city of the western frontier. Heavy magitek armour patrols the perimeter.' },
  { id:'tuas_megaforge',  name:'Tuas Megaforge',         type:'dungeon',     x:18.0, y:52.5, region:'ironwild', status:'active', desc:'Massive industrial dungeon. Autonomous war machines are mass-produced in the lower levels.' },
  { id:'jurong_wastes',   name:'Jurong Wastes',          type:'wilderness',  x:27.5, y:73.5, region:'ironwild', status:'active', desc:'Toxic wasteland. Mutated creatures roam the ruins of old petrochemical plants.' },
  { id:'tengah_outpost',  name:'Tengah Outpost',         type:'outpost',     x:36.5, y:43.0, region:'ironwild', status:'active', desc:'Military staging point on the border between Ironwild and Crown Dominion.' },
  // Verdant Bloom
  { id:'bloomheart',      name:'Bloomheart Conservatory',type:'dungeon',     x:73.5, y:40.5, region:'verdant',  status:'active', desc:'A living dungeon of impossible scale. The conservatory breathes with Aether energy. Chapter 1 boss.' },
  { id:'sengkang_wilds',  name:'Sengkang Wilds',         type:'wilderness',  x:68.0, y:53.5, region:'verdant',  status:'active', desc:'Dense overgrown jungle. Druidic settlements hide among the roots of giant Aether Trees.' },
  { id:'hougang_gardens', name:'Hougang Gardens',        type:'shrine',      x:77.0, y:56.0, region:'verdant',  status:'active', desc:'Summon Shrine of the Forest Titan. Offerings of rare flora required for activation.' },
  { id:'seletar',         name:'Seletar Skyfields',      type:'outpost',     x:80.0, y:20.5, region:'verdant',  status:'active', desc:'Aerial docking platform. Skyships connect Verdant Bloom to the Crown Dominion.' },
  { id:'punggol',         name:'Punggol Promenade',      type:'town',        x:89.5, y:22.5, region:'verdant',  status:'active', desc:'Coastal town known for its floating markets and Chocobo racing track.' },
  // Frostveil Barrens
  { id:'frostveil_citadel',  name:'Frostveil Citadel',   type:'fortress',    x:50.5, y:5.5,  region:'frostveil',status:'active', desc:'Ancient fortress at the frozen peak. Chapter 4 — the truth about SOLDIER experiments surfaces here.' },
  { id:'woodlands_bastion',  name:'Woodlands Bastion',   type:'town',        x:30.5, y:25.0, region:'frostveil',status:'active', desc:'Northern garrison city. Last supply stop before the frozen wastes.' },
  { id:'yishun_depths',      name:'Yishun Depths',       type:'dungeon',     x:48.5, y:33.0, region:'frostveil',status:'active', desc:'Underground cavern system. Dimensional rifts open unpredictably in the lower chambers.' },
  { id:'mandai_obs',         name:'Mandai Observatory',  type:'observatory', x:61.0, y:21.0, region:'frostveil',status:'active', desc:'Ancient star-tracking facility. Houses records of all six Aether Well activation cycles.' },
  // Azure Coastlands
  { id:'changi',          name:'Changi Lighthouse',      type:'fortress',    x:91.5, y:48.5, region:'azure',    status:'active', desc:'Watchtower of the eastern sea. Signals to offshore naval fleets defending the Crystal Shoals.' },
  { id:'pasir_ris',       name:'Pasir Ris Shoreline',    type:'town',        x:83.5, y:63.5, region:'azure',    status:'active', desc:'Fishing village turned navy port. The underwater ruins beneath the bay remain unexplored.' },
  { id:'leviathan_shrine',name:'Leviathan Shrine',       type:'shrine',      x:78.5, y:73.0, region:'azure',    status:'active', desc:'Summon Shrine of the Sea God. Submerged at high tide. Leviathan stirs in the deep.' },
  { id:'junon',           name:'Junon Naval Fortress',   type:'fortress',    x:87.5, y:78.5, region:'azure',    status:'active', desc:'Impenetrable naval stronghold. Chapter 5 — the Skyfall War begins with a bombardment from these cannons.' },
  // Southern Isles (hidden)
  { id:'sentosa_haven',   name:'Sentosa Haven',          type:'town',        x:40.0, y:88.5, region:'southern', status:'hidden', desc:'A paradise island untouched by the mainland wars. Accessible only via the Lazarus Gate.' },
  { id:'lazarus_sanctum', name:'Lazarus Sanctum',        type:'dungeon',     x:52.0, y:89.0, region:'southern', status:'hidden', desc:'Final dungeon of the hidden region. The source of the dimensional anomalies originates here.' },
  { id:'st_johns',        name:"St. John's Refuge",      type:'outpost',     x:64.0, y:88.0, region:'southern', status:'hidden', desc:'Survivor settlement. The only people who know the truth about the Southern Isles live here.' },
];

const TYPE_ICON: Record<LocationType, string> = {
  town:'🏰', dungeon:'⚔️', shrine:'💎', outpost:'🏯', observatory:'🔭', fortress:'🛡️', wilderness:'🌿', crystal:'🔷',
};
const TYPE_COLOR: Record<LocationType, string> = {
  town:'#F59E0B', dungeon:'#EF4444', shrine:'#A78BFA', outpost:'#94A3B8',
  observatory:'#60A5FA', fortress:'#F97316', wilderness:'#22C55E', crystal:'#38BDF8',
};
const REGION_MAP = Object.fromEntries(REGIONS.map(r => [r.id, r])) as Record<RegionId, Region>;

// ── IMAGE URL ─────────────────────────────────────────────────────────────────
// Use CDN URL as primary, gh-pages path as fallback
const MAP_URL = 'https://base44.app/api/apps/69e9f7892ff1eb79f2a98ff3/files/mp/public/69e9f7892ff1eb79f2a98ff3/ec9ee385b_63a07f472_4BA9F621-C8FE-464D-AA48-16D7D07DD74F.png';

// ── Component ─────────────────────────────────────────────────────────────────
export const NeoGaiaQuest = () => {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState<RegionId | null>(null);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  const [hoveredLoc, setHoveredLoc] = useState<string | null>(null);

  const selectedRegion = activeRegion ? REGION_MAP[activeRegion] : null;
  const regionLocations = activeRegion ? LOCATIONS.filter(l => l.region === activeRegion) : [];

  const handleLocClick = (loc: Location) => {
    if (loc.status === 'hidden') return;
    setActiveLocation(loc);
    setActiveRegion(loc.region);
  };

  const handleRegionClick = (rid: RegionId) => {
    setActiveRegion(r => r === rid ? null : rid);
    setActiveLocation(null);
  };

  // ── Styles ──────────────────────────────────────────────────────────────────
  const S = {
    page: {
      minHeight: '100vh',
      background: '#0a0804',
      color: '#fde68a',
      fontFamily: 'var(--font-body)',
    } as React.CSSProperties,

    header: {
      borderBottom: '1px solid rgba(120,60,10,0.4)',
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(8px)',
      position: 'sticky' as const,
      top: 0,
      zIndex: 50,
    } as React.CSSProperties,

    headerInner: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '12px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
    } as React.CSSProperties,

    backBtn: {
      background: 'none',
      border: 'none',
      color: '#d97706',
      cursor: 'pointer',
      fontSize: '0.8rem',
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      padding: '4px 8px',
      borderRadius: 6,
      transition: 'color 0.2s',
    } as React.CSSProperties,

    content: {
      maxWidth: 1200,
      margin: '0 auto',
      padding: '16px',
    } as React.CSSProperties,

    // MAP
    mapOuter: {
      position: 'relative' as const,
      width: '100%',
      borderRadius: 12,
      overflow: 'hidden',
      border: '1px solid rgba(120,60,10,0.5)',
      boxShadow: '0 8px 40px rgba(0,0,0,0.8)',
      background: '#0a0804',
    } as React.CSSProperties,

    mapImg: {
      width: '100%',
      height: 'auto',
      display: 'block',
      userSelect: 'none' as const,
    } as React.CSSProperties,

    hotspotLayer: {
      position: 'absolute' as const,
      inset: 0,
    } as React.CSSProperties,

    // BOTTOM PANEL
    bottomPanel: {
      marginTop: 16,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: 12,
    } as React.CSSProperties,

    regionGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 8,
    } as React.CSSProperties,

    regionCard: (r: Region, active: boolean) => ({
      background: active ? r.bgColor : 'rgba(0,0,0,0.5)',
      border: `1px solid ${active ? r.color + '80' : 'rgba(80,40,10,0.35)'}`,
      borderRadius: 10,
      padding: '10px 12px',
      cursor: 'pointer',
      textAlign: 'left' as const,
      transition: 'all 0.2s',
      boxShadow: active ? `0 0 14px ${r.color}28` : 'none',
      outline: 'none',
    } as React.CSSProperties),

    detailPanel: {
      background: 'rgba(0,0,0,0.6)',
      border: '1px solid rgba(80,40,10,0.4)',
      borderRadius: 10,
      padding: 16,
      minHeight: 220,
    } as React.CSSProperties,

    // STORY ARC
    storyGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
      gap: 8,
      marginTop: 16,
    } as React.CSSProperties,

    chapterCard: (active: boolean) => ({
      padding: '10px 12px',
      borderRadius: 8,
      border: `1px solid ${active ? 'rgba(180,120,20,0.5)' : 'rgba(80,40,10,0.2)'}`,
      background: active ? 'rgba(120,60,0,0.2)' : 'rgba(0,0,0,0.2)',
      opacity: active ? 1 : 0.5,
      textAlign: 'center' as const,
    } as React.CSSProperties),
  };

  return (
    <div style={S.page}>

      {/* ── Header ── */}
      <div style={S.header}>
        <div style={S.headerInner}>
          <button style={S.backBtn} onClick={() => navigate('/')}>
            ← World Map
          </button>
          <div style={{ width: 1, height: 16, background: 'rgba(120,60,10,0.5)' }} />
          <div>
            <div style={{ fontFamily: 'var(--font-title)', fontSize: '0.85rem', color: '#f59e0b', letterSpacing: '0.15em' }}>
              NEO GAIA
            </div>
            <div style={{ fontSize: '0.65rem', color: '#92400e', letterSpacing: '0.1em' }}>
              Explore. Fight. Save the Planet.
            </div>
          </div>
          {/* Region progress bar strip */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
            {REGIONS.filter(r => r.status !== 'hidden').map(r => (
              <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.7rem' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: r.color }} />
                <span style={{ color: '#78350f' }}>{r.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={S.content}>

        {/* ── Map ── */}
        <div style={S.mapOuter}>
          <img
            src={MAP_URL}
            alt="Neo Gaia World Map"
            style={S.mapImg}
            draggable={false}
          />

          {/* ── Hotspot overlay ── */}
          <div style={S.hotspotLayer}>
            {LOCATIONS.map(loc => {
              const isHovered  = hoveredLoc === loc.id;
              const isSelected = activeLocation?.id === loc.id;
              const isHidden   = loc.status === 'hidden';
              const color = isHidden ? '#A78BFA' : TYPE_COLOR[loc.type];
              const size  = loc.isPlayerStart ? 18 : 12;

              return (
                <div
                  key={loc.id}
                  style={{
                    position: 'absolute',
                    left: `${loc.x}%`,
                    top:  `${loc.y}%`,
                    transform: 'translate(-50%, -50%)',
                    zIndex: isSelected ? 20 : isHovered ? 10 : 1,
                  }}
                  onMouseEnter={() => setHoveredLoc(loc.id)}
                  onMouseLeave={() => setHoveredLoc(null)}
                  onClick={() => handleLocClick(loc)}
                  onKeyDown={(e) => e.key === 'Enter' && handleLocClick(loc)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select location: ${loc.name}`}
                >
                  {/* Pulse ring */}
                  {(isHovered || isSelected) && !isHidden && (
                    <div style={{
                      position: 'absolute',
                      width: size * 2.5,
                      height: size * 2.5,
                      borderRadius: '50%',
                      background: color,
                      opacity: 0.25,
                      transform: 'translate(-50%, -50%)',
                      top: '50%', left: '50%',
                      animation: 'pulse-glow 1s ease-in-out infinite',
                      pointerEvents: 'none',
                    }} />
                  )}

                  {/* Marker */}
                  <button
                    aria-label={loc.name}
                    style={{
                      width: size,
                      height: size,
                      borderRadius: '50%',
                      background: loc.isPlayerStart ? '#38BDF8' : color,
                      border: loc.isPlayerStart ? '2px solid white' : `1.5px solid rgba(255,255,255,0.5)`,
                      boxShadow: `0 0 ${isSelected ? 12 : isHovered ? 8 : 4}px ${color}`,
                      opacity: isHidden ? 0.4 : 1,
                      cursor: isHidden ? 'not-allowed' : 'pointer',
                      transform: `scale(${isSelected ? 1.6 : isHovered ? 1.3 : 1})`,
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '7px',
                      color: '#0a0804',
                      fontWeight: 'bold',
                      outline: 'none',
                      padding: 0,
                      position: 'relative',
                    }}
                  >
                    {loc.isPlayerStart && '▲'}
                  </button>

                  {/* Tooltip */}
                  {isHovered && (
                    <div style={{
                      position: 'absolute',
                      bottom: '130%',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: 'rgba(10,5,0,0.95)',
                      border: `1px solid ${color}`,
                      borderRadius: 8,
                      padding: '6px 10px',
                      minWidth: 130,
                      textAlign: 'center',
                      pointerEvents: 'none',
                      zIndex: 100,
                      boxShadow: `0 4px 20px rgba(0,0,0,0.8), 0 0 8px ${color}40`,
                      whiteSpace: 'nowrap',
                    }}>
                      <div style={{ fontSize: '0.72rem', fontWeight: 'bold', color: 'white' }}>{loc.name}</div>
                      <div style={{ fontSize: '0.62rem', color, marginTop: 2 }}>
                        {TYPE_ICON[loc.type]} {loc.type}
                      </div>
                      {isHidden && <div style={{ fontSize: '0.6rem', color: '#A78BFA', marginTop: 2 }}>🔒 Sealed</div>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Bottom Panel ── */}
        <div style={S.bottomPanel}>

          {/* Region cards */}
          <div>
            <div style={S.regionGrid}>
              {REGIONS.map(region => (
                <button
                  key={region.id}
                  style={S.regionCard(region, activeRegion === region.id)}
                  onClick={() => handleRegionClick(region.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleRegionClick(region.id)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Select region: ${region.name}`}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <span style={{ fontSize: '0.9rem' }}>{region.icon}</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 'bold', color: '#fde68a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {region.name}
                    </span>
                    {region.status === 'hidden' && <span style={{ fontSize: '0.6rem', color: '#a78bfa', marginLeft: 'auto', flexShrink: 0 }}>🔒</span>}
                  </div>
                  <div style={{ fontSize: '0.6rem', color: '#92400e', marginBottom: 8 }}>{region.subtitle}</div>
                  {region.status !== 'hidden' ? (
                    <>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', marginBottom: 4 }}>
                        <span style={{ color: '#78350f' }}>Progress</span>
                        <span style={{ color: region.color }}>{region.progress}%</span>
                      </div>
                      <div style={{ width: '100%', height: 3, background: 'rgba(120,60,0,0.3)', borderRadius: 2, overflow: 'hidden' }}>
                        <div style={{ width: `${region.progress}%`, height: '100%', background: region.color, borderRadius: 2, transition: 'width 0.5s ease' }} />
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: '0.62rem', color: '#7c3aed' }}>Region Sealed</div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div style={S.detailPanel}>
            {activeLocation ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 12 }}>
                  <div>
                    <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: TYPE_COLOR[activeLocation.type], marginBottom: 4 }}>
                      {TYPE_ICON[activeLocation.type]} {activeLocation.type}
                    </div>
                    <div style={{ fontSize: '1rem', fontWeight: 'bold', color: '#fde68a', lineHeight: 1.2 }}>{activeLocation.name}</div>
                    <div style={{ fontSize: '0.68rem', color: '#78350f', marginTop: 3 }}>{REGION_MAP[activeLocation.region].name}</div>
                  </div>
                  {activeLocation.isPlayerStart && (
                    <span style={{ background: 'rgba(14,116,144,0.3)', border: '1px solid rgba(56,189,248,0.5)', color: '#38bdf8', fontSize: '0.6rem', padding: '3px 8px', borderRadius: 20, flexShrink: 0 }}>
                      ▲ Start
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '0.78rem', color: '#d97706', lineHeight: 1.6, marginBottom: 12 }}>{activeLocation.desc}</p>
                {selectedRegion && (
                  <div style={{ borderTop: '1px solid rgba(80,40,10,0.3)', paddingTop: 10 }}>
                    <div style={{ fontSize: '0.6rem', color: '#78350f', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>Region Lore</div>
                    <p style={{ fontSize: '0.72rem', color: '#92400e', lineHeight: 1.6 }}>{selectedRegion.lore}</p>
                  </div>
                )}
              </div>
            ) : selectedRegion ? (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: '1.1rem' }}>{selectedRegion.icon}</span>
                  <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: '#fde68a' }}>{selectedRegion.name}</div>
                </div>
                <div style={{ fontSize: '0.68rem', color: '#78350f', marginBottom: 8 }}>{selectedRegion.subtitle}</div>
                <p style={{ fontSize: '0.76rem', color: '#d97706', lineHeight: 1.6, marginBottom: 12 }}>{selectedRegion.lore}</p>
                <div style={{ fontSize: '0.6rem', color: '#78350f', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: 6 }}>Locations</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {regionLocations.map(loc => (
                    <button key={loc.id} onClick={() => setActiveLocation(loc)}
                      style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: 6,
                        background: 'rgba(0,0,0,0)', border: 'none', cursor: 'pointer', textAlign: 'left',
                        transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(120,60,0,0.2)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0)')}
                    >
                      <span style={{ fontSize: '0.8rem' }}>{TYPE_ICON[loc.type]}</span>
                      <span style={{ fontSize: '0.75rem', color: '#fbbf24' }}>{loc.name}</span>
                      <span style={{ marginLeft: 'auto', color: '#78350f', fontSize: '0.7rem' }}>›</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', textAlign: 'center', gap: 10, padding: '30px 0' }}>
                <div style={{ fontSize: '2rem' }}>🗺️</div>
                <div style={{ fontSize: '0.8rem', color: '#78350f' }}>Tap a region card or<br/>a marker on the map</div>
                <div style={{ fontSize: '0.65rem', color: '#451a03' }}>25 locations across 6 regions</div>
              </div>
            )}
          </div>

        </div>

        {/* ── Story Arc ── */}
        <div style={{ marginTop: 24, background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(80,40,10,0.4)', borderRadius: 10, padding: 16 }}>
          <div style={{ fontSize: '0.65rem', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 12, fontFamily: 'var(--font-title)' }}>
            Story Arc
          </div>
          <div style={S.storyGrid}>
            {[
              { ch:'01', title:'Bloomheart Incident', region:'Verdant Bloom',     active:true },
              { ch:'02', title:'Echoes of Midgar',    region:'Crown Dominion',    active:true },
              { ch:'03', title:'The Iron Rebellion',  region:'Ironwild Frontier', active:false },
              { ch:'04', title:'The Frozen Truth',    region:'Frostveil Barrens', active:false },
              { ch:'05', title:'The Skyfall War',     region:'All Regions',       active:false },
            ].map(c => (
              <div key={c.ch} style={S.chapterCard(c.active)}>
                <div style={{ fontSize: '0.6rem', color: '#d97706', fontWeight: 'bold', marginBottom: 4, letterSpacing: '0.1em' }}>
                  CHAPTER {c.ch}
                </div>
                <div style={{ fontSize: '0.78rem', fontWeight: 'bold', color: '#fde68a', lineHeight: 1.3, marginBottom: 4 }}>
                  {c.title}
                </div>
                <div style={{ fontSize: '0.62rem', color: '#92400e' }}>{c.region}</div>
                {c.active && (
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', margin: '8px auto 0', animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Tech tags ── */}
        <div style={{ marginTop: 16, display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
          {['Unreal Engine 5', 'PostgreSQL + PostGIS', 'NestJS', 'GeoJSON Pipeline', 'Nanite + Lumen', 'PCG Framework'].map(t => (
            <span key={t} style={{ fontSize: '0.65rem', color: '#78350f', border: '1px solid rgba(80,40,10,0.3)', padding: '3px 10px', borderRadius: 20, background: 'rgba(0,0,0,0.3)' }}>
              {t}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};

export default NeoGaiaQuest;
