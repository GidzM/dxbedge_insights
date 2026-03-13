import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { useCurrency } from '../components/CurrencyContext';

interface DrawerContent {
  id: string;
  title: string;
  category: string;
  body: React.ReactNode;
}

const Section = ({ title, children }: { title: string; children?: React.ReactNode }) => (
  <section className="mb-12 animate-fadeIn">
    <h4
      className="font-sans font-bold text-xl text-brand-navy mb-5 border-b border-brand-gold/20 pb-2"
      style={{ fontFamily: 'Univers, Inter, sans-serif' }}
    >
      {title}
    </h4>
    <div className="space-y-5">{children}</div>
  </section>
);

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
          {item}
        </p>
      </div>
    ))}
  </div>
);

const CombinedStrategy: React.FC = () => {
  const { formatFromAED } = useCurrency();
  const economy32T = formatFromAED(32000000000000, { maximumFractionDigits: 0 });
  const trade25_6T = formatFromAED(25600000000000, { maximumFractionDigits: 0 });
  const trade14_2T = formatFromAED(14200000000000, { maximumFractionDigits: 0 });
  const fdi60B = formatFromAED(60000000000, { maximumFractionDigits: 0 });
  const digital100B = formatFromAED(100000000000, { maximumFractionDigits: 0 });
  const gov700B = formatFromAED(700000000000, { maximumFractionDigits: 0 });
  const private1T = formatFromAED(1000000000000, { maximumFractionDigits: 0 });
  const consumption2_2T = formatFromAED(2200000000000, { maximumFractionDigits: 0 });
  const consumption3T = formatFromAED(3000000000000, { maximumFractionDigits: 0 });

  const [activeTab, setActiveTab] = useState('framework');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState<DrawerContent | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [drawerOpen]);

  useEffect(() => {
    const scrollContainer = document.querySelector('main');

    const handleScroll = () => {
      const mainScrollTop = scrollContainer ? scrollContainer.scrollTop : 0;
      const windowScrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      setShowScrollTop(Math.max(mainScrollTop, windowScrollTop) > 180);
    };

    handleScroll();
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  const scrollToTop = () => {
    const scrollContainer = document.querySelector('main');
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            src="https://images.unsplash.com/photo-1655309893829-407c54619f1f?auto=format&fit=crop&q=80&w=2000" 
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
          AI-generated combined analysis of the Dubai 2040 Urban Plan and D33 Economic Agenda, translated into clear strategic guidance for investors.
        </p>
      </header>

      <div className="mb-12 py-3 bg-soft-grey border-b border-slate-200 md:py-0 md:border-b-0 md:bg-transparent">
        <div className="flex items-center justify-between mb-3 gap-4">
          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-navy/70">Strategy Sections</p>
          <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-grey/60 whitespace-nowrap">Swipe Tabs →</p>
        </div>
        <div className="overflow-x-auto custom-scrollbar custom-scrollbar-prominent">
          <div className="inline-flex min-w-full w-max gap-2 p-2 border border-slate-200 bg-soft-grey/70 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] transition-all whitespace-nowrap rounded-md border ${
                  activeTab === tab.id
                    ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                    : 'bg-white text-brand-navy/70 border-slate-200 hover:text-brand-navy hover:border-brand-gold/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
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
                `Economic output target of ${economy32T} by 2033.`,
                `FDI goals of ${fdi60B} annually.`,
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
                    <VerbatimText text={`D33 provides the economic engine, aiming to double the economy to ${economy32T}, expand foreign trade by 80% to ${trade25_6T}, nearly double annual FDI to ${fdi60B}, and generate ${digital100B} annually from digital transformation.`} />
                    <VerbatimText text="Together, these plans create a powerful, coordinated framework that unlocks major real estate opportunities across transit-oriented mixed-use districts, logistics and industrial zones near trade gateways, knowledge-economy office and residential clusters, and technology-enabled smart developments. With aligned timelines and mutually reinforcing goals, the combined strategy represents one of the most comprehensive and investable urban transformation programmes globally." />
                  </div>
                )
              })}
            />
            <Card
              category="Convergence"
              title="Key Synergies Map"
                image="https://images.unsplash.com/photo-1612873649383-edf91f1cf7fe?auto=format&fit=crop&q=80&w=800"
              points={[
                "Full 10-Point Strategic Alignment Analysis.",
                "Population targets supporting D33 economic goals.",
                "Transit-Oriented Development linked to trade expansion.",
                `Infrastructure expenditure sync (${gov700B}).`,
                "Smart-City foundations for digital economy growth."
              ]}
              onMore={() => openDrawer({
                id: 'synergies',
                category: 'Alignment Analysis',
                title: 'Key Synergies Between Plans',
                body: (
                  <div className="space-y-2">
                    <Section title="1. Aligned Population & Economic Growth">
                      <VerbatimText text={`The projected 75% population increase—from 3.3 million to 5.8 million—directly supports D33’s economic-doubling goals by expanding the workforce and increasing domestic consumption from ${consumption2_2T} to ${consumption3T}.`} />
                    </Section>
                    <Section title="2. Urban Centres Reinforce Economic Diversification">
                      <VerbatimText text={`The six major urban centres, including Silicon Oasis as a technology hub, align with D33’s focus on the knowledge economy and digital transformation valued at ${digital100B} annually.`} />
                    </Section>
                    <Section title="3. Transit-Oriented Development Supports Trade Expansion">
                      <VerbatimText text={`Metro and light-rail expansion, combined with Etihad Rail connectivity, strengthens the logistics network required for foreign trade growth from ${trade14_2T} to ${trade25_6T}.`} />
                    </Section>
                    <Section title="4. Integrated Southern Logistics Hub">
                      <VerbatimText text="The Urban Plan’s multi-modal logistics zone—anchored by Jebel Ali Port, Al Maktoum Airport, and Etihad Rail—directly enables D33’s trade and FDI targets." />
                    </Section>
                    <Section title="5. Coordinated Infrastructure Investment">
                      <VerbatimText text={`The Urban Plan’s phased development approach aligns with D33’s ${gov700B} in government expenditure, ensuring infrastructure delivery is synchronised with economic growth.`} />
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
                      <VerbatimText text={`Integrated utilities and digital infrastructure in the Urban Plan provide the foundation for D33’s ${digital100B} annual digital-economy ambitions.`} />
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
              image="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800"
              points={[
                "Unabridged list of 20 strategic takeaways.",
                "Permanent scarcity premiums of 30-50%.",
                "Transit timing: 2-3 years prior to opening.",
                "Southern emirate as the logistics powerhouse.",
                `Private-sector investment signals (${private1T}).`
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
                      `5. Logistics is the most predictable growth story: With foreign trade rising 80% to ${trade25_6T}, logistics real estate near trade hubs offers exceptionally strong potential.`,
                      `6. Digital transformation creates a new real estate class: ${digital100B} annual digital value drives demand for smart buildings, data centres, and innovation districts.`,
                      `7. FDI growth brings institutional-grade tenants: Annual FDI rising to ${fdi60B} attracts multinational firms requiring Grade A office and bulk residential leasing.`,
                      "8. Knowledge-economy expansion boosts premium residential demand: Skilled professionals seek high-quality housing, amenities, and transit access.",
                      "9. Mixed-use becomes the dominant development model: Both plans prioritise walkable, integrated mixed-use environments that achieve higher densities.",
                      "10. Waterfront scarcity premium is locked in: The moratorium on offshore reclamation ensures permanent scarcity, supporting 30–50% premiums.",
                      "11. Staged land release creates clear investment cycles: The land-bank system releases supply in phases; early movers secure the most attractive pricing.",
                      "12. Southern emirate emerges as the logistics powerhouse: The Jebel Ali–Al Maktoum–Etihad Rail corridor becomes the region’s premier logistics zone.",
                      "13. Affordable housing offers scale and complexity: Mandated housing expands market depth; understanding allocation requirements is essential.",
                      "14. Industrial-to-mixed-use regeneration: Underutilised industrial districts in the core offer strong uplift potential through redevelopment.",
                      "15. Transit-oriented timing is critical: Acquiring TOD assets two to three years before opening delivers the best risk-adjusted returns.",
                      `16. Private-sector investment validates market confidence: D33’s ${private1T} private-sector investment target signals strong capital availability.`,
                      `17. Domestic demand strengthens retail and hospitality: Consumption growth to ${consumption3T} supports neighbourhood retail and family hospitality.`,
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
              image="https://images.unsplash.com/photo-1623725259601-b8c41ad6a532?auto=format&fit=crop&q=80&w=800"
              points={[
                "Unabridged Demand Drivers and Supply Factors.",
                "Analysis of Price Implications and Rental Effects.",
                "Impact of 5.8 million residents and 4.9 million workers.",
                "68% increase in urban density valuations.",
                "Offshore reclamation moratorium reinforces long-term waterfront scarcity premiums."
              ]}
              isPremium
              onMore={() => openDrawer({
                id: 'market-impact',
                category: 'Economic Analysis',
                title: 'Real Estate Impact',
                body: (
                  <div className="space-y-12">
                    <Section title="Demand Drivers">
                      <GoldBullets items={[
                        "Dual population and economic doubling generates powerful, compounding demand across all real estate asset classes.",
                        "A city of 5.8 million residents and 4.9 million workers, combined with economic doubling, creates unprecedented requirements for housing, offices, and commercial space.",
                        `Rising FDI to ${fdi60B} annually, paired with transit-oriented urban centres, concentrates demand in premium locations near Metro stations.`,
                        `Foreign trade expansion to ${trade25_6T} and the southern logistics hub drive major demand for industrial, warehousing, and free-zone facilities.`,
                        `Digital transformation worth ${digital100B} annually fuels demand for smart buildings, data centres, and technology-focused real estate.`,
                        `Domestic consumption rising to ${consumption3T} strengthens demand for retail, hospitality, and mixed-use developments.`,
                        `Tourism growth to 25 million visitors annually, supported by ${private1T} in private investment, expands hospitality and short-term rental demand.`,
                        "A 68% increase in urban density and the 20-minute city model elevate valuations for walkable, transit-accessible properties."
                      ]} />
                    </Section>
                    <Section title="Supply Factors">
                      <GoldBullets items={[
                        "Strict urban boundary controls and a moratorium on offshore reclamation create permanently constrained land supply, supporting long-term value appreciation.",
                        `A staged land-bank system and ${private1T} in private-sector investment ensure supply is released in a controlled, demand-aligned manner.`,
                        `${gov700B} in government expenditure unlocks new development areas through phased infrastructure delivery.`,
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
                "Technology-led obsolescence risk in traditional office and retail stock."
              ]}
              onMore={() => openDrawer({
                id: 'investor-risks',
                category: 'Strategic Defence',
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
                "Location precision in designated centres is a core success lever.",
                "8 Critical factors for institutional excellence.",
                "Transit-linked acquisitions perform best 2-3 years pre-launch.",
                "Al Sa’fat-compliant assets can achieve 10-15% sustainability premiums.",
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
                "Investment thesis, target returns, and risk profile by sector.",
                "Hospitality RevPAR and STR yield targets.",
                "Mixed-Use target returns of 22-28% on cost.",
                `Retail transformation mapping (${consumption3T} demand).`
              ]}
              isPremium
              onMore={() => openDrawer({
                id: 'sectors-restored',
                category: 'Asset Class Strategy',
                title: 'Sector Deep Dives',
                body: (
                  <div className="space-y-12">
                    <Section title="Logistics & Industrial">
                      <VerbatimText text={`Opportunity Scale: Exceptional — the ${trade25_6T} foreign-trade target requires major expansion of logistics and industrial infrastructure.`} />
                      <VerbatimText text="Key Locations: Southern multi-modal logistics hub (Jebel Ali Port, Al Maktoum Airport, Etihad Rail) and designated industrial zones near major urban centres." />
                      <GoldBullets items={[
                        `Investment Thesis: Trade growth of 80% over the decade demands proportional increases in warehousing, fulfilment centres, cold storage, and last-mile logistics. E-commerce expansion and ${consumption3T} in domestic demand add further pressure.`,
                        "Target Returns: Land appreciation of 60–80%, stabilised yields of 6–8% net, and development returns of 18–22% on cost.",
                        "Risks: Competition from Jebel Ali Free Zone expansions and automation reducing space requirements per transaction."
                      ]} />
                    </Section>
                    <Section title="Commercial Office">
                      <VerbatimText text="Opportunity Scale: Strong — the knowledge-economy shift and doubling of FDI create sustained demand for premium office space." />
                      <VerbatimText text="Key Locations: Six major urban centres (especially Silicon Oasis and District 2020), downtown business districts, and transit-oriented developments." />
                      <GoldBullets items={[
                        `Investment Thesis: Digital transformation (${digital100B} annually) and rising FDI (${fdi60B} annually) attract high-quality tenants seeking smart buildings. Knowledge workers prioritise premium amenities and transit access. As the economy doubles, Grade A office supply may lag demand.`,
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
                        `Investment Thesis: Domestic consumption rising from ${consumption2_2T} to ${consumption3T} supports retail expansion, but the market is shifting from traditional malls toward street retail and experiential formats. The 20-minute city model increases demand for neighbourhood commercial assets.`,
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
              image="https://images.unsplash.com/photo-1615747476205-991a14cd2358?auto=format&fit=crop&q=80&w=800"
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
                        `Logistics and industrial real estate along the Etihad Rail corridor and near Jebel Ali Port and Al Maktoum Airport, directly benefiting from the ${trade25_6T} foreign-trade target and strong visibility on 80% trade growth.`,
                        `Smart office and innovation-district assets in Silicon Oasis and technology clusters, aligned with ${digital100B} in annual digital-economy value and attracting premium tenants.`
                      ]} />
                    </Section>
                    <Section title="TIER 2">
                      <GoldBullets items={[
                        `Premium residential properties in major urban centres targeting knowledge-economy professionals, supported by FDI growth to ${fdi60B} annually and rising demand from skilled workers.`,
                        "Hospitality assets along the coastal tourism corridor, benefiting from the 25-million-visitor target and increased business travel linked to FDI expansion.",
                        "Industrial-to-mixed-use regeneration projects in the urban core, offering value-add potential through redevelopment of underutilised but infrastructure-rich sites."
                      ]} />
                    </Section>
                    <Section title="TIER 3">
                      <GoldBullets items={[
                        `Retail and street-level commercial in walkable mixed-use centres, supported by domestic consumption growth to ${consumption3T} and the 20-minute city model.`,
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
                "Three-phase timeline: 2024-2027, 2028-2033, and 2034-2040.",
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
              image="https://images.unsplash.com/photo-1650435331404-c1340a4c8f24?auto=format&fit=crop&q=80&w=800"
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

      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll to top"
        className={`md:hidden fixed right-4 bottom-6 z-50 w-12 h-12 rounded-full border border-brand-gold/40 bg-brand-navy text-white shadow-lg transition-all duration-300 ${showScrollTop && !drawerOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'}`}
      >
        <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

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

            {/* Utility Toolbar */}
            <div className="bg-soft-grey px-10 py-4 flex justify-between items-center border-b border-slate-200">
              <button 
                onClick={copyVerbatim}
                className="text-[9px] font-bold text-brand-navy hover:text-brand-gold transition-colors flex items-center gap-2 uppercase tracking-widest px-2 py-1 -my-1"
              >
                <svg className="w-4 h-4 flex-none overflow-visible" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3h6a1 1 0 011 1v2H8V4a1 1 0 011-1z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h8a2 2 0 012 2v11a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11h6M9 15h6" />
                </svg>
                Copy Strategic Intelligence
              </button>
            </div>

            {/* Drawer Body - Standardized typography */}
            <div
              id="drawer-body-text"
              className={`flex-1 p-12 overflow-y-auto custom-scrollbar custom-scrollbar-prominent bg-white transition-opacity duration-700 delay-200 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CombinedStrategy;