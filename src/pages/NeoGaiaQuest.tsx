/**
 * Neo Gaia Quest Page — Phase 1 (Image Map Edition)
 * Uses the real Neo Gaia Mini Map as the background with interactive hotspots.
 */
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ── Types ─────────────────────────────────────────────────────────────────────
type RegionId = 'crown' | 'ironwild' | 'verdant' | 'frostveil' | 'azure' | 'southern';
type LocationType = 'town' | 'dungeon' | 'shrine' | 'outpost' | 'observatory' | 'fortress' | 'wilderness' | 'crystal';

interface Location {
  id: string;
  name: string;
  type: LocationType;
  x: number;  // % of image width
  y: number;  // % of image height
  region: RegionId;
  desc: string;
  status: 'active' | 'locked' | 'hidden';
  isPlayerStart?: boolean;
}

interface Region {
  id: RegionId;
  name: string;
  subtitle: string;
  progress: number;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  lore: string;
  status: 'active' | 'locked' | 'hidden';
}

// ── Region Data ───────────────────────────────────────────────────────────────
const REGIONS: Region[] = [
  {
    id: 'crown',
    name: 'The Crown Dominion',
    subtitle: 'Central Region',
    progress: 45,
    color: '#F59E0B',
    bgColor: 'rgba(245,158,11,0.15)',
    borderColor: 'rgba(245,158,11,0.6)',
    icon: '👑',
    lore: 'The seat of power at the heart of Neo Gaia. A towering city-state where arcane guilds and merchant lords vie for dominance. Aurelia Prime — the capital — pulses with mako energy and political intrigue.',
    status: 'active',
  },
  {
    id: 'verdant',
    name: 'Verdant Bloom',
    subtitle: 'North-East Region',
    progress: 38,
    color: '#22C55E',
    bgColor: 'rgba(34,197,94,0.15)',
    borderColor: 'rgba(34,197,94,0.6)',
    icon: '🌿',
    lore: 'Giant botanical ecosystems tower over overgrown ruins and jungle canals. Magical conservatories house species found nowhere else in Neo Gaia. The Bloomheart Conservatory holds secrets older than the Aether Wells.',
    status: 'active',
  },
  {
    id: 'ironwild',
    name: 'Ironwild Frontier',
    subtitle: 'West Region',
    progress: 26,
    color: '#F97316',
    bgColor: 'rgba(249,115,22,0.15)',
    borderColor: 'rgba(249,115,22,0.6)',
    icon: '⚔️',
    lore: 'An industrial wasteland scarred by centuries of magitek excavation. Mako reactors burn day and night. The Ferrum Bastion stands as the last organised city before the Tuas Wastelands swallow everything west.',
    status: 'active',
  },
  {
    id: 'frostveil',
    name: 'Frostveil Barrens',
    subtitle: 'North Region',
    progress: 30,
    color: '#60A5FA',
    bgColor: 'rgba(96,165,250,0.15)',
    borderColor: 'rgba(96,165,250,0.6)',
    icon: '❄️',
    lore: 'Frozen mountains hide abandoned SOLDIER laboratories and dimensional anomalies. Frostveil Citadel overlooks an endless white expanse. Few venture here willingly — fewer still return unchanged.',
    status: 'active',
  },
  {
    id: 'azure',
    name: 'Azure Coastlands',
    subtitle: 'East Region',
    progress: 33,
    color: '#38BDF8',
    bgColor: 'rgba(56,189,248,0.15)',
    borderColor: 'rgba(56,189,248,0.6)',
    icon: '⚓',
    lore: 'Crystal oceans and flooded temples stretch along the eastern coast. Naval kingdoms rule from above the waterline while ancient civilisations slumber below. Leviathan stirs in the deep.',
    status: 'active',
  },
  {
    id: 'southern',
    name: 'Southern Isles',
    subtitle: 'Hidden Region',
    progress: 0,
    color: '#A78BFA',
    bgColor: 'rgba(167,139,250,0.15)',
    borderColor: 'rgba(167,139,250,0.5)',
    icon: '👁️',
    lore: 'A scattered archipelago sealed from the main continent. Rumours speak of an ancient pact and a sanctuary untouched by war. Access requires the Lazarus Key — its whereabouts unknown.',
    status: 'hidden',
  },
];

// ── Location Data ─────────────────────────────────────────────────────────────
const LOCATIONS: Location[] = [
  // Crown Dominion
  { id:'aurelia_prime',      name:'Aurelia Prime',         type:'town',        x:50.0, y:55.5, region:'crown',    isPlayerStart:true, status:'active', desc:'Capital of Neo Gaia. Hub of all political power. The Aether Spire reaches beyond the clouds.' },
  { id:'orchard_heights',    name:'Orchard Heights',       type:'town',        x:43.5, y:48.0, region:'crown',    status:'active', desc:'Affluent upper district. Home to the Arcane Merchant Guild and the Grand Bazaar.' },
  { id:'queenstown_ward',    name:'Queenstown Ward',       type:'outpost',     x:44.0, y:62.5, region:'crown',    status:'active', desc:'Industrial lower district. SOLDIER recruitment offices and black-market trade.' },
  { id:'marina_spire',       name:'Marina Spire',          type:'crystal',     x:50.5, y:70.5, region:'crown',    status:'active', desc:'Fast Travel Crystal hub. MRT Crystal Lines converge at this coastal terminus.' },
  { id:'downtown_core',      name:'Downtown Core',         type:'town',        x:57.5, y:62.0, region:'crown',    status:'active', desc:'Financial district controlled by the Shinra Trading Consortium.' },

  // Ironwild Frontier
  { id:'ferrum_bastion',     name:'Ferrum Bastion',        type:'town',        x:30.0, y:66.0, region:'ironwild', status:'active', desc:'Fortress city of the western frontier. Heavy magitek armour patrols the perimeter.' },
  { id:'tuas_megaforge',     name:'Tuas Megaforge',        type:'dungeon',     x:17.5, y:52.0, region:'ironwild', status:'active', desc:'Massive industrial dungeon. Autonomous war machines are mass-produced in the lower levels.' },
  { id:'jurong_wastes',      name:'Jurong Wastes',         type:'wilderness',  x:27.0, y:73.0, region:'ironwild', status:'active', desc:'Toxic wasteland. Mutated creatures roam the ruins of old petrochemical plants.' },
  { id:'tengah_outpost',     name:'Tengah Outpost',        type:'outpost',     x:36.5, y:42.5, region:'ironwild', status:'active', desc:'Military staging point on the border between Ironwild and Crown Dominion.' },

  // Verdant Bloom
  { id:'bloomheart',         name:'Bloomheart Conservatory', type:'dungeon',   x:73.5, y:40.0, region:'verdant',  status:'active', desc:'A living dungeon of impossible scale. The conservatory breathes with Aether energy. Chapter 1 boss located here.' },
  { id:'sengkang_wilds',     name:'Sengkang Wilds',        type:'wilderness',  x:68.0, y:53.0, region:'verdant',  status:'active', desc:'Dense overgrown jungle. Druidic settlements hide among the roots of giant Aether Trees.' },
  { id:'hougang_gardens',    name:'Hougang Gardens',       type:'shrine',      x:77.0, y:55.5, region:'verdant',  status:'active', desc:'Summon Shrine of the Forest Titan. Offerings of rare flora required for activation.' },
  { id:'seletar_skyfields',  name:'Seletar Skyfields',     type:'outpost',     x:80.0, y:20.0, region:'verdant',  status:'active', desc:'Aerial docking platform. Skyships connect Verdant Bloom to the Crown Dominion.' },
  { id:'punggol_promenade',  name:'Punggol Promenade',     type:'town',        x:89.5, y:22.5, region:'verdant',  status:'active', desc:'Coastal town known for its floating markets and Chocobo racing track.' },

  // Frostveil Barrens
  { id:'frostveil_citadel',  name:'Frostveil Citadel',     type:'fortress',    x:50.5, y:5.5,  region:'frostveil',status:'active', desc:'Ancient fortress at the frozen peak. Chapter 4 — the truth about SOLDIER experiments surfaces here.' },
  { id:'woodlands_bastion',  name:'Woodlands Bastion',     type:'town',        x:30.0, y:24.5, region:'frostveil',status:'active', desc:'Northern garrison city. Last supply stop before the frozen wastes.' },
  { id:'yishun_depths',      name:'Yishun Depths',         type:'dungeon',     x:48.5, y:33.0, region:'frostveil',status:'active', desc:'Underground cavern system. Dimensional rifts open unpredictably in the lower chambers.' },
  { id:'mandai_observatory', name:'Mandai Observatory',    type:'observatory', x:60.5, y:20.5, region:'frostveil',status:'active', desc:'Ancient star-tracking facility. Houses records of all six Aether Well activation cycles.' },

  // Azure Coastlands
  { id:'changi_lighthouse',  name:'Changi Lighthouse',     type:'fortress',    x:91.5, y:48.5, region:'azure',    status:'active', desc:'Watchtower of the eastern sea. Signals to offshore naval fleets defending the Crystal Shoals.' },
  { id:'pasir_ris',          name:'Pasir Ris Shoreline',   type:'town',        x:83.5, y:63.0, region:'azure',    status:'active', desc:'Fishing village turned navy port. The underwater ruins beneath the bay remain unexplored.' },
  { id:'leviathan_shrine',   name:'Leviathan Shrine',      type:'shrine',      x:78.5, y:72.5, region:'azure',    status:'active', desc:'Summon Shrine of the Sea God. Submerged at high tide. Leviathan stirs in the deep.' },
  { id:'junon_fortress',     name:'Junon Naval Fortress',  type:'fortress',    x:87.5, y:78.0, region:'azure',    status:'active', desc:'Impenetrable naval stronghold. Chapter 5 — the Skyfall War begins with a bombardment from these cannons.' },

  // Southern Isles
  { id:'sentosa_haven',      name:'Sentosa Haven',         type:'town',        x:40.0, y:88.0, region:'southern', status:'hidden', desc:'A paradise island untouched by the mainland wars. Accessible only via the Lazarus Gate.' },
  { id:'lazarus_sanctum',    name:'Lazarus Sanctum',       type:'dungeon',     x:52.0, y:88.5, region:'southern', status:'hidden', desc:'Final dungeon of the hidden region. The source of the dimensional anomalies originates here.' },
  { id:'st_johns',           name:"St. John's Refuge",     type:'outpost',     x:63.5, y:87.5, region:'southern', status:'hidden', desc:'Survivor settlement. The only people who know the truth about the Southern Isles live here.' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const TYPE_ICON: Record<LocationType, string> = {
  town: '🏰', dungeon: '⚔️', shrine: '💎', outpost: '🏯',
  observatory: '🔭', fortress: '🛡️', wilderness: '🌿', crystal: '🔷',
};
const TYPE_COLOR: Record<LocationType, string> = {
  town: '#F59E0B', dungeon: '#EF4444', shrine: '#A78BFA', outpost: '#94A3B8',
  observatory: '#60A5FA', fortress: '#F97316', wilderness: '#22C55E', crystal: '#38BDF8',
};
const REGION_MAP = Object.fromEntries(REGIONS.map(r => [r.id, r]));

// ── Component ─────────────────────────────────────────────────────────────────
export const NeoGaiaQuest = () => {
  const navigate = useNavigate();
  const [activeRegion, setActiveRegion] = useState<RegionId | null>(null);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  const [hoveredLoc, setHoveredLoc] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  const selectedRegion = activeRegion ? REGION_MAP[activeRegion] : null;
  const regionLocations = activeRegion ? LOCATIONS.filter(l => l.region === activeRegion) : [];

  const handleLocClick = (loc: Location) => {
    if (loc.status === 'hidden') return;
    setActiveLocation(loc);
    setActiveRegion(loc.region);
  };

  return (
    <div className="min-h-screen bg-[#0a0804] text-amber-100 font-serif">

      {/* ── Header ── */}
      <div className="border-b border-amber-900/40 bg-black/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-amber-600 hover:text-amber-400 transition-colors text-sm">
            <>← World Map</>
          </button>
          <div className="h-4 w-px bg-amber-900/50"/>
          <div>
            <h1 className="text-amber-400 font-bold tracking-widest text-sm uppercase">Neo Gaia</h1>
            <p className="text-amber-700 text-xs">Explore. Fight. Save the Planet.</p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-3">
            {REGIONS.filter(r => r.status !== 'hidden').map(r => (
              <div key={r.id} className="flex items-center gap-1.5 text-xs">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: r.color }}/>
                <span className="text-amber-700">{r.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-6">

        {/* ── Map Container ── */}
        <div className="relative w-full rounded-xl overflow-hidden border border-amber-900/50 shadow-2xl shadow-amber-950/50" ref={mapRef}>

          {/* The actual map image */}
          <img
            src="/portfolio/neo-gaia-map.png"
            alt="Neo Gaia World Map"
            className="w-full h-auto block select-none"
            draggable={false}
          />

          {/* ── Location Hotspots overlay ── */}
          <div className="absolute inset-0">
            {LOCATIONS.map(loc => {
              const isHovered = hoveredLoc === loc.id;
              const isSelected = activeLocation?.id === loc.id;
              const isHidden = loc.status === 'hidden';
              const color = isHidden ? '#A78BFA' : TYPE_COLOR[loc.type];

              return (
                <div
                  key={loc.id}
                  className="absolute"
                  style={{ left: `${loc.x}%`, top: `${loc.y}%`, transform: 'translate(-50%, -50%)' }}
                  onMouseEnter={() => setHoveredLoc(loc.id)}
                  onMouseLeave={() => setHoveredLoc(null)}
                  onClick={() => handleLocClick(loc)}
                >
                  {/* Pulse ring on hover / selected */}
                  {(isHovered || isSelected) && !isHidden && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{
                        width: 24, height: 24,
                        transform: 'translate(-50%, -50%) translate(50%, 50%)',
                        background: color,
                        opacity: 0.35,
                      }}
                    />
                  )}

                  {/* Marker dot */}
                  <button
                    className={`relative rounded-full flex items-center justify-center transition-all duration-150 cursor-pointer
                      ${isHidden ? 'opacity-40' : 'opacity-90 hover:opacity-100'}
                      ${isSelected ? 'scale-150 z-20' : isHovered ? 'scale-125 z-10' : 'scale-100'}
                    `}
                    style={{
                      width: loc.isPlayerStart ? 20 : 14,
                      height: loc.isPlayerStart ? 20 : 14,
                      background: loc.isPlayerStart ? '#38BDF8' : color,
                      boxShadow: `0 0 ${isSelected ? 12 : 6}px ${color}`,
                      border: loc.isPlayerStart ? '2px solid white' : `1.5px solid rgba(255,255,255,0.4)`,
                    }}
                    aria-label={loc.name}
                  >
                    {loc.isPlayerStart && (
                      <span className="text-[7px] font-bold text-slate-900">▲</span>
                    )}
                  </button>

                  {/* Tooltip */}
                  {isHovered && (
                    <div
                      className="absolute z-30 pointer-events-none"
                      style={{
                        left: '50%',
                        bottom: '120%',
                        transform: 'translateX(-50%)',
                        minWidth: 140,
                      }}
                    >
                      <div className="bg-slate-900/95 border rounded-lg px-2.5 py-2 text-center shadow-xl backdrop-blur-sm"
                           style={{ borderColor: color }}>
                        <p className="text-xs font-bold text-white whitespace-nowrap">{loc.name}</p>
                        <p className="text-[10px] mt-0.5" style={{ color }}>
                          {TYPE_ICON[loc.type]} {loc.type}
                        </p>
                        {isHidden && <p className="text-[9px] text-purple-400 mt-0.5">🔒 Locked</p>}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Bottom Panel — Region + Location info ── */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Region cards */}
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {REGIONS.map(region => (
              <button
                key={region.id}
                onClick={() => {
                  setActiveRegion(r => r === region.id ? null : region.id);
                  setActiveLocation(null);
                }}
                className={`text-left p-3 rounded-xl border transition-all duration-200 ${
                  activeRegion === region.id ? 'ring-1' : 'hover:scale-[1.02]'
                }`}
                style={{
                  background: activeRegion === region.id ? region.bgColor : 'rgba(0,0,0,0.4)',
                  borderColor: activeRegion === region.id ? region.borderColor : 'rgba(120,80,20,0.3)',
                  boxShadow: activeRegion === region.id ? `0 0 12px ${region.color}30` : 'none',
                  // @ts-ignore
                  '--tw-ring-color': region.borderColor,
                }}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <span style={{ color: region.color }}>{region.icon}</span>
                  <span className="text-xs font-bold text-amber-200 truncate">{region.name}</span>
                  {region.status === 'hidden' && <span className="text-purple-400 text-xs">🔒</span>}
                </div>
                <p className="text-[10px] text-amber-600 mb-2">{region.subtitle}</p>
                {region.status !== 'hidden' ? (
                  <div>
                    <div className="flex justify-between text-[10px] mb-1">
                      <span className="text-amber-600">Progress</span>
                      <span style={{ color: region.color }}>{region.progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-amber-950 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                           style={{ width: `${region.progress}%`, background: region.color }}/>
                    </div>
                  </div>
                ) : (
                  <p className="text-[10px] text-purple-400">🔒 Region Sealed</p>
                )}
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="rounded-xl border border-amber-900/40 bg-black/50 p-4 min-h-[200px]">
            {activeLocation ? (
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest mb-1"
                       style={{ color: TYPE_COLOR[activeLocation.type] }}>
                      {TYPE_ICON[activeLocation.type]} {activeLocation.type}
                    </p>
                    <h3 className="text-amber-200 font-bold text-base leading-tight">{activeLocation.name}</h3>
                    <p className="text-xs text-amber-700 mt-0.5">{REGION_MAP[activeLocation.region].name}</p>
                  </div>
                  {activeLocation.isPlayerStart && (
                    <span className="shrink-0 text-[10px] bg-sky-900/60 border border-sky-700/50 text-sky-300 px-2 py-0.5 rounded-full">
                      ▲ Start
                    </span>
                  )}
                </div>
                <p className="text-xs text-amber-400/80 leading-relaxed mb-4">{activeLocation.desc}</p>
                {selectedRegion && (
                  <div className="border-t border-amber-900/30 pt-3">
                    <p className="text-[10px] text-amber-700 uppercase tracking-wider mb-1">Region Lore</p>
                    <p className="text-[11px] text-amber-600/80 leading-relaxed line-clamp-4">{selectedRegion.lore}</p>
                  </div>
                )}
              </div>
            ) : selectedRegion ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span style={{ color: selectedRegion.color }}>{selectedRegion.icon}</span>
                  <h3 className="text-amber-200 font-bold">{selectedRegion.name}</h3>
                </div>
                <p className="text-xs text-amber-600 mb-3">{selectedRegion.subtitle}</p>
                <p className="text-xs text-amber-400/80 leading-relaxed mb-4">{selectedRegion.lore}</p>
                <div className="space-y-1.5">
                  <p className="text-[10px] text-amber-700 uppercase tracking-wider">Locations</p>
                  {regionLocations.map(loc => (
                    <button
                      key={loc.id}
                      onClick={() => setActiveLocation(loc)}
                      className="w-full flex items-center gap-2 text-left px-2 py-1.5 rounded-lg hover:bg-amber-900/20 transition-colors"
                    >
                      <span className="text-xs">{TYPE_ICON[loc.type]}</span>
                      <span className="text-xs text-amber-300 flex-1">{loc.name}</span>
                      <span className="text-amber-700 text-xs">›</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3 py-8">
                <span className="text-4xl">🗺️</span>
                <p className="text-amber-700 text-sm">Tap a region card or<br/>a marker on the map</p>
                <p className="text-amber-900 text-xs">25 locations across 6 regions</p>
              </div>
            )}
          </div>
        </div>

        {/* ── Story Chapters ── */}
        <div className="mt-6 border border-amber-900/40 rounded-xl bg-black/40 p-4">
          <h2 className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-3">Story Arc</h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {[
              { ch:'01', title:'Bloomheart Incident',  region:'Verdant Bloom',      status:'active' },
              { ch:'02', title:'Echoes of Midgar',     region:'Crown Dominion',     status:'active' },
              { ch:'03', title:'The Iron Rebellion',   region:'Ironwild Frontier',  status:'planned' },
              { ch:'04', title:'The Frozen Truth',     region:'Frostveil Barrens',  status:'planned' },
              { ch:'05', title:'The Skyfall War',      region:'All Regions',        status:'planned' },
            ].map(c => (
              <div key={c.ch}
                className={`p-3 rounded-lg border text-center transition-all ${
                  c.status === 'active'
                    ? 'border-amber-600/50 bg-amber-950/40'
                    : 'border-amber-900/20 bg-black/20 opacity-50'
                }`}>
                <p className="text-amber-600 text-[10px] font-bold mb-1">CHAPTER {c.ch}</p>
                <p className="text-amber-200 text-xs font-bold leading-tight mb-1">{c.title}</p>
                <p className="text-amber-700 text-[10px]">{c.region}</p>
                {c.status === 'active' && (
                  <div className="mt-2 w-2 h-2 rounded-full bg-amber-500 mx-auto animate-pulse"/>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Tech Stack Note ── */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {['Unreal Engine 5', 'PostgreSQL + PostGIS', 'NestJS', 'GeoJSON Pipeline', 'Nanite + Lumen', 'PCG Framework'].map(t => (
            <span key={t} className="text-[10px] text-amber-800 border border-amber-900/30 px-2 py-0.5 rounded-full bg-amber-950/20">
              {t}
            </span>
          ))}
        </div>

      </div>
    </div>
  );
};

export default NeoGaiaQuest;
