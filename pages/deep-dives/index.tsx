import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import HeroBanner from '../../components/HeroBanner';
import SEO from '../../components/SEO';

const DeepDivesIndex: React.FC = () => {
  return (
    <>
      <SEO
        title="Deep Dives | DXB Edge Insights"
        description="Long-form, fundamentals-driven Dubai property research across Market, Strategy, and UK Investor themes."
        path="/deep-dives"
        type="article"
        schemaType="CollectionPage"
        image="/media/dxb-edge-default.jpg"
        imageAlt="DXB Edge deep dives index"
        keywords={[
          'Dubai property deep dives',
          'Dubai market research',
          'Dubai investment strategy research',
          'UK investors Dubai research',
        ]}
      />

      <div className="bg-[radial-gradient(circle_at_top,_rgba(201,168,106,0.14),_transparent_36%),linear-gradient(180deg,_#f8f9fa_0%,_#ffffff_45%,_#f7f4ee_100%)]">
        <div className="mx-auto max-w-7xl px-10 pt-16 pb-8 lg:px-16 lg:pt-20 lg:pb-8">
          <HeroBanner
            title="Deep Dives"
            subtitle="Long-form research for serious investors seeking deeper context on Dubai market behaviour, strategy execution and UK investor positioning."
            background="#eef8f4"
            image="https://images.unsplash.com/photo-1655309893829-407c54619f1f?auto=format&fit=crop&q=80&w=2000"
            cta={{ label: 'Explore Core Market Pillar', href: '/market' }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-10 pt-8 pb-16 lg:px-16 lg:pt-8 lg:pb-20">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Insights', href: '/insights' },
              { label: 'Deep Dives', href: '/deep-dives' },
            ]}
            className="mb-8"
          />

          <section className="mt-12 grid gap-8 lg:grid-cols-3">
            <article className="rounded-3xl border border-white/80 bg-white p-7 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <h2 className="text-2xl font-serif italic text-brand-navy">Market Deep Dives</h2>
              <ul className="mt-5 space-y-3 text-sm text-slate-grey">
                <li><Link to="/deep-dives/dubai-property-cycle-explained" className="hover:text-brand-gold">Dubai Property Cycle Explained</Link></li>
                <li><Link to="/deep-dives/dubai-rental-market-trends" className="hover:text-brand-gold">Dubai Rental Market Trends</Link></li>
                <li><Link to="/deep-dives/dubai-price-trends" className="hover:text-brand-gold">Dubai Price Trends</Link></li>
                <li><Link to="/deep-dives/dubai-supply-pipeline" className="hover:text-brand-gold">Dubai Supply Pipeline</Link></li>
              </ul>
            </article>

            <article className="rounded-3xl border border-white/80 bg-white p-7 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <h2 className="text-2xl font-serif italic text-brand-navy">Investment Strategy Deep Dives</h2>
              <ul className="mt-5 space-y-3 text-sm text-slate-grey">
                <li><Link to="/deep-dives/off-plan-vs-ready" className="hover:text-brand-gold">Off-Plan vs Ready</Link></li>
                <li><Link to="/deep-dives/off-plan-risk-framework" className="hover:text-brand-gold">Off-Plan Risk Framework</Link></li>
                <li><Link to="/deep-dives/cashflow-management" className="hover:text-brand-gold">Cashflow Management</Link></li>
                <li><Link to="/deep-dives/exit-strategy" className="hover:text-brand-gold">Exit Strategy</Link></li>
              </ul>
            </article>

            <article className="rounded-3xl border border-white/80 bg-white p-7 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <h2 className="text-2xl font-serif italic text-brand-navy">UK Investor Deep Dives</h2>
              <ul className="mt-5 space-y-3 text-sm text-slate-grey">
                <li><Link to="/deep-dives/dubai-vs-uk-property" className="hover:text-brand-gold">Dubai vs UK Property Market</Link></li>
                <li><Link to="/deep-dives/exchange-rate-advantage" className="hover:text-brand-gold">Exchange-Rate Advantage</Link></li>
                <li><Link to="/deep-dives/tax-for-uk-investors" className="hover:text-brand-gold">Tax for UK Investors</Link></li>
                <li><Link to="/deep-dives/uk-investor-financing" className="hover:text-brand-gold">UK Investor Financing</Link></li>
              </ul>
            </article>
          </section>

          <section className="mt-12 grid gap-8 lg:grid-cols-2">
            <article className="rounded-3xl border border-brand-gold/25 bg-[#f7f2e8] p-7 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <h2 className="text-2xl font-serif italic text-brand-navy">Coming Soon</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-grey">
                More Deep Dives will be added as we expand our research library, including community-specific analysis, developer comparisons, legal frameworks and financing strategies.
              </p>
            </article>

            <article className="rounded-3xl border border-white/80 bg-white p-7 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <h2 className="text-2xl font-serif italic text-brand-navy">Explore Pillars</h2>
              <ul className="mt-5 space-y-3 text-sm text-slate-grey">
                <li><Link to="/market" className="hover:text-brand-gold">Dubai Property Market</Link></li>
                <li><Link to="/strategy" className="hover:text-brand-gold">Investment Strategy</Link></li>
                <li><Link to="/uk-investors" className="hover:text-brand-gold">UK Investors</Link></li>
              </ul>
            </article>
          </section>
        </div>
      </div>
    </>
  );
};

export default DeepDivesIndex;