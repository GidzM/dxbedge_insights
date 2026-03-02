import React, { useState, useEffect } from 'react';
import Card from '../components/Card';

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
  const targets = [
    "AED 917 billion", "20%", "6-8%", "8-12%", "15-25%", "$400–$650", 
    "7.0–7.3%", "8-10%", "80%", "75-80%", "90-day", "5-20%", "182,500"
  ];
  
  let result: React.ReactNode = text;
  targets.forEach(target => {
    if (typeof result === 'string' && result.includes(target)) {
      const parts = result.split(target);
      result = (
        <>
          {parts[0]}
          <span className="text-brand-gold font-bold">{target}</span>
          {parts[1]}
        </>
      );
    }
  });
  return result;
};

const SMEInsights: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'performance' | 'mechanics' | 'commercial'>('performance');
  const [activeDrawer, setActiveDrawer] = useState<DrawerContent | null>(null);

  // FIX 1: Prevent parent scroll when drawer is open
  useEffect(() => {
    if (activeDrawer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeDrawer]);

  const drawerOpen = Boolean(activeDrawer);

  const copyDrawerText = () => {
    if (!activeDrawer) return;
    const text = document.getElementById('sme-drawer-body')?.innerText || '';
    navigator.clipboard.writeText(text);
    alert('Strategic intelligence copied to clipboard.');
  };

  const tabs = [
    { id: 'performance', label: 'Market Performance' },
    { id: 'mechanics', label: 'Investor Mechanics' },
    { id: 'commercial', label: 'Commercial & Industrial' }
  ];

  const content = {
    performance: [
      {
        id: 'global-value',
        category: 'Market Macro',
        title: 'The Global Value Gap',
        isPremium: true,
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80',
        points: [
          "Dubai Entry: $400–$650 per sq. ft.",
          "Vs. London: $1,700–$3,000+ per sq. ft.",
          "Vs. New York: $1,500–$2,500+ per sq. ft.",
          "Zero annual property or capital gains tax advantage."
        ],
        drawerContent: {
          id: 'global-value-detail',
          category: 'SME Insight // Price Benchmarking',
          title: 'Global Real Estate Arbitrage',
          body: (
            <div className="space-y-8">
              <VerbatimText text="Despite record-breaking growth, Dubai remains one of the most undervalued tier-1 global cities on a price-per-square-foot basis." />
              <SectionHeader title="Comparative Analysis (USD/sq. ft.)" />
              <GrowthBullets items={[
                "Hong Kong (Central): $2,200–$2,800+ [Source: World Financial Review].",
                "London (Mayfair): $1,700–$3,000+.",
                "Dubai (Prime): $400–$650 — offering 3x-4x more space for the same capital outlay.",
                "The 'Zero Tax' environment significantly increases Net ROI."
              ]} />
            </div>
          )
        }
      },
      {
        id: 'market-records',
        category: 'Performance',
        title: 'Market Performance Records',
        image: 'https://images.unsplash.com/photo-1582653280643-e39991d70b0a?auto=format&fit=crop&q=80',
        points: [
          "AED 917 billion total transactions in 2024 (20% YoY increase).",
          "Transitioning to a 'Mature Market Cycle'.",
          "High proportion of cash buyers reducing leverage risk.",
          "Sovereign support via D33 & 2040 Urban Plan."
        ],
        drawerContent: {
          id: 'records-detail',
          category: 'SME Insight // Performance Metrics',
          title: 'Transaction & Resilience Data',
          body: (
            <div className="space-y-8">
              <VerbatimText text="Market resilience is reinforced by over 70% cash-buyer dominance, insulating the market from global interest rate hikes." />
              <SectionHeader title="Key Resilience Factors" />
              <GrowthBullets items={[
                "Yield Leadership: Dubai's 8-10% average outperforms London (3-4%).",
                "D33 Economic Agenda: Strategic planning and infrastructure investment floor.",
                "Escrow Protections: Stricter RERA rules preventing speculative bubbles."
              ]} />
            </div>
          )
        }
      },
      {
        id: 'appreciation-forecast',
        category: 'Growth',
        title: '2025-2026 Appreciation',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80',
        points: [
          "6-8% citywide price growth forecast for 2025.",
          "8-12% projected momentum for 2026 handovers.",
          "15-25% 'Handover Arbitrage' in emerging nodes.",
          "Capital gains reinforced by high HNWI migration."
        ],
        drawerContent: {
          id: 'appreciation-detail',
          category: 'SME Insight // Growth Forecast',
          title: 'Strategic Capital Growth',
          body: (
            <div className="space-y-8">
              <VerbatimText text="Off-plan properties launch 10–20% below future handover values, creating natural equity gain for early investors." />
              <SectionHeader title="Top Performance Nodes" />
              <GrowthBullets items={[
                "Dubai South & JVC: 15–25%+ expected gain from contract to completion.",
                "Prime/Branded Residences: 15–30%+ luxury demand premium.",
                "Vite-calculated IRR is maximized by interest-free payment plans."
              ]} />
            </div>
          )
        }
      },
      {
        id: 'structural-gap',
        category: 'Demographics',
        title: 'The Structural Supply Gap',
        isPremium: true,
        image: 'https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?auto=format&fit=crop&q=80',
        points: [
          "182,500 new residents in 2025 (6.1% growth).",
          "3.46 residents arriving for every 1 new unit delivered.",
          "Shortfall in core family housing segments.",
          "Population projected to exceed 5.8M by 2040."
        ],
        drawerContent: {
          id: 'gap-detail',
          category: 'SME Insight // Supply/Demand',
          title: 'Demand vs. Delivery Analysis',
          body: (
            <div className="space-y-8">
              <SectionHeader title="The Absorption Data" />
              <GrowthBullets items={[
                "Dubai's population is projected to hit 4.2M by 2026.",
                "Current 'Under-supply' limits downside risk in core segments.",
                "Secondary market liquidity is rising as End-Users account for 40% of sales."
              ]} />
            </div>
          )
        }
      },
      {
        id: 'rental-benchmarks',
        category: 'Yields',
        title: 'Rental Yield Benchmarks',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80',
        points: [
          "Apartments: 7.0–7.3% average gross yield.",
          "Villas/Townhouses: 5.0% average gross yield.",
          "Short-term/Holiday Lets: 8-12%+ potential.",
          "High-yield nodes: JVC, International City, and DIP."
        ],
        drawerContent: {
          id: 'yield-detail',
          category: 'SME Insight // ROI Analysis',
          title: 'Yield Optimization Strategy',
          body: (
            <div className="space-y-8">
              <SectionHeader title="Community Performance" />
              <GrowthBullets items={[
                "JVC & International City: Leading yield nodes (8-10% gross).",
                "Short-term strategy: Focus on Downtown & Marina for seasonal yields.",
                "Net Yields: Deduct 1.5-2.0% for service charges and management."
              ]} />
            </div>
          )
        }
      }
    ],
    mechanics: [
      {
        id: 'mortgage-ltv',
        category: 'Financing',
        title: 'Mortgage & LTV Strategy',
        isPremium: true,
        image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80',
        points: [
          "Residents: Up to 75-80% LTV for first property.",
          "Non-Residents: 50-70% LTV available.",
          "AED 10k–15k+ min income requirements.",
          "7-8% total acquisition fees (DLD & Commissions)."
        ],
        drawerContent: {
          id: 'mortgage-detail',
          category: 'SME Insight // Investor Mechanics',
          title: 'Acquisition & Leverage Costs',
          body: (
            <div className="space-y-8">
              <SectionHeader title="Transaction Fee Breakdown" />
              <GrowthBullets items={[
                "DLD Fee: 4% (Mandatory).",
                "Agent Commission: 2% + VAT.",
                "Trustee Office Fees: AED 4,000.",
                "Mortgage Valuation: AED 2,500–3,500."
              ]} />
            </div>
          )
        }
      },
      {
        id: 'rera-laws',
        category: 'Legal',
        title: 'RERA Rental Compliance',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80',
        points: [
          "90-day notice for contract changes.",
          "5-20% rent increase bands based on RERA Index.",
          "12-month eviction notice via Notary Public.",
          "Mandatory Ejari registration."
        ],
        drawerContent: {
          id: 'rera-detail',
          category: 'SME Insight // Tenancy Law',
          title: 'Landlord Obligations & Rights',
          body: (
            <div className="space-y-8">
              <SectionHeader title="The Rent Increase Formula" />
              <GrowthBullets items={[
                "Rent 11-20% below market: 5% max increase.",
                "Rent 21-30% below market: 10% max increase.",
                "Rent 31-40% below market: 15% max increase.",
                "Maintenance: Landlords handle major/structural repairs."
              ]} />
            </div>
          )
        }
      },
      {
        id: 'developer-selection',
        category: 'Risk Management',
        title: 'Developer Tier Strategy',
        image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80',
        points: [
          "Tier 1 (Emaar, Nakheel): Best resale liquidity.",
          "Boutique (Ellington, Select): Design focus.",
          "Escrow account protection is mandatory.",
          "Resale velocity higher for brand leaders."
        ],
        drawerContent: {
          id: 'developer-detail',
          category: 'SME Insight // Risk Analysis',
          title: 'Due Diligence on Delivery',
          body: (
            <div className="space-y-8">
              <SectionHeader title="Strategic Segmentation" />
              <GrowthBullets items={[
                "Prestige: Emaar, Nakheel, Meraas.",
                "Value: Azizi, Danube, DAMAC.",
                "Design: Sobha, Ellington, Select Group."
              ]} />
            </div>
          )
        }
      },
      {
        id: 'secondary-vs-offplan',
        category: 'Strategy',
        title: 'Secondary vs Off-Plan Strategy',
        image: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&q=80',
        points: [
          "Off-plan: Maximize IRR via payment plans.",
          "Secondary: Immediate cash flow & liquidity.",
          "Hybrid: Growth via off-plan, income via secondary.",
          "Recycle capital by refinancing at handover."
        ],
        drawerContent: {
          id: 'strategy-detail',
          category: 'SME Insight // Portfolio Strategy',
          title: 'Capital Horizons',
          body: (
            <div className="space-y-8">
              <SectionHeader title="When to Choose" />
              <GrowthBullets items={[
                "Off-Plan: Best for 2–4 year capital growth targets.",
                "Secondary: Best for immediate income and bank financing."
              ]} />
            </div>
          )
        }
      },
      {
        id: 'exit-liquidity',
        category: 'Market Maturity',
        title: 'Exit Options & Velocity',
        image: 'https://images.unsplash.com/photo-1560520653-9e0e4c89eb11?auto=format&fit=crop&q=80',
        points: [
          "Resale velocity at record highs.",
          "Golden Visa eligibility driving retention.",
          "Ease of exit in established master communities.",
          "Market maturity reducing exit friction."
        ]
        // NO Drawer content here
      }
    ],
    commercial: [
      {
        id: 'logistics-yields',
        category: 'Commercial Alpha',
        title: 'Industrial & Logistics Alpha',
        isPremium: true,
        image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80',
        points: [
          "Warehouse yields: 8-10% in JAFZA.",
          "Triple-Net (NNN) leases (Tenant handles maintenance).",
          "Long-term stability (3–10 year leases).",
          "E-commerce & trade sector tailwinds."
        ],
        drawerContent: {
          id: 'logistics-detail',
          category: 'SME Insight // Commercial Yields',
          title: 'Industrial Yield Advantage',
          body: (
            <div className="space-y-8">
              <SectionHeader title="High-Yield Hubs" />
              <GrowthBullets items={[
                "JAFZA & Dubai South: 8–10% industrial yields.",
                "Al Quoz: 6–8% accessibility demand.",
                "Corporate tenants reduce vacancy and operational risk."
              ]} />
            </div>
          )
        }
      },
      {
        id: 'office-demand',
        category: 'Commercial',
        title: 'Grade A Office Renaissance',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80',
        points: [
          "7–9% yields in DIFC and Business Bay.",
          "Multinational expansion driving occupancy.",
          "Multi-year contract rental growth.",
          "Grade A supply constraints."
        ],
        drawerContent: {
          id: 'office-detail',
          category: 'SME Insight // Commercial Strategy',
          title: 'Office Market Fundamentals',
          body: (
            <div className="space-y-8">
              <SectionHeader title="Target Districts" />
              <GrowthBullets items={[
                "DIFC: Highest rental premiums.",
                "Business Bay & DMCC: Consistent cash flow hedges."
              ]} />
            </div>
          )
        }
      },
      {
        id: 'retail-opportunities',
        category: 'Commercial',
        title: 'Prime Retail & High-Street',
        image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&q=80',
        points: [
          "Tourism growth driving demand.",
          "Community centers offering stable 7-8% yields.",
          "High barriers to entry in mall nodes.",
          "Appreciation in lifestyle districts."
        ]
        // NO Drawer content here
      },
      {
        id: 'commercial-mechanics',
        category: 'Legal',
        title: 'Commercial Lease Mechanics',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80',
        points: [
          "Different protections vs Residential.",
          "Corporate vs Individual ownership.",
          "Impact of 5% VAT on transactions.",
          "Fit-out periods and incentives."
        ]
        // NO Drawer content here
      }
    ]
  };

  return (
    <div className="flex flex-col h-screen bg-soft-grey overflow-hidden">
      <header className="px-10 lg:px-16 pt-14 pb-6 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="border-l border-brand-gold pl-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-navy mb-3">Expert Insights</h1>
            <p className="text-sm lg:text-base text-slate-grey/80 max-w-3xl leading-relaxed">
              Strategic intelligence distilled from on-the-ground expertise, structured for decisive investment action.
            </p>
          </div>

          <div className="mt-8 border-b border-slate-200 overflow-x-auto no-scrollbar">
            <div className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'performance' | 'mechanics' | 'commercial')}
                  className={`pb-4 text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                    activeTab === tab.id ? 'text-brand-navy' : 'text-slate-grey/40 hover:text-brand-navy/60'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && <div className="mt-3 h-0.5 bg-brand-navy" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Grid Content */}
      <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[#F8F9FA]">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {content[activeTab].map((card) => (
            <Card
              key={card.id}
              {...card}
              onMore={card.drawerContent ? () => setActiveDrawer(card.drawerContent!) : undefined}
            />
          ))}
        </div>
      </div>

      {/* Drawer System */}
      <div 
        className={`fixed inset-0 z-[90] bg-brand-navy/60 backdrop-blur-sm transition-opacity duration-700 ${drawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setActiveDrawer(null)}
      />
      
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[650px] bg-white shadow-2xl z-[100] transform transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {activeDrawer && (
          <div className="flex flex-col h-full">
            <div className="bg-[#0A192F] p-10 flex justify-between items-start border-b border-brand-gold/20">
              <div>
                <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.4em] mb-3 block">DXB Edge Vault // {activeDrawer.category}</span>
                <h3
                  className="text-3xl font-sans font-bold text-white leading-tight"
                  style={{ fontFamily: 'Univers, Inter, sans-serif' }}
                >
                  {activeDrawer.title}
                </h3>
              </div>
              <button 
                onClick={() => setActiveDrawer(null)}
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
                <svg className="w-4 h-4 flex-none overflow-visible" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                Copy Strategic Intelligence
              </button>
            </div>

            <div
              id="sme-drawer-body"
              className={`flex-1 p-12 overflow-y-auto custom-scrollbar bg-white transition-opacity duration-700 delay-200 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
               {activeDrawer.body}
            </div>

            <div className="p-10 border-t border-slate-100 flex gap-4 bg-soft-grey/30">
              <button 
                onClick={() => setActiveDrawer(null)}
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