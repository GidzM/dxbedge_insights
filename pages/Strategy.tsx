import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import InternalLinks from '@/components/InternalLinks';

type LeadCaptureType = 'Expert' | 'Investment Strategist' | 'Strategic Advisory' | 'Developer' | 'Mortgage Advisor' | 'Services';

interface StrategyProps {
  openModal: (type: LeadCaptureType) => void;
}

interface DrawerContent {
  title: string;
  category: string;
  body: React.ReactNode;
}

export const metadata = {
  title: 'Dubai Investment Strategy | Off-Plan, Ready, Cashflow & Exit Planning',
  description:
    'Long-term Dubai property investment strategy including off-plan frameworks, ready property stability, cashflow planning, exit strategy, equity release and off-plan mortgage guidance.',
  keywords: [
    'Dubai investment strategy',
    'Dubai property investment',
    'Dubai off-plan investment',
    'Dubai ready property',
    'Dubai cashflow management',
    'Dubai exit strategy',
    'Dubai equity release',
    'Dubai off-plan mortgages',
    'Dubai investor guide',
  ],
  openGraph: {
    title: 'Dubai Investment Strategy',
    description: 'Long-term Dubai property investment strategy for serious investors.',
    url: 'https://insights.dxbedge.com/strategy',
    type: 'article' as const,
  },
};

const offPlanAdvantages = [
  'Early-phase pricing before later launch tranches reset higher.',
  'Flexible payment plans that can increase leverage efficiency.',
  'Developer incentives that improve basis or cashflow timing.',
  'The strongest long-term appreciation potential when entry is disciplined.',
];

const offPlanRequirements = [
  'Developer reliability and delivery track record.',
  'Cycle awareness before committing to launch pricing.',
  'Community-level evaluation rather than project-only marketing.',
  'Payment-plan risk management across construction and handover.',
];

const readyStrategyPoints = [
  'Immediate rental income from day one of completion and transfer.',
  'Lower execution risk because the asset and building behaviour are visible.',
  'Observable tenant profile, service quality and resale liquidity.',
  'More stable yields for investors prioritising defensiveness over maximum upside.',
];

const equityReleasePoints = [
  'UK property equity release or refinancing.',
  'Portfolio leverage against existing holdings.',
  'Recycling idle equity into higher-growth Dubai opportunities.',
];

const offPlanMortgagePoints = [
  'Construction-phase mortgages in selected structures.',
  'Post-handover mortgage solutions once the project matures.',
  'Fixed-rate or subsidised incentives arranged through approved banks.',
];

const mortgageActivationTriggers = [
  'At roughly 50-60% construction progress.',
  'After Oqood registration and project compliance milestones.',
  'Through developer-approved banking channels rather than broad retail access.',
];

const cashflowPlanning = [
  'Stage payments across the construction timeline.',
  'Service charges and ongoing ownership friction costs.',
  'Mortgage instalments and refinance assumptions.',
  'Rental income timing versus actual handover dates.',
  'Maintenance reserves, vacancy risk and furnishing costs where relevant.',
];

const exitInputs = [
  'Current cycle phase and whether launch premiums are expanding or compressing.',
  'Community maturity and the depth of end-user demand at handover.',
  'Rental-yield trajectory relative to new launch pricing.',
  'Resale liquidity and actual achieved-price evidence.',
  'Assignment market conditions for investors exiting before handover.',
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

const Strategy: React.FC<StrategyProps> = ({ openModal }) => {
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

  const strategyDrawer = useMemo<DrawerContent>(() => ({
    category: 'Investor Strategy',
    title: 'Cashflow Management & Exit Strategy',
    body: (
      <div className="space-y-12">
        <DrawerSection title="Cashflow Management">
          <DrawerParagraph>
            Cashflow planning determines whether an investor can actually hold through cycle changes rather than being forced into a badly timed sale. In Dubai, that discipline matters more in off-plan because capital is committed over time while market conditions keep moving.
          </DrawerParagraph>
          <DrawerBullets items={cashflowPlanning} />
          <DrawerParagraph>
            The practical question is not only whether the deal looks attractive at launch. It is whether the investor can carry the asset through construction, absorb handover friction, and still remain positioned for the intended holding period or exit window.
          </DrawerParagraph>
        </DrawerSection>

        <DrawerSection title="Exit Strategy">
          <DrawerParagraph>
            Exit planning should be defined before reservation, not after momentum fades. Off-plan investors may sell by assignment before handover, refinance into an income hold, or dispose after stabilisation once the community is more mature.
          </DrawerParagraph>
          <DrawerBullets items={exitInputs} />
          <DrawerParagraph>
            A strong exit plan treats liquidity as a real underwriting factor. Some projects look attractive on headline launch pricing but offer weak resale depth if too much competing stock lands at the same time.
          </DrawerParagraph>
        </DrawerSection>

        <DrawerSection title="Cycle-Aware Decision Rules">
          <DrawerBullets items={[
            'In expanding phases, earlier launch entry can outperform later phases, but only if the community has durable end-user demand.',
            'In late-cycle conditions, cashflow resilience matters more than projected paper upside.',
            'For ready property, defensiveness often comes from proven occupancy, service quality and rental evidence rather than launch discounts.',
            'For off-plan, the most important mistake to avoid is paying growth-market pricing for weak execution or oversupplied locations.',
          ]} />
        </DrawerSection>

        <DrawerSection title="Investor Takeaway">
          <DrawerParagraph>
            Dubai rewards long-term, fundamentals-driven strategy. Off-plan usually offers the greatest upside, while ready property offers more visible income and lower execution risk. The correct choice depends on holding power, risk tolerance, financing structure and the specific micro-market being targeted.
          </DrawerParagraph>
        </DrawerSection>
      </div>
    ),
  }), []);

  const copyDrawerText = () => {
    const text = document.getElementById('strategy-drawer-body')?.innerText || '';
    navigator.clipboard.writeText(text);
    alert('Strategic intelligence copied to clipboard.');
  };

  return (
    <>
      <SEO
        title={metadata.title}
        description={metadata.description}
        path={location.pathname}
        type={metadata.openGraph.type}
        schemaType="Article"
        image="/media/dxb-edge-default.jpg"
        imageAlt="Dubai investment strategy for property investors"
        keywords={metadata.keywords}
      />

      <div className="bg-[radial-gradient(circle_at_top,_rgba(201,168,106,0.16),_transparent_38%),linear-gradient(180deg,_#f8f9fa_0%,_#ffffff_42%,_#f7f4ee_100%)]">
        <section className="relative overflow-hidden border-b border-brand-gold/20 bg-brand-navy text-white">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute left-0 top-8 h-72 w-72 rounded-full bg-brand-gold blur-3xl" />
            <div className="absolute right-0 top-1/4 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-7xl px-10 py-20 lg:px-16 lg:py-24">
            <div className="max-w-4xl">
              <div className="mb-4 inline-flex items-center border border-brand-gold/30 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.3em] text-brand-gold">
                Dubai Investment Strategy
              </div>
              <h1 className="max-w-5xl text-4xl font-serif italic text-white sm:text-5xl lg:text-6xl">
                Long-term strategy for Dubai property across off-plan, ready, cashflow, financing and exits.
              </h1>
              <p className="mt-6 max-w-3xl text-sm leading-relaxed text-white/80 md:text-base">
                Dubai rewards long-term, fundamentals-driven strategy. Off-plan offers the strongest return potential, while ready property provides greater stability, immediate income and clearer operational visibility.
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
                  onClick={() => setActiveDrawer(strategyDrawer)}
                  className="inline-flex items-center justify-center border border-white/20 px-6 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:border-brand-gold hover:text-brand-gold"
                >
                  Open Cashflow & Exit Drawer
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-10 py-16 lg:px-16 lg:py-20">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Investment Strategy', href: '/strategy' },
            ]}
            className="mb-10"
          />

          <section className="grid gap-8 lg:grid-cols-2">
            <article className="flex flex-col rounded-3xl border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Off-Plan Strategy</div>
              <h2 className="mt-3 text-3xl font-serif italic text-brand-navy">Highest return potential, but only with control over timing and execution.</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-grey">
                Off-plan can deliver the strongest upside because investors access earlier pricing, flexible payment structures and long-duration appreciation. That same structure also increases underwriting complexity.
              </p>
              <div className="mt-6 space-y-3">
                {offPlanAdvantages.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-soft-grey/70 px-4 py-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-gold" />
                    <p className="text-sm leading-relaxed text-slate-grey">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-brand-gold/20 bg-[#f7f2e8] p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-gold">Requires</div>
                <div className="mt-4 space-y-3">
                  {offPlanRequirements.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                      <p className="text-sm leading-relaxed text-slate-grey">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/deep-dives/off-plan-risk-framework')}
                className="mt-auto self-start pt-6 inline-flex items-center justify-center border border-brand-navy/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-navy transition-all duration-300 hover:bg-brand-navy hover:text-white"
              >
                Open risk framework
              </button>
            </article>

            <article className="flex flex-col rounded-3xl border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Ready Strategy</div>
              <h2 className="mt-3 text-3xl font-serif italic text-brand-navy">More visible income, lower execution risk and clearer community behaviour.</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-grey">
                Ready property is usually the more defensive route. The trade-off is lower upside versus top-performing off-plan entries, but stronger evidence on rent, occupancy, operations and resale depth.
              </p>
              <div className="mt-6 space-y-3">
                {readyStrategyPoints.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-soft-grey/70 px-4 py-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-gold" />
                    <p className="text-sm leading-relaxed text-slate-grey">{item}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate('/ready/ready-vs-off-plan/')}
                className="mt-auto self-start pt-6 inline-flex items-center justify-center border border-brand-navy/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-navy transition-all duration-300 hover:bg-brand-navy hover:text-white"
              >
                Compare ready vs off-plan
              </button>
            </article>
          </section>

          <section className="mt-16 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="flex flex-col rounded-3xl border border-brand-gold/40 bg-brand-navy p-8 text-white shadow-[0_30px_100px_rgba(10,25,47,0.12)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Cashflow & Exit Strategy</div>
              <h2 className="mt-3 text-3xl font-serif italic text-white">This is where good deals fail or survive.</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                Cashflow discipline determines whether an investor can hold through volatility. Exit planning determines whether the projected upside can actually be realised in the intended time window.
              </p>
              <button
                type="button"
                onClick={() => setActiveDrawer(strategyDrawer)}
                className="mt-auto self-start pt-6 inline-flex items-center justify-center border border-brand-gold px-5 py-3 text-[10px] font-bold uppercase tracking-[0.26em] text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy"
              >
                Open full breakdown
              </button>
            </article>

            <article className="flex flex-col rounded-3xl border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Equity Release</div>
              <p className="mt-4 text-sm leading-relaxed text-slate-grey">
                Many international buyers, especially UK investors, fund Dubai acquisitions by releasing equity or restructuring existing holdings rather than waiting for fresh cash accumulation.
              </p>
              <div className="mt-5 space-y-3">
                {equityReleasePoints.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                    <p className="text-sm leading-relaxed text-slate-grey">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="mt-16 grid gap-8 xl:grid-cols-2">
            <article className="rounded-3xl border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Off-Plan Mortgages</div>
              <p className="mt-4 text-sm leading-relaxed text-slate-grey">
                Off-plan mortgages exist, but they are conditional products rather than universally available financing. Activation usually depends on project progress, registration milestones and approved lending partners.
              </p>
              <div className="mt-5 space-y-3">
                {offPlanMortgagePoints.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                    <p className="text-sm leading-relaxed text-slate-grey">{item}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-slate-200 bg-soft-grey/70 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-gold">Typical activation</div>
                <div className="mt-4 space-y-3">
                  {mortgageActivationTriggers.map((item) => (
                    <div key={item} className="flex items-start gap-3">
                      <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                      <p className="text-sm leading-relaxed text-slate-grey">{item}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/financing/off-plan-mortgages/')}
                className="mt-auto self-start pt-6 inline-flex items-center justify-center border border-brand-navy/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-navy transition-all duration-300 hover:bg-brand-navy hover:text-white"
              >
                Open mortgage topic
              </button>
            </article>

            <article className="flex flex-col rounded-3xl border border-brand-gold/25 bg-[#f7f2e8] p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Investor CTA</div>
              <h2 className="mt-3 text-3xl font-serif italic text-brand-navy">Choose the support that matches your investment goal.</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-grey">
                Whether you are planning an off-plan entry or stress-testing finance assumptions, our team can help you with practical, tailored guidance for your next move.
              </p>
              <div className="mt-auto grid gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => openModal('Expert')}
                  className="border border-brand-navy bg-brand-navy px-5 py-4 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy"
                >
                  Request Off-Plan Strategy Guide
                </button>
                <button
                  type="button"
                  onClick={() => openModal('Mortgage Advisor')}
                  className="border border-brand-gold px-5 py-4 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-navy transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy"
                >
                  Ask for Cashflow Model
                </button>
              </div>
            </article>
          </section>

          <InternalLinks type="strategy" className="mt-16" />
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
              id="strategy-drawer-body"
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

export default Strategy;