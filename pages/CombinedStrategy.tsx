import React, { useState, useEffect } from 'react';
import Card from '../components/Card';

interface DrawerContent {
  id: string;
  title: string;
  category: string;
  body: React.ReactNode;
}

const Section = ({ title, children }: { title: string; children?: React.ReactNode }) => (
  <section className="mb-12 animate-fadeIn">
    <h4 className="font-serif font-bold text-xl text-brand-navy mb-5 italic border-b border-brand-gold/20 pb-2">{title}</h4>
    <div className="space-y-5">{children}</div>
  </section>
);

const VerbatimText = ({ text }: { text: string }) => (
  <p className="text-brand-navy/80 text-[14px] leading-relaxed mb-4 font-medium">{text}</p>
);

const GoldBullets = ({ items }: { items: string[] }) => (
  <div className="space-y-5">
    {items.map((item, idx) => (
      <div key={idx} className="flex gap-4 items-start">
        <div className="w-1.5 h-1.5 bg-brand-gold mt-2.5 shrink-0" />
        <p className="text-brand-navy/80 text-[14px] leading-relaxed font-medium">{item}</p>
      </div>
    ))}
  </div>
);

const CombinedStrategy: React.FC = () => {
  const [activeTab, setActiveTab] = useState('framework');
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

  const closeDrawer = () => {
    setDrawerOpen(false);
  };

  const copyVerbatim = () => {
    if (!drawerContent) return;
    const text = document.getElementById('drawer-body-text')?.innerText || '';
    navigator.clipboard.writeText(text);
    alert('Strategic intelligence copied to clipboard.');
  };

  const tabs = [
    { id: 'framework', label: 'Strategic Framework' },
    { id: 'impact', label: 'Real Estate Impact' },
    { id: 'sectors', label: 'Sector Deep Dives' },
    { id: 'guidance', label: 'Investor Guidance' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-16 px-10 lg:px-16 animate-fadeIn pb-32">
      <div className="w-full h-[300px] bg-brand-navy overflow-hidden mb-16 relative">
          <img 
            src="https://images.unsplash.com/photo-1528702748617-c64d49f918af?auto=format&fit=crop&q=80&w=2000" 
            alt="Dubai Night Skyline" 
            className="w-full h-full object-cover grayscale brightness-[0.7] contrast-[1.2]"
          />
          <div className="absolute inset-0 bg-brand-navy/60 mix-blend-multiply transition-opacity duration-700" />
          <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/40">Sovereign Strategic Intelligence Stream</span>
          </div>
      </div>

      <header className="mb-16 border-l border-brand-gold pl-10">
        <h1 className="text-5xl font-serif font-bold text-brand-navy mb-6 italic">Strategic Outlook</h1>
        <p className="text-xl text-slate-grey max-w-4xl leading-relaxed font-serif italic">
          High-density restoration of the Dubai 2040 Urban Plan and D33 Economic Agenda. No truncation, full fidelity strategic guidance.
        </p>
      </header>

      <div className="mb-12 border-b border-slate-200 overflow-x-auto no-scrollbar">
        <div className="flex gap-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all relative whitespace-nowrap ${
                activeTab === tab.id ? 'text-brand-navy' : 'text-slate-grey/40 hover:text-brand-navy/60'
              }`}
            >
              {tab.label}
              {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-navy" />}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {activeTab === 'framework' && (
          <>
            <Card
              category="Executive"
              title="Executive Summary"
              image="https://images.unsplash.com/photo-1571210862729-78a52d3779a2?auto=format&fit=crop&q=80&w=800"
              points={[
                "Unification of 2040 Spatial Foundation and D33 Engine.",
                "Targeting 75% population increase to 5.8 million.",
                "AED 32 Trillion economic output target by 2033.",
                "FDI goals of AED 60 Billion annually.",
                "Unlocking transit-oriented mixed-use and logistics nodes."
              ]}
              isPremium
              onMore={() => openDrawer({
                id: 'exec-summary',
                category: 'Strategic Overview',
                title: 'Executive Summary',
                body: (
                  <div className="space-y-6">
                    <VerbatimText text="Dubai’s two flagship strategies—the 2040 Urban Master Plan and the D33 Economic Agenda—form a unified roadmap for transforming the city into a top-three global hub by 2033–2040. The 2040 plan sets the spatial foundation, targeting a 75% population increase to 5.8 million, higher urban density, and transit-oriented growth centred on six major urban centres within tightly controlled development boundaries." />
                    <VerbatimText text="D33 provides the economic engine, aiming to double the economy to AED 32 trillion, expand foreign trade by 80% to AED 25.6 trillion, nearly double annual FDI to AED 60 billion, and generate AED 100 billion annually from digital transformation." />
                    <VerbatimText text="Together, these plans create a powerful, coordinated framework that unlocks major real estate opportunities across transit-oriented mixed-use districts, logistics and industrial zones near trade gateways, knowledge-economy office and residential clusters, and technology-enabled smart developments. With aligned timelines and mutually reinforcing goals, the combined strategy represents one of the most comprehensive and investable urban transformation programmes globally." />
                  </div>
                )
              })}
            />
            <Card
              category="Convergence"
              title="Key Synergies Map"
              image="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800"
              points={[
                "Full 10-Point Strategic Alignment Analysis.",
                "Population targets supporting D33 economic goals.",
                "Transit-Oriented Development linked to trade expansion.",
                "AED 700B infrastructure expenditure sync.",
                "Smart-City foundations for digital economy growth."
              ]}
              onMore={() => openDrawer({
                id: 'synergies',
                category: 'Alignment Analysis',
                title: 'Key Synergies Between Plans',
                body: (
                  <div className="space-y-2">
                    <Section title="1. Aligned Population & Economic Growth">
                      <VerbatimText text="The projected 75% population increase—from 3.3 million to 5.8 million—directly supports D33’s economic-doubling goals by expanding the workforce and increasing domestic consumption from AED 2.2 trillion to AED 3 trillion." />
                    </Section>
                    <Section title="2. Urban Centres Reinforce Economic Diversification">
                      <VerbatimText text="The six major urban centres, including Silicon Oasis as a technology hub, align with D33’s focus on the knowledge economy and digital transformation valued at AED 100 billion annually." />
                    </Section>
                    <Section title="3. Transit-Oriented Development Supports Trade Expansion">
                      <VerbatimText text="Metro and light-rail expansion, combined with Etihad Rail connectivity, strengthens the logistics network required for foreign trade growth from AED 14.2 trillion to AED 25.6 trillion." />
                    </Section>
                    <Section title="4. Integrated Southern Logistics Hub">
                      <VerbatimText text="The Urban Plan’s multi-modal logistics zone—anchored by Jebel Ali Port, Al Maktoum Airport, and Etihad Rail—directly enables D33’s trade and FDI targets." />
                    </Section>
                    <Section title="5. Coordinated Infrastructure Investment">
                      <VerbatimText text="The Urban Plan’s phased development approach aligns with D33’s AED 700 billion in government expenditure, ensuring infrastructure delivery is synchronised with economic growth." />
                    </Section>
                    <Section title="6. Mixed-Use Centres Enable Knowledge-Economy Growth">
                      <VerbatimText text="The Urban Plan’s hierarchy of mixed-use, live-work-play centres helps attract and retain skilled professionals essential for knowledge-based industries." />
                    </Section>
                    <Section title="7. Affordable Housing Supports Workforce Expansion">
                      <VerbatimText text="Affordable housing initiatives ensure the population growth required for economic doubling is supported by accessible, well-located residential supply." />
                    </Section>
                    <Section title="8. Green Infrastructure Enhances Talent Attraction">
                      <VerbatimText text="Doubling open space from 21.7 km² to 42.8 km² improves liveability, strengthening Dubai’s ability to attract global talent for high-skill sectors." />
                    </Section>
                    <Section title="9. Smart-City Infrastructure Enables Digital Transformation">
                      <VerbatimText text="Integrated utilities and digital infrastructure in the Urban Plan provide the foundation for D33’s AED 100 billion annual digital-economy ambitions." />
                    </Section>
                    <Section title="10. Aligned Timelines Create a Unified Investment Horizon">
                      <VerbatimText text="D33’s 2033 targets and the Urban Plan’s 2040 horizon form a coordinated 10–15 year roadmap with clear milestones for investors." />
                    </Section>
                  </div>
                )
              })}
            />
            <Card
              category="Insights"
              title="Final Takeaways"
              image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
              points={[
                "Unabridged list of 20 strategic takeaways.",
                "Permanent scarcity premiums of 30-50%.",
                "Transit timing: 2-3 years prior to opening.",
                "Southern emirate as the logistics powerhouse.",
                "AED 1 Trillion private-sector investment signals."
              ]}
              onMore={() => openDrawer({
                id: 'takeaways',
                category: 'Intelligence',
                title: 'Final Takeaways (20 Points)',
                body: (
                  <div className="space-y-6">
                    <GoldBullets items={[
                      "1. Historic, synchronized transformation: Dubai’s 2040 Urban Plan and D33 Economic Agenda form one of the world’s most coordinated transformations.",
                      "2. Population growth with structural supply constraints: Adding 2.5 million residents within fixed urban boundaries and a ban on offshore reclamation supports sustained appreciation.",
                      "3. Transit-oriented assets deliver the strongest premiums: Properties within 800 metres of Metro or light-rail are highest-conviction investments, with expected 40–60% premiums.",
                      "4. Six urban centres anchor long-term value: Deira/Bur Dubai, Downtown/SZR, Marina, Silicon Oasis, District 2020, and future Jebel Ali are designated cores.",
                      "5. Logistics is the most predictable growth story: With foreign trade rising 80% to AED 25.6 trillion, logistics real estate near trade hubs offers exceptionally strong potential.",
                      "6. Digital transformation creates a new real estate class: AED 100 billion annual digital value drives demand for smart buildings, data centres, and innovation districts.",
                      "7. FDI growth brings institutional-grade tenants: Annual FDI rising to AED 60 billion attracts multinational firms requiring Grade A office and bulk residential leasing.",
                      "8. Knowledge-economy expansion boosts premium residential demand: Skilled professionals seek high-quality housing, amenities, and transit access.",
                      "9. Mixed-use becomes the dominant development model: Both plans prioritise walkable, integrated mixed-use environments that achieve higher densities.",
                      "10. Waterfront scarcity premium is locked in: The moratorium on offshore reclamation ensures permanent scarcity, supporting 30–50% premiums.",
                      "11. Staged land release creates clear investment cycles: The land-bank system releases supply in phases; early movers secure the most attractive pricing.",
                      "12. Southern emirate emerges as the logistics powerhouse: The Jebel Ali–Al Maktoum–Etihad Rail corridor becomes the region’s premier logistics zone.",
                      "13. Affordable housing offers scale and complexity: Mandated housing expands market depth; understanding allocation requirements is essential.",
                      "14. Industrial-to-mixed-use regeneration: Underutilised industrial districts in the core offer strong uplift potential through redevelopment.",
                      "15. Transit-oriented timing is critical: Acquiring TOD assets two to three years before opening delivers the best risk-adjusted returns.",
                      "16. Private-sector investment validates market confidence: D33’s AED 1 trillion private-sector investment target signals strong capital availability.",
                      "17. Domestic demand strengthens retail and hospitality: Consumption growth to AED 3 trillion supports neighbourhood retail and family hospitality.",
                      "18. Hatta presents a niche, asymmetric opportunity: Sustainable tourism in Hatta offers high-margin potential through eco-resorts and adventure assets.",
                      "19. Sustainability delivers measurable premiums: Green buildings meeting Al Sa’fat standards achieve 10–15% price premiums and attract stronger tenants.",
                      "20. A 10–15 year horizon is essential: Full value creation aligns with the 2033–2040 timeline, requiring long-term commitment."
                    ]} />
                  </div>
                )
              })}
            />
          </>
        )}

        {activeTab === 'impact' && (
          <>
            <Card
              category="Analysis"
              title="Real Estate Impact"
              image="https://images.unsplash.com/photo-1528702748617-c64d49f918af?auto=format&fit=crop&q=80&w=800"
              points={[
                "Unabridged Demand Drivers and Supply Factors.",
                "Analysis of Price Implications and Rental Effects.",
                "Impact of 5.8 million residents and 4.9 million workers.",
                "68% increase in urban density valuations.",
                "Moratorium on offshore reclamation scarcity effect."
              ]}
              isPremium
              onMore={() => openDrawer({
                id: 'market-impact',
                category: 'Economic Analysis',
                title: 'Real Estate Impact: Verbatim Restoration',
                body: (
                  <div className="space-y-12">
                    <Section title="Demand Drivers">
                      <GoldBullets items={[
                        "Dual population and economic doubling generates powerful, compounding demand across all real estate asset classes.",
                        "A city of 5.8 million residents and 4.9 million workers, combined with economic doubling, creates unprecedented requirements for housing, offices, and commercial space.",
                        "Rising FDI to AED 60 billion annually, paired with transit-oriented urban centres, concentrates demand in premium locations near Metro stations.",
                        "Foreign trade expansion to AED 25.6 trillion and the southern logistics hub drive major demand for industrial, warehousing, and free-zone facilities.",
                        "Digital transformation worth AED 100 billion annually fuels demand for smart buildings, data centres, and technology-focused real estate.",
                        "Domestic consumption rising to AED 3 trillion strengthens demand for retail, hospitality, and mixed-use developments.",
                        "Tourism growth to 25 million visitors annually, supported by AED 1 trillion in private investment, expands hospitality and short-term rental demand.",
                        "A 68% increase in urban density and the 20-minute city model elevate valuations for walkable, transit-accessible properties."
                      ]} />
                    </Section>
                    <Section title="Supply Factors">
                      <GoldBullets items={[
                        "Strict urban boundary controls and a moratorium on offshore reclamation create permanently constrained land supply, supporting long-term value appreciation.",
                        "A staged land-bank system and AED 1 trillion in private-sector investment ensure supply is released in a controlled, demand-aligned manner.",
                        "AED 700 billion in government expenditure unlocks new development areas through phased infrastructure delivery.",
                        "Industrial-to-mixed-use regeneration introduces new supply from underutilised urban core districts.",
                        "Transit-oriented development and the six major urban centres concentrate new supply in high-value, infrastructure-rich locations.",
                        "Environmental protections—such as Hatta’s 15% slope restriction and expanded conservation areas—limit outward sprawl.",
                        "Zoning overlays and framework plans enforce quality-focused development standards."
                      ]} />
                    </Section>
                    <Section title="Price Implications">
                      <GoldBullets items={[
                        "Economic doubling typically aligns with 80–120% real estate price appreciation over 10–15 years in comparable global cities.",
                        "Transit-oriented properties within 800m of Metro stations may command 40–60% premiums by 2033.",
                        "The six urban centres—especially Silicon Oasis and District 2020—are positioned for 100–150% capital appreciation as they mature.",
                        "Logistics and industrial assets near Jebel Ali and Al Maktoum Airport may see 60–80% appreciation driven by 80% trade growth.",
                        "Prime commercial assets in FDI-heavy districts may achieve 50–70% appreciation due to multinational demand.",
                        "Waterfront properties benefit from a permanent scarcity premium of 30–50% due to the reclamation moratorium.",
                        "Knowledge-economy residential districts may see 70–100% appreciation as they attract skilled professionals.",
                        "Established mixed-use centres like Downtown and Marina may experience 40–60% steady appreciation from densification and amenity upgrades."
                      ]} />
                    </Section>
                    <Section title="Rental Market Effects">
                      <GoldBullets items={[
                        "A workforce of 4.9 million plus FDI-driven expatriate inflows supports sustained rental demand with 3–5% yield stability.",
                        "Knowledge-economy professionals favour rental flexibility, boosting demand for premium apartments and serviced units.",
                        "Tourism growth and business travel support hospitality and short-term rentals, with 80–90% occupancy achievable.",
                        "Transit-oriented locations command 15–25% rental premiums over car-dependent areas.",
                        "Mixed-use centres with strong amenities achieve 5–8% higher yields than single-use residential assets.",
                        "Industrial and logistics assets near trade hubs maintain 6–8% net yields through corporate leasing.",
                        "Affordable housing initiatives may moderate luxury rental growth but expand mid-market opportunities.",
                        "Remote work adoption is offset by clustering effects in urban centres, sustaining demand for prime, well-connected locations."
                      ]} />
                    </Section>
                  </div>
                )
              })}
            />
            <Card
              category="Risks"
              title="Investor Risks Mapping"
              image="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800"
              points={[
                "Unabridged list of 11 combined investor risks.",
                "Execution complexity across 48+ entities.",
                "Analysis of ambitious growth (75% pop growth).",
                "Supply-demand timing risks (2025-2028).",
                "Technology-driven disruption of office stock."
              ]}
              onMore={() => openDrawer({
                id: 'investor-risks',
                category: 'Strategic Defense',
                title: 'Combined Investor Risks',
                body: (
                  <div className="space-y-6">
                    <GoldBullets items={[
                      "Execution complexity: Coordinating two major strategies across more than 48 government entities creates execution risk; delays or misalignment could affect project timelines and investor returns.",
                      "Ambitious growth assumptions: Economic doubling and 75% population growth are aspirational. Even achieving 60–70% of targets delivers strong outcomes, but significant underperformance could soften valuations.",
                      "Supply–demand timing risk: If private developers build ahead of actual demand, temporary oversupply—particularly between 2025 and 2028—may pressure prices and rental yields.",
                      "Regional competitive pressure: Saudi Vision 2030, Qatar’s post-World Cup development, and Abu Dhabi’s diversification efforts compete for the same FDI inflows and skilled talent.",
                      "Regulatory uncertainty: Framework plans, zoning overlays, and development parameters are still being finalised, creating short-term uncertainty for project planning and feasibility.",
                      "Exposure to global economic conditions: Both plans assume favourable global markets. Recession, geopolitical instability, or oil-price shocks could slow FDI, trade growth, and overall economic momentum.",
                      "Technology-driven disruption: Rapid digital transformation may accelerate obsolescence in traditional office and retail assets, requiring adaptive repositioning strategies.",
                      "Infrastructure-linked value risk: Transit-oriented development returns depend on timely Metro and light-rail expansion; delays could weaken expected value uplift.",
                      "Affordable housing requirements: Mandated allocations may compress margins in certain developments, affecting project-level returns.",
                      "Climate and sustainability costs: Rising environmental and resilience standards may increase development costs by 10–15%.",
                      "Capital-flow sensitivity: Although the AED is pegged to the USD, global capital-flow disruptions can still influence foreign investment levels and real estate demand."
                    ]} />
                  </div>
                )
              })}
            />
            <Card
              category="Success"
              title="Success Factors"
              image="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800"
              points={[
                "Verbatim restoration of Success Factors guide.",
                "8 Critical factors for institutional excellence.",
                "Timing transit acquisitions (2-3 years pre-launch).",
                "Capturing sustainability premiums of 10-15%.",
                "Building asset flexibility into portfolios."
              ]}
              onMore={() => openDrawer({
                id: 'critical-success',
                category: 'Investor Execution',
                title: 'Critical Success Factors for Investors',
                body: (
                  <div className="space-y-6">
                    <GoldBullets items={[
                      "Location precision is essential: With growth concentrated inside defined urban boundaries and six major hubs, assets within 800 metres of Metro stations and inside designated centres can achieve significantly higher appreciation than peripheral locations.",
                      "Timing transit-linked acquisitions: Properties along planned Metro and light-rail extensions offer the strongest risk-adjusted returns when acquired two to three years before line openings.",
                      "Aligning with government priorities: Projects that clearly support D33 objectives—FDI attraction, digital transformation, and trade facilitation—tend to receive faster approvals and more favourable regulatory treatment.",
                      "Choosing the right partners: Collaborating with major developers holding master-plan allocations and strong government relationships (e.g., Emaar, Nakheel, Meraas, Dubai Properties) reduces execution risk.",
                      "Understanding zoning evolution: As framework plans and zoning overlays are still being finalised, early engagement in consultation processes helps investors anticipate regulatory shifts and identify emerging opportunities.",
                      "Capturing the sustainability premium: Developments meeting Al Sa’fat green-building standards can command 10–15% price premiums and attract higher-quality tenants.",
                      "Mastering phasing strategy: Staged land releases reward early movers in each phase; monitoring Dubai Land Department announcements is critical for timing acquisitions.",
                      "Diversifying across asset classes: With both population and the economy set to double, opportunities span all major sectors. A balanced portfolio helps mitigate cyclical and sector-specific risks.",
                      "Committing long-term capital: The combined plans target 2033–2040, requiring 10–15 year investment horizons to fully capture value creation.",
                      "Building flexibility into assets: Rapid technological change and evolving work patterns favour properties that can adapt—such as those with flexible layouts or conversion potential between office and residential uses."
                    ]} />
                  </div>
                )
              })}
            />
          </>
        )}

        {activeTab === 'sectors' && (
          <>
            <Card
              category="Deep Dive"
              title="Sector Analysis"
              image="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800"
              points={[
                "Unabridged analysis of all 6 primary sectors.",
                "Thesis, Returns, and Risks for Logistics & Residential.",
                "Hospitality RevPAR and STR yield targets.",
                "Mixed-Use target returns of 22-28% on cost.",
                "Retail transformation mapping (AED 3T demand)."
              ]}
              isPremium
              onMore={() => openDrawer({
                id: 'sectors-restored',
                category: 'Asset Class Strategy',
                title: 'Sector Deep Dives',
                body: (
                  <div className="space-y-12">
                    <Section title="Logistics & Industrial">
                      <VerbatimText text="Opportunity Scale: Exceptional — the AED 25.6 trillion foreign-trade target requires major expansion of logistics and industrial infrastructure." />
                      <VerbatimText text="Key Locations: Southern multi-modal logistics hub (Jebel Ali Port, Al Maktoum Airport, Etihad Rail) and designated industrial zones near major urban centres." />
                      <GoldBullets items={[
                        "Investment Thesis: Trade growth of 80% over the decade demands proportional increases in warehousing, fulfilment centres, cold storage, and last-mile logistics. E-commerce expansion and AED 3 trillion in domestic demand add further pressure.",
                        "Target Returns: Land appreciation of 60–80%, stabilised yields of 6–8% net, and development returns of 18–22% on cost.",
                        "Risks: Competition from Jebel Ali Free Zone expansions and automation reducing space requirements per transaction."
                      ]} />
                    </Section>
                    <Section title="Commercial Office">
                      <VerbatimText text="Opportunity Scale: Strong — the knowledge-economy shift and doubling of FDI create sustained demand for premium office space." />
                      <VerbatimText text="Key Locations: Six major urban centres (especially Silicon Oasis and District 2020), downtown business districts, and transit-oriented developments." />
                      <GoldBullets items={[
                        "Investment Thesis: Digital transformation (AED 100 billion annually) and rising FDI (AED 60 billion annually) attract high-quality tenants seeking smart buildings. Knowledge workers prioritise premium amenities and transit access. As the economy doubles, Grade A office supply may lag demand.",
                        "Target Returns: Prime office appreciation of 50–70%, stabilised yields of 6–7%, and development returns of 15–18% on cost.",
                        "Risks: Remote-work adoption, obsolescence of traditional office stock, and oversupply risk if speculative development outpaces absorption."
                      ]} />
                    </Section>
                    <Section title="Residential">
                      <VerbatimText text="Opportunity Scale: Exceptional — 75% population growth (3.3M to 5.8M) creates one of the largest housing-demand cycles globally." />
                      <VerbatimText text="Key Locations: Transit-oriented areas within 800 metres of Metro stations, the six urban centres, and designated growth zones with staged land release." />
                      <GoldBullets items={[
                        "Investment Thesis: An additional 2.5 million residents will require 600,000–800,000 new housing units. Knowledge-economy professionals demand high-quality living environments, while FDI growth brings expatriate inflows. Affordable housing expands mid-market depth, and transit proximity commands strong premiums.",
                        "Target Returns: Transit-oriented appreciation of 70–100%, non-transit appreciation of 40–50%, rental yields of 4–6%, and development returns of 20–25% on cost.",
                        "Risks: Potential oversupply if developers overbuild, affordable-housing mandates affecting margins, and competition from neighbouring emirates."
                      ]} />
                    </Section>
                    <Section title="Hospitality">
                      <VerbatimText text="Opportunity Scale: Strong — driven by 25 million annual visitors and increased business travel linked to FDI growth." />
                      <VerbatimText text="Key Locations: Coastal tourism corridor, Dubai Harbour and Mina Rashid cruise terminals, and urban centres for business-oriented hotels." />
                      <GoldBullets items={[
                        "Investment Thesis: Tourism growth of 53% (to 964,000 daily visitors) and expanding trade activity fuel hotel demand. Business travel adds further depth. Short-term rentals benefit from supportive regulations, while waterfront supply remains constrained due to the reclamation moratorium.",
                        "Target Returns: Hotel appreciation of 40–60%, RevPAR growth of 4–6% annually, development returns of 15–20% on cost, and short-term rental yields of 6–9%.",
                        "Risks: Exposure to global travel disruptions, potential oversupply in certain segments, regulatory changes affecting STRs."
                      ]} />
                    </Section>
                    <Section title="Retail">
                      <VerbatimText text="Opportunity Scale: Moderate — supported by domestic demand growth but challenged by e-commerce disruption." />
                      <VerbatimText text="Key Locations: Street-level retail in mixed-use centres, neighbourhood commercial in high-density areas, and experiential retail in tourist zones." />
                      <GoldBullets items={[
                        "Investment Thesis: Domestic consumption rising from AED 2.2 trillion to AED 3 trillion supports retail expansion, but the market is shifting from traditional malls toward street retail and experiential formats. The 20-minute city model increases demand for neighbourhood commercial assets.",
                        "Target Returns: Prime street-retail appreciation of 30–40%, yields of 6–8%, and development returns of 12–15% on cost.",
                        "Risks: E-commerce cannibalisation, oversupply of mall space, evolving consumer preferences, and high fit-out costs."
                      ]} />
                    </Section>
                    <Section title="Mixed-Use">
                      <VerbatimText text="Opportunity Scale: Exceptional — a core strategy underpinning both Dubai 2040 and D33." />
                      <VerbatimText text="Key Locations: All six urban centres, 13 multi-sector centres, 40 sector centres, and transit-oriented development zones." />
                      <GoldBullets items={[
                        "Investment Thesis: Mixed-use development is central to the urban-centre hierarchy and the 20-minute city concept. These projects combine residential, office, retail, and hospitality in walkable environments that attract knowledge workers, maximise transit investments, and support the highest development densities.",
                        "Target Returns: Flagship mixed-use projects may achieve 100–150% appreciation, blended yields of 5–7%, and development returns of 22–28% on cost.",
                        "Risks: High execution complexity, need for critical mass to succeed, longer stabilisation periods, and elevated capital requirements."
                      ]} />
                    </Section>
                  </div>
                )
              })}
            />
            <Card
              category="Tiers"
              title="Investor Priority Tiers"
              image="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800"
              points={[
                "Unabridged mapping of Tiers 1, 2, and 3.",
                "Tier 1: TOD Mixed-Use and Southern Logistics.",
                "Tier 2: Premium Residential and Regeneration.",
                "Tier 3: Retail, Data Centres, and Affordable Housing.",
                "Silicon Oasis and District 2020 anchor nodes."
              ]}
              onMore={() => openDrawer({
                id: 'investor-tiers',
                category: 'Capital Strategy',
                title: 'Priority Investor Opportunities',
                body: (
                  <div className="space-y-8">
                    <Section title="TIER 1 – Highest Conviction">
                      <GoldBullets items={[
                        "Transit-oriented mixed-use developments within 800 metres of Metro and light-rail stations in the six major urban centres (Silicon Oasis, District 2020, Downtown, Marina, Deira/Bur Dubai, and future Jebel Ali). These locations capture both population growth and economic diversification.",
                        "Logistics and industrial real estate along the Etihad Rail corridor and near Jebel Ali Port and Al Maktoum Airport, directly benefiting from the AED 25.6 trillion foreign-trade target and strong visibility on 80% trade growth.",
                        "Smart office and innovation-district assets in Silicon Oasis and technology clusters, aligned with AED 100 billion in annual digital-economy value and attracting premium tenants."
                      ]} />
                    </Section>
                    <Section title="TIER 2">
                      <GoldBullets items={[
                        "Premium residential properties in major urban centres targeting knowledge-economy professionals, supported by FDI growth to AED 60 billion annually and rising demand from skilled workers.",
                        "Hospitality assets along the coastal tourism corridor, benefiting from the 25-million-visitor target and increased business travel linked to FDI expansion.",
                        "Industrial-to-mixed-use regeneration projects in the urban core, offering value-add potential through redevelopment of underutilised but infrastructure-rich sites."
                      ]} />
                    </Section>
                    <Section title="TIER 3">
                      <GoldBullets items={[
                        "Retail and street-level commercial in walkable mixed-use centres, supported by domestic consumption growth to AED 3 trillion and the 20-minute city model.",
                        "Data centres and technology infrastructure, a specialised but high-value segment capturing digital-transformation demand.",
                        "Affordable and mid-income housing near employment hubs, offering scale opportunities aligned with national housing goals and workforce expansion.",
                        "Free-zone commercial and light-industrial properties, benefiting from foreign company relocations driven by rising FDI."
                      ]} />
                    </Section>
                  </div>
                )
              })}
            />
          </>
        )}

        {activeTab === 'guidance' && (
          <>
            <Card
              category="Timeline"
              title="Strategy by Timeline"
              image="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800"
              points={[
                "Verbatim restoration of 2024-2040 phases.",
                "Immediate Term: Core income-producing focus.",
                "Medium Term: Emerging centre growth projects.",
                "Long Term: Post-2040 city-shaping expansion.",
                "Targeted annual returns of 12-22% across cycles."
              ]}
              isPremium
              onMore={() => openDrawer({
                id: 'timeline-strategy',
                category: 'Capital Lifecycle',
                title: 'Investment Strategy by Timeline',
                body: (
                  <div className="space-y-12">
                    <Section title="Immediate Term (2024–2027)">
                      <VerbatimText text="Strategy: Acquire core, income-producing assets in established locations with strong near-term appreciation potential." />
                      <GoldBullets items={[
                        "Existing residential in Downtown, Marina, and Business Bay near Metro stations to capture early population growth.",
                        "Grade A office space in DIFC and Business Bay benefiting from the first wave of FDI-driven corporate activity.",
                        "Land banking in Silicon Oasis and District 2020 ahead of full infrastructure build-out.",
                        "Operational logistics facilities near Jebel Ali Port to immediately benefit from rising trade volumes.",
                        "Hotel assets in Downtown and DIFC supported by early business-travel demand.",
                        "Expected Returns: Stabilised yields of 5–7%, three-year appreciation of 25–35%, and total annual returns of 12–15%."
                      ]} />
                    </Section>
                    <Section title="Medium Term (2028–2033)">
                      <VerbatimText text="Strategy: Develop and acquire growth-oriented assets in emerging centres and infrastructure-enabled zones." />
                      <GoldBullets items={[
                        "Transit-oriented development projects in Silicon Oasis and District 2020 as Metro extensions become operational.",
                        "Mixed-use developments in the 13 multi-sector centres as density and demand increase.",
                        "Industrial and logistics assets in the southern emirate as Etihad Rail and Al Maktoum Airport expand.",
                        "Residential communities in designated growth areas aligned with staged land-bank releases.",
                        "Commercial office assets in maturing innovation districts attracting digital-economy tenants.",
                        "Expected Returns: Development returns of 20–25%, stabilised appreciation of 50–80%, and total annual returns of 15–18%."
                      ]} />
                    </Section>
                    <Section title="Long Term (2034–2040)">
                      <VerbatimText text="Strategy: Position for post-2040 expansion and participate in transformational, city-shaping projects." />
                      <GoldBullets items={[
                        "Land banking in the future Jebel Ali urban centre at pre-development pricing.",
                        "Regeneration projects converting urban-core industrial areas into mixed-use districts.",
                        "Partnership stakes in mega-projects aligned with long-term planning frameworks.",
                        "Emerging technology real estate, including autonomous-mobility infrastructure and advanced data centres.",
                        "Hatta sustainable tourism and residential projects as the exclave matures.",
                        "Expected Returns: Land appreciation of 100–200%, project-level returns of 25–30%, and total annual returns of 18–22%."
                      ]} />
                    </Section>
                  </div>
                )
              })}
            />
            <Card
              category="Guidance"
              title="Final Investor Guidance"
              image="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800"
              points={[
                "Unabridged Portfolio Allocation model (40/40/20).",
                "Verbatim Entry, Risk, and Exit strategies.",
                "Key Success Metric: 15%+ annualised returns.",
                "Maintaining 85%+ occupancy requirements.",
                "Hold protocols for top-performing core assets."
              ]}
              onMore={() => openDrawer({
                id: 'final-guidance',
                category: 'Wealth Management',
                title: 'Final Investor Guidance',
                body: (
                  <div className="space-y-12">
                    <Section title="Portfolio Allocation Model">
                      <GoldBullets items={[
                        "Core Holdings – 40%: Stabilised, income-producing assets in established centres such as Downtown, Marina, and DIFC. These provide 5–7% yields and steady appreciation, balancing capital preservation with long-term growth.",
                        "Growth Holdings – 40%: Development and pre-stabilisation assets in emerging centres like Silicon Oasis and District 2020, as well as transit-oriented locations. Higher-risk positions with 15–20% return potential.",
                        "Opportunistic Holdings – 20%: Value-add regeneration projects, land banking in future development phases, and niche sectors such as data centres or Hatta tourism. Highest-risk category with 20–25%+ potential returns."
                      ]} />
                    </Section>
                    <Section title="Execution Protocol">
                      <VerbatimText text="Entry Strategy: Deploy capital gradually over 24–36 months to average entry pricing and align with phased land releases. Prioritise acquisitions in areas that are announced but not yet developed—where infrastructure funding is confirmed but construction has not begun. Form joint ventures with master developers to secure prime sites." />
                      <VerbatimText text="Risk Management: Diversify across asset classes—residential, commercial, logistics, and hospitality—and across multiple urban centres. Avoid over-concentration in single-use or non-transit locations. Maintain 15–20% of the portfolio in liquid, stabilised assets for flexibility. Partner with established developers." />
                      <VerbatimText text="Exit Strategy: Plan for 7–10 year holds for core assets, 5–7 years for growth assets, and 3–5 years for opportunistic positions. Time exits around major infrastructure milestones such as Metro openings or centre maturation. Use partial exits—via strata sales or portfolio transactions—to recycle capital. Retain top-performing core assets beyond 2040." />
                    </Section>
                    <Section title="Key Success Metric">
                      <VerbatimText text="Success is defined as achieving 15%+ annualised total returns over a 10-year period while maintaining 85%+ occupancy and avoiding permanent capital loss. This requires disciplined location selection (transit-oriented and centre-based), staged capital deployment, and active asset management focused on tenant quality, property upgrades, and adaptive reuse." />
                    </Section>
                  </div>
                )
              })}
            />
          </>
        )}
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
            {/* Drawer Header - Deep Navy as requested */}
            <div className="bg-[#0A192F] p-10 flex justify-between items-start border-b border-brand-gold/20">
              <div>
                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.4em] mb-3 block">DXB Edge Vault // {drawerContent.category}</span>
                <h3 className="text-3xl font-serif font-bold text-white leading-tight italic">{drawerContent.title}</h3>
              </div>
              <button 
                onClick={closeDrawer}
                className="p-2 text-white/40 hover:text-brand-gold transition-colors"
              >
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Utility Toolbar */}
            <div className="bg-soft-grey px-10 py-4 flex justify-between items-center border-b border-slate-200">
              <button 
                onClick={copyVerbatim}
                className="text-[9px] font-bold text-brand-navy hover:text-brand-gold transition-colors flex items-center gap-2 uppercase tracking-widest"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                Copy Strategic Intelligence
              </button>
              <span className="text-[8px] font-bold text-slate-grey/40 uppercase tracking-widest">Sovereign Data Stream: 2024.1.RESTORED</span>
            </div>

            {/* Drawer Body - Standardized typography */}
            <div id="drawer-body-text" className={`flex-1 p-12 overflow-y-auto custom-scrollbar bg-white transition-opacity duration-700 delay-200 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}>
               {drawerContent.body}
            </div>

            {/* Drawer Footer */}
            <div className="p-10 border-t border-slate-100 flex gap-4 bg-soft-grey/30">
              <button 
                onClick={closeDrawer}
                className="flex-1 bg-brand-navy text-white text-[11px] font-bold uppercase tracking-[0.3em] py-5 hover:bg-brand-gold transition-all duration-500 shadow-xl"
              >
                Exit Analysis
              </button>
              <button 
                className="px-10 border border-brand-navy/20 text-brand-navy text-[11px] font-bold uppercase tracking-[0.3em] hover:border-brand-gold transition-colors"
              >
                Export PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombinedStrategy;