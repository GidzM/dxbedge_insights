import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { useCurrency } from '../components/CurrencyContext';
import SEO from '@/components/SEO';

interface DrawerContent {
  id: string;
  title: string;
  category: string;
  body: React.ReactNode;
}

const VerbatimText = ({ text }: { text: string }) => (
  <p
    className="text-brand-navy/80 text-[14px] leading-relaxed mb-4 font-medium whitespace-pre-line"
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

type GrowthBulletItem = string | { text: string; subItems?: string[] };

const GrowthBullets = ({ items }: { items: GrowthBulletItem[] }) => (
  <div className="space-y-5">
    {items.map((item, idx) => {
      const text = typeof item === 'string' ? item : item.text;
      const subItems = typeof item === 'string' ? [] : item.subItems ?? [];

      return (
        <div key={idx} className="space-y-3">
          <div className="flex gap-4 items-start">
            <div className="w-1.5 h-1.5 bg-brand-gold mt-2.5 shrink-0 shadow-[0_0_8px_rgba(201,168,106,0.4)]" />
            <p
              className="text-brand-navy/80 text-[14px] leading-relaxed font-medium"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              {parseGrowthData(text)}
            </p>
          </div>

          {subItems.length > 0 && (
            <ul className="ml-7 space-y-2 border-l border-brand-navy/10 pl-4">
              {subItems.map((subItem, subIndex) => (
                <li key={subIndex} className="flex gap-3 items-start">
                  <span className="mt-2 h-1 w-1 rounded-full bg-brand-gold shrink-0" />
                  <p
                    className="text-brand-navy/70 text-[13px] leading-relaxed font-medium"
                    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
                  >
                    {parseGrowthData(subItem)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      );
    })}
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

const CityComparatorExperience: React.FC<{ formatBudgetLabel: (amountUsd: number) => string }> = ({ formatBudgetLabel }) => {
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
              Monthly Living Budget ({formatBudgetLabel(monthlyBudget)})
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
            <p className="text-[11px] text-slate-grey/70 leading-relaxed">
              Estimated monthly cost of living in the target city (rent, utilities, transport, and daily expenses).
            </p>
          </label>
        </div>
        <p className="text-[11px] text-slate-grey/70 mt-5 leading-relaxed">
          This tool is live: update any input and the ranking recalculates automatically.
        </p>
      </div>

      <div className="border border-brand-gold/40 bg-brand-navy/[0.03] p-5">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-navy mb-2">Top Match</p>
        <div className="flex items-center justify-between gap-5">
          <p className="text-[18px] font-bold text-brand-navy">{topPick?.city ?? '—'}</p>
          <p className="text-[12px] font-semibold text-brand-gold">Match Score: {topPick ? (topPick.score * 100).toFixed(1) : '—'}</p>
        </div>
        <p className="text-[11px] text-slate-grey/70 mt-3 leading-relaxed">
          Match Score is a directional fit index (0-100), not a guaranteed return. It reflects how closely each city aligns with your selected objective, risk tolerance, time horizon, and budget fit.
        </p>
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
  const highlightRegex = /(?:AED|USD|EUR|GBP|SAR|INR|CNY)\s?[\d,.]+(?:\s?(?:[BMKT]|billion|trillion|million))?|[$€£]\s?[\d,.]+(?:\s?(?:[BMKT]|billion|trillion|million))?(?:\s?[+])?|[\d,.]+(?:\s?[-–]\s?[\d,.]+)?%|\d{1,3}(?:,\d{3})+/g;
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

const SMEInsights: React.FC = () => {
  const { formatFromAED, formatRangeFromAED, convertAmount, currency } = useCurrency();
  const aedPerUsd = 1 / 0.2723;
  const formatFromUSD = (amountUsd: number, options?: Intl.NumberFormatOptions) =>
    formatFromAED(amountUsd * aedPerUsd, options);
  const formatRangeFromUSD = (minUsd: number, maxUsd: number, options?: Intl.NumberFormatOptions) =>
    formatRangeFromAED(minUsd * aedPerUsd, maxUsd * aedPerUsd, options);
  const formatBillionsFromAED = (amountAED: number) => {
    const amountInSelectedCurrency = convertAmount(amountAED, 'AED', currency) / 1_000_000_000;
    const fractionDigits = Number.isInteger(amountInSelectedCurrency) ? 0 : 1;

    return `${new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      minimumFractionDigits: fractionDigits,
      maximumFractionDigits: 1,
    }).format(amountInSelectedCurrency)} billion`;
  };
  const formatBudgetLabel = (amountUsd: number) => formatFromUSD(amountUsd, { maximumFractionDigits: 0 });
  const dubaiPrimeRange = formatRangeFromUSD(900, 1350, { maximumFractionDigits: 0 });
  const londonPrimeRange = `${formatRangeFromUSD(1700, 3000, { maximumFractionDigits: 0 })}+`;
  const newYorkPrimeRange = `${formatRangeFromUSD(1500, 2500, { maximumFractionDigits: 0 })}+`;
  const hongKongPrime = `${formatFromUSD(5000, { maximumFractionDigits: 0 })}+`;
  const monthlyDubai = formatFromUSD(2514, { maximumFractionDigits: 0 });
  const monthlyHongKong = formatFromUSD(2718, { maximumFractionDigits: 0 });
  const monthlySingapore = formatFromUSD(3201, { maximumFractionDigits: 0 });
  const monthlyLondon = formatFromUSD(3851, { maximumFractionDigits: 0 });
  const monthlyNewYork = formatFromUSD(4203, { maximumFractionDigits: 0 });
  const familyDubai = formatFromUSD(5509, { maximumFractionDigits: 0 });
  const familySingapore = formatFromUSD(6971, { maximumFractionDigits: 0 });

  const transactions917B = formatFromAED(917000000000, { maximumFractionDigits: 0 });
  const income10k = formatFromAED(10000, { maximumFractionDigits: 0 });
  const income15k = formatFromAED(15000, { maximumFractionDigits: 0 });
  const dubaiEntryRange = formatRangeFromUSD(900, 1350, { maximumFractionDigits: 0 });
  const londonRange = `${formatRangeFromUSD(1700, 3000, { maximumFractionDigits: 0 })}+`;
  const newYorkRange = `${formatRangeFromUSD(1500, 2500, { maximumFractionDigits: 0 })}+`;
  const hongKongCore = `${formatFromUSD(5000, { maximumFractionDigits: 0 })}+`;
  const ultraPrimeDubaiRange = formatRangeFromUSD(2000, 4500, { maximumFractionDigits: 0 });
  const commercialDubaiRange = formatRangeFromUSD(900, 1600, { maximumFractionDigits: 0 });

  const [activeTab, setActiveTab] = useState<'performance' | 'mechanics' | 'commercial' | 'infrastructure' | 'comparative'>('performance');
  const [activeDrawer, setActiveDrawer] = useState<DrawerContent | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // FIX 1: Prevent parent scroll when drawer is open
  useEffect(() => {
    if (activeDrawer) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [activeDrawer]);

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

  const drawerOpen = Boolean(activeDrawer);

  const copyDrawerText = () => {
    if (!activeDrawer) return;
    const text = document.getElementById('sme-drawer-body')?.innerText || '';
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
    { id: 'performance', label: 'Market Performance' },
    { id: 'mechanics', label: 'Investor Mechanics' },
    { id: 'commercial', label: 'Commercial & Industrial' },
    { id: 'infrastructure', label: 'Infrastructure Catalysts' },
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
          `Dubai Entry: ${dubaiEntryRange} per sq. ft.`,
          `Vs. London: ${londonRange} per sq. ft.`,
          `Vs. New York: ${newYorkRange} per sq. ft.`,
          'Prime stock still trades at a c.35-60% discount to leading global wealth hubs.'
        ],
        drawerContent: {
          id: 'global-value-detail',
          category: 'Expert Insight // Price Benchmarking',
          title: 'Global Real Estate Arbitrage',
          body: (
            <div className="space-y-8">
              <VerbatimText text="Dubai continues to trade at a meaningful discount to global gateway cities on a price-per-square-foot basis, while offering developed-market infrastructure and institutional demand depth." />
              <SectionHeader title="Global Price Positioning (per sq. ft.)" />
              <GrowthBullets items={[
                `Dubai prime residential now sits around ${dubaiEntryRange}, while comparable prime stock in London and New York typically ranges from ${newYorkRange} to ${londonRange}, with Hong Kong core districts above ${hongKongCore}.`,
                `Prime commercial office in Dubai is now around ${commercialDubaiRange}, with trophy DIFC and Downtown assets above ${formatFromAED(5000, { maximumFractionDigits: 0 })} per sq. ft. amid severe Grade A supply constraints.`,
                `Ultra-luxury residential in Palm Jumeirah, Emirates Hills, and Jumeirah Bay now trades around ${ultraPrimeDubaiRange}, still below Monaco, Hong Kong Peak, and prime Manhattan benchmarks.`,
                'Dubai remains one of the most competitively priced global gateway cities for investors despite strong capital appreciation since 2022.'
              ]} />
              <SectionHeader title="Investor Implications" />
              <GrowthBullets items={[
                "Value entry plus strong rental fundamentals supports a favorable risk-adjusted return profile.",
                "Lower basis pricing leaves room for medium-term yield compression and capital upside as market maturity advances.",
                "Tax efficiency (no annual property tax, no typical capital gains tax) improves net, not just headline, returns."
              ]} />
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
          `H1 2024 sales-only market reached ${formatBillionsFromAED(233000000000)} across 80,800 transactions.`,
          `H1 2025 set a new first-half record at ${formatBillionsFromAED(326000000000)} and 102,000 transactions.`,
          `H1 2026 remained resilient at ${formatBillionsFromAED(286400000000)} and 86,005 transactions.`,
          'H1 2026 ranked second only to 2025, showing moderation rather than collapse.'
        ],
        drawerContent: {
          id: 'records-detail',
          category: 'Expert Insight // Performance Metrics',
          title: 'Sales-Only H1 Performance',
          body: (
            <div className="space-y-8">
              <VerbatimText text="Sales-only comparison (excluding mortgages and gifts)." />
              <SectionHeader title="H1 Sales Records" />
              <GrowthBullets items={[
                `H1 2024: Sales Value ${formatBillionsFromAED(233000000000)}; Sales Transactions 80,800.`,
                `H1 2025: Sales Value ${formatBillionsFromAED(326000000000)}; Sales Transactions 102,000.`,
                `H1 2026: Sales Value ${formatBillionsFromAED(286400000000)}; Sales Transactions 86,005.`,
                'The 2025 first half remains the highest-value and highest-volume H1 ever recorded in Dubai.'
              ]} />
              <SectionHeader title="Key Takeaway" />
              <GrowthBullets items={[
                "H1 2026 became the second-strongest H1 on record, with transaction values staying close to the 2025 peak despite regional geopolitical tensions.",
                "The market saw moderation rather than a collapse, with residential demand remaining resilient through the uncertainty.",
                "The pullback was driven largely by fewer large land and building transactions, while off-plan residential sales continued to outperform the ready market."
              ]} />
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
          category: 'Expert Insight // Cycle Risk',
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
          "Capital gains reinforced by high HNWI migration.",
          "Luxury growth nodes include Palm Jumeirah, Downtown, Business Bay, and Creek Harbour.",
          "Early-cycle upside is building in Palm Jebel Ali and select branded waterfront stock."
        ],
        drawerContent: {
          id: 'appreciation-detail',
          category: 'Expert Insight // Growth Forecast',
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
              <SectionHeader title="Luxury Growth Nodes (2025–2026)" />
              <VerbatimText text="Here are the top luxury real estate locations in Dubai for investment in 2025–2026, focusing on high-end, premium, and ultra-luxury segments with strong capital growth or solid rental demand." />
              <GrowthBullets items={[
                "Palm Jumeirah — Signature Waterfront Luxury: Dubai’s most iconic luxury district with beachfront villas, penthouses, private beaches, proven global demand, and historically strong price-per-square-foot performance driven by limited supply. Investor Suitability: ultra-wealthy buyers, branded residences, trophy assets, and capital-preservation mandates.",
                "Downtown Dubai — Urban Luxury Hub: anchored by Burj Khalifa, Dubai Mall, and Opera District, with high footfall, tourism demand, prestige positioning, and consistent corporate-relocation demand supporting visibility and liquidity. Investor Suitability: high-end apartments, penthouses, and icon addresses requiring strong resale depth.",
                "Business Bay — Branded & Premium Residences: central location near Downtown with Dubai Canal views; branded luxury towers can command pricing premiums, while rental demand remains strong among professionals and corporate tenants. Investor Suitability: serviced luxury condos, premium-yield strategies, and branded-luxury allocations.",
                "Dubai Creek Harbour — Waterfront Future Icon: positioned as a growth-oriented waterfront core with larger master-plan upside, mixed-use lifestyle offerings, parks, and retail that broaden buyer depth as infrastructure scales. Investor Suitability: modern waterfront condos and long-term appreciation-focused portfolios.",
                "Mohammed Bin Rashid City (MBR City) — Luxe, Low-Density: expansive integrated district with luxury villas, townhouses, and high-end apartments near Downtown, combining greenery, exclusivity, and family-driven end-user demand. Investor Suitability: premium villas and family-oriented luxury homes with lifestyle-led resilience.",
                "Palm Jebel Ali — Next-Generation Waterfront Luxury: planned as a significantly larger beachfront ecosystem, still early in development and therefore more speculative, but with notable early-entrant pricing optionality as infrastructure rolls out. Investor Suitability: long-horizon capital-growth investors and ultra-luxury beachfront exposure.",
                "Dubai Marina / Bluewaters — Waterfront & Lifestyle Luxury: marina views, yacht-centric positioning, and strong international appeal support both occupier depth and liquidity; tourism and corporate rental channels continue to underpin occupancy. Investor Suitability: high-yield waterfront condos, branded residences, and global-renter-focused income sleeves."
              ]} />
              <SectionHeader title="Demand Drivers & Investor Fit Matrix" />
              <GrowthBullets items={[
                "Palm Jumeirah: ultra-luxury beachfront scarcity → Trophy assets and capital preservation.",
                "Downtown: city prestige + tourism flow + business-hub demand → High-end apartments and penthouses with liquidity.",
                "Business Bay: branded and serviced luxury + corporate tenant depth → Rental plus short-term demand strategies.",
                "Creek Harbour: waterfront growth corridor with maturing infrastructure → Long-term appreciation allocations.",
                "MBR City: family luxury and green-space appeal → Premium villas and end-user-oriented holdings.",
                "Palm Jebel Ali: early-stage mega-waterfront project → Speculative capital-growth mandates.",
                "Marina/Bluewaters: waterfront lifestyle and global tourism relevance → Rental-yield and international appeal strategies."
              ]} />
              <SectionHeader title="Additional Allocation Signals" />
              <VerbatimText text="Investor takeaway from the DXB Expert Insights: luxury allocation should focus on scarcity-led beachfront and waterfront stock, evaluate branded residences where service and design can command premium pricing, and balance yield-stable urban cores with growth-oriented waterfront districts." />
              <GrowthBullets items={[
                "Focus on scarcity: limited-supply beach or waterfront locations tend to preserve and grow value.",
                "Consider branded residences: these can command pricing premiums and attract premium renters.",
                "Analyse yield vs growth: urban cores (Downtown/Business Bay) can deliver stable rents, while developing waterfront districts can offer stronger appreciation."
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
        image: 'https://images.unsplash.com/photo-1550779864-6ccb28702fdb?auto=format&fit=crop&q=80',
        points: [
          "182,500 new residents in 2025 (6.1% growth).",
          "3.46 residents arriving for every 1 new unit delivered.",
          "Shortfall in core family housing segments.",
          "Population projected to exceed 5.8M by 2040."
        ],
        drawerContent: {
          id: 'gap-detail',
          category: 'Expert Insight // Supply/Demand',
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
          category: 'Expert Insight // ROI Analysis',
          title: 'Yield Optimisation Strategy',
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
          `${income10k}–${income15k}+ min income requirements.`,
          "7-8% total acquisition fees (DLD & Commissions)."
        ],
        drawerContent: {
          id: 'mortgage-detail',
          category: 'Expert Insight // Investor Mechanics',
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
                "DLD transfer fee, brokerage, trustee/registration, and admin items should be modelled upfront.",
                "Mortgage users should include valuation, arrangement fees, and mortgage registration costs.",
                "Secondary purchases often underwrite at c.7–8% all-in transaction friction before mortgage extras."
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
          category: 'Expert Insight // Tenancy Law',
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
          category: 'Expert Insight // Risk Analysis',
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
                "Large master developers often optimise liquidity and financing familiarity.",
                "Boutique/design-led names may offer brand premium but require stricter exit/tenant-depth checks.",
                "Blend core-delivery certainty with selective upside exposure rather than concentrating in one developer profile."
              ]} />
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
          category: 'Expert Insight // Portfolio Strategy',
          title: 'Capital Horizons',
          body: (
            <div className="space-y-8">
              <VerbatimText text="Off-plan and secondary serve different objectives: one optimises capital growth and IRR through staged entry, the other optimises immediate income, liquidity, and lower execution risk." />
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
      },
      {
  id: 'offplan-vs-ready',
  category: 'Investment Strategy',
  title: 'Off-Plan vs Ready Properties (2026)',
  isPremium: true,
  image: 'https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&q=80&w=2000',
  points: [
    "Off-plan: lower upfront capital, structured payment plans.",
    "Ready: immediate rental income (4–9% yields).",
    "Off-plan: higher long-term appreciation potential.",
    "Ready: stronger negotiation leverage in 2026."
  ],
  drawerContent: {
    id: 'offplan-vs-ready-detail',
    category: 'Expert Insight // Investor Mechanics',
    title: 'Off-Plan vs Ready Properties | Dubai Investment Guide 2026',
    body: (
      <div className="space-y-8">

        <VerbatimText text="In the current 2026 market environment, the distinction between off-plan and ready property investments has become increasingly strategic. Each asset class serves a different objective within a well-structured portfolio." />

        <SectionHeader title="Off-Plan Property (Developer Sales)" />
        <GrowthBullets items={[
          "Investment Objective: Capital appreciation with lower initial capital outlay.",
          "Reduced upfront capital through structured payment plans.",
          "Developer incentives: fee waivers, post-handover plans.",
          "Early entry pricing offering capital uplift potential.",
          "Competitive positioning in softer market conditions, where developers are actively stimulating demand."
        ]} />

        <SectionHeader title="Off-Plan Considerations" />
        <GrowthBullets items={[
          "No immediate income generation.",
          "Exposure to construction timelines and delivery risk.",
          "Limited price negotiation vs secondary market.",
          "Sensitivity to future supply (2026–2028 pipeline)."
        ]} />

        <SectionHeader title="Current Off-Plan Insight (2026)" />
        <VerbatimText text="Opportunities exist where developers are offering aggressive commercial terms. Selectivity is critical—prioritise prime locations, reputable developers, and differentiated projects to mitigate supply-driven risk." />

        <SectionHeader title="Ready Property (Secondary Market)" />
        <GrowthBullets items={[
          "Investment Objective: Income generation with lower risk exposure",
          "Immediate rental income (4–9% yields).",
          "No construction or delivery risk.",
          "High negotiation leverage in buyer-favourable conditions.",
          "Potential to acquire from motivated sellers."
        ]} />

        <SectionHeader title="Ready Property Considerations" />
        <GrowthBullets items={[
          "Higher upfront capital requirement.",
          "Lower short-term appreciation vs early-stage off-plan.",
          "Potential refurbishment depending on asset age."
        ]} />

        <SectionHeader title="Current Ready Market Insight (2026)" />
        <VerbatimText text="The secondary market presents compelling opportunities. With reduced transaction volumes and elevated negotiation levels, investors can secure income-producing assets below recent peak pricing." />

        <SectionHeader title="Strategic Allocation Framework" />
        <GrowthBullets items={[
          {
            text: "Short-Term (0–2 yrs): Preferred Strategy: Ready property for income stability.",
            subItems: [
              "Immediate income generation",
              "Enhanced pricing opportunities due to softer market conditions",
              "Reduced exposure to market and delivery uncertainty"
            ]
          },
          {
            text: "Medium/Long-Term (3–7 yrs): Preferred Strategy: Balanced Allocation.",
            subItems: [
              "Ready assets for stable cash flow",
              "Off-plan exposure for capital growth potential",
            ]
          },
          {
            text: "High-risk strategy: selective off-plan in prime, supply-constrained zones.",
            subItems: [
              "Partner with established, top-tier developers",
              "Avoid oversupplied mid-market segments where future pricing pressure is more likely"
            ]
          }
        ]} />

        <SectionHeader title="Key Takeaway" />
        <VerbatimText text="The current market is not uniform and does not support a one-dimensional investment approach.

        Ready property offers pricing inefficiencies and immediate income stability.

        Off-plan property provides structured entry points and long-term capital appreciation potential, albeit with higher risk.

        The most effective investors in 2026 are not choosing between off-plan and ready—they are allocating strategically across both to optimise risk-adjusted returns." />
      </div>
    )
  }
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
          category: 'Expert Insight // Commercial Yields',
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
          category: 'Expert Insight // Commercial Strategy',
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
    infrastructure: [
      {
  id: 'metro-expansion',
  category: 'Infrastructure Growth',
  title: 'Metro & Rail Expansion (2026–2030)',
  isPremium: true,
  image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80',
  points: [
    "Blue Line: Creek Harbour → International City → Academic City.",
    "Gold Line: Business Bay → Dubailand → JGE.",
    "10–25% price premium near metro stations.",
    "Infrastructure-led appreciation historically up to 16%."
  ],
  drawerContent: {
    id: 'metro-expansion-detail',
    category: 'Expert Insight // Infrastructure Catalysts',
    title: 'Emerging Growth Corridors (2026–2030)',
    body: (
      <div className="space-y-8">

        <VerbatimText text="Dubai’s next phase of real estate growth is closely aligned with its expanding metro and rail infrastructure. Transit-oriented development remains a core pillar of urban planning, unlocking new residential corridors and supporting long-term population growth." />

        <SectionHeader title="Blue Line (Completion Target: 2029)" />
        <GrowthBullets items={[
          "The Blue Line represents a significant east–north connectivity upgrade, linking several high-potential residential districts.",
          "Key connections include: Dubai Creek Harbour, International City, Academic City.",
          "Unlocks substantial value in currently under-connected areas.",
          "Transforms areas into viable end-user and rental markets."
        ]} />

        <SectionHeader title="Gold Line (Announced 2026)" />
        <GrowthBullets items={[
          "Enhances central-to-inland connectivity, directly linking key residential and lifestyle destinations.",
          "Connects Business Bay, Dubailand, Jumeirah Golf Estates.",
          "Integrates economic hubs with large-scale suburban communities.",
          "Supports future population absorption."
        ]} />

        <SectionHeader title="Wider Infrastructure Integration" />
        <GrowthBullets items={[
          "Enhanced connectivity to Al Maktoum International Airport.",
          "Infrastructure support for Palm Jebel Ali.",
          "Expansion into outer suburban zones for large-scale development."
        ]} />

        <SectionHeader title="Impact on Real Estate" />
        <GrowthBullets items={[
          "Metro proximity drives 10–25% price premiums.",
          "Transit-oriented communities see up to 16% capital uplift post-delivery.",
          "Improved accessibility strengthens rental demand.",
          "Connectivity increases liquidity and long-term viability."
        ]} />

        
        <SectionHeader title="Investor Considerations" />
        <GrowthBullets items={[
          "The expansion of Dubai’s metro and rail network is not merely a transportation upgrade—it is a forward-looking demand map for real estate."
        ]} />

        <SectionHeader title="Investor Framework" />
        <GrowthBullets items={[
          "Pre-infrastructure: lower entry pricing, higher upside, higher execution risk.",
          "Construction phase: gradual appreciation as certainty increases.",
          "Post-completion: stabilised demand, stronger rental performance."
        ]} />

        <SectionHeader title="Strategic Takeaway" />
        <VerbatimText text="Dubai’s 2026–2030 infrastructure pipeline will define the next real estate cycle. The strongest opportunities lie along planned metro corridors, especially in supply-constrained, master-planned communities positioned for population decentralisation." />

      </div>
    )
  }
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
          'GDP Growth (2025): UAE 6.2%, Singapore 4.8%, United States 2.0%.',
          'GDP Growth (2026 Forecast): UAE 5.0–5.2%, Singapore 1.7–2.0%, United States 2.4%.',
          'Dubai remains a global greenfield FDI leader, with the UAE sustaining one of the world’s strongest FDI-to-GDP profiles while Singapore leads among financial centres and the US attracts the largest absolute inflows.'
        ],
        drawerContent: {
          id: 'macro-comparison-detail',
          category: 'Comparative // Macro 2025-2026',
          title: 'Cross-Market Macro Momentum Dashboard',
          body: (
            <div className="space-y-8">
              <VerbatimText text="As of 17 July 2026, this dashboard reflects the latest official 2025 macro data alongside the most relevant 2026 in-year growth and investment signals for the UAE, Singapore, and the United States." />

              <ComparativeBars
                title="GDP Growth (2025 Latest Official)"
                unit="%"
                freshnessLabel="Official Data • 2025"
                items={[
                  { label: 'Dubai/UAE', value: 6.2, display: '6.2% (2025)', highlight: true },
                  { label: 'Singapore', value: 4.8, display: '4.8% (2025)' },
                  { label: 'United States', value: 2.0, display: '2.0% (2025)' },
                ]}
              />

              <ComparativeBars
                title="FDI Inflows (% of GDP, 2025)"
                unit="%"
                freshnessLabel="Latest Official • 2025"
                items={[
                  { label: 'Dubai/UAE', value: 8.5, display: '8–9% of GDP', highlight: true },
                  { label: 'Singapore', value: 22.5, display: '20–25% of GDP' },
                  { label: 'United States', value: 1.75, display: '1.5–2.0% of GDP' },
                ]}
              />

              <ComparativeBars
                title="GDP Growth (2026 Forecast)"
                unit="%"
                freshnessLabel="Latest Estimates • 2026"
                items={[
                  { label: 'Dubai/UAE', value: 5.1, display: '5.0–5.2% (2026 forecast)', highlight: true },
                  { label: 'United States', value: 2.4, display: '2.4% (2026 forecast)' },
                  { label: 'Singapore', value: 1.85, display: '1.7–2.0% (2026 forecast)' },
                ]}
              />

              <SectionHeader title="2026 FDI Momentum" />
              <GrowthBullets
                items={[
                  'Official 2026 full-year FDI-to-GDP ratios are not yet published, so current comparisons remain directional rather than final.',
                  'The UAE continues to record strong momentum across financial services, AI, data centres, logistics, advanced manufacturing, and real estate.',
                  'Dubai remains one of the world’s leading cities for greenfield FDI project announcements, reinforcing its role as the Middle East’s premier investment hub.'
                ]}
              />

              <SourceNote sources={["Official published 2025 macro data and latest available 2026 estimates (as of 17 Jul 2026)"]} />
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
              <VerbatimText text="This panel compares residential pricing and income profile using the updated July 2026 DXB Edge benchmark set alongside global gateway reference markets." />

              <ComparativeBars
                title="Prime Residential Pricing (per sq. ft.)"
                unit=""
                freshnessLabel="DXB Edge • Jul 2026"
                items={[
                  { label: 'Dubai', value: 1350, display: dubaiPrimeRange, highlight: true },
                  { label: 'London', value: 3000, display: londonPrimeRange },
                  { label: 'New York', value: 2500, display: newYorkPrimeRange },
                  { label: 'Hong Kong', value: 5000, display: `${hongKongPrime} (core zones)` },
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

              <SourceNote sources={["DXB Edge Global Value Gap benchmark set (Jul 2026)"]} />
            </div>
          )
        }
      },
      {
        id: 'living-cost-snapshot',
        category: 'Relocation Economics',
        title: 'Living Cost Snapshot',
        image: 'https://images.unsplash.com/photo-1615747476205-991a14cd2358?auto=format&fit=crop&q=80',
        points: [
          'Livingcost snapshot comparison added for Dubai, Singapore, Hong Kong, London, and New York.',
          `Total monthly cost (with rent): Dubai ${monthlyDubai} vs Singapore ${monthlySingapore} and New York ${monthlyNewYork}.`,
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
                title="Monthly Cost of Living — Total With Rent"
                unit=""
                freshnessLabel="Livingcost • Oct 2025"
                items={[
                  { label: 'Dubai', value: 2514, display: monthlyDubai, highlight: true },
                  { label: 'Hong Kong', value: 2718, display: monthlyHongKong },
                  { label: 'Singapore', value: 3201, display: monthlySingapore },
                  { label: 'London', value: 3851, display: monthlyLondon },
                  { label: 'New York', value: 4203, display: monthlyNewYork },
                ]}
              />

              <ComparativeBars
                title="Household Cost Snapshot — Family of Four"
                unit=""
                freshnessLabel="Livingcost • Oct 2025"
                items={[
                  { label: 'Dubai', value: 5509, display: familyDubai, highlight: true },
                  { label: 'Singapore', value: 6971, display: familySingapore },
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

              <CityComparatorExperience formatBudgetLabel={formatBudgetLabel} />

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
    <>
      <SEO
        title="DXB Edge Expert Insights | Dubai Real Estate Research, Yields & Strategy"
        description="Research-led Dubai real estate intelligence for investors comparing yields, pricing, infrastructure catalysts, macro signals, and decision tools before engaging further."
        path="/expert-insights"
        type="website"
        schemaType="CollectionPage"
        image="/media/dxb-edge-default.jpg"
        imageAlt="DXB Edge expert insights on Dubai real estate"
        keywords={[
          'Dubai real estate insights',
          'Dubai property research',
          'Dubai yields',
          'Dubai market performance',
          'Dubai infrastructure catalysts',
          'Dubai real estate macro trends',
          'investor research Dubai',
        ]}
      />
    <div className="flex flex-col min-h-screen bg-soft-grey">
      <header className="px-10 lg:px-16 pt-14 pb-6 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="border-l border-brand-gold pl-8">
            <h1 className="text-4xl lg:text-5xl font-bold text-brand-navy mb-3">Expert Insights</h1>
            <p className="text-sm lg:text-base text-slate-grey/80 max-w-3xl leading-relaxed">
              Strategic intelligence distilled from on-the-ground expertise, structured for decisive investment action.
            </p>
          </div>
        </div>
      </header>

      <div className="border-b border-slate-200 bg-white md:border-b-0 md:bg-transparent">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-16 py-3 md:py-0 md:mt-8">
          <div>
            <div className="flex items-center justify-between mb-3 gap-4">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand-navy/70">Insight Sections</p>
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-grey/60 whitespace-nowrap">Swipe Tabs →</p>
            </div>
            <div className="overflow-x-auto custom-scrollbar custom-scrollbar-prominent">
              <div className="inline-flex min-w-full w-max gap-2 p-2 border border-slate-200 bg-soft-grey/70 rounded-lg">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as 'performance' | 'mechanics' | 'commercial' | 'infrastructure' | 'comparative')}
                    className={`px-4 py-2.5 text-[10px] lg:text-[11px] font-bold uppercase tracking-[0.16em] transition-all whitespace-nowrap rounded-md border ${
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
        </div>
      </div>

      {/* Grid Content */}
      <div className="flex-1 overflow-visible p-5 sm:p-8 lg:p-12 bg-[#F8F9FA]">
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
                <svg className="w-4 h-4 flex-none overflow-visible" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3h6a1 1 0 011 1v2H8V4a1 1 0 011-1z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h8a2 2 0 012 2v11a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11h6M9 15h6" />
                </svg>
                Copy Strategic Intelligence
              </button>
            </div>

            <div
              id="sme-drawer-body"
              className={`flex-1 p-12 overflow-y-auto custom-scrollbar custom-scrollbar-prominent bg-white transition-opacity duration-700 delay-200 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
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
    </>
  );
};

export default SMEInsights;