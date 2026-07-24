import React from 'react';
import { Link } from 'react-router-dom';
import Breadcrumbs from '../../components/Breadcrumbs';
import HeroBanner from '../../components/HeroBanner';
import SEO from '../../components/SEO';

const CommunitiesIndex: React.FC = () => {
  return (
    <>
      <SEO
        title="Dubai Communities | Investment Areas & Location Guides"
        description="Fundamentals-driven guides to Dubai's major and emerging investment communities, including supply, demand, tenant profile and long-term stability context."
        path="/communities"
        type="article"
        schemaType="CollectionPage"
        image="/media/dxb-edge-default.jpg"
        imageAlt="Dubai communities and investment areas"
        keywords={[
          'Dubai communities',
          'Dubai investment areas',
          'Dubai Marina investment',
          'Downtown Dubai investment',
          'Business Bay investment',
          'JVC investment',
        ]}
      />

      <div className="bg-[radial-gradient(circle_at_top,_rgba(201,168,106,0.14),_transparent_36%),linear-gradient(180deg,_#f8f9fa_0%,_#ffffff_45%,_#f7f4ee_100%)]">
        <div className="mx-auto max-w-7xl px-10 pt-16 pb-8 lg:px-16 lg:pt-20 lg:pb-8">
          <HeroBanner
            title="Dubai Communities & Investment Areas"
            subtitle="Area-by-area guidance on community performance, rental demand, supply pipelines and long-term positioning for Dubai investors."
            background="#fff5ee"
            image="https://images.unsplash.com/photo-1655309893829-407c54619f1f?auto=format&fit=crop&q=80&w=2000"
            cta={{ label: 'View Strategic Outlook', href: '/insights/strategic-outlook' }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-10 pt-8 pb-16 lg:px-16 lg:pt-8 lg:pb-20">
          <Breadcrumbs
            items={[
              { label: 'Home', href: '/' },
              { label: 'Insights', href: '/insights' },
              { label: 'Communities', href: '/communities' },
            ]}
            className="mb-8"
          />

          <section className="mt-12 grid gap-8 lg:grid-cols-2">
            <article className="rounded-3xl border border-white/80 bg-white p-7 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <h2 className="text-2xl font-serif italic text-brand-navy">Major Investment Communities</h2>
              <ul className="mt-5 space-y-3 text-sm text-slate-grey">
                <li><Link to="/communities/dubai-marina" className="hover:text-brand-gold">Dubai Marina</Link></li>
                <li><Link to="/communities/downtown-dubai" className="hover:text-brand-gold">Downtown Dubai</Link></li>
                <li><Link to="/communities/business-bay" className="hover:text-brand-gold">Business Bay</Link></li>
                <li><Link to="/communities/jvc" className="hover:text-brand-gold">Jumeirah Village Circle (JVC)</Link></li>
                <li><Link to="/communities/dubai-hills" className="hover:text-brand-gold">Dubai Hills Estate</Link></li>
                <li><Link to="/communities/palm-jumeirah" className="hover:text-brand-gold">Palm Jumeirah</Link></li>
              </ul>
            </article>

            <article className="rounded-3xl border border-white/80 bg-white p-7 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <h2 className="text-2xl font-serif italic text-brand-navy">Emerging Communities</h2>
              <ul className="mt-5 space-y-3 text-sm text-slate-grey">
                <li><Link to="/communities/dubai-south" className="hover:text-brand-gold">Dubai South</Link></li>
                <li><Link to="/communities/meydan" className="hover:text-brand-gold">Meydan</Link></li>
                <li><Link to="/communities/arjan" className="hover:text-brand-gold">Arjan</Link></li>
                <li><Link to="/communities/town-square" className="hover:text-brand-gold">Town Square</Link></li>
              </ul>
            </article>
          </section>

          <section className="mt-12 grid gap-8 lg:grid-cols-2">
            <article className="rounded-3xl border border-brand-gold/25 bg-[#f7f2e8] p-7 shadow-[0_20px_60px_rgba(10,25,47,0.06)]">
              <h2 className="text-2xl font-serif italic text-brand-navy">Coming Soon</h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-grey">
                Each community page will include rental yield trends, pricing behaviour, supply pipeline, tenant demographics, long-term stability indicators and investor implications.
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

export default CommunitiesIndex;