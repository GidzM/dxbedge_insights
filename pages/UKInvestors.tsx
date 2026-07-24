import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';
import Breadcrumbs from '@/components/Breadcrumbs';
import InternalLinks from '@/components/InternalLinks';
import HeroBanner from '@/components/HeroBanner';

type LeadCaptureType = 'Expert' | 'Investment Strategist' | 'Strategic Advisory' | 'Developer' | 'Mortgage Advisor' | 'Services';

interface UKInvestorsProps {
  openModal: (type: LeadCaptureType) => void;
}

interface DrawerContent {
  title: string;
  category: string;
  body: React.ReactNode;
}

export const metadata = {
  title: 'Dubai Property for UK Investors | Tax, Strategy, Currency & Off-Plan',
  description:
    'Clear guidance for UK investors entering Dubai\'s property market. Tax treatment, off-plan buying, financing, currency advantages, rental yields and long-term strategy.',
  keywords: [
    'Dubai property UK investors',
    'Dubai property investment UK',
    'Dubai property tax UK',
    'Dubai off-plan UK',
    'Dubai vs UK property market',
    'Dubai rental yields UK',
    'Dubai currency advantage',
    'Dubai investor guide UK',
  ],
  openGraph: {
    title: 'Dubai Property for UK Investors',
    description: 'Independent guidance for UK investors entering Dubai\'s property market.',
    url: 'https://insights.dxbedge.com/uk-investors',
    type: 'article' as const,
  },
};

const ukBuyerDrivers = [
  'Tax efficiency compared with many domestic UK property structures.',
  'Stronger gross rental yields in key Dubai communities.',
  'Lifestyle and relocation appeal for families and business owners.',
  'Currency dynamics that can improve effective acquisition costs.',
];

const offPlanRemoteBuying = [
  'Reservation and transaction completion without an in-person visit.',
  'Decision-making led by verified brochures, data and layouts.',
  'Developer track record and delivery credibility as core filters.',
  'Community fundamentals and handover supply depth as underwriting inputs.',
];

const britishCommunityEffects = [
  'Sustained tenant demand from a large UK expat population.',
  'More consistent resale liquidity in established communities.',
  'Greater community stability through repeat buyer and tenant behaviour.',
];

const taxTopics = [
  'HMRC treatment of overseas rental income and gains.',
  'Allowable deductions and documentation discipline.',
  'Double-taxation framework considerations.',
  'Golden Visa thresholds and ownership planning implications.',
];

const financingTopics = [
  'Equity release from UK assets.',
  'UK refinancing and capital recycling.',
  'Developer-linked mortgage pathways where available.',
  'Stage-payment cashflow planning before and after handover.',
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

const UKInvestors: React.FC<UKInvestorsProps> = ({ openModal }) => {
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

  const currencyDrawer = useMemo<DrawerContent>(() => ({
    category: 'Currency Strategy',
    title: 'Exchange-Rate Examples for UK Investors',
    body: (
      <div className="space-y-12">
        <DrawerSection title="Why FX matters for UK investors">
          <DrawerParagraph>
            The AED is pegged to the USD, so GBP strength or weakness can materially change your effective entry price and realised GBP yield. The same property can look very different in sterling terms depending on timing.
          </DrawerParagraph>
        </DrawerSection>

        <DrawerSection title="Increased Purchasing Power">
          <DrawerParagraph>A property costs AED 5,000,000.</DrawerParagraph>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-soft-grey/80 text-left text-[11px] uppercase tracking-[0.16em] text-brand-navy">
                <tr>
                  <th className="px-4 py-3">Exchange Rate</th>
                  <th className="px-4 py-3">Cost in GBP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-grey">
                <tr>
                  <td className="px-4 py-3">GBP 1 = AED 4.50</td>
                  <td className="px-4 py-3">GBP 1,111,111</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">GBP 1 = AED 5.00</td>
                  <td className="px-4 py-3">GBP 1,000,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <DrawerParagraph>
            Sterling strength in this example reduces effective acquisition cost by roughly GBP 111,000.
          </DrawerParagraph>
        </DrawerSection>

        <DrawerSection title="Rental Income Advantage">
          <DrawerParagraph>Annual rent = AED 240,000.</DrawerParagraph>
          <div className="overflow-hidden rounded-2xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-soft-grey/80 text-left text-[11px] uppercase tracking-[0.16em] text-brand-navy">
                <tr>
                  <th className="px-4 py-3">Exchange Rate</th>
                  <th className="px-4 py-3">GBP Income</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white text-slate-grey">
                <tr>
                  <td className="px-4 py-3">GBP 1 = AED 4.50</td>
                  <td className="px-4 py-3">GBP 53,333</td>
                </tr>
                <tr>
                  <td className="px-4 py-3">GBP 1 = AED 5.20</td>
                  <td className="px-4 py-3">GBP 46,154</td>
                </tr>
              </tbody>
            </table>
          </div>
          <DrawerParagraph>
            Currency timing affects your effective sterling yield, even with the same AED rent.
          </DrawerParagraph>
        </DrawerSection>

        <DrawerSection title="Dual Returns">
          <DrawerBullets
            items={[
              'Property appreciation in AED terms.',
              'Potential FX uplift when converted back to GBP.',
              'Combined return profile that can amplify results in favourable cycles.',
            ]}
          />
        </DrawerSection>
      </div>
    ),
  }), []);

  const copyDrawerText = () => {
    const text = document.getElementById('uk-investors-drawer-body')?.innerText || '';
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
        imageAlt="UK investor strategy in Dubai property"
        keywords={metadata.keywords}
      />

      <div className="bg-[radial-gradient(circle_at_top,_rgba(201,168,106,0.16),_transparent_38%),linear-gradient(180deg,_#f8f9fa_0%,_#ffffff_42%,_#f7f4ee_100%)]">
        <div className="mx-auto max-w-7xl px-10 pt-16 lg:px-16 lg:pt-20">
          <HeroBanner
            title="Dubai Property for UK Investors"
            subtitle="Structured guidance for UK investors entering Dubai, covering tax, financing, currency dynamics and off-plan positioning."
            background="#f7faff"
            image="https://images.unsplash.com/photo-1655309893829-407c54619f1f?auto=format&fit=crop&q=80&w=2000"
            cta={{ label: 'Request UK Investor Guide', href: '/reports/uk-investors' }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-10 pt-8 pb-16 lg:px-16 lg:pt-8 lg:pb-20">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'UK Investors', href: '/uk-investors' },
            ]}
            className="mb-10"
          />

          <section className="grid gap-8 lg:grid-cols-2">
            <article className="flex flex-col rounded-3xl border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">UK Investor Profile</div>
              <h2 className="mt-3 text-3xl font-serif italic text-brand-navy">Why British investors keep allocating to Dubai.</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-grey">
                UK investors usually combine return logic with long-term optionality. The market can serve income, growth, relocation planning and portfolio diversification in one structure.
              </p>
              <div className="mt-6 space-y-3">
                {ukBuyerDrivers.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-soft-grey/70 px-4 py-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-gold" />
                    <p className="text-sm leading-relaxed text-slate-grey">{item}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="flex flex-col rounded-3xl border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Buying Off-Plan Without Visiting</div>
              <h2 className="mt-3 text-3xl font-serif italic text-brand-navy">A defining behaviour among UK buyers.</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-grey">
                A high share of UK investors reserve off-plan remotely. Success depends on underwriting discipline, not just launch marketing.
              </p>
              <div className="mt-6 space-y-3">
                {offPlanRemoteBuying.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl bg-soft-grey/70 px-4 py-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-gold" />
                    <p className="text-sm leading-relaxed text-slate-grey">{item}</p>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <section className="mt-16 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <article className="flex flex-col rounded-3xl border border-brand-gold/25 bg-[#f7f2e8] p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">British Community in UAE</div>
              <h2 className="mt-3 text-3xl font-serif italic text-brand-navy">Established demand base and stronger liquidity characteristics.</h2>
              <div className="mt-6 space-y-3">
                {britishCommunityEffects.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-brand-gold/10 bg-white/80 px-4 py-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 bg-brand-gold" />
                    <p className="text-sm leading-relaxed text-slate-grey">{item}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="flex flex-col rounded-3xl border border-brand-gold/40 bg-brand-navy p-8 text-white shadow-[0_30px_100px_rgba(10,25,47,0.12)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Exchange-Rate Advantage</div>
              <h2 className="mt-3 text-3xl font-serif italic text-white">Sterling movement can materially reshape entry cost and yield.</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/80">
                Because AED is pegged to USD, GBP volatility affects effective purchase price, sterling rental income and realised return. This creates dual-return potential when property growth and currency movement align.
              </p>
              <button
                type="button"
                onClick={() => setActiveDrawer(currencyDrawer)}
                className="mt-auto self-start pt-6 inline-flex items-center justify-center border border-brand-gold px-5 py-3 text-[10px] font-bold uppercase tracking-[0.26em] text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy"
              >
                View full FX examples
              </button>
            </article>
          </section>

          <section className="mt-16 grid gap-8 xl:grid-cols-2">
            <article className="flex flex-col rounded-3xl border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Tax Considerations</div>
              <p className="mt-4 text-sm leading-relaxed text-slate-grey">
                UK investors should get structure-specific tax guidance before acquisition, including income treatment, deductions, reporting obligations and cross-border planning implications.
              </p>
              <div className="mt-5 space-y-3">
                {taxTopics.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                    <p className="text-sm leading-relaxed text-slate-grey">{item}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate('/deep-dives/tax-for-uk-investors')}
                className="mt-auto self-start pt-6 inline-flex items-center justify-center border border-brand-navy/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-navy transition-all duration-300 hover:bg-brand-navy hover:text-white"
              >
                Open tax topic
              </button>
            </article>

            <article className="flex flex-col rounded-3xl border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Financing for UK Investors</div>
              <p className="mt-4 text-sm leading-relaxed text-slate-grey">
                Most UK buyers optimise acquisition capacity through equity and refinancing strategies, then match financing structure to construction stages and hold-period cashflow.
              </p>
              <div className="mt-5 space-y-3">
                {financingTopics.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <div className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-gold" />
                    <p className="text-sm leading-relaxed text-slate-grey">{item}</p>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => navigate('/deep-dives/uk-investor-financing')}
                className="mt-auto self-start pt-6 inline-flex items-center justify-center border border-brand-navy/15 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-navy transition-all duration-300 hover:bg-brand-navy hover:text-white"
              >
                Open financing topic
              </button>
            </article>
          </section>

          <section className="mt-16 rounded-3xl border border-brand-gold/40 bg-brand-navy p-8 text-white shadow-[0_30px_100px_rgba(10,25,47,0.12)] md:p-10">
            <div className="max-w-4xl">
              <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Investor CTA</div>
              <h2 className="mt-3 text-3xl font-serif italic text-white md:text-4xl">Get UK-specific guidance before making your next reservation.</h2>
              <p className="mt-4 text-sm leading-relaxed text-white/80 md:text-base">
                If you want support on acquisition strategy, financing setup or currency timing, use the channels below and we will align advice to your portfolio and objectives.
              </p>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <button
                type="button"
                onClick={() => openModal('Expert')}
                className="border border-brand-gold px-5 py-5 text-[10px] font-bold uppercase tracking-[0.24em] text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy"
              >
                Request UK Investor Guide
              </button>
              <button
                type="button"
                onClick={() => openModal('Mortgage Advisor')}
                className="border border-white/15 px-5 py-5 text-[10px] font-bold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:border-brand-gold hover:text-brand-gold"
              >
                Ask for Currency Timing Advice
              </button>
            </div>
          </section>

          <InternalLinks type="ukInvestors" className="mt-16" />
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
              id="uk-investors-drawer-body"
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

export default UKInvestors;