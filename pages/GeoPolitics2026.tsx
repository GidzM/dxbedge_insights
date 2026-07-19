import React, { memo } from 'react';
import Card from '../components/Card';
import SEO from '../components/SEO';

type AnalysisSectionData = {
  title: string;
  paragraphs: string[];
  quote?: string;
};

const toParagraphs = (text: string): string[] =>
  text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

const analysisSections: AnalysisSectionData[] = [
  {
    title: '1. Initial Impact and Investor Uncertainty',
    paragraphs: toParagraphs(`
When regional tensions increased, Dubai experienced the normal reactions seen in global investment markets. These conditions did not represent a market breakdown, but they did affect investor behaviour in the short term.

The first effect was a period of caution. Some international investors delayed purchase decisions, increased due diligence, and reviewed risk exposure across their portfolios. The shift was mostly in decision-making speed rather than a withdrawal of interest from Dubai.

During uncertain periods, investors became more selective and focused on fundamentals such as developer reputation, location quality, construction timelines, payment structures, rental demand, and exit opportunities.
`),
  },
  {
    title: '2. International Sentiment, Travel, and Financial Conditions',
    paragraphs: toParagraphs(`
As an internationally exposed market, Dubai naturally sees global sentiment effects. Overseas investors monitored travel patterns, business confidence, and whether demand from specific regions could slow temporarily.

Investors also watched air connectivity, tourism flows, business travel, and corporate relocation trends. Dubai's ongoing airport operations and expansion plans remained important stabilising factors.

At the same time, higher global interest rates, financing costs, currency movements, and mortgage affordability created additional pressure, especially for leveraged buyers. This encouraged a shift toward stronger locations, better assets, and more conservative financing structures.
`),
  },
  {
    title: '3. Why Confidence Held: Structural Advantages and Government Response',
    paragraphs: toParagraphs(`
Dubai's resilience has been supported by a diversified economy, strong governance, infrastructure investment, and its role as a global business and lifestyle destination.

During this period, policy focus remained on economic stability and business continuity. Continued infrastructure investment across roads, metro expansion, airports, logistics, smart-city systems, and community development reinforced long-term confidence.

Regulatory development also continued through institutions such as DLD and RERA, helping move the market toward greater transparency and a more mature investment environment.
`),
  },
  {
    title: '4. Market Performance and Capital Allocation',
    paragraphs: toParagraphs(`
Dubai real estate continued to record significant transaction activity. Investors should distinguish total registered transactions from pure sales activity, since total transaction data can include mortgages, gifts, inheritances, and administrative registrations.

Even in a more challenging regional context, demand remained supported and Dubai recorded more than AED 917 billion in total real estate transactions in 2025 across all transaction types.

Investors continued allocating capital because they were not only purchasing property, but investing in a broader economic ecosystem supported by business growth, resident demand, and long-term liquidity.
`),
  },
  {
    title: '5. Off-Plan Reality: Strong Launches and Selective Risk',
    paragraphs: toParagraphs(`
The off-plan segment remained active, but investor behaviour became more disciplined. Successful launches generally shared common characteristics: prime location, established developers, strong branding, limited supply, attractive payment plans, and clear end-user demand.

Examples during this period included launch momentum in projects such as RAW District by Imtiaz and selected Hudayriyat Island phases, where scarcity and positioning supported strong absorption.

Fast sell-outs should still be analysed carefully. Investors must assess future competing supply, developer delivery history, service charges, location maturity, rental demand, and exit opportunities.
`),
  },
  {
    title: '6. Core Risks and Portfolio Discipline',
    paragraphs: toParagraphs(`
A balanced strategy recognises both opportunity and risk. Regional geopolitical risk can create temporary caution and volatility, while market-cycle risk means not all areas or projects perform equally.

Supply risk remains important as new residential stock is added, requiring close review of pipeline volumes, delivery timelines, and actual community demand.

Financing risk is also central for leveraged investors, especially around interest rates, lending conditions, refinancing options, and cash-flow sustainability.
`),
  },
  {
    title: '7. Advisor Quality and Long-Term Investment Case',
    paragraphs: toParagraphs(`
As market complexity increases, advisor quality matters more. Strong advisors provide comparable sales analysis, rental performance context, supply assessments, and independent guidance on both upside and downside.

Dubai continues attracting private and institutional capital because long-term fundamentals remain visible: global connectivity, economic diversification, infrastructure investment, tourism growth, financial-sector depth, business expansion, and population growth.

The strongest outcomes typically come from selecting quality assets, stress-testing assumptions, and maintaining a disciplined long-term approach rather than relying on short-term market noise.
`),
  },
  {
    title: '9. Conclusion',
    paragraphs: toParagraphs(`
Regional tensions created understandable uncertainty, but Dubai's core investment story remained supported by strong economic and institutional fundamentals.

The period highlighted temporary caution, increased due diligence, financing pressures, and a stronger focus on asset quality. At the same time, the city continued to benefit from international demand, infrastructure investment, and long-range planning.

Dubai's real estate market is not risk-free, but its ability to manage external shocks while continuing to develop as a global city remains a central reason investors continue allocating long-term capital.
`),
  },
];

const AnalysisSection = memo(({ title, paragraphs, quote }: AnalysisSectionData) => (
  <section>
    <h2 className="text-xl font-serif italic text-brand-navy mb-4">{title}</h2>
    <div className="space-y-4">
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="leading-relaxed text-slate-800">
          {paragraph}
        </p>
      ))}
    </div>
    {quote && (
      <blockquote className="border-l-2 border-brand-gold pl-4 italic text-sm text-slate-700 my-4">
        {quote}
      </blockquote>
    )}
  </section>
));

AnalysisSection.displayName = 'AnalysisSection';

const Geopolitics2026: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-6 md:px-10 lg:px-16 animate-fadeIn">
      <SEO
        title="Dubai Real Estate During Regional Tensions - DXB Edge Intelligence"
        description="Investor guide to Dubai market resilience during regional tensions, covering risk management, transaction behaviour, off-plan selectivity, and long-term fundamentals."
        image="/media/dxb-edge-default.jpg"
        type="article"
        publishedTime="2026-07-18"
        jsonLd
      />

      <header className="mb-12 border-l border-brand-gold pl-6 md:pl-10">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy mb-4 italic">
          Dubai Real Estate During Regional Tensions
        </h1>
        <p className="text-sm uppercase tracking-[0.3em] text-brand-gold/80 mb-2">
          Investor Resilience Brief
        </p>
        <p className="text-lg text-slate-grey max-w-3xl leading-relaxed">
          An investor guide to market resilience, risk management, and long-term opportunity supplied by DXB Edge's Subject Matter Expert.
        </p>
      </header>

      <section className="mb-12 rounded-sm border border-slate-200 bg-slate-50 p-6 md:p-8">
        <h2 className="text-xl font-serif italic text-brand-navy mb-3">
          Executive Summary
        </h2>
        <p className="text-sm md:text-base text-slate-800 leading-relaxed">
          Regional tensions introduced short-term uncertainty, but Dubai's real estate market continued to demonstrate resilience through sustained transaction activity,
          ongoing investor participation, continued launches, and long-term infrastructure commitment. The key takeaway for investors is that risk remains real,
          but fundamentals, governance, and economic diversification continue to support disciplined long-term allocation.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-16">
        <div className="lg:col-span-2 space-y-12">
          {analysisSections
            .filter((section) => section.title !== '9. Conclusion')
            .map((section) => (
              <AnalysisSection
                key={section.title}
                title={section.title}
                paragraphs={section.paragraphs}
                quote={section.quote}
              />
            ))}

          <section>
            <h2 className="text-xl font-serif italic text-brand-navy mb-4">
              8. Investor Action Framework
            </h2>
            <ul className="list-disc pl-6 text-slate-800 space-y-2">
              <li><strong>Prioritise quality:</strong> Focus on proven developers, strong locations, and assets with durable end-user demand.</li>
              <li><strong>Stress-test assumptions:</strong> Model interest-rate scenarios, cash-flow coverage, and exit liquidity before commitment.</li>
              <li><strong>Distinguish data categories:</strong> Separate pure sales trends from aggregate transaction totals that include mortgages and registrations.</li>
              <li><strong>Use independent advice:</strong> Work with advisors who provide transparent risk analysis, not urgency-driven sales messaging.</li>
            </ul>
          </section>

          {analysisSections
            .filter((section) => section.title === '9. Conclusion')
            .map((section) => (
              <AnalysisSection
                key={section.title}
                title={section.title}
                paragraphs={section.paragraphs}
                quote={section.quote}
              />
            ))}
        </div>

        <aside className="space-y-6">
          <Card
            category="Segment Performance"
            title="What Held Up"
            image="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=800"
            points={[
              'Continued transaction activity across the market cycle.',
              'Sustained domestic and international investor interest.',
              'Ongoing infrastructure spending and business continuity.',
              'Long-term population and business-growth demand drivers.'
            ]}
            isPremium
            density="compact"
            stretch={false}
          />

          <Card
            category="Market Dynamics"
            title="Key Risks to Manage"
            image="https://images.unsplash.com/photo-1462007895615-c8c073bebcd8?auto=format&fit=crop&q=80&w=800"
            points={[
              'Geopolitical volatility can delay decision-making and raise caution.',
              'Supply additions can pressure weaker submarkets and undifferentiated stock.',
              'Leverage sensitivity increases under higher-rate financing conditions.',
              'Not all launches or developers deliver equal outcomes.'
            ]}
            density="compact"
            stretch={false}
          />

          <div className="border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
            <div className="font-semibold text-brand-navy mb-1">Update Context</div>
            <p>Analysis timestamp: 18 July 2026. Supplied directly by DXB Edge Expert.</p>
          </div>
        </aside>
      </div>

      <div className="mt-10">
        <a
          href="/"
          className="text-xs text-brand-navy/70 underline underline-offset-4 hover:text-brand-navy"
        >
          &larr; Back to Home
        </a>
      </div>
    </div>
  );
};

export default Geopolitics2026;
