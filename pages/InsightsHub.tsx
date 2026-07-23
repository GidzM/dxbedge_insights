import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';

type LeadCaptureType = 'Expert' | 'Investment Strategist' | 'Strategic Advisory' | 'Developer' | 'Mortgage Advisor' | 'Services';

interface InsightsHubProps {
  openModal: (type: LeadCaptureType) => void;
}

interface DrawerContent {
  title: string;
  category: string;
  body: React.ReactNode;
}

const insightStructure = [
  'Definition',
  'Summary',
  'Key facts',
  'Structured sections',
  'Lists and tables',
  'FAQs',
  'Key takeaways',
  'Investor implications',
];

const pillars = [
  {
    title: 'Dubai Property Market',
    description: 'Cycles, supply, demand, pricing and rental behaviour.',
    path: '/market',
    cta: 'Explore market research',
  },
  {
    title: 'Investment Strategy',
    description: 'Long-term frameworks, yield analysis and risk models.',
    path: '/strategy',
    cta: 'Explore strategy guidance',
  },
  {
    title: 'UK Investor Guidance',
    description: 'Tax, strategy, currency advantages and long-term positioning.',
    path: '/uk-investors',
    cta: 'Explore UK investor content',
  },
  {
    title: 'Off-Plan Property',
    description: 'Payment plans, developer reliability and launch-cycle timing.',
    path: '/off-plan',
    cta: 'Coming soon pillar',
  },
  {
    title: 'Ready & Secondary Market',
    description: 'Stability, yields, resale value and community depth.',
    path: '/ready',
    cta: 'Coming soon pillar',
  },
  {
    title: 'Communities & Areas',
    description: 'Dubai Hills, Marina, Downtown, JVC and Palm Jumeirah.',
    path: '/communities',
    cta: 'Coming soon pillar',
  },
  {
    title: 'Legal & Fees',
    description: 'RERA, DLD fees, ownership rules and rental regulations.',
    path: '/legal',
    cta: 'Coming soon pillar',
  },
  {
    title: 'Financing & Costs',
    description: 'Mortgages, service charges and acquisition costs.',
    path: '/financing',
    cta: 'Coming soon pillar',
  },
];

const featuredInsights = [
  { title: 'Dubai Property Cycle Explained', path: '/deep-dives/dubai-property-cycle-explained' },
  { title: 'Dubai Investment Strategy Guide', path: '/deep-dives/dubai-investment-strategy-guide' },
  { title: 'Off-Plan vs Ready', path: '/deep-dives/off-plan-vs-ready' },
  { title: 'Best Areas to Invest in Dubai', path: '/deep-dives/best-areas-to-invest' },
  { title: 'Dubai Property Fees Explained', path: '/deep-dives/dubai-property-fees' },
  { title: 'Dubai Supply Pipeline 2026-2028', path: '/deep-dives/dubai-supply-pipeline' },
];

const startHere = [
  'Dubai Property Cycle Explained',
  'Dubai Investment Strategy Guide',
  'Off-Plan vs Ready',
  'Best Areas to Invest in Dubai',
  'Dubai Property Fees Explained',
];

const DrawerSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="space-y-5">
    <h4
      className="border-b border-brand-gold/20 pb-2 font-sans text-xl font-bold text-brand-navy"
      style={{ fontFamily: 'Univers, Inter, sans-serif' }}
    >
      {title}
    </h4>
    {children}
  </section>
);

const DrawerParagraph = ({ children }: { children: React.ReactNode }) => (
  <p
    className="text-[14px] font-medium leading-relaxed text-brand-navy/80"
    style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
  >
    {children}
  </p>
);

const DrawerBullets = ({ items }: { items: string[] }) => (
  <div className="space-y-4">
    {items.map((item) => (
      <div key={item} className="flex items-start gap-4">
        <div className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-brand-gold" />
        <p
          className="text-[14px] font-medium leading-relaxed text-brand-navy/80"
          style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
        >
          {item}
        </p>
      </div>
    ))}
  </div>
);

const InsightsHub: React.FC<InsightsHubProps> = ({ openModal }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeDrawer, setActiveDrawer] = useState<DrawerContent | null>(null);
  const drawerOpen = Boolean(activeDrawer);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
      return;
    }

    document.body.style.overflow = 'unset';

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [drawerOpen]);

  const structureDrawer = useMemo<DrawerContent>(() => ({
    category: 'Methodology',
    title: 'How DXB Edge Insights Work',
    body: (
      <div className="space-y-12">
        <DrawerSection title="Why this structure exists">
          <DrawerParagraph>
            DXB Edge Insights is designed as a structured collection of independent research for long-term investors. Every article follows a repeatable format so readers can move quickly from context to decision.
          </DrawerParagraph>
        </DrawerSection>
        <DrawerSection title="Core format used across insights">
          <DrawerBullets items={insightStructure} />
        </DrawerSection>
        <DrawerSection title="What this gives investors">
          <DrawerBullets
            items={[
              'Clarity: complex market behaviour explained simply.',
              'Consistency: each topic is easier to compare and revisit over time.',
              'Extractability: structured content supports both human readers and AI engines.',
              'Decision utility: every insight is built around real investor implications, not commentary alone.',
            ]}
          />
        </DrawerSection>
      </div>
    ),
  }), []);

  const copyDrawerText = () => {
    const text = document.getElementById('insights-hub-drawer-body')?.innerText || '';
    navigator.clipboard.writeText(text);
    alert('Strategic intelligence copied to clipboard.');
  };

  return (
    <>
      <SEO
        title="DXB Edge Insights | Independent Dubai Property Research"
        description="Independent Dubai property research for long-term investors. Explore market analysis, investment strategy, off-plan guidance, community insights and UK investor resources."
        path={location.pathname}
        type="article"
        schemaType="Article"
        image="/media/dxb-edge-default.jpg"
        imageAlt="DXB Edge insights hub"
        keywords={[
          'Dubai property insights',
          'Dubai investment research',
          'Dubai market analysis',
          'Dubai property strategy',
          'Dubai off-plan guidance',
          'UK investors Dubai',
        ]}
      />

      <div className="bg-[radial-gradient(circle_at_top,_rgba(201,168,106,0.16),_transparent_38%),linear-gradient(180deg,_#f8f9fa_0%,_#ffffff_42%,_#f7f4ee_100%)]">
        <section className="relative overflow-hidden border-b border-brand-gold/20 bg-brand-navy text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute -left-24 top-8 h-72 w-72 rounded-full bg-brand-gold blur-3xl" />
            <div className="absolute right-0 top-1/3 h-64 w-64 rounded-full bg-cyan-300/20 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-10 py-20 lg:px-16 lg:py-24">
            <div className="max-w-4xl">
              <div className="mb-4 inline-flex items-center border border-brand-gold/30 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                DXB Edge Insights
              </div>
              <h1 className="max-w-5xl text-4xl font-serif italic text-white sm:text-5xl lg:text-6xl">
                Independent Dubai property analysis for long-term investors.
              </h1>
              <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/80 md:text-base">
                This is our structured library of fundamentals-driven research. No hype, no sales pressure, just clear analysis of how Dubai behaves and what that means for long-term value.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <button
                  type="button"
                  onClick={() => openModal('Investment Strategist')}
                  className="inline-flex items-center justify-center border border-brand-gold bg-brand-gold px-6 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-brand-navy transition-all duration-300 hover:bg-transparent hover:text-brand-gold"
                >
                  Speak to an Investment Consultant
                </button>
                <button
                  type="button"
                  onClick={() => setActiveDrawer(structureDrawer)}
                  className="inline-flex items-center justify-center border border-white/20 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:border-brand-gold hover:text-brand-gold"
                >
                  How Our Insights Work
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-10 py-16 lg:px-16 lg:py-20">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Insights', href: '/insights' },
            ]}
            className="mb-10"
          />

          <section className="mb-16 rounded-3xl border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Explore by Pillar</div>
            <p className="mt-4 max-w-4xl text-sm leading-relaxed text-slate-grey">
              Insights are organised into core pillars investors use most. Each pillar is designed to answer a specific decision layer: market behaviour, strategy, geography, regulation and financing.
            </p>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {pillars.map((pillar) => (
                <article key={pillar.title} className="flex flex-col rounded-2xl border border-slate-100 bg-soft-grey/60 p-6">
                  <h3 className="text-2xl font-serif italic text-brand-navy">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-grey">{pillar.description}</p>
                  <button
                    type="button"
                    onClick={() => navigate(pillar.path)}
                    className="mt-auto self-start pt-5 inline-flex items-center justify-center border border-brand-navy/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-navy transition-all duration-300 hover:bg-brand-navy hover:text-white"
                  >
                    {pillar.cta}
                  </button>
                </article>
              ))}
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-3xl border border-brand-gold/40 bg-brand-navy p-8 text-white shadow-[0_30px_100px_rgba(10,25,47,0.12)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Featured Insights</div>
              <p className="mt-4 text-sm leading-relaxed text-white/82">
                These cornerstone pieces define our approach and will expand over time into full deep dives.
              </p>
              <div className="mt-6 grid gap-3">
                {featuredInsights.map((insight) => (
                  <button
                    key={insight.title}
                    type="button"
                    onClick={() => navigate(insight.path)}
                    className="flex items-center justify-between rounded-xl border border-white/15 px-4 py-3 text-left text-sm text-white/90 transition-all duration-300 hover:border-brand-gold hover:text-brand-gold"
                  >
                    <span>{insight.title}</span>
                    <span className="text-[10px] uppercase tracking-[0.2em]">Open</span>
                  </button>
                ))}
              </div>
            </article>

            <article className="rounded-3xl border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Start Here</div>
              <p className="mt-4 text-sm leading-relaxed text-slate-grey">
                If you are new to Dubai property investing, begin with these five topics in sequence to build decision context quickly.
              </p>
              <div className="mt-6 space-y-3">
                {startHere.map((topic) => (
                  <div key={topic} className="flex items-start gap-3 rounded-xl bg-soft-grey/70 px-4 py-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                    <p className="text-sm leading-relaxed text-slate-grey">{topic}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="mt-16 grid gap-8 xl:grid-cols-2">
            <article className="flex flex-col rounded-3xl border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Expert Insights</div>
              <h2 className="mt-3 text-3xl font-serif italic text-brand-navy">Subject Matter Expert-led intelligence in card + drawer format.</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-grey">
                Detailed strategic notes driven by subject-matter expertise, designed for rapid scanning and deeper expansion where required.
              </p>
              <button
                type="button"
                onClick={() => navigate('/insights/expert-insights')}
                className="mt-auto self-start pt-6 inline-flex items-center justify-center border border-brand-navy/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-navy transition-all duration-300 hover:bg-brand-navy hover:text-white"
              >
                Open Expert Insights
              </button>
            </article>

            <article className="flex flex-col rounded-3xl border border-brand-gold/25 bg-[#f7f2e8] p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Strategic Outlook</div>
              <h2 className="mt-3 text-3xl font-serif italic text-brand-navy">Macro cycle analysis and long-range positioning.</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-grey">
                The strategic outlook now sits under this Insights Hub with direct access to both the combined thesis and its 2040/D33 sub-pages.
              </p>
              <div className="mt-auto grid gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/insights/strategic-outlook')}
                  className="inline-flex self-start items-center justify-center border border-brand-navy/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-navy transition-all duration-300 hover:bg-brand-navy hover:text-white"
                >
                  Open Strategic Outlook
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/insights/strategic-outlook/dubai-2040')}
                  className="inline-flex self-start items-center justify-center border border-brand-navy/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-navy transition-all duration-300 hover:bg-brand-navy hover:text-white"
                >
                  Open 2040 Vision Page
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/insights/strategic-outlook/d33-agenda')}
                  className="inline-flex self-start items-center justify-center border border-brand-navy/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-navy transition-all duration-300 hover:bg-brand-navy hover:text-white"
                >
                  Open D33 Growth Page
                </button>
              </div>
            </article>
          </section>

          <section className="mt-16 rounded-3xl border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
            <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">SEO & AEO Linking Blocks</div>
            <div className="mt-6 grid gap-8 xl:grid-cols-3">
              <article>
                <h3 className="text-xl font-serif italic text-brand-navy">Explore Pillars</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-grey">
                  <li><Link to="/market" className="hover:text-brand-gold">Dubai Property Market</Link></li>
                  <li><Link to="/strategy" className="hover:text-brand-gold">Investment Strategy</Link></li>
                  <li><Link to="/uk-investors" className="hover:text-brand-gold">UK Investors</Link></li>
                </ul>
              </article>

              <article>
                <h3 className="text-xl font-serif italic text-brand-navy">Featured Deep Dives (Coming Soon)</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-grey">
                  <li><Link to="/deep-dives/dubai-property-cycle-explained" className="hover:text-brand-gold">Dubai Property Cycle Explained</Link></li>
                  <li><Link to="/deep-dives/dubai-investment-strategy-guide" className="hover:text-brand-gold">Dubai Investment Strategy Guide</Link></li>
                  <li><Link to="/deep-dives/off-plan-vs-ready" className="hover:text-brand-gold">Off-Plan vs Ready</Link></li>
                  <li><Link to="/deep-dives/best-areas-to-invest" className="hover:text-brand-gold">Best Areas to Invest in Dubai</Link></li>
                  <li><Link to="/deep-dives/dubai-property-fees" className="hover:text-brand-gold">Dubai Property Fees Explained</Link></li>
                  <li><Link to="/deep-dives/dubai-supply-pipeline" className="hover:text-brand-gold">Dubai Supply Pipeline</Link></li>
                </ul>
              </article>

              <article>
                <h3 className="text-xl font-serif italic text-brand-navy">Explore Insight Categories</h3>
                <ul className="mt-4 space-y-3 text-sm text-slate-grey">
                  <li><Link to="/insights/expert-insights" className="hover:text-brand-gold">Expert Insights</Link></li>
                  <li><Link to="/insights/strategic-outlook" className="hover:text-brand-gold">Strategic Outlook</Link></li>
                </ul>
              </article>
            </div>
          </section>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[90] bg-brand-navy/60 backdrop-blur-sm transition-opacity duration-700 ${drawerOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={() => setActiveDrawer(null)}
      />

      <div
        className={`fixed right-0 top-0 z-[100] h-full w-full transform bg-white shadow-2xl transition-transform duration-700 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] sm:w-[650px] ${drawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {activeDrawer && (
          <div className="flex h-full flex-col">
            <div className="flex items-start justify-between border-b border-brand-gold/20 bg-[#0A192F] p-10">
              <div>
                <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.4em] text-brand-gold">DXB Edge Vault // {activeDrawer.category}</span>
                <h3
                  className="text-3xl font-sans font-bold leading-tight text-white"
                  style={{ fontFamily: 'Univers, Inter, sans-serif' }}
                >
                  {activeDrawer.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveDrawer(null)}
                className="p-2 text-white/40 transition-colors hover:text-brand-gold"
              >
                <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 bg-soft-grey px-10 py-4">
              <button
                type="button"
                onClick={copyDrawerText}
                className="flex items-center gap-2 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-brand-navy transition-colors hover:text-brand-gold"
              >
                <svg className="h-4 w-4 flex-none overflow-visible" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3h6a1 1 0 011 1v2H8V4a1 1 0 011-1z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 6h8a2 2 0 012 2v11a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 11h6M9 15h6" />
                </svg>
                Copy Strategic Intelligence
              </button>
            </div>

            <div
              id="insights-hub-drawer-body"
              className={`custom-scrollbar custom-scrollbar-prominent flex-1 overflow-y-auto bg-white p-12 transition-opacity duration-700 delay-200 ${drawerOpen ? 'opacity-100' : 'opacity-0'}`}
            >
              {activeDrawer.body}
            </div>

            <div className="flex gap-4 border-t border-slate-100 bg-soft-grey/30 p-10">
              <button
                type="button"
                onClick={() => setActiveDrawer(null)}
                className="flex-1 bg-brand-navy py-5 text-[11px] font-bold uppercase tracking-[0.3em] text-white shadow-xl transition-all duration-500 hover:bg-brand-gold hover:text-brand-navy"
              >
                Exit Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default InsightsHub;