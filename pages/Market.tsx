import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import InternalLinks from '@/components/InternalLinks';
import HeroBanner from '@/components/HeroBanner';

type LeadCaptureType = 'Expert' | 'Investment Strategist' | 'Strategic Advisory' | 'Developer' | 'Mortgage Advisor' | 'Services';

interface MarketProps {
  openModal: (type: LeadCaptureType) => void;
}

interface DrawerContent {
  title: string;
  category: string;
  body: React.ReactNode;
}

interface CycleSummary {
  period: string;
  title: string;
  movement: string;
  description: string;
}

interface CycleDetail {
  period: string;
  title: string;
  movement?: string;
  overview: string[];
  drivers?: string[];
  impacts?: string[];
}

export const metadata = {
  title: 'Dubai Property Market | Cycles, Supply, Pricing & Emerging Areas',
  description:
    'Independent analysis of Dubai\'s property market cycles, supply, demand, pricing behaviour, rental trends and emerging communities. Clear, fundamentals-driven guidance for long-term investors.',
  keywords: [
    'Dubai property market',
    'Dubai property investment',
    'Dubai real estate',
    'Dubai market cycles',
    'Dubai property trends',
    'Dubai rental market',
    'Dubai supply pipeline',
    'Dubai pricing trends',
    'Dubai emerging communities',
    'Dubai investment research',
  ],
  openGraph: {
    title: 'Dubai Property Market',
    description: 'Independent Dubai property market analysis for long-term investors.',
    url: 'https://insights.dxbedge.com/market',
    type: 'article' as const,
  },
};

const cycleSummary: CycleSummary[] = [
  {
    period: '2003-2008',
    title: 'Freehold boom and rapid appreciation',
    movement: '+171% on BIS index',
    description: 'Freehold opening, credit expansion, master-community launches and speculative demand drove the first major expansion cycle.',
  },
  {
    period: '2008-2011',
    title: 'Financial crisis correction',
    movement: '-36.5% on BIS index',
    description: 'The global credit crisis exposed leverage, froze transactions and forced a structural regulatory reset across the market.',
  },
  {
    period: '2012-2014',
    title: 'Recovery and second boom',
    movement: '+81.8%',
    description: 'Expo expectations, stronger sentiment and renewed international demand drove a second sharp appreciation phase.',
  },
  {
    period: '2015-2020',
    title: 'Supply-led adjustment',
    movement: '-30.2%',
    description: 'A slower correction emerged through oversupply, weaker rents, longer sales cycles and greater developer incentives.',
  },
  {
    period: '2020-2021',
    title: 'Pandemic disruption',
    movement: 'Limited additional decline',
    description: 'COVID caused a short shock, but rapid reopening and a shift toward larger homes accelerated the rebound.',
  },
  {
    period: '2021-2025',
    title: 'Post-pandemic expansion',
    movement: '+42.2% by Q1 2024 on BIS index',
    description: 'Migration, residency reforms, global capital inflows and constrained villa supply supported record volumes and rents.',
  },
  {
    period: '2026',
    title: 'Deceleration and geopolitical shock',
    movement: 'Monthly declines emerging',
    description: 'The market entered a later-cycle slowdown before regional conflict hit sentiment, volumes and seller confidence.',
  },
];

const cycleDetails: CycleDetail[] = [
  {
    period: 'Cycle 1: 2003-2008',
    title: 'Freehold expansion and speculative boom',
    movement: 'BIS index moved from approximately 55.8 in Q3 2003 to 151.4 in Q2 2008, representing roughly 171% growth.',
    overview: [
      'Dubai opened designated areas to foreign freehold ownership in 2002. That policy change unlocked a new international buyer base and supported the launch of Palm Jumeirah, Dubai Marina, Downtown Dubai, Arabian Ranches and other major master communities.',
      'International investment, population growth, infrastructure spending and easy access to off-plan property created the conditions for very rapid appreciation.',
      'Prices rose quickly, but a meaningful share of demand was investment-led rather than anchored by occupancy or rental fundamentals. Properties were often resold before construction or handover.',
    ],
    drivers: [
      'Introduction of foreign freehold ownership.',
      'Large-scale master-development launches.',
      'Rapid population and economic growth.',
      'Speculative off-plan resales.',
      'High leverage and relatively loose market regulation.',
      'Strong global liquidity before the financial crisis.',
    ],
  },
  {
    period: 'Cycle 2: 2008-2011',
    title: 'Global financial crisis and major correction',
    movement: 'BIS index declined from approximately 151.4 in Q2 2008 to 96.1 in Q4 2010, a contraction of around 36.5%. Dubai-specific estimates commonly place the decline at more than 50% peak to trough.',
    overview: [
      'The global financial crisis restricted access to credit and exposed the market\'s dependence on speculative demand and highly leveraged buyers.',
      'Transactions slowed sharply, projects were delayed or cancelled, and distressed selling increased across the market.',
      'This was both a cyclical and structural correction. It did not only lower prices; it changed how off-plan sales, escrow accounts, project registration and brokerage activity were regulated.',
    ],
    impacts: [
      'Significant price reductions and negative equity for some leveraged buyers.',
      'Project cancellations, construction delays and reduced bank lending.',
      'Stricter mortgage requirements and stronger RERA oversight.',
      'Consolidation among developers and agencies.',
    ],
  },
  {
    period: 'Cycle 3: 2012-2014',
    title: 'Recovery and second growth phase',
    movement: 'BIS index rose from approximately 96.1 in Q4 2010 to 174.8 in Q4 2014, an increase of approximately 81.8%.',
    overview: [
      'From around 2011-2012, prices began recovering as economic confidence improved and previously delayed projects restarted.',
      'Tourism growth and Dubai\'s successful Expo 2020 bid in November 2013 strengthened expectations for future infrastructure, population growth and investment demand.',
      'Authorities and developers responded more cautiously than before 2008, including tighter mortgage limits and higher transaction costs intended to curb short-term speculation.',
    ],
    drivers: [
      'Renewed international investor demand.',
      'Recovery of previously discounted properties.',
      'Improved mortgage availability.',
      'Stronger transaction regulation than during the first cycle.',
      'New off-plan launches and rising speculation through 2013 and early 2014.',
    ],
  },
  {
    period: 'Cycle 4: 2015-2020',
    title: 'Long correction and supply-led adjustment',
    movement: 'BIS index fell from approximately 174.8 in Q4 2014 to 122.0 in Q3 2020, a contraction of about 30.2%.',
    overview: [
      'After the 2014 peak, Dubai entered a prolonged adjustment rather than a sudden crash. Large volumes of new apartment inventory entered the market while demand growth moderated.',
      'The decline was influenced by lower oil prices, a stronger US dollar, regional economic weakness and substantial development supply.',
      'This cycle matters because it shows that Dubai corrections do not always resemble 2008. A market can contract slowly over five or six years through weaker rents, supply growth and gradual price erosion.',
    ],
    impacts: [
      'Gradual rather than sudden price reductions.',
      'Declining rents and increasing tenant incentives.',
      'Greater negotiation power for ready-property buyers.',
      'Longer sales periods and pressure on investor yields where rents fell faster than acquisition costs.',
      'Increasing competition between ready and newly completed properties.',
      'Developers offering extended payment plans and post-handover terms.',
    ],
  },
  {
    period: 'Cycle 5: 2020-2021',
    title: 'Pandemic disruption and rapid reversal',
    movement: 'The BIS series reached approximately 122 in 2020 before beginning a sustained upward movement from 2021.',
    overview: [
      'COVID-19 initially reduced viewings, transactions, tourism and economic activity, but prices were already near the bottom of the previous cycle, which limited the scale of the additional decline.',
      'Dubai reopened faster than many competing global cities. Remote working, migration, residency reforms and demand for larger homes contributed to a strong recovery, especially in villas and established communities.',
    ],
    impacts: [
      'Initial transaction slowdown.',
      'Strong preference for villas, townhouses and larger homes.',
      'Rising demand from end users rather than only investors.',
      'Increased migration by entrepreneurs and high-net-worth individuals.',
      'Recovery in rents followed by accelerating sale prices.',
      'Limited supply in established villa communities.',
    ],
  },
  {
    period: 'Cycle 6: 2021-2025',
    title: 'Post-pandemic expansion',
    movement: 'The BIS index increased from approximately 123.3 in Q1 2021 to 175.4 in Q1 2024, representing roughly 42.2% growth. Dubai-specific data indicates a much stronger rise in several prime and villa-led submarkets.',
    overview: [
      'Dubai-specific reporting has indicated that average prices increased by approximately 75% from February 2021 to early 2025.',
      'The expansion was driven by population growth, international wealth migration, Golden Visa and residency reforms, stronger rental growth and limited ready-villa supply in prime communities.',
    ],
    drivers: [
      'Strong population growth.',
      'International wealth migration.',
      'Golden Visa and residency reforms.',
      'Dubai\'s handling of the pandemic and early reopening.',
      'Demand from Europe, India, Russia, China and the wider GCC.',
      'Limited ready-villa supply in prime communities.',
      'Higher global visibility following Expo 2020.',
      'Strong rental growth encouraging investment purchases.',
      'Continued developer launches and attractive payment plans.',
    ],
    impacts: [
      'Record transaction volumes.',
      'Prices surpassing previous peaks in many communities.',
      'Large rental increases.',
      'Stronger demand for luxury and branded residences.',
      'Rapid off-plan expansion and rising land, construction and replacement costs.',
      'Greater variation between original launch prices and later launch phases.',
    ],
  },
  {
    period: 'Cycle 7: 2026',
    title: 'Slowdown, correction or temporary shock?',
    movement: 'REIDIN reported Dubai\'s residential sales price index fell 1.76% month-on-month in April 2026 while remaining 6.09% higher year-on-year. Reuters reported that UAE transaction volumes during the first 12 days of March 2026 were down 37% year-on-year and 49% month-on-month.',
    overview: [
      'The market entered 2026 after roughly five years of price growth, making it more mature and more vulnerable to a slowdown before prices had fully reset market-wide.',
      'Regional geopolitical conflict then caused a sharper deterioration in confidence. Reuters also reported individual asking-price reductions of approximately 12-15%, while median transacted prices were only around 3% lower year-on-year at that stage.',
      'It is premature to describe 2026 as another 2008-style crash. Current evidence points to a late-cycle slowdown combined with an external geopolitical shock, with performance varying significantly by community, property type, seller motivation and payment position.',
    ],
    impacts: [
      'Transaction volumes normally react first.',
      'Motivated sellers begin accepting discounts before broad market indices fully roll over.',
      'Wider asking prices adjust more slowly than achieved prices.',
      'Recorded price indices can remain positive year-on-year even while current monthly prices are falling.',
      'Off-plan headline prices may stay firm because developers change incentives, payment plans or commissions rather than officially cutting prices.',
    ],
  },
];

const cycleChangeSignals = [
  'Transaction volumes falling before prices.',
  'Growing differences between asking and achieved prices.',
  'Increasing assignment or resale supply from off-plan buyers.',
  'Developers extending payment plans or increasing incentives.',
  'Rents no longer supporting current sale prices.',
  'Rising completions relative to population and household growth.',
  'More motivated or distressed secondary-market sellers.',
];

const readyCommunities = [
  'Dubai South',
  'Meydan',
  'Al Furjan',
  'JVC, where building-level variation is increasing',
  'Arjan',
  'Town Square',
];

const offPlanCommunities = [
  'Dubai South growth corridors',
  'Meydan districts',
  'Dubailand expansion zones',
  'New metro-linked districts',
];

const rentalFactors = [
  'Community maturity and tenant profile.',
  'Supply levels and new handovers.',
  'Layout efficiency and usable size.',
  'Service-charge drag on net yield.',
];

const pricingFactors = [
  'Current market-cycle phase.',
  'The active supply pipeline in the immediate micro-location.',
  'Developer strategy, launch cadence and incentives.',
  'Community stability and depth of end-user demand.',
];

const supplyFactors = [
  'Rental-yield compression or support.',
  'Secondary resale pricing power.',
  'Off-plan exit risk and absorption speed.',
  'Long-term value resilience once new stock completes into the market.',
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

const Market: React.FC<MarketProps> = ({ openModal }) => {
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

  const cycleDrawer = useMemo<DrawerContent>(() => ({
    category: 'Market Cycles',
    title: 'Full Dubai Property Market Cycles (2003-2026)',
    body: (
      <div className="space-y-12">
        <DrawerSection title="Summary of the cycles">
          <div className="grid gap-4 sm:grid-cols-2">
            {cycleSummary.map((cycle) => (
              <div key={cycle.period} className="rounded-2xl border border-slate-200 bg-soft-grey/60 p-5">
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-brand-gold">{cycle.period}</div>
                <h5 className="mt-2 text-lg font-serif italic text-brand-navy">{cycle.title}</h5>
                <p className="mt-2 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-grey">{cycle.movement}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-grey">{cycle.description}</p>
              </div>
            ))}
          </div>
        </DrawerSection>

        {cycleDetails.map((cycle) => (
          <DrawerSection key={cycle.period} title={`${cycle.period} - ${cycle.title}`}>
            {cycle.movement && (
              <div className="rounded-2xl border border-brand-gold/30 bg-brand-navy p-4">
                <p className="text-sm font-medium leading-relaxed text-white/90">{cycle.movement}</p>
              </div>
            )}
            <div className="space-y-4">
              {cycle.overview.map((paragraph) => (
                <DrawerParagraph key={paragraph}>{paragraph}</DrawerParagraph>
              ))}
            </div>
            {cycle.drivers && cycle.drivers.length > 0 && (
              <div className="space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-gold">Principal drivers</div>
                <DrawerBullets items={cycle.drivers} />
              </div>
            )}
            {cycle.impacts && cycle.impacts.length > 0 && (
              <div className="space-y-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.24em] text-brand-gold">Market impact</div>
                <DrawerBullets items={cycle.impacts} />
              </div>
            )}
          </DrawerSection>
        ))}

        <DrawerSection title="What previous cycles tell investors">
          <DrawerParagraph>
            Dubai's long-term direction has been upward, but entry price and holding period matter considerably. Investors who bought near the 2008 or 2014 peaks often required several years to recover original purchase values.
          </DrawerParagraph>
          <DrawerParagraph>
            Investors purchasing during 2010-2012 or 2019-2021 generally benefited from lower acquisition prices, stronger rental yields and the subsequent recovery. The central lesson is that Dubai is not one uniform market: prime villas, affordable apartments, branded residences and heavily supplied off-plan districts can each sit at different points in their own cycles.
          </DrawerParagraph>
        </DrawerSection>

        <DrawerSection title="Cycle-change indicators investors should track">
          <DrawerBullets items={cycleChangeSignals} />
        </DrawerSection>
      </div>
    ),
  }), []);

  const copyDrawerText = () => {
    const text = document.getElementById('market-drawer-body')?.innerText || '';
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
        imageAlt="Dubai property market cycle and community analysis"
        keywords={metadata.keywords}
      />

      <div className="bg-[radial-gradient(circle_at_top,_rgba(201,168,106,0.16),_transparent_38%),linear-gradient(180deg,_#f8f9fa_0%,_#ffffff_42%,_#f7f4ee_100%)]">
        <div className="mx-auto max-w-7xl px-10 pt-16 lg:px-16 lg:pt-20">
          <HeroBanner
            title="Dubai Property Market"
            subtitle="Independent analysis of Dubai's property cycles, supply, demand, pricing behaviour and rental trends for long-term investors."
            background="#eef4ff"
            image="https://images.unsplash.com/photo-1655309893829-407c54619f1f?auto=format&fit=crop&q=80&w=2000"
            cta={{ label: 'Speak to an Investment Consultant', href: '/contact' }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-10 pt-8 pb-16 lg:px-16 lg:pt-8 lg:pb-20">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Dubai Property Market', href: '/market' },
            ]}
            className="mb-10"
          />

          <section className="grid gap-8 lg:grid-cols-[1.35fr_0.95fr]">
            <div className="rounded-3xl border border-white/70 bg-white/90 p-8 shadow-[0_30px_100px_rgba(10,25,47,0.08)] backdrop-blur">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Why Market Cycles Matter</div>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-grey">
                Market cycles influence launch pricing, resale pricing, rental yields, off-plan risk, community stability and investor entry timing. The current page gives a high-level view first, then opens into the full cycle history through the site drawer pattern.
              </p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  'Launch pricing',
                  'Resale pricing',
                  'Rental yields',
                  'Off-plan risk',
                  'Community stability',
                  'Investor entry timing',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-soft-grey/70 px-4 py-3">
                    <div className="h-2 w-2 rounded-full bg-brand-gold" />
                    <span className="text-sm font-medium text-brand-navy">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-brand-gold/40 bg-brand-navy p-8 text-white shadow-[0_30px_100px_rgba(10,25,47,0.12)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Current Market Read</div>
              <h2 className="mt-4 text-2xl font-serif italic text-white">2026 is a late-cycle slowdown, not yet a 2008-style market event.</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                Volumes have weakened faster than recorded annual price indices, selective discounts are emerging, and off-plan pricing remains more resilient where incentives absorb the pressure. That distinction matters for investor timing and underwriting.
              </p>
              <button
                type="button"
                onClick={() => setActiveDrawer(cycleDrawer)}
                className="mt-6 inline-flex items-center justify-center border border-brand-gold px-5 py-3 text-[10px] font-bold uppercase tracking-[0.26em] text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy"
              >
                Open Full Cycle History
              </button>
            </div>
          </section>

          <section className="mt-16">
            <div className="flex items-end justify-between gap-6">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Market Cycles Summary</div>
                <h2 className="mt-3 text-4xl font-serif italic text-brand-navy">Seven major phases from 2003 to 2026</h2>
              </div>
              <button
                type="button"
                onClick={() => setActiveDrawer(cycleDrawer)}
                className="hidden border border-brand-navy/15 bg-white px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-navy transition-all duration-300 hover:border-brand-navy hover:bg-brand-navy hover:text-white lg:inline-flex"
              >
                View full history
              </button>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {cycleSummary.map((cycle, index) => (
                <article key={cycle.period} className={`rounded-3xl border p-7 shadow-[0_20px_60px_rgba(10,25,47,0.06)] transition-transform duration-300 hover:-translate-y-1 ${index === 6 ? 'border-brand-gold/50 bg-brand-navy text-white xl:col-span-3' : 'border-white/80 bg-white'}`}>
                  <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">{cycle.period}</div>
                  <h3 className={`mt-3 text-2xl font-serif italic ${index === 6 ? 'text-white' : 'text-brand-navy'}`}>{cycle.title}</h3>
                  <p className={`mt-3 text-[11px] font-bold uppercase tracking-[0.18em] ${index === 6 ? 'text-white/70' : 'text-slate-grey'}`}>{cycle.movement}</p>
                  <p className={`mt-4 text-sm leading-relaxed ${index === 6 ? 'text-white/82' : 'text-slate-grey'}`}>{cycle.description}</p>
                </article>
              ))}
            </div>

            <div className="mt-8 lg:hidden">
              <button
                type="button"
                onClick={() => setActiveDrawer(cycleDrawer)}
                className="inline-flex w-full items-center justify-center border border-brand-navy bg-brand-navy px-5 py-4 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy"
              >
                View full drawer
              </button>
            </div>
          </section>

          <section className="mt-16 grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Emerging Communities</div>
              <h2 className="mt-3 text-3xl font-serif italic text-brand-navy">Ready + emerging communities</h2>
              <div className="mt-6 space-y-3">
                {readyCommunities.map((community) => (
                  <div key={community} className="flex items-start gap-3 rounded-2xl bg-soft-grey/70 px-4 py-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-gold" />
                    <p className="text-sm leading-relaxed text-slate-grey">{community}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col rounded-3xl border border-brand-gold/25 bg-[#f7f2e8] p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Off-Plan Focus</div>
              <h2 className="mt-3 text-3xl font-serif italic text-brand-navy">Off-plan emerging communities</h2>
              <div className="mt-6 space-y-3">
                {offPlanCommunities.map((community) => (
                  <div key={community} className="flex items-start gap-3 rounded-2xl border border-brand-gold/10 bg-white/80 px-4 py-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-gold" />
                    <p className="text-sm leading-relaxed text-slate-grey">{community}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => openModal('Expert')}
                className="mt-auto self-start pt-6 inline-flex items-center justify-center border border-brand-navy px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-navy transition-all duration-300 hover:bg-brand-navy hover:text-white"
              >
                Discuss off-plan pipeline
              </button>
            </div>
          </section>

          <section className="mt-16 grid gap-8 xl:grid-cols-3">
            <article className="flex flex-col rounded-3xl border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Rental Market Trends</div>
              <p className="mt-4 text-sm leading-relaxed text-slate-grey">
                Rental demand varies materially by community maturity, tenant demographics, supply levels, layout efficiency and service charges.
              </p>
              <div className="mt-5 space-y-3">
                {rentalFactors.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                    <p className="text-sm leading-relaxed text-slate-grey">{item}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate('/deep-dives/dubai-rental-market-trends')}
                className="mt-auto self-start pt-6 inline-flex items-center justify-center border border-brand-navy/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-navy transition-all duration-300 hover:bg-brand-navy hover:text-white"
              >
                Open topic page
              </button>
            </article>

            <article className="flex flex-col rounded-3xl border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Pricing Behaviour</div>
              <p className="mt-4 text-sm leading-relaxed text-slate-grey">
                Pricing behaviour is shaped by cycle phase, pipeline pressure, developer incentives and the resilience of end-user demand in each micro-market.
              </p>
              <div className="mt-5 space-y-3">
                {pricingFactors.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                    <p className="text-sm leading-relaxed text-slate-grey">{item}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate('/deep-dives/dubai-price-trends')}
                className="mt-auto self-start pt-6 inline-flex items-center justify-center border border-brand-navy/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-navy transition-all duration-300 hover:bg-brand-navy hover:text-white"
              >
                Open topic page
              </button>
            </article>

            <article className="flex flex-col rounded-3xl border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Supply Pipeline</div>
              <p className="mt-4 text-sm leading-relaxed text-slate-grey">
                Supply directly affects rental yields, resale pricing, off-plan risk and long-term value support once new stock completes into the market.
              </p>
              <div className="mt-5 space-y-3">
                {supplyFactors.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                    <p className="text-sm leading-relaxed text-slate-grey">{item}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate('/deep-dives/dubai-supply-pipeline')}
                className="mt-auto self-start pt-6 inline-flex items-center justify-center border border-brand-navy/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-navy transition-all duration-300 hover:bg-brand-navy hover:text-white"
              >
                Open topic page
              </button>
            </article>
          </section>

          <section className="mt-16 rounded-3xl border border-brand-gold/40 bg-brand-navy p-8 text-white shadow-[0_30px_100px_rgba(10,25,47,0.12)] md:p-10">
            <div className="max-w-4xl">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Investor CTA</div>
              <h2 className="mt-3 text-3xl font-serif italic text-white md:text-4xl">Move from market reading to underwriting support.</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">
                If you need deeper cycle interpretation, community-level guidance or project-specific off-plan risk review, use the existing advisory channels below rather than generic contact forms.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <button
                type="button"
                onClick={() => openModal('Strategic Advisory')}
                className="border border-brand-gold px-5 py-5 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy"
              >
                Request a Community Report
              </button>
              <button
                type="button"
                onClick={() => openModal('Expert')}
                className="border border-white/15 px-5 py-5 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:border-brand-gold hover:text-brand-gold"
              >
                Ask for Off-Plan Risk Assessment
              </button>
              <button
                type="button"
                onClick={() => openModal('Expert')}
                className="border border-white/15 px-5 py-5 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:border-brand-gold hover:text-brand-gold"
              >
                Speak to an Expert
              </button>
            </div>
          </section>

          <InternalLinks type="market" className="mt-16" />
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
              id="market-drawer-body"
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

export default Market;