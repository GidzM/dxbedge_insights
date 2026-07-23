
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { useCurrency } from '../components/CurrencyContext';
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
    {parseGrowthData(text)}
  </p>
);

const SectionHeader = ({ title }: { title: string }) => (
  <h4
    className="text-[11px] font-black text-brand-navy uppercase tracking-[0.3em] mb-6 mt-10 border-b border-brand-navy/10 pb-2 font-sans"
    style={{ fontFamily: 'Univers, Inter, sans-serif' }}
  >
    {title}
  </h4>
);

const GrowthBullets = ({ items }: { items: string[] }) => (
  <div className="space-y-5">
    {items.map((item, idx) => (
      <div key={idx} className="flex gap-4 items-start">
  <div className="w-1.5 h-1.5 bg-brand-gold mt-2.5 shrink-0 shadow-[0_0_8px_rgba(201,168,106,0.4)]" />
        <p
          className="text-brand-navy/80 text-[14px] leading-relaxed font-medium"
          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
        >
          {parseGrowthData(item)}
        </p>
      </div>
    ))}
  </div>
);

const parseGrowthData = (text: string) => {
  const highlightRegex = /(?:AED|USD|EUR|GBP|SAR|INR|CNY)\s?[\d,.]+(?:\s?(?:[BMKT]|billion|trillion|million))?|[$€£]\s?[\d,.]+(?:\s?(?:[BMKT]|billion|trillion|million))?(?:\s?[+])?|[\d,.]+(?:\s?[-–]\s?[\d,.]+)?%|\d{1,3}(?:,\d{3})+|\d+\s?cities/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(highlightRegex)) {
    const start = match.index ?? 0;
    const value = match[0];

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    nodes.push(
      <span key={`${start}-${value}`} className="text-brand-gold font-bold">
        {value}
      </span>
    );

    lastIndex = start + value.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes.length > 0 ? nodes : text;
};

const D33Agenda: React.FC = () => {
  const { formatFromAED } = useCurrency();
  const economy32T = formatFromAED(32000000000000, { maximumFractionDigits: 0 });
  const trade14_2T = formatFromAED(14200000000000, { maximumFractionDigits: 0 });
  const trade25_6T = formatFromAED(25600000000000, { maximumFractionDigits: 0 });
  const digital100B = formatFromAED(100000000000, { maximumFractionDigits: 0 });
  const fdi650B = formatFromAED(650000000000, { maximumFractionDigits: 0 });
  const fdi32B = formatFromAED(32000000000, { maximumFractionDigits: 0 });
  const fdi60B = formatFromAED(60000000000, { maximumFractionDigits: 0 });
  const private1T = formatFromAED(1000000000000, { maximumFractionDigits: 0 });
  const gov700B = formatFromAED(700000000000, { maximumFractionDigits: 0 });

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<DrawerContent | null>(null);

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

  const handleCopy = () => {
    const text = document.getElementById('d33-drawer-body')?.innerText || '';
    navigator.clipboard.writeText(text);
    alert('Strategic intelligence copied to clipboard.');
  };

  return (
  <>
        <SEO
        title="Dubai D33 Economic Agenda | Growth Strategy, Trade Expansion & Property Impact"
        description="Investor-focused analysis of Dubai's D33 Economic Agenda, highlighting trade expansion, investment inflows, sovereign capital, and the real estate demand it supports."
        path="/d33-agenda"
        image="/media/dxb-edge-default.jpg"
        type="article"
        schemaType="Article"
        imageAlt="Dubai D33 economic agenda strategic outlook"
        keywords={[
          'Dubai D33',
          'D33 agenda',
          'Dubai growth strategy',
          'Dubai trade expansion',
          'Dubai economic agenda',
          'Dubai real estate demand',
          'Dubai investment inflows',
        ]}
        jsonLd
      />
  
    <div className="max-w-7xl mx-auto py-16 px-10 lg:px-16 animate-fadeIn pb-32">
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Insights', href: '/insights' },
          { label: 'Strategic Outlook', href: '/insights/strategic-outlook' },
          { label: 'D33 Growth', href: '/insights/strategic-outlook/d33-agenda' },
        ]}
        className="mb-8"
      />

      <div className="w-full h-[300px] bg-brand-navy overflow-hidden mb-16 relative rounded-2xl border border-white/5">
        <img 
          src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000" 
          alt="Dubai Financial District" 
          className="w-full h-full object-cover grayscale brightness-[0.5] contrast-[1.2]"
        />
        <div className="absolute inset-0 bg-brand-navy/60 mix-blend-multiply" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/40">The D33 Economic Agenda</span>
        </div>
      </div>

      <header className="mb-16 border-l-4 border-brand-gold pl-10">
        <h1 className="text-5xl font-serif font-bold text-brand-navy mb-6 italic tracking-tight">Global Hub Tier-1 Strategy</h1>
        <p className="text-xl text-slate-grey max-w-4xl leading-relaxed font-serif italic opacity-80">
          A 10-year roadmap to position Dubai as one of the top three global economic cities. Targeting an aggregate economic output of <span className="text-brand-navy font-bold">{economy32T}</span>. [Source: D33 Analysis]
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <Card
          category="Trade Nexus"
          title="Global Trade Expansion"
          image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
          points={[
            "Expanding the foreign trade network by adding 400 cities to Dubai's global map.",
            `Targeting a surge in foreign trade from ${trade14_2T} to ${trade25_6T}.`,
            "Achieving an 80% increase in total trade volume over the next decade.",
            "Positioning Dubai as the world's most connected trading gateway."
          ]}
          isPremium
          onMore={() => openDrawer({
            id: 'trade-expansion',
            category: 'Economic Protocol',
            title: 'Global Trade Expansion Deep Dive',
            body: (
              <div className="space-y-2">
                <VerbatimText text="The D33 strategy focuses on exponentially expanding Dubai's trading footprint to maintain its status as the world's premier logistics gateway." />
                
                <SectionHeader title="STRATEGIC INITIATIVES" />
                <GrowthBullets items={[
                  "Addition of 400 cities to Dubai's foreign trade map to diversify market reach.",
                  "Launch of 'Dubai Economic Corridors' project focusing on Africa, Latin America, and South East Asia.",
                  "Modernization of customs processes and trade policies to support high-velocity movement.",
                  "Development of advanced logistics infrastructure near major trade gateways."
                ]} />

                <SectionHeader title="INVESTOR IMPLICATIONS" />
                <GrowthBullets items={[
                  `Foreign trade set to expand from ${trade14_2T} to ${trade25_6T} (80% increase).`,
                  "Significant upward pressure on industrial and logistics asset values, particularly near Jebel Ali Port and Al Maktoum Airport.",
                  "Increased demand for high-value warehousing and specialised fulfilment centers."
                ]} />
              </div>
            )
          })}
        />

        <Card
          category="Tech Economy"
          title="Digital Transformation"
          image="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
          points={[
            `Generating ${digital100B} in annual economic value via digital innovation.`,
            "Launch of 'Sandbox Dubai' for the commercial testing of next-gen technologies.",
            "Accelerating the adoption of smart-city infrastructure and smart building standards.",
            "Integration of AI and digital ecosystems as a core pillar of economic output."
          ]}
          onMore={() => openDrawer({
            id: 'digital-transform',
            category: 'Future Economy',
            title: 'Digital Economy & Sandbox Analysis',
            body: (
              <div className="space-y-2">
                <VerbatimText text="Digital transformation is a major pillar of D33, expected to drive high-value economic output through technological integration." />
                
                <SectionHeader title="STRATEGIC INITIATIVES" />
                <GrowthBullets items={[
                  `Generation of ${digital100B} in annual economic value through digital innovation.`,
                  "Launch of 'Sandbox Dubai' for the commercial testing of next-gen technologies and disruptive business models.",
                  "Implementation of technology adoption mandates for businesses and government entities.",
                  "Support for a dedicated regulatory framework enabling the digital economy."
                ]} />

                <SectionHeader title="INVESTOR IMPLICATIONS" />
                <GrowthBullets items={[
                  "Increased demand for tech hubs, data centres, and smart, digitally enabled buildings.",
                  "Smart buildings command higher valuations due to connectivity and infrastructure advantages.",
                  "Attraction of tech talent seeking high-quality, smart-city integrated rental housing."
                ]} />
              </div>
            )
          })}
        />

        <Card
          category="Unified Logistics"
          title="Industrial & Unified Trade"
          image="https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&q=80&w=800"
          points={[
            "Establishing 'Dubai Economic Corridors' to streamline cross-border movement.",
            "Targeting 50% growth in traditional trade sectors via regulatory efficiency.",
            "Supporting the 'Make it in the Emirates' initiative for local manufacturing.",
            "Developing specialised, purpose-built industrial parks and innovation districts."
          ]}
          onMore={() => openDrawer({
            id: 'industrial-trade',
            category: 'Production Strategy',
            title: 'Unified Trade & Industrial Resilience',
            body: (
              <div className="space-y-2">
                <VerbatimText text="Strengthening Dubai's innovation ecosystem and expanding high-value, knowledge-driven manufacturing sectors." />
                
                <SectionHeader title="STRATEGIC INITIATIVES" />
                <GrowthBullets items={[
                  "Support for the local manufacturing 'Make it in the Emirates' initiative to drive domestic production.",
                  "Transition toward a sustainable, industrial economy focused on advanced manufacturing and AI.",
                  "Incentives for Research and Development (R&D) within the knowledge-economy sectors.",
                  "Expansion of free zones and dedicated industrial corridors to support trade expansion."
                ]} />

                <SectionHeader title="INVESTOR IMPLICATIONS" />
                <GrowthBullets items={[
                  "Development of advanced manufacturing parks catering to future-focused sectors.",
                  "Requirement for specialised, purpose-built facilities to support emerging industries.",
                  "Growth in free zone properties attractive to foreign companies seeking business-friendly environments."
                ]} />
              </div>
            )
          })}
        />

        <Card
          category="Capital Flows"
          title="Investment & FDI Inflow"
          image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800"
          points={[
            `Targeting ${fdi650B} in total FDI inflows over the next decade.`,
            `Increasing annual FDI from ${fdi32B} to ${fdi60B} per year.`,
            `Incentivizing ${private1T} in private sector investment by 2033.`,
            "Strategic focus on attracting multinational headquarters and prime capital."
          ]}
          isPremium
          onMore={() => openDrawer({
            id: 'fdi-inflow',
            category: 'Capital Blueprint',
            title: 'Financial Capital & Investment Targets',
            body: (
              <div className="space-y-2">
                <VerbatimText text="D33 aims to nearly double FDI inflows and significantly increase private-sector participation to fuel massive development." />
                
                <SectionHeader title="STRATEGIC INITIATIVES" />
                <GrowthBullets items={[
                  `Targeting ${economy32T} in total economic output over the decade.`,
                  `${gov700B} government spending plan to support emerging and traditional industries.`,
                  "Streamlined foreign investment regulations and expanded incentives (Enhanced FDI Framework).",
                  "Encouraging public-private partnerships (PPP) for infrastructure delivery."
                ]} />

                <SectionHeader title="INVESTOR IMPLICATIONS" />
                <GrowthBullets items={[
                  `Target of ${fdi650B} in FDI across ten years supports large-scale developments across asset classes.`,
                  `${private1T} in private-sector investment injects substantial capital into large-scale real estate projects.`,
                  "Doubling the economy correlates with broad real estate price appreciation cycles."
                ]} />
              </div>
            )
          })}
        />
      </div>

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
              <button onClick={closeDrawer} className="p-2 text-white/40 hover:text-brand-gold transition-colors">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="bg-soft-grey px-10 py-4 flex justify-between items-center border-b border-slate-200">
              <button 
                onClick={handleCopy}
                className="text-[9px] font-bold text-brand-navy hover:text-brand-gold transition-colors flex items-center gap-2 uppercase tracking-widest px-2 py-1 -my-1"
              >
                <svg className="w-4 h-4 flex-none overflow-visible" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3h6a1 1 0 011 1v2H8V4a1 1 0 011-1z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h8a2 2 0 012 2v11a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11h6M9 15h6" />
                </svg>
                Copy Strategic Intelligence
              </button>
              <span className="text-[8px] font-bold text-slate-grey/40 uppercase tracking-widest">Data Stream: D33_RESEARCH</span>
            </div>

            <div
              id="d33-drawer-body"
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

export default D33Agenda;
