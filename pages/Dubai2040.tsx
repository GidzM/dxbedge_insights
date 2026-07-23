
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import Card from '../components/Card';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';

interface DrawerContent {
  id: string;
  title: string;
  category: string;
  body: React.ReactNode;
}

const VerbatimText = ({ text }: { text: string }) => (
  <p
    className="text-brand-navy/80 text-[14px] leading-relaxed mb-4 font-medium"
    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
  >
    {text}
  </p>
);

const GoldBullets = ({ items }: { items: string[] }) => (
  <div className="space-y-5">
    {items.map((item, idx) => (
      <div key={idx} className="flex gap-4 items-start">
        <div className="w-1.5 h-1.5 bg-brand-gold mt-2.5 shrink-0" />
        <p
          className="text-brand-navy/80 text-[14px] leading-relaxed font-medium"
          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
        >
          {parseBoldData(item)}
        </p>
      </div>
    ))}
  </div>
);

const parseBoldData = (text: string) => {
  const highlightRegex = /(?:AED|USD|EUR|GBP|SAR|INR|CNY)\s?[\d,.]+(?:\s?(?:[BMKT]|billion|trillion|million))?|[$€£]\s?[\d,.]+(?:\s?(?:[BMKT]|billion|trillion|million))?(?:\s?[+])?|[\d,.]+(?:\s?[-–]\s?[\d,.]+)?%|\d+\s?M|\d+(?:\.\d+)?\s?million|\d+\s?minutes/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(highlightRegex)) {
    const start = match.index ?? 0;
    const value = match[0];

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    nodes.push(
      <strong key={`${start}-${value}`} className="text-brand-navy font-black">
        {value}
      </strong>
    );

    lastIndex = start + value.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : text;
};

const LocationWidget = ({ highlightNodes }: { highlightNodes: boolean }) => {
  const centers = [
    { id: '1', label: 'Deira/Bur Dubai', hub: 'Historical Hub', x: 250, y: 40 },
    { id: '2', label: 'Downtown/Business Bay', hub: 'Financial Hub', x: 195, y: 150 },
    { id: '3', label: 'Marina/JBR', hub: 'Tourism Hub', x: 130, y: 220 },
    { id: '4', label: 'Silicon Oasis', hub: 'Innovation Hub', x: 235, y: 185 },
    { id: '5', label: 'District 2020', hub: 'Logistics Hub', x: 165, y: 300 },
  ];

  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    try {
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/gman7714/cmrijbyf9009s01sifrr4ema9',
        center: [55.2708, 25.2048],
        zoom: 10.3,
      });

      map.on('load', async () => {
        const geoJsonCandidates = ['/data/growth-nodes.geojson', '/data/growth-nodes.geo.json'];
        let geoData: any = null;

        for (const url of geoJsonCandidates) {
          try {
            const response = await fetch(url);
            if (response.ok) {
              geoData = await response.json();
              break;
            }
          } catch {
            // Try next candidate.
          }
        }

        if (!geoData || !Array.isArray(geoData.features)) {
          return;
        }

        map.addSource('growth-nodes', {
          type: 'geojson',
          data: geoData,
        });

        const hubFeatures = geoData.features.filter((f: any) => f?.properties?.type === 'node');
        let minLng = Infinity;
        let minLat = Infinity;
        let maxLng = -Infinity;
        let maxLat = -Infinity;

        for (const feature of hubFeatures) {
          const coordinates = feature?.geometry?.coordinates;
          if (!coordinates) continue;

          const rings = feature.geometry.type === 'Polygon' ? coordinates : feature.geometry.type === 'MultiPolygon' ? coordinates.flat() : [];

          for (const ring of rings) {
            for (const point of ring) {
              const [lng, lat] = point;
              if (typeof lng !== 'number' || typeof lat !== 'number') continue;
              minLng = Math.min(minLng, lng);
              minLat = Math.min(minLat, lat);
              maxLng = Math.max(maxLng, lng);
              maxLat = Math.max(maxLat, lat);
            }
          }
        }

        if (Number.isFinite(minLng) && Number.isFinite(minLat) && Number.isFinite(maxLng) && Number.isFinite(maxLat)) {
          map.fitBounds(
            [
              [minLng, minLat],
              [maxLng, maxLat],
            ],
            {
              padding: 40,
              duration: 1200,
            }
          );
        }

        map.addLayer({
          id: 'node-fill',
          type: 'fill',
          source: 'growth-nodes',
          filter: ['==', ['get', 'type'], 'node'],
          paint: { 'fill-color': '#4A90E2', 'fill-opacity': 0.55 },
        });

        map.addLayer({
          id: 'node-outline',
          type: 'line',
          source: 'growth-nodes',
          filter: ['==', ['get', 'type'], 'node'],
          paint: { 'line-color': '#003f7f', 'line-width': 3 },
        });

        map.addLayer({
          id: 'surround-fill',
          type: 'fill',
          source: 'growth-nodes',
          filter: ['==', ['get', 'type'], 'surround'],
          paint: { 'fill-color': '#4A90E2', 'fill-opacity': 0.15 },
        });

        map.addLayer({
          id: 'corridor-line',
          type: 'line',
          source: 'growth-nodes',
          filter: ['==', ['get', 'type'], 'corridor'],
          paint: { 'line-color': '#ffffff', 'line-width': 3, 'line-dasharray': [2, 2] },
        });

        map.addLayer({
          id: 'coastal-baseline',
          type: 'line',
          source: 'growth-nodes',
          filter: ['==', ['get', 'type'], 'coast'],
          paint: { 'line-color': '#7FDBFF', 'line-width': 4 },
        });

        map.addLayer({
          id: 'node-labels',
          type: 'symbol',
          source: 'growth-nodes',
          filter: ['==', ['get', 'type'], 'node'],
          layout: { 'text-field': ['get', 'name'], 'text-size': 13, 'text-offset': [0, 0.6] },
          paint: { 'text-color': '#003f7f' },
        });
      });

      return () => map.remove();
    } catch (err) {
      // fail silently in environments without Mapbox token
    }
  }, []);

  return (
    <div
      className={`relative w-full h-[520px] bg-[#050C16] rounded-xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 ease-in-out font-sans box-border ${highlightNodes ? 'ring-1 ring-[#00E676]/30' : ''}`}
      role="region"
      aria-label="2040 Spatial Hierarchy map widget"
    >
      {/* Header */}
      <div className="bg-white/5 border-b border-white/5 px-6 py-2 flex justify-between items-center z-20 relative">
        <span className="text-[8px] font-black text-brand-gold uppercase tracking-[0.4em]">2040 SPATIAL HIERARCHY</span>
        <div className="flex items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-[#00E676] animate-pulse" />
          <span className="text-[7px] text-[#00E676]/60 font-black uppercase tracking-widest">Live Pulse</span>
        </div>
      </div>

      <div className="flex h-full flex-col lg:flex-row">
        {/* Map area */}
        <div className="w-full lg:w-[62%] h-[65%] lg:h-full relative lg:border-r border-white/5 p-4 flex items-center justify-center box-border min-w-0">
          <div className="w-full h-full flex flex-col">
            <div ref={mapContainerRef} className="w-full flex-1" />
            <div className="h-6" />
          </div>
        </div>

        {/* Legend area */}
        <aside className="w-full lg:w-[38%] h-[35%] lg:h-full bg-[#050C16] p-5 flex flex-col justify-between lg:border-l border-white/5 overflow-hidden min-w-0" aria-label="Map legend">
          <div className="space-y-5 pt-4 max-w-full">
            {centers.map((node) => (
              <div key={`legend-${node.id}`} className="flex flex-col">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className={`text-[10px] font-black transition-colors duration-500 ${highlightNodes ? 'text-[#00E676]' : 'text-white/20'}`}>0{node.id}</span>
                  <span className={`text-[9px] font-bold uppercase tracking-[0.12em] leading-tight break-words transition-colors duration-500 ${highlightNodes ? 'text-white' : 'text-white/20'}`}>{node.label}</span>
                </div>
                <p className={`text-[10px] font-serif italic transition-colors duration-500 ${highlightNodes ? 'text-brand-gold' : 'text-white/10'} break-words whitespace-normal`}>{node.hub}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-1 bg-[#7DA1C4] rounded-full" />
                <span className="text-[8px] font-black text-white/70 uppercase tracking-widest break-words">Coastal Baseline</span>
              </div>

              <div className="flex items-center gap-3">
                <svg width="24" height="4" viewBox="0 0 24 4" className="shrink-0">
                  <line x1="0" y1="2" x2="24" y2="2" stroke="white" strokeWidth="3" strokeDasharray="3 4" />
                </svg>
                <span className="text-[7px] sm:text-[8px] font-black text-white/70 uppercase tracking-[0.1em] leading-tight break-words max-w-full">E611 Strategic Corridor</span>
              </div>

              <div className="flex items-center gap-3">
                <div className={`w-2.5 h-2.5 rounded-full ${highlightNodes ? 'bg-[#00E676] shadow-[0_0_10px_#00E676]' : 'bg-white/10'}`} />
                <span className="text-[7px] sm:text-[8px] font-black text-white/70 uppercase tracking-[0.1em] leading-tight break-words max-w-full">Verified Growth Node</span>
              </div>
            </div>
            <p className="text-[6px] text-white/10 uppercase tracking-widest leading-none italic">Ref: 2040 Analysis</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

const Dubai2040: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<DrawerContent | null>(null);
  const [isCard1Hovered, setIsCard1Hovered] = useState(false);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [drawerOpen]);

  const openDrawer = (content: DrawerContent) => {
    setDrawerContent(content);
    setDrawerOpen(true);
  };

  const closeDrawer = () => setDrawerOpen(false);

  const copyDrawerText = () => {
    if (!drawerContent) return;
    const text = document.getElementById('dubai2040-drawer-body')?.innerText || '';
    navigator.clipboard.writeText(text);
    alert('Strategic intelligence copied to clipboard.');
  };

  return (
    <>
        <SEO
        title="Dubai 2040 Urban Master Plan | Growth Corridors & Real Estate Impact"
        description="Investor-focused analysis of the Dubai 2040 Urban Master Plan, mapping growth centres, infrastructure corridors, and the property opportunities they create."
        path="/dubai-2040"
        image="/media/dxb-edge-default.jpg"
        type="article"
        schemaType="Article"
        imageAlt="Dubai 2040 urban master plan strategic analysis"
        keywords={[
          'Dubai 2040',
          'Dubai urban master plan',
          'Dubai growth corridors',
          'Dubai infrastructure',
          'Dubai real estate strategy',
          'Dubai spatial planning',
          'Dubai development outlook',
        ]}
        jsonLd
      />
    <div className="max-w-[92rem] mx-auto py-16 px-6 md:px-8 lg:px-10 animate-fadeIn pb-32">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Insights', href: '/insights' },
          { label: 'Strategic Outlook', href: '/insights/strategic-outlook' },
          { label: 'Dubai 2040 Vision', href: '/insights/strategic-outlook/dubai-2040' },
        ]}
        className="mb-8"
      />

      {/* Header Section */}
      <header className="mb-16 border-l-4 border-brand-gold pl-10">
        <h1 className="text-5xl lg:text-6xl font-serif font-bold text-brand-navy mb-6 italic tracking-tight">Dubai 2040 Urban Master Plan</h1>
        <p className="text-xl lg:text-2xl text-slate-grey max-w-4xl leading-relaxed font-serif italic opacity-80">
          The structural roadmap for global liveability. A spatial strategy designed to accommodate a transition to <span className="text-brand-gold font-bold">5.8 million residents</span>. [Source: Dubai 2040 Plan]
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-8 lg:gap-10 items-start">
        {/* Cards area — 2.5 of 4 desktop columns (5/8) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-5 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Urban Hierarchy */}
            <div 
              onMouseEnter={() => setIsCard1Hovered(true)} 
              onMouseLeave={() => setIsCard1Hovered(false)}
              className="h-full"
            >
              <Card
                category="Urban Hierarchy"
                title="Urban Hierarchy & Centres"
                image="https://images.unsplash.com/photo-1607414851776-f2fcc379fb48?auto=format&fit=crop&q=80&w=800"
                points={[
                  "Structural focus on 5 primary growth nodes: Deira/Bur Dubai, Downtown/Business Bay, Dubai Marina/JBR, Expo 2020 Centre, and Dubai Silicon Oasis .",
                  "Strategic integration of 2 emerging centres: Silicon Oasis and District 2020.",
                  "Density targeted at 4,200 people per km² within these urban boundaries.",
                  "13 multi-sector centres and 40 specialised hubs to distribute economic activity."
                ]}
                isPremium
                onMore={() => openDrawer({
                  id: 'urban-centres',
                  category: 'Spatial Hierarchy',
                  title: 'The Six Major Urban Centres',
                  body: (
                    <div className="space-y-6">
                      <VerbatimText text="Dubai will evolve into a polycentric city with six major urban centres — three existing (Deira/Bur Dubai, Downtown/Sheikh Zayed Road, Dubai Marina) and three developing (Silicon Oasis, District 2020 by 2040, and Jebel Ali post-2040)." />
                      <GoldBullets items={[
                        "Population density within designated urban areas will increase from 2,500 to 4,200 people per km².",
                        "The plan supports the expansion of high-tech and knowledge-based sectors in Silicon Oasis.",
                        "Development is strictly organised into four zones: Urban Zone, Peri-Urban Zone, Rural Zone, and Marine Zone.",
                        "Future growth is contained within a defined Urban Area stretching from the coastline to the E611 corridor."
                      ]} />
                    </div>
                  )
                })}
              />
            </div>

            {/* Card 2: 20-Minute City */}
            <Card
              category="Liveability"
              title="The 20-Minute City"
              image="https://images.unsplash.com/photo-1550779864-6ccb28702fdb?auto=format&fit=crop&q=80&w=800"
              points={[
                "Strategic goal: 55% of residents live within 800 meters of transit, with daily needs reachable in 20 minutes by foot or bike.",
                "Structural focus on essential services proximity to residential clusters.",
                "Soft mobility networks with shaded pedestrian and cycling routes throughout core zones.",
                "Increases rental appeal for properties with walkable access to services."
              ]}
              onMore={() => openDrawer({
                id: '20-min-city',
                category: 'Urban Mobility',
                title: '20-Minute City Model Details',
                body: (
                  <div className="space-y-6">
                    <VerbatimText text="The 20-minute city model boosts the appeal of properties located near transit stations and mixed-use centres, ensuring essential services are within 20–30 minutes of reach." />
                    <GoldBullets items={[
                      "Essential services will be accessible within 20–30 minutes by walking, cycling, or public transport.",
                      "Implementation includes shaded pedestrian paths and on-demand bus services to improve last-mile connectivity.",
                      "Transit accessibility becomes a key differentiator for rental demand as public transport expands.",
                      "Reduces car dependency and enhances the liveability score of urban core districts."
                    ]} />
                  </div>
                )
              })}
            />

            {/* Card 3: Green & Nature */}
            <Card
              category="Environmental"
              title="Green & Nature Reserves"
              image="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80&w=800"
              points={[
                "60% of Dubai's total land area will be nature reserves and natural conservation areas.",
                "Total open space to nearly double, including 13 km² of new city-level parks.",
                "Strategic green corridors connecting parks, natural assets, and urban centres.",
                "Environmental protection restricted offshore land reclamation."
              ]}
              onMore={() => openDrawer({
                id: 'green-reserves',
                category: 'Sustainability',
                title: 'Environmental Resilience & Open Space',
                body: (
                  <div className="space-y-6">
                    <VerbatimText text="The plan places a strong emphasis on environmental resilience, restricting offshore reclamation and strengthening conservation zones." />
                    <GoldBullets items={[
                      "60% of Dubai's land area is dedicated to nature reserves and natural areas.",
                      "Total open space will nearly double, including over 13 km² of new city-level parks.",
                      "Hatta will grow as a sustainable rural tourism and residential centre with a 15% slope cap to protect the landscape.",
                      "Integrated rights-of-way combining utilities, mobility corridors, and green infrastructure."
                    ]} />
                  </div>
                )
              })}
            />

            {/* Card 4: Coastal Transformation */}
            <Card
              category="Coastal"
              title="Coastal Transformation"
              image="https://images.unsplash.com/photo-1688671525781-d9447cf1abd2?auto=format&fit=crop&q=80&w=800"
              points={[
                "Target to increase public beach areas by 400% through the coastline expansion protocol.",
                "Moratorium on offshore reclamation limits new coastal development, preserving scarcity.",
                "Properties along coastal tourism corridors benefit from rising visitor numbers (target 25M).",
                "Marine transport integration linking cruise terminals and coastal districts."
              ]}
              onMore={() => openDrawer({
                id: 'coastal-trans',
                category: 'Waterfront Scarcity',
                title: 'Coastal Protection & Public Access',
                body: (
                  <div className="space-y-6">
                    <VerbatimText text="A moratorium on offshore land reclamation restricts new coastal land, supporting premium pricing for existing waterfront properties." />
                    <GoldBullets items={[
                      "Targeted increase of public beach areas by 400%.",
                      "Limited coastal supply supports premium pricing for waterfront properties across Palm Jumeirah and Jumeirah Bay.",
                      "Hospitality assets along designated coastal tourism corridors benefit from rising visitor numbers.",
                      "Marine transport integration linking cruise terminals such as Dubai Harbour and Mina Rashid."
                    ]} />
                  </div>
                )
              })}
            />

            {/* Card 5: Sustainable Mobility */}
            <Card
              category="Mobility"
              title="Sustainable Mobility (TOD)"
              image="https://images.unsplash.com/photo-1655309893829-407c54619f1f?auto=format&fit=crop&q=80&w=2000"
              points={[
                "Focus on Transit-Oriented Development (TOD) focused on urban centres and high-density zones.",
                "Metro and light-rail expansion to reach within 800 metres of major residential clusters.",
                "Increase in the area dedicated to hotels and tourism by 134%.",
                "Properties near transit hubs are positioned for premium appreciation."
              ]}
              onMore={() => openDrawer({
                id: 'tod-mobility',
                category: 'Infrastructure',
                title: 'Transit-Oriented Development (TOD)',
                body: (
                  <div className="space-y-6">
                    <VerbatimText text="Transit-oriented development is a central pillar of the city’s growth strategy, making properties near Metro stations prime candidates for value appreciation." />
                    <GoldBullets items={[
                      "Metro and light-rail expansion focused on urban centres.",
                      "Area dedicated to hotels/tourism will increase by 134%.",
                      "Soft mobility networks with shaded pedestrian and cycling routes.",
                      "Homes within 800 metres of transit stations are likely to command higher valuations."
                    ]} />
                  </div>
                )
              })}
            />

            {/* Card 6: STEAM & Innovation */}
            <Card
              category="Economy"
              title="STEAM & Innovation Hubs"
              image="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
              points={[
                "Expansion of STEAM sectors in dedicated clusters like Silicon Oasis and District 2020.",
                "Support for high-tech, innovation clusters, and advanced manufacturing sectors.",
                "Silicon Oasis positioned as a major technology-focused urban centre and production zone.",
                "Drives demand for high-quality professional housing in surrounding corridors."
              ]}
              onMore={() => openDrawer({
                id: 'steam-hubs',
                category: 'Knowledge Economy',
                title: 'STEAM & Innovation District Analysis',
                body: (
                  <div className="space-y-6">
                    <VerbatimText text="Economic diversification is driven by high-tech, STEAM, and innovation clusters, which boost demand for modern office space and R&D facilities." />
                    <GoldBullets items={[
                      "Development will support high-tech, STEAM, innovation clusters, and advanced manufacturing sectors.",
                      "Silicon Oasis is positioned as a major technology-focused urban centre, supported by an advanced production zone.",
                      "District 2020 is positioned for significant growth as it matures into a residential-commercial hub post-Expo.",
                      "Growth in these sectors attracts skilled professionals seeking high-quality housing in adjacent mid-tier zones."
                    ]} />
                  </div>
                )
              })}
            />
          </div>
        </div>

        {/* Sidebar / Map widget area — spans 1.5 of 4 desktop columns (3/8) */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 min-w-0">
          <div className="sticky top-32">
            <LocationWidget highlightNodes={isCard1Hovered} />
            <div className="mt-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
              <h5 className="text-[10px] font-black text-brand-navy uppercase tracking-[0.3em] mb-4">Intelligence Insight</h5>
              <p className="text-[12px] text-slate-grey leading-relaxed font-serif italic">
                Strategic clustering in these verified growth nodes ensures long-term capital preservation. The polycentric city model restricts supply while concentrating D33 economic drivers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* STRATEGIC VAULT SIDE DRAWER */}
      <div 
        className={`fixed inset-0 z-[90] bg-brand-navy/60 backdrop-blur-sm transition-opacity duration-700 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeDrawer}
      />
      
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[650px] bg-white shadow-2xl z-[100] transform transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {drawerContent && (
          <div className="flex flex-col h-full">
            <div className="bg-[#0A192F] p-10 flex justify-between items-start border-b border-brand-gold/20">
              <div>
                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.4em] mb-3 block">DXB Edge Vault // {drawerContent.category}</span>
                <h3
                  className="text-3xl font-sans font-bold text-white leading-tight"
                  style={{ fontFamily: 'Univers, Inter, sans-serif' }}
                >
                  {drawerContent.title}
                </h3>
              </div>
              <button 
                onClick={closeDrawer}
                className="p-2 text-white/40 hover:text-brand-gold transition-colors"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="bg-soft-grey px-10 py-4 flex justify-between items-center border-b border-slate-200">
              <button 
                onClick={copyDrawerText}
                className="text-[9px] font-bold text-brand-navy hover:text-brand-gold transition-colors flex items-center gap-2 uppercase tracking-widest px-2 py-1 -my-1"
              >
                <svg className="w-4 h-4 flex-none overflow-visible" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3h6a1 1 0 011 1v2H8V4a1 1 0 011-1z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h8a2 2 0 012 2v11a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11h6M9 15h6" />
                </svg>
                Copy Strategic Intelligence
              </button>
              <span className="text-[8px] font-bold text-slate-grey/40 uppercase tracking-widest">Data Stream: Sovereign 2040 MASTER PLAN</span>
            </div>

            <div
              id="dubai2040-drawer-body"
              className={`flex-1 p-12 overflow-y-auto custom-scrollbar custom-scrollbar-prominent bg-white transition-opacity duration-700 delay-200 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
               {drawerContent.body}
            </div>

            <div className="p-10 border-t border-slate-100 flex gap-4 bg-soft-grey/30">
              <button 
                onClick={closeDrawer}
                className="flex-1 bg-brand-navy text-white text-[11px] font-bold uppercase tracking-[0.3em] py-5 hover:bg-brand-gold transition-all duration-500 shadow-xl"
              >
                Exit Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Dubai2040;
