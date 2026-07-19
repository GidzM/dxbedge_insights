import React from 'react';
import SEO from '../components/SEO';

const SHOW_FOUNDER_PHOTO_PLACEHOLDERS = false;

const AboutUs: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto py-16 px-6 md:px-10 lg:px-16 animate-fadeIn">
      <SEO
        title="About DXB Edge | Our Story"
        description="Meet Georgina and Gideon, the siblings behind DXB Edge Insights, and learn why we built an independent, research-driven platform for long-term Dubai real-estate investors."
        path="/about-us"
        type="website"
        schemaType="WebPage"
        image="/media/dxb-edge-default.jpg"
        imageAlt="DXB Edge investor intelligence"
      />

      <header className="mb-12 border-l border-brand-gold pl-6 md:pl-10">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-navy mb-4 italic">
          About Us
        </h1>
        <p className="text-sm uppercase tracking-[0.3em] text-brand-gold/80 mb-2">
          Our Story
        </p>
        <p className="text-lg text-slate-grey max-w-4xl leading-relaxed">
          Two siblings with different strengths, working together to bring clarity to one of the world's most dynamic property markets.
        </p>
      </header>

      <section className="mb-10 rounded-sm border border-brand-gold/30 bg-amber-50/40 p-6 md:p-8">
        <h2 className="text-xl font-serif italic text-brand-navy mb-4">Why We Built DXB Edge Insights</h2>
        <p className="text-slate-800 leading-relaxed mb-4">
          We're Georgina and Gideon, siblings who decided to combine our strengths to create something we felt was missing in Dubai's real estate space: clear, independent, research-driven insight for investors who want long-term value, not hype.
        </p>
        <p className="text-slate-800 leading-relaxed mb-4">
          Dubai's property market is full of opportunity, but it's also full of noise. We built DXB Edge Insights to cut through that noise and give investors a place where they can understand market trends, assess risk, and make confident decisions based on analysis rather than speculation.
        </p>
        <p className="text-slate-800 leading-relaxed">
          This platform is our shared vision, shaped by Georgina's market expertise and Gideon's technical foundation.
        </p>
      </section>

      <div
        className={SHOW_FOUNDER_PHOTO_PLACEHOLDERS ? 'mb-10' : 'hidden'}
        aria-hidden={SHOW_FOUNDER_PHOTO_PLACEHOLDERS ? undefined : 'true'}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <figure className="border border-brand-gold/30 bg-white p-4">
            <div className="h-64 w-full border border-dashed border-brand-gold/50 bg-amber-50/50" />
            <figcaption className="mt-3 text-[11px] uppercase tracking-[0.18em] text-brand-navy/60">
              Photo Placeholder 1: Founders portrait
            </figcaption>
          </figure>

          <figure className="border border-brand-gold/30 bg-white p-4">
            <div className="h-64 w-full border border-dashed border-brand-gold/50 bg-amber-50/50" />
            <figcaption className="mt-3 text-[11px] uppercase tracking-[0.18em] text-brand-navy/60">
              Photo Placeholder 2: Team or workspace
            </figcaption>
          </figure>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        <section className="border border-slate-200 bg-white p-6 md:p-8">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-gold mb-4">Georgina's Journey Into Dubai Real Estate</h3>
          <p className="text-slate-700 leading-relaxed text-sm mb-4">
            Georgina's path into Dubai's property market began after years in business transformation and strategic growth. That background built a deep understanding of how markets behave, how value is created, and how to identify opportunity early.
          </p>
          <p className="text-slate-700 leading-relaxed text-sm mb-4">
            Over the past four years, she has immersed herself in residential, commercial, ready, and off-plan sectors, studying cycles, analysing projects, and tracking how the city evolves.
          </p>
          <p className="text-slate-700 leading-relaxed text-sm">
            The pattern she kept seeing was clear: investors were surrounded by sales-driven narratives, conflicting opinions, and short-term speculation. DXB Edge Insights exists to provide independent, commercially minded insight grounded in research and long-term thinking.
          </p>
        </section>

        <section className="border border-slate-200 bg-white p-6 md:p-8">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-brand-gold mb-4">Gideon's Role in Bringing the Vision to Life</h3>
          <p className="text-slate-700 leading-relaxed text-sm mb-4">
            Gideon's background is in DevOps, full-stack development, and building systems that are secure, reliable, and designed to scale.
          </p>
          <p className="text-slate-700 leading-relaxed text-sm mb-4">
            When Georgina shared the vision for a research-driven Dubai property intelligence platform, he built the infrastructure, automation, and technical foundation that delivers analysis with speed, stability, and accuracy.
          </p>
          <p className="text-slate-700 leading-relaxed text-sm">
            His role is to ensure the platform is engineered properly so Georgina's insights reach investors clearly and consistently. The technology is designed to be invisible, quietly enabling better investment decisions.
          </p>
        </section>
      </div>

      <section className="mb-10 rounded-sm border border-slate-200 bg-white p-6 md:p-8">
        <h2 className="text-xl font-serif italic text-brand-navy mb-4">Our Mission</h2>
        <ul className="list-disc pl-6 text-slate-800 leading-relaxed space-y-2">
          <li>Independent, research-driven analysis.</li>
          <li>Clear explanations of Dubai property trends.</li>
          <li>Commercially minded guidance.</li>
          <li>Long-term value thinking.</li>
          <li>Insights free from hype or sales pressure.</li>
        </ul>
        <p className="text-slate-700 leading-relaxed mt-5">
          Our goal is simple: help investors make informed decisions with confidence.
        </p>
      </section>

      <section className="mb-10 rounded-sm border border-slate-200 bg-white p-6 md:p-8">
        <h2 className="text-xl font-serif italic text-brand-navy mb-4">What You Can Expect</h2>
        <ul className="list-disc pl-6 text-slate-800 leading-relaxed space-y-2">
          <li>Market insights grounded in real data.</li>
          <li>Analysis across residential, commercial, ready, and off-plan sectors.</li>
          <li>Long-term investment perspectives.</li>
          <li>Research-driven commentary.</li>
          <li>Tools and content designed to support smarter decision-making.</li>
        </ul>
        <p className="text-slate-700 leading-relaxed mt-5">
          If you want to explore further, you can continue with Latest Insights, Market Trends, Investment Guides, and Research Reports.
        </p>
      </section>

      <section className="rounded-sm border border-brand-gold/50 bg-gradient-to-r from-brand-navy to-[#3f2f1f] p-6 md:p-8">
        <h2 className="text-2xl font-serif italic text-brand-gold mb-3">Human Strategy with AI Precision</h2>
        <p className="text-white/90 leading-relaxed max-w-4xl">
          Technology helps us process and structure information faster, but judgement remains human. DXB Edge uses AI-assisted workflows to improve speed and consistency while keeping interpretation, context, and strategic direction grounded in expert oversight.
        </p>
      </section>
    </div>
  );
};

export default AboutUs;
