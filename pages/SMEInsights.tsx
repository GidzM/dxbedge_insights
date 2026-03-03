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

const SourceNote = ({ sources }: { sources: string[] }) => (
  <p
    className="text-[10px] uppercase tracking-[0.18em] text-slate-grey/60 font-bold pt-2"
    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
  >
    Source: {sources.join(' | ')}
  </p>
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

const ComparativeBars = ({
  title,
  items,
  unit,
  freshnessLabel,
}: {
  title: string;
  items: { label: string; value: number; display?: string; highlight?: boolean }[];
  unit: string;
  freshnessLabel?: string;
}) => {
  const maxValue = Math.max(...items.map((item) => Math.max(item.value, 0)), 1);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h5
          className="text-[10px] font-black text-brand-navy uppercase tracking-[0.28em]"
          style={{ fontFamily: 'Univers, Inter, sans-serif' }}
        >
          {title}
        </h5>
        {freshnessLabel && (
          <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-slate-grey/70 whitespace-nowrap">
            {freshnessLabel}
          </span>
        )}
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const width = `${(Math.max(item.value, 0) / maxValue) * 100}%`;

          return (
            <div key={item.label} className="space-y-1.5">
              <div className="flex justify-between items-center gap-4">
                <span className="text-[12px] text-brand-navy/85 font-medium">{item.label}</span>
                <span className="text-[12px] text-brand-navy/70 font-semibold">{item.display ?? `${item.value.toFixed(2)}${unit}`}</span>
              </div>
              <div className="h-2 bg-slate-200/70 overflow-hidden rounded-sm">
                <div
                  className={`h-full ${item.highlight ? 'bg-brand-gold' : 'bg-brand-navy/60'}`}
                  style={{ width }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CityComparatorExperience: React.FC = () => {
  const [monthlyBudget, setMonthlyBudget] = useState(3200);
  const [investmentObjective, setInvestmentObjective] = useState<'balanced' | 'income' | 'growth' | 'defensive'>('balanced');
  const [riskTolerance, setRiskTolerance] = useState<'low' | 'medium' | 'high'>('medium');
  const [timeHorizon, setTimeHorizon] = useState<'short' | 'medium' | 'long'>('medium');
  const [rankedMarkets, setRankedMarkets] = useState<{ city: string; score: number }[]>([]);
  const [topPick, setTopPick] = useState<{ city: string; score: number } | null>(null);
  const [isScoring, setIsScoring] = useState(false);
  const [scoreError, setScoreError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchScores = async () => {
      setIsScoring(true);
      setScoreError(null);

      try {
        const response = await fetch('/api/calculator/score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            monthlyBudget,
            objective: investmentObjective,
            riskTolerance,
            timeHorizon,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Scoring request failed.');
        }

        const payload = await response.json();
        const ranking = Array.isArray(payload.ranking) ? payload.ranking : [];

        const normalizedRanking = ranking
          .filter((item: { city?: unknown; score?: unknown }) => typeof item.city === 'string' && typeof item.score === 'number')
          .map((item: { city: string; score: number }) => ({ city: item.city, score: item.score }));

        setRankedMarkets(normalizedRanking);
        setTopPick(
          payload.topPick && typeof payload.topPick.city === 'string' && typeof payload.topPick.score === 'number'
            ? { city: payload.topPick.city, score: payload.topPick.score }
            : normalizedRanking[0] ?? null
        );
      } catch (error) {
        if ((error as { name?: string }).name !== 'AbortError') {
          setScoreError('Calculator service is temporarily unavailable.');
          setRankedMarkets([]);
          setTopPick(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsScoring(false);
        }
      }
    };

    fetchScores();

    return () => {
      controller.abort();
    };
  }, [monthlyBudget, investmentObjective, riskTolerance, timeHorizon]);

  const highestScore = Math.max(...rankedMarkets.map((market) => market.score), 1);

  return (
    <div className="space-y-8">
      <div className="border border-slate-200 bg-soft-grey/30 p-6">
        <h5 className="text-[10px] font-black text-brand-navy uppercase tracking-[0.3em] mb-5">City Comparator Inputs</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <label className="space-y-2 block">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-grey/80">Investment Objective</span>
            <select
              value={investmentObjective}
              onChange={(event) => setInvestmentObjective(event.target.value as 'balanced' | 'income' | 'growth' | 'defensive')}
              className="w-full border border-slate-300 bg-white px-3 py-2 text-[12px] text-brand-navy"
            >
              <option value="balanced">Balanced</option>
              <option value="income">Income Focus</option>
              <option value="growth">Growth Focus</option>
              <option value="defensive">Defensive</option>
            </select>
          </label>

          <label className="space-y-2 block">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-grey/80">Risk Tolerance</span>
            <select
              value={riskTolerance}
              onChange={(event) => setRiskTolerance(event.target.value as 'low' | 'medium' | 'high')}
              className="w-full border border-slate-300 bg-white px-3 py-2 text-[12px] text-brand-navy"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label className="space-y-2 block">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-grey/80">Time Horizon</span>
            <select
              value={timeHorizon}
              onChange={(event) => setTimeHorizon(event.target.value as 'short' | 'medium' | 'long')}
              className="w-full border border-slate-300 bg-white px-3 py-2 text-[12px] text-brand-navy"
            >
              <option value="short">0-3 Years</option>
              <option value="medium">3-7 Years</option>
              <option value="long">7+ Years</option>
            </select>
          </label>

          <label className="space-y-2 block">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-grey/80">
              Monthly Living Budget ({`$${monthlyBudget.toLocaleString()}`})
            </span>
            <input
              type="range"
              min={1800}
              max={5000}
              step={50}
              value={monthlyBudget}
              onChange={(event) => setMonthlyBudget(Number(event.target.value))}
              className="w-full accent-brand-gold"
            />
          </label>
        </div>
      </div>

      <div className="border border-brand-gold/40 bg-brand-navy/[0.03] p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-navy mb-2">Top Match</p>
        <div className="flex items-center justify-between gap-5">
          <p className="text-[18px] font-bold text-brand-navy">{topPick?.city ?? '—'}</p>
          <p className="text-[12px] font-semibold text-brand-gold">Match Score: {topPick ? (topPick.score * 100).toFixed(1) : '—'}</p>
        </div>
      </div>

      {isScoring && (
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-grey/70">Recalculating ranking...</p>
      )}

      {scoreError && (
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-grey/70">{scoreError}</p>
      )}

      <div className="space-y-4">
        <h5 className="text-[10px] font-black text-brand-navy uppercase tracking-[0.3em]">Market Ranking</h5>
        {rankedMarkets.map((market, rankIndex) => {
          const width = `${(market.score / highestScore) * 100}%`;
          return (
            <div key={market.city} className="space-y-1.5">
              <div className="flex justify-between items-center gap-4">
                <span className="text-[12px] text-brand-navy/85 font-medium">#{rankIndex + 1} {market.city}</span>
                <span className="text-[12px] text-brand-navy/70 font-semibold">{(market.score * 100).toFixed(1)}</span>
              </div>
              <div className="h-2 bg-slate-200/70 overflow-hidden rounded-sm">
                <div className={`h-full ${rankIndex === 0 ? 'bg-brand-gold' : 'bg-brand-navy/60'}`} style={{ width }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

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
  const [activeTab, setActiveTab] = useState<'performance' | 'mechanics' | 'commercial' | 'comparative'>('performance');
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
    { id: 'commercial', label: 'Commercial & Industrial' },
    { id: 'comparative', label: 'Global Comparative' }
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
              <VerbatimText text="Dubai continues to trade at a meaningful discount to global gateway cities on a price-per-square-foot basis, while offering developed-market infrastructure and institutional demand depth." />
              <SectionHeader title="Global Price Positioning (USD/sq. ft.)" />
              <GrowthBullets items={[
                "Dubai prime residential: $400–$650, versus London/New York often $1,500–$3,000+ and Hong Kong above $2,200 in core zones.",
                "Ultra-prime Dubai (Palm/Jumeirah Bay): c.$1,200–$2,500, still below Monaco, Mayfair, and Billionaires’ Row benchmarks.",
                "Commercial office pricing in Dubai (c.$350–$700) remains significantly below London/New York/Singapore ranges.",
                "Capital efficiency remains high: similar capital can secure materially more area in Dubai than in mature Western hubs."
              ]} />
              <SectionHeader title="Investor Implications" />
              <GrowthBullets items={[
                "Value entry plus strong rental fundamentals supports a favorable risk-adjusted return profile.",
                "Lower basis pricing leaves room for medium-term yield compression and capital upside as market maturity advances.",
                "Tax efficiency (no annual property tax, no typical capital gains tax) improves net, not just headline, returns."
              ]} />
              <SourceNote sources={["DXB Expert Insights"]} />
            </div>
          )
        }
      },
      {
        id: 'market-records',
        category: 'Performance',
        title: 'Market Performance Records',
        image: 'https://images.unsplash.com/photo-1651467606797-e1c660cf3fda?auto=format&fit=crop&q=80',
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
              <VerbatimText text="Dubai recorded AED 917 billion in total real estate transactions, with growth anchored by off-plan absorption, luxury demand, and broad end-user participation rather than purely leveraged speculation." />
              <SectionHeader title="Resilience Drivers" />
              <GrowthBullets items={[
                "High cash-buyer share reduces refinancing stress and supports price stability through rate cycles.",
                "Government-backed roadmaps (D33, Dubai 2040) provide unusually strong policy visibility for infrastructure and economic growth.",
                "Transaction depth across primary and secondary segments improves market liquidity and exit optionality.",
                "Dubai yield leadership versus mature markets supports continued cross-border capital inflows."
              ]} />
              <SectionHeader title="Cycle Context" />
              <GrowthBullets items={[
                "Current phase is better characterized as market maturation/normalization than a structural downturn.",
                "Expected supply growth appears more phased than abrupt, reducing near-term shock risk in core demand corridors."
              ]} />
              <SourceNote sources={["DXB Expert Insights"]} />
            </div>
          )
        }
      },
      {
        id: 'bubble-reality-check',
        category: 'Market Risk',
        title: 'Bubble Risk Reality Check',
        image: 'https://images.unsplash.com/photo-1554469384-e58fac16e23a?auto=format&fit=crop&q=80',
        points: [
          'A bubble is rapid price growth detached from fundamentals.',
          'Dubai demand remains underpinned by migration and end users.',
          'Rental yields and regulation suggest structural support.',
          'Base case points to cooling/adjustment, not a broad crash.'
        ],
        drawerContent: {
          id: 'bubble-reality-check-detail',
          category: 'SME Insight // Cycle Risk',
          title: 'What a Real Estate Bubble Is — And Is Dubai in One?',
          body: (
            <div className="space-y-8">
              <VerbatimText text="A real estate bubble is an economic cycle of rapid price increases that exceeds fundamental value, often driven by speculation, easy credit, and investor psychology." />
              <VerbatimText text="Prices rise far above what income or rental yields would justify and at some point the trend becomes unsustainable. Eventually reality catches up and the bubble pops, causing prices to decline sharply as demand evaporates or investors sell off assets." />
              <SectionHeader title="Indicators Suggesting Dubai May Not Be in a Traditional Bubble" />
              <GrowthBullets items={[
                'Still strong demand: population growth, migration, economic diversification, and rental demand remain strong drivers, with many buyers being end users rather than purely speculative participants.',
                'Moderate rental yields: Dubai still offers attractive rental yields compared with global cities, suggesting pricing remains linked to fundamentals and not only speculation.',
                'Institutional safeguards and regulation: strengthened frameworks such as escrow protections and stricter lending practices help temper speculative excesses versus prior boom-bust conditions before 2008.',
                'Expert views are mixed: some analyses classify Dubai as hot but not in bubble territory, citing structural demand and affordability advantages versus Hong Kong and New York.'
              ]} />
              <SectionHeader title="Current Forecast Positioning" />
              <GrowthBullets items={[
                'Current expert forecasts lean toward cooling or moderate price adjustments rather than a crash.',
                'Emerging communities and developments, luxury and waterfront assets, larger apartments, villas/townhouses, and legacy/trophy properties are still viewed as capable of strong capital appreciation and double-digit ROI over medium to long-term horizons.'
              ]} />
              <SourceNote sources={["DXB Edge Expert Insight Brief"]} />
            </div>
          )
        }
      },
      {
        id: 'appreciation-forecast',
        category: 'Growth',
        title: '2025-2026 Appreciation',
        image: 'https://images.unsplash.com/photo-1607414851776-f2fcc379fb48?auto=format&fit=crop&q=80',
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
              <VerbatimText text="Off-plan pricing in Dubai frequently embeds handover arbitrage: early-stage entry can be 10–20% below completion value in projects with strong location and developer execution." />
              <SectionHeader title="2025–2026 Appreciation Framework" />
              <GrowthBullets items={[
                "Citywide expectations remain in high single digits, with selective nodes outperforming as handover momentum builds.",
                "Core off-plan communities (e.g., Dubai South, JVC, MBR-adjacent areas) can generate stronger contract-to-handover uplift when launch basis is disciplined.",
                "Prime/brand-led stock is typically more resilient in slower periods due to deeper international demand.",
                "Payment-plan structures improve IRR by reducing upfront equity concentration and preserving optionality."
              ]} />
              <SectionHeader title="Execution Conditions" />
              <GrowthBullets items={[
                "Prioritize proven delivery track record, escrow discipline, and realistic handover timelines.",
                "Account for phased supply arrivals in 2027–2028 when underwriting exit values.",
                "Treat off-plan upside as location + developer + payment-structure dependent, not automatic."
              ]} />
              <SourceNote sources={["DXB Expert Insights"]} />
            </div>
          )
        }
      },
      {
        id: 'structural-gap',
        category: 'Demographics',
        title: 'The Structural Supply Gap',
        isPremium: true,
        image: 'https://images.unsplash.com/photo-1550779864-6ccb28702fdb?auto=format&fit=crop&q=80',
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
              <VerbatimText text="Population growth has remained ahead of annual delivery, sustaining absorption and occupancy support despite a sizable medium-term development pipeline." />
              <SectionHeader title="Absorption & Demographics" />
              <GrowthBullets items={[
                "2025 population growth exceeded 180k residents, with trajectory toward c.4.2M in 2026 and higher longer-term targets.",
                "Recent delivery levels imply multiple new residents per new unit, indicating persistent demand pressure in rental-led segments.",
                "Apartment-heavy supply means family-format and select villa/townhouse segments can stay relatively tighter.",
                "Demand quality (professionals, families, long-stay visa holders, corporate relocations) supports stickier occupancy."
              ]} />
              <SectionHeader title="Investor Read-Through" />
              <GrowthBullets items={[
                "Near-term rental resilience remains supported where demand outpaces completions.",
                "Medium-term underwriting should model gradual supply normalization rather than immediate oversupply shock.",
                "Policy-backed growth visibility (D33 + 2040) adds confidence to longer-duration holding theses."
              ]} />
              <SourceNote sources={["DXB Expert Insights"]} />
            </div>
          )
        }
      },
      {
        id: 'rental-benchmarks',
        category: 'Yields',
        title: 'Rental Yield Benchmarks',
        image: 'https://images.unsplash.com/photo-1579525612525-053cd3e8cbd7?auto=format&fit=crop&q=80',
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
              <VerbatimText text="Dubai’s income profile remains globally competitive, with citywide residential yields typically above mature-market peers and strong dispersion by micro-location and operating model." />
              <SectionHeader title="Yield Bands by Strategy" />
              <GrowthBullets items={[
                "Long-term residential: commonly 6–8% gross, with stronger outcomes in mid-market, high-absorption communities.",
                "Apartments generally outperform villas on gross yield, while villas can offer different appreciation/risk characteristics.",
                "Short-term/holiday-led strategies can exceed long-term averages in high-demand tourism and business districts.",
                "Commercial and logistics assets often extend gross yield potential into the 7–10%+ bracket with longer lease visibility."
              ]} />
              <SectionHeader title="Net Yield Discipline" />
              <GrowthBullets items={[
                "Model service charges, leasing costs, management, vacancy, and periodic capex before claiming net yield targets.",
                "Prioritize tenant-quality and renewal probability over headline rent alone to improve risk-adjusted income.",
                "Match asset class to objective: income stability (office/logistics) vs liquidity/flexible exit (residential)."
              ]} />
              <SourceNote sources={["DXB Expert Insights"]} />
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
              <VerbatimText text="Debt is accessible to both residents and non-residents, but leverage efficiency depends on borrower profile, asset type, and whether the purchase is ready or off-plan." />
              <SectionHeader title="LTV & Access Framework" />
              <GrowthBullets items={[
                "Residents typically access higher ready-asset LTV bands than non-residents; off-plan financing is more conservative.",
                "Non-residents usually require materially higher equity and may face slightly higher rates/stricter underwriting.",
                "Ready assets are generally easier to mortgage immediately versus under-construction stock.",
                "Use leverage to improve cash-on-cash returns, but stress-test for rate and vacancy scenarios."
              ]} />
              <SectionHeader title="True Acquisition Cost Stack" />
              <GrowthBullets items={[
                "DLD transfer fee, brokerage, trustee/registration, and admin items should be modeled upfront.",
                "Mortgage users should include valuation, arrangement fees, and mortgage registration costs.",
                "Secondary purchases often underwrite at c.7–8% all-in transaction friction before mortgage extras."
              ]} />
              <SourceNote sources={["DXB Expert Insights"]} />
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
              <VerbatimText text="RERA compliance is central to income stability: rent resets, renewal timing, eviction pathways, and dispute outcomes are all framework-driven rather than discretionary." />
              <SectionHeader title="Core Rent Adjustment Rules" />
              <GrowthBullets items={[
                "Lease amendments at renewal require compliant notice timing (commonly 90 days) and index-based support.",
                "RERA calculator bands govern allowable increases; out-of-framework increases are challengeable.",
                "Ejari registration is essential for enforceability and dispute protection.",
                "Landlord responsibility includes major/structural maintenance beyond normal tenant wear-and-tear."
              ]} />
              <SectionHeader title="Possession & Enforcement" />
              <GrowthBullets items={[
                "Owner-use/sale/major works pathways typically require formal 12-month notarized notice.",
                "Documentation quality (contracts, notices, inspection records) materially improves enforceability.",
                "Treat legal compliance as an operational alpha lever, not an admin afterthought."
              ]} />
              <SourceNote sources={["DXB Expert Insights"]} />
            </div>
          )
        }
      },
      {
        id: 'developer-selection',
        category: 'Risk Management',
        title: 'Developer Tier Strategy',
        image: 'https://images.unsplash.com/photo-1688671525781-d9447cf1abd2?auto=format&fit=crop&q=80',
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
              <VerbatimText text="Developer selection is the primary execution risk filter in Dubai off-plan and a major liquidity determinant in secondary resale." />
              <SectionHeader title="Due Diligence Priorities" />
              <GrowthBullets items={[
                "Confirm delivery track record (timeline reliability, handover quality, defect remediation history).",
                "Verify project registration and escrow mechanics under RERA oversight.",
                "Assess community-level demand durability, not just launch marketing velocity.",
                "Underwrite handover-era competition from nearby pipeline stock."
              ]} />
              <SectionHeader title="Tiering Lens for Portfolio Construction" />
              <GrowthBullets items={[
                "Large master developers often optimize liquidity and financing familiarity.",
                "Boutique/design-led names may offer brand premium but require stricter exit/tenant-depth checks.",
                "Blend core-delivery certainty with selective upside exposure rather than concentrating in one developer profile."
              ]} />
              <SourceNote sources={["DXB Expert Insights"]} />
            </div>
          )
        }
      },
      {
        id: 'secondary-vs-offplan',
        category: 'Strategy',
        title: 'Secondary vs Off-Plan Strategy',
        image: 'https://images.unsplash.com/photo-1462007895615-c8c073bebcd8?auto=format&fit=crop&q=80',
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
              <VerbatimText text="Off-plan and secondary serve different objectives: one optimizes capital growth and IRR through staged entry, the other optimizes immediate income, liquidity, and lower execution risk." />
              <SectionHeader title="Off-Plan vs Secondary — Strategic Fit" />
              <GrowthBullets items={[
                "Off-plan: stronger for appreciation-seeking investors with 2–4 year horizons and tolerance for delivery timing risk.",
                "Secondary: stronger for yield-now mandates, immediate leasing, and straightforward mortgage deployment.",
                "Off-plan is usually more capital-efficient at entry; secondary is typically more transparent on current market value.",
                "Assignment/refinance options can recycle equity, subject to developer and financing conditions."
              ]} />
              <SectionHeader title="Hybrid Allocation Playbook" />
              <GrowthBullets items={[
                "Use off-plan for growth sleeves and secondary assets for stable income sleeves.",
                "Rebalance on handover milestones, refinancing windows, and rent-reset cycles.",
                "Align hold periods with transaction-cost drag: shorter flips require stricter spread discipline."
              ]} />
              <SourceNote sources={["DXB Expert Insights"]} />
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
              <VerbatimText text="Dubai’s logistics and industrial assets remain one of the market’s strongest income categories, supported by structural tailwinds from trade, re-export, and e-commerce expansion." />
              <SectionHeader title="Income Fundamentals" />
              <GrowthBullets items={[
                "Prime logistics nodes (JAFZA, Dubai South) are commonly cited in the upper yield bands versus standard residential.",
                "Lease terms are often longer than residential, supporting visibility of forward cash flow.",
                "Corporate occupiers with fit-out commitments can reduce turnover and vacancy friction.",
                "Operational structures may shift cost burden to tenants (NNN-style terms in select formats), improving net income quality."
              ]} />
              <SectionHeader title="Execution Priorities" />
              <GrowthBullets items={[
                "Prioritize access to major transport corridors, ports, and airport-linked logistics networks.",
                "Assess covenant strength, lease rollover clustering, and escalation clauses before underwriting terminal values.",
                "Treat logistics as an income anchor within a diversified portfolio mix."
              ]} />
              <SourceNote sources={["DXB Expert Insights"]} />
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
              <VerbatimText text="Office demand is increasingly quality-selective: Grade A and core business-district stock captures the strongest pricing power, renewal profile, and institutional tenant demand." />
              <SectionHeader title="Demand Nodes & Yield Pattern" />
              <GrowthBullets items={[
                "DIFC commands premium positioning due to deep financial-services concentration and global tenant profile.",
                "Business Bay and DMCC/JLT corridors offer broader tenant depth and stable office leasing velocity.",
                "Grade and building specification materially influence occupancy resilience and rent trajectory.",
                "Longer commercial lease terms can improve planning certainty versus one-year residential cycles."
              ]} />
              <SectionHeader title="Underwriting Checklist" />
              <GrowthBullets items={[
                "Focus on micro-location, parking/access, fit-out quality, and tenant covenant mix.",
                "Model re-leasing downtime and incentive packages explicitly in net yield assumptions.",
                "Prefer assets with defensible relevance in evolving occupier requirements (quality, connectivity, flexibility)."
              ]} />
              <SourceNote sources={["DXB Expert Insights"]} />
            </div>
          )
        }
      },
      {
        id: 'retail-opportunities',
        category: 'Commercial',
        title: 'Prime Retail & High-Street',
        image: 'https://images.unsplash.com/photo-1650435331404-c1340a4c8f24?auto=format&fit=crop&q=80',
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
    ],
    comparative: [
      {
        id: 'macro-comparison',
        category: 'Comparative Macro',
        title: 'GDP & FDI Market Comparison',
        image: 'https://images.unsplash.com/photo-1612873649383-edf91f1cf7fe?auto=format&fit=crop&q=80',
        points: [
          'World Bank macro comparison: Dubai/UAE vs global gateway markets.',
          'GDP growth (2024): Dubai/UAE 3.99%, Singapore 4.39%, US 2.79%.',
          'FDI inflows (2024): Dubai/UAE 8.26% of GDP, with higher financial-hub concentrations in HK/SG.',
          'Visualized as ranked bars for quick market momentum read-through.'
        ],
        drawerContent: {
          id: 'macro-comparison-detail',
          category: 'Comparative // World Bank',
          title: 'Cross-Market Macro Momentum Dashboard',
          body: (
            <div className="space-y-8">
              <VerbatimText text="This comparative panel benchmarks Dubai/UAE against London/UK, New York/US, Hong Kong, and Singapore using latest public World Bank datapoints currently available in the app." />

              <ComparativeBars
                title="GDP Growth (Annual %)"
                unit="%"
                freshnessLabel="World Bank • 2024"
                items={[
                  { label: 'Dubai/UAE', value: 3.99, display: '3.99% (2024)', highlight: true },
                  { label: 'Singapore', value: 4.39, display: '4.39% (2024)' },
                  { label: 'United States', value: 2.79, display: '2.79% (2024)' },
                  { label: 'Hong Kong', value: 2.50, display: '2.50% (2024)' },
                  { label: 'United Kingdom', value: 1.13, display: '1.13% (2024)' },
                ]}
              />

              <ComparativeBars
                title="FDI Net Inflows (% of GDP)"
                unit="%"
                freshnessLabel="World Bank • 2024"
                items={[
                  { label: 'Dubai/UAE', value: 8.26, display: '8.26% (2024)', highlight: true },
                  { label: 'Hong Kong', value: 30.92, display: '30.92% (2024)' },
                  { label: 'Singapore', value: 27.76, display: '27.76% (2024)' },
                  { label: 'United States', value: 1.03, display: '1.03% (2024)' },
                  { label: 'United Kingdom', value: 0, display: '-0.35% (2024)' },
                ]}
              />

              <ComparativeBars
                title="International Tourism Arrivals (Latest Common Year)"
                unit="M"
                freshnessLabel="World Bank • 2020"
                items={[
                  { label: 'Dubai/UAE', value: 8.08, display: '8.08M (2020)', highlight: true },
                  { label: 'United States', value: 45.04, display: '45.04M (2020)' },
                  { label: 'United Kingdom', value: 11.10, display: '11.10M (2020)' },
                  { label: 'Hong Kong', value: 3.57, display: '3.57M (2020)' },
                  { label: 'Singapore', value: 2.74, display: '2.74M (2020)' },
                ]}
              />

              <SourceNote sources={["World Bank API (NY.GDP.MKTP.KD.ZG, BX.KLT.DINV.WD.GD.ZS, ST.INT.ARVL)"]} />
            </div>
          )
        }
      },
      {
        id: 'valuation-yield-compare',
        category: 'Comparative Valuation',
        title: 'PPSQFT & Yield Differential',
        image: 'https://images.unsplash.com/photo-1623725259601-b8c41ad6a532?auto=format&fit=crop&q=80',
        points: [
          'Dubai prime entry remains materially below London/New York/Hong Kong levels.',
          'Dubai rental yields stay comparatively attractive in global-city context.',
          'Visual bars prioritize quick spread recognition over long narrative text.',
          'Supports allocation decisions across value entry and income profile.'
        ],
        drawerContent: {
          id: 'valuation-yield-compare-detail',
          category: 'Comparative // Pricing & Yield',
          title: 'Global Price-to-Yield Positioning',
          body: (
            <div className="space-y-8">
              <VerbatimText text="This panel compares residential pricing and income profile using existing in-platform DXB Edge Expert benchmarks and global-city references already used in the strategy notes." />

              <ComparativeBars
                title="Prime Residential Pricing (USD / sq. ft.)"
                unit=""
                freshnessLabel="SME Benchmark Set"
                items={[
                  { label: 'Dubai', value: 650, display: '$400–$650', highlight: true },
                  { label: 'London', value: 3000, display: '$1,700–$3,000+' },
                  { label: 'New York', value: 2500, display: '$1,500–$2,500+' },
                  { label: 'Hong Kong', value: 2200, display: '$2,200+ (core zones)' },
                ]}
              />

              <ComparativeBars
                title="Gross Residential Yield Snapshot"
                unit="%"
                freshnessLabel="SME Benchmark Set"
                items={[
                  { label: 'Dubai Apartments', value: 7.2, display: '7.0–7.3%', highlight: true },
                  { label: 'Dubai Villas', value: 5.0, display: '5.0%' },
                  { label: 'Holiday Lets (Dubai)', value: 10.0, display: '8–12% potential' },
                ]}
              />

              <SourceNote sources={["DXB Expert Insights", "Global Value Gap references already used in Expert Insights"]} />
            </div>
          )
        }
      },
      {
        id: 'living-cost-snapshot',
        category: 'Relocation Economics',
        title: 'Living Cost Snapshot (USD)',
        image: 'https://images.unsplash.com/photo-1615747476205-991a14cd2358?auto=format&fit=crop&q=80',
        points: [
          'Livingcost snapshot comparison added for Dubai, Singapore, Hong Kong, London, and New York.',
          'Total monthly cost (with rent): Dubai $2,514 vs Singapore $3,201 and New York $4,203.',
          'Supports relocation and affordability framing for investors and end users.',
          'Presented as visual bars to keep comparison scannable.'
        ],
        drawerContent: {
          id: 'living-cost-snapshot-detail',
          category: 'Comparative // Living Cost',
          title: 'Cross-City Living Cost Comparison',
          body: (
            <div className="space-y-8">
              <VerbatimText text="This panel adds fixed living-cost snapshots to complement pricing/yield and macro data, helping compare affordability and relocation friction across major markets." />

              <ComparativeBars
                title="Monthly Cost of Living — Total With Rent (USD)"
                unit=""
                freshnessLabel="Livingcost • Oct 2025"
                items={[
                  { label: 'Dubai', value: 2514, display: '$2,514', highlight: true },
                  { label: 'Hong Kong', value: 2718, display: '$2,718' },
                  { label: 'Singapore', value: 3201, display: '$3,201' },
                  { label: 'London', value: 3851, display: '$3,851' },
                  { label: 'New York', value: 4203, display: '$4,203' },
                ]}
              />

              <ComparativeBars
                title="Household Cost Snapshot — Family of Four (USD)"
                unit=""
                freshnessLabel="Livingcost • Oct 2025"
                items={[
                  { label: 'Dubai', value: 5509, display: '$5,509', highlight: true },
                  { label: 'Singapore', value: 6971, display: '$6,971' },
                ]}
              />

              <ComparativeBars
                title="Cost-to-Salary Coverage (Months)"
                unit=""
                freshnessLabel="Livingcost • Oct 2025"
                items={[
                  { label: 'Dubai', value: 1.6, display: '1.6 months (after-tax salary coverage)', highlight: true },
                  { label: 'Singapore', value: 1.4, display: '1.4 months (after-tax salary coverage)' },
                ]}
              />

              <SectionHeader title="Interpretation Note" />
              <GrowthBullets
                items={[
                  'These values are snapshot benchmarks for cross-market orientation and should be refreshed periodically as living-cost baskets move.',
                  'Cost-to-salary coverage is currently shown where explicit after-tax salary snapshots were available in the extracted feed.',
                  'Use Numbeo, Expatistan, or Livingcost.org for personalized international relocation scenarios based on salary, household size, and lifestyle assumptions.'
                ]}
              />

              <SourceNote sources={["Livingcost.org (city snapshots, updated Oct 14 2025)"]} />
            </div>
          )
        }
      },
      {
        id: 'city-comparator-flow',
        category: 'Decision Flow',
        title: 'City Comparator (Top 5 Markets)',
        image: 'https://images.unsplash.com/photo-1473186505569-9c61870c11f9?auto=format&fit=crop&q=80',
        points: [
          'Decision flow added for Dubai, Singapore, Hong Kong, London, and New York.',
          'Adjust objective, risk tolerance, horizon, and budget to re-rank markets instantly.',
          'Top recommendation and full ranked list are generated from current comparative dataset.',
          'Built for practical shortlisting rather than static source-tracking tables.'
        ],
        drawerContent: {
          id: 'city-comparator-flow-detail',
          category: 'Comparative // Decision Flow',
          title: 'Interactive 5-City Investment Comparator',
          body: (
            <div className="space-y-8">
              <VerbatimText text="This comparator models a practical decision flow: set your investment objective and constraints, then review a ranked shortlist across the five target global markets." />

              <CityComparatorExperience />

              <SectionHeader title="Data Inputs Used" />
              <GrowthBullets
                items={[
                  'Living cost snapshots (monthly total with rent) for affordability fit.',
                  'Budget-fit and affordability weighting for risk sensitivity.',
                  'World Bank GDP growth and FDI inflows for macro momentum and capital-flow context.',
                  'Outputs are directional and should be paired with asset-level underwriting before execution.'
                ]}
              />

              <SourceNote sources={["World Bank API", "Livingcost.org"]} />
            </div>
          )
        }
      },
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
                  onClick={() => setActiveTab(tab.id as 'performance' | 'mechanics' | 'commercial' | 'comparative')}
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