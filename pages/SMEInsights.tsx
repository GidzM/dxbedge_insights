
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
        <p className="text-brand-navy/80 text-[14px] leading-relaxed font-medium">
          {parseBoldData(item)}
        </p>
      </div>
    ))}
  </div>
);

// Helper to bold currency, percentages, and ROI figures in text
const parseBoldData = (text: string) => {
  const parts = text.split(/(AED\s[\d,.]+[BMKT]?|[\d.]+%|ROI)/g);
  return parts.map((part, i) => {
    if (/(AED\s[\d,.]+[BMKT]?|[\d.]+%|ROI)/.test(part)) {
      return <strong key={i} className="text-brand-navy font-black">{part}</strong>;
    }
    return part;
  });
};

const SMEInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState('fundamentals');
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

  const tabs = [
    { id: 'fundamentals', label: 'Market Fundamentals' },
    { id: 'growth', label: 'Growth & Demand' },
    { id: 'mechanics', label: 'Transaction Mechanics' },
    { id: 'location', label: 'Location Intelligence' },
    { id: 'advisory', label: 'Strategic Advisory' }
  ];

  return (
    <div className="max-w-7xl mx-auto py-16 px-10 lg:px-16 animate-fadeIn pb-32">
      <div className="w-full h-[300px] bg-brand-navy overflow-hidden mb-16 relative">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000" 
            alt="Dubai Downtown Aerial" 
            className="w-full h-full object-cover grayscale brightness-[0.7] contrast-[1.2]"
          />
          <div className="absolute inset-0 bg-brand-navy/40 mix-blend-multiply" />
          <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/40">SME Ground Truth Stream</span>
          </div>
      </div>

      <header className="mb-16 border-l border-brand-gold pl-10">
        <h1 className="text-5xl font-serif font-bold text-brand-navy mb-6 italic">SME Insights</h1>
        <p className="text-xl text-slate-grey max-w-3xl leading-relaxed font-serif italic">
          Expert-level market intelligence distilled into clear, actionable insights. All data grounded in verified SME documentation. [Source: SME Strategic Insights]
        </p>
      </header>

      <div className="mb-12 border-b border-slate-200 overflow-x-auto no-scrollbar">
        <div className="flex gap-4 md:gap-6 lg:gap-8 justify-between lg:justify-start">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.15em] lg:tracking-[0.2em] transition-all relative whitespace-nowrap ${
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
        {activeTab === 'fundamentals' && (
          <>
            <Card
              category="Market Performance"
              title="Market Fundamentals"
              image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
              points={[
                "Dubai recorded AED 917B in transactions, rising 20% YoY.",
                "Rental yields are strongest globally at 8–10%.",
                "Market is shifting into a stable, mature phase.",
                "Anchored by Dubai 2040 and D33 strategies."
              ]}
              isPremium
              onMore={() => openDrawer({
                id: 'market-perf',
                category: 'Set 1: Market Performance',
                title: 'Market Performance & Fundamentals',
                body: (
                  <div className="space-y-6">
                    <GoldBullets items={[
                      "Dubai recorded AED 917B in real estate transactions, rising 20% YoY, driven by strong off-plan activity.",
                      "Rental yields remain among the strongest globally at 8–10%, supported by a high share of cash buyers.",
                      "Analysts expect the market to shift into a stable, mature phase, not a correction.",
                      "Long-term confidence is anchored by Dubai 2040 and D33, which prioritise population growth and infrastructure."
                    ]} />
                  </div>
                )
              })}
            />
            <Card
              category="Benchmarking"
              title="Global Price Benchmarking"
              image="https://images.unsplash.com/photo-1528702748617-c64d49f918af?auto=format&fit=crop&q=80&w=800"
              points={[
                "Prime pricing ($400–$650) is a 50–75% discount to hubs like London.",
                "Waterfront homes ($1,200–$2,500) far below Monaco benchmarks.",
                "Higher yields (6–9%) compared to mature markets (2–4%).",
                "Lower entry pricing = more floor area per dollar invested."
              ]}
              onMore={() => openDrawer({
                id: 'benchmarking',
                category: 'Set 1: Global Benchmarking',
                title: 'Global Price Benchmarking',
                body: (
                  <div className="space-y-12">
                    <Section title="Prime Residential Pricing (USD per sq ft)">
                      <VerbatimText text="Dubai ($400–$650) remains significantly more affordable than Hong Kong, London, New York, Singapore, Paris, and Tokyo — typically at a 50–75% discount." />
                    </Section>
                    <Section title="Ultra-Luxury Waterfront">
                      <VerbatimText text="Dubai’s top-tier waterfront homes ($1,200–$2,500) remain far below Monaco, Hong Kong Peak, London, and New York." />
                    </Section>
                    <Section title="Commercial Office Pricing">
                      <VerbatimText text="Dubai ($350–$700) is materially cheaper than London, New York, and Singapore, supporting stronger yields and capital efficiency." />
                    </Section>
                  </div>
                )
              })}
            />
            <Card
              category="Yields"
              title="Rental Yield Landscape"
              image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
              points={[
                "Citywide average: ~6.9% [Source: SME Strategic Insights].",
                "Apartments: 7.0–7.3% | Villas: ~5%.",
                "Short-term rentals: 8–12%++ potential.",
                "High-yield communities consistently deliver 7.5–9%++."
              ]}
              onMore={() => openDrawer({
                id: 'yield-landscape',
                category: 'Set 2: Yields',
                title: 'Rental Yield Landscape (2025)',
                body: (
                  <div className="space-y-6">
                    <GoldBullets items={[
                      "Citywide average: ~6.9%",
                      "Apartments: 7.0–7.3%",
                      "Villas: ~5%",
                      "Short-term rentals: 8–12%+",
                      "High-yield communities: 7.5–9%+",
                      "Dubai’s yields outperform London, New York, and Singapore."
                    ]} />
                  </div>
                )
              })}
            />
          </>
        )}

        {activeTab === 'growth' && (
          <>
            <Card
              category="Demographics"
              title="Population Growth & Demand"
              image="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=800"
              points={[
                "Population exceeded 4.0M in 2025 (6.1% growth).",
                "Targeting 5M residents by ~2030.",
                "Demand continues to outpace supply through 2026.",
                "Driven by skilled professionals and HNW migration."
              ]}
              isPremium
              onMore={() => openDrawer({
                id: 'pop-growth',
                category: 'Set 3: Population',
                title: 'Population Growth & Housing Demand (2025–2026)',
                body: (
                  <div className="space-y-12">
                    <Section title="Projections">
                      <VerbatimText text="2025: Population exceeded 4.0M, growing 6.1%. 2026: Expected to reach ~4.2M, growing 5–5.5%. Long-term trajectory: 5M residents by ~2030." />
                    </Section>
                    <Section title="Supply vs Population">
                      <GoldBullets items={[
                        "2025: 182,500 new residents vs 55,400 units delivered.",
                        "2026: 182,500 projected vs 52,780 units delivered.",
                        "Demand continues to outpace supply, supporting rents and prices."
                      ]} />
                    </Section>
                  </div>
                )
              })}
            />
            <Card
              category="Lifestyle"
              title="Community & Lifestyle Drivers"
              image="https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&q=80&w=800"
              points={[
                "Demand for villas/townhouses rising due to lifestyle focus.",
                "Education expansion: 227 private schools, up 42% in 5 years.",
                "100 new private schools planned by 2033.",
                "Homes near top schools outperform on rental yield."
              ]}
              onMore={() => openDrawer({
                id: 'community-drivers',
                category: 'Set 6: Lifestyle',
                title: 'Family-Focused Communities & Education Demand',
                body: (
                  <div className="space-y-12">
                    <Section title="Education Infrastructure">
                      <VerbatimText text="Education infrastructure is expanding: 227 private schools with 387k students, up 42% in five years. Government plans to add 100 new private schools by 2033, many tied to new master-planned communities." />
                    </Section>
                    <Section title="Value Performance">
                      <GoldBullets items={[
                        "Homes near top international schools consistently outperform on rental yield and capital appreciation.",
                        "Families pay premiums for proximity to education.",
                        "High-performing areas include Dubai Hills Estate, Arabian Ranches, Emirates Living, and Damac Hills."
                      ]} />
                    </Section>
                  </div>
                )
              })}
            />
          </>
        )}

        {activeTab === 'mechanics' && (
          <>
            <Card
              category="Investment"
              title="Off-Plan vs Secondary"
              image="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800"
              points={[
                "Off-plan typically launches 10–20% below future value.",
                "Forecast 8–12% growth in 2026 for handover-near projects.",
                "Hybrid strategy: Off-plan for growth, Secondary for yield.",
                "Refinance at handover to recycle capital."
              ]}
              isPremium
              onMore={() => openDrawer({
                id: 'offplan-mech',
                category: 'Set 4: Off-Plan Mechanics',
                title: 'Off-Plan vs Secondary Market Analysis',
                body: (
                  <div className="space-y-12">
                    <Section title="Off-Plan Capital Appreciation (2025–2026)">
                      <GoldBullets items={[
                        "2025: Expected 6–8% price growth.",
                        "2026: Forecast 8–12% growth as major projects near handover.",
                        "Off-plan typically launches 10–20% below future handover value.",
                        "Strong locations may deliver 15–25%+ appreciation through construction."
                      ]} />
                    </Section>
                    <Section title="Hybrid Strategy Mapping">
                      <VerbatimText text="Investors often utilize Off-plan for growth and Secondary for yield. Refinancing at handover allows for capital recycling into new off-plan launches." />
                    </Section>
                  </div>
                )
              })}
            />
            <Card
              category="Costs"
              title="Fees & Transaction Costs"
              image="https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800"
              points={[
                "DLD Transfer Fee: 4% | Title Deed: AED 580.",
                "Professional Agent Commission: 2% + VAT.",
                "Trustee Office fees: AED 2,000–4,000 + VAT.",
                "Mortgage Registration: 0.25% of loan + AED 290."
              ]}
              onMore={() => openDrawer({
                id: 'transaction-fees',
                category: 'Set 5: Financing & Costs',
                title: 'Transaction Fees',
                body: (
                  <div className="space-y-12">
                    <Section title="Government Fees">
                      <GoldBullets items={[
                        "DLD Transfer Fee: 4%",
                        "Registration Fee: AED 2,000–4,000 + VAT",
                        "Title Deed: AED 580",
                        "Oqood (off-plan): ~AED 1,000 + VAT"
                      ]} />
                    </Section>
                    <Section title="Professional & Mortgage Fees">
                      <GoldBullets items={[
                        "Agent commission: 2% + VAT",
                        "Trustee office: AED 2,000–4,000 + VAT",
                        "Mortgage Registration: 0.25% of loan + AED 290"
                      ]} />
                    </Section>
                  </div>
                )
              })}
            />
            <Card
              category="Finance"
              title="Mortgage Landscape"
              image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800"
              points={[
                "Residents LTV: 75–80% (Ready), 60–65% (Off-plan).",
                "Non-Residents LTV: 50–70% (Ready), 50–60% (Off-plan).",
                "Resident Rates: 3.5–5.5% | Non-Resident: 4.5–6.5%++.",
                "Higher equity requirements for international investors."
              ]}
              onMore={() => openDrawer({
                id: 'mortgage-landscape',
                category: 'Set 5: Financing',
                title: 'Mortgage Landscape – Residents vs Non-Residents',
                body: (
                  <div className="space-y-12">
                    <Section title="Residents">
                      <GoldBullets items={[
                        "LTV: 75–80% (ready), 60–65% (off-plan)",
                        "Rates: 3.5–5.5%",
                        "Easier approval processes"
                      ]} />
                    </Section>
                    <Section title="Non-Residents">
                      <GoldBullets items={[
                        "LTV: 50–70% (ready), 50–60% (off-plan)",
                        "Rates: 4.5–6.5%+",
                        "Higher equity requirements"
                      ]} />
                    </Section>
                  </div>
                )
              })}
            />
            <Card
              category="Alternative"
              title="Crypto-Funded Purchases"
              image="https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80&w=800"
              points={[
                "Settlement typically occurs in AED via licensed partners.",
                "Off-plan is popular due to flexible payment structures.",
                "Standard AML checks still apply to all transactions.",
                "Fast, tax-efficient deployment via regulated channels."
              ]}
              onMore={() => openDrawer({
                id: 'crypto-purchases',
                category: 'Set 5: Mechanics',
                title: 'Crypto-Funded Property Purchases',
                body: (
                  <div className="space-y-6">
                    <VerbatimText text="Dubai allows property purchases funded by digital assets, but settlement typically occurs in AED via licensed conversion partners. Not all developers or banks accept crypto directly; compliant intermediaries are required." />
                    <GoldBullets items={[
                      "Standard AML checks still apply, including proof of funds and identity verification.",
                      "Off-plan is popular among crypto investors due to flexible, phased payment structures.",
                      "Digital assets can support fast, tax-efficient deployment when handled through regulated channels."
                    ]} />
                  </div>
                )
              })}
            />
          </>
        )}

        {activeTab === 'location' && (
          <>
            <Card
              category="Mid-Tier"
              title="Yield Hubs & Emerging Zones"
              image="https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80&w=800"
              points={[
                "High-Yield Mid-Tier: JVT, Dubai South, Business Bay.",
                "Emerging High-Growth: Expo City, Maritime City.",
                "JVT Gross Yields: 8.5% to 10% for premium units.",
                "Maritime City projected appreciation: 15-20% > average."
              ]}
              isPremium
              onMore={() => openDrawer({
                id: 'yield-hubs',
                category: 'Set 7: Location Intelligence',
                title: 'Mid-Tier Yield Hubs & Emerging Growth Zones',
                body: (
                  <div className="space-y-12">
                    <Section title="High-Yield Mid-Tier Areas">
                      <GoldBullets items={[
                        "Burj Khalifa District",
                        "JVT (8.5% to 10% gross yields)",
                        "Dubai South",
                        "Business Bay",
                        "Dubailand",
                        "JLT"
                      ]} />
                    </Section>
                    <Section title="Emerging High-Growth Areas">
                      <GoldBullets items={[
                        "Expo City",
                        "Maritime City (Appreciation projected 15-20% > city average)",
                        "South Dubai (around Al Maktoum Airport)",
                        "Dubai Creek Harbour"
                      ]} />
                    </Section>
                  </div>
                )
              })}
            />
            <Card
              category="Luxury"
              title="Luxury & Branded Residences"
              image="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800"
              points={[
                "Top Locations: Palm Jumeirah, Jumeirah Bay, Downtown.",
                "Branded premium pricing: Up to 30% higher.",
                "Moratorium on reclamation locks in permanent scarcity.",
                "Waterfront villas show 100%++ appreciation cycles."
              ]}
              onMore={() => openDrawer({
                id: 'luxury-hotspots',
                category: 'Set 7: Branded Residences',
                title: 'Luxury & Branded Residence Hotspots',
                body: (
                  <div className="space-y-12">
                    <Section title="Top Luxury Locations">
                      <GoldBullets items={[
                        "Palm Jumeirah (Global benchmark for ultra-luxury)",
                        "Jumeirah Bay Island",
                        "Downtown Dubai",
                        "Dubai Hills Estate",
                        "Maritime City"
                      ]} />
                    </Section>
                    <Section title="Branded Residence Appeal">
                      <GoldBullets items={[
                        "Premium pricing (up to 30% higher)",
                        "Strong yields and faster resale",
                        "Global brand loyalty",
                        "High-quality management standards"
                      ]} />
                    </Section>
                  </div>
                )
              })}
            />
          </>
        )}

        {activeTab === 'advisory' && (
          <>
            <Card
              category="Migration"
              title="Dubai’s Appeal to HNWIs"
              image="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800"
              points={[
                "World's top destination for millionaire migration.",
                "Safety, lifestyle, and elite healthcare anchors.",
                "Global instability driving capital to stable hubs.",
                "Long-term residency pathways (Golden Visa)."
              ]}
              isPremium
              onMore={() => openDrawer({
                id: 'hnwi-appeal',
                category: 'Set 8: Strategic Insights',
                title: 'Dubai’s Appeal to HNWIs',
                body: (
                  <div className="space-y-6">
                    <GoldBullets items={[
                      "One of the world’s top destinations for millionaire migration.",
                      "High safety rankings, strong happiness scores, elite healthcare, and top-tier schools.",
                      "Global instability contrasts with Dubai’s stability, tax advantages, and economic momentum.",
                      "Fiscal neutrality continues to attract global portfolios."
                    ]} />
                  </div>
                )
              })}
            />
            <Card
              category="Wealth"
              title="Tax & Repatriation"
              image="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800"
              points={[
                "Key Advantage: No capital gains or annual property tax.",
                "No rental income tax | No inheritance tax.",
                "Wealth Structuring: Foundations, Offshore entities.",
                "100% foreign ownership of assets."
              ]}
              onMore={() => openDrawer({
                id: 'tax-protection',
                category: 'Set 8: Wealth Protection',
                title: 'Tax, Repatriation & Wealth Protection',
                body: (
                  <div className="space-y-12">
                    <Section title="Key Advantages">
                      <GoldBullets items={[
                        "No capital gains tax",
                        "No annual property tax",
                        "No rental income tax",
                        "No inheritance tax"
                      ]} />
                    </Section>
                    <Section title="Wealth Structuring Options">
                      <GoldBullets items={[
                        "Foundations",
                        "Offshore entities",
                        "UAE wills",
                        "Holding companies"
                      ]} />
                    </Section>
                  </div>
                )
              })}
            />
            <Card
              category="Strategic"
              title="Smart Investor Guidance"
              image="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800"
              points={[
                "Avoid: Developers with no track record.",
                "Avoid: Assets with unclear exit strategies.",
                "Prioritise: Projects aligned with sovereign strategy.",
                "Prioritise: Agents supporting long-term goals."
              ]}
              onMore={() => openDrawer({
                id: 'investor-guidance',
                category: 'Set 8: Guidance',
                title: 'Smart Investor Guidance',
                body: (
                  <div className="space-y-12">
                    <Section title="What to Avoid">
                      <GoldBullets items={[
                        "Developers with no track record",
                        "Assets with unclear exit strategies",
                        "Over-leveraging in speculative mid-tier segments"
                      ]} />
                    </Section>
                    <Section title="What to Prioritise">
                      <GoldBullets items={[
                        "Proven developers",
                        "Agents who support long-term goals",
                        "Projects aligned with your investment strategy",
                        "Transit-oriented and high-occupancy communities"
                      ]} />
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

            <div className="bg-soft-grey px-10 py-4 flex justify-between items-center border-b border-slate-200">
              <span className="text-[8px] font-bold text-slate-grey/40 uppercase tracking-widest">Sovereign Data Stream: RESTORED SME DATA</span>
            </div>

            <div className="flex-1 p-12 overflow-y-auto custom-scrollbar bg-white">
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
  );
};

export default SMEInsights;
