import React from 'react';
import { Link } from 'react-router-dom';

type InternalLinksType = 'market' | 'strategy' | 'ukInvestors';

interface InternalLinkItem {
  label: string;
  href: string;
}

interface InternalLinksConfig {
  title: string;
  links: InternalLinkItem[];
  pillars: InternalLinkItem[];
}

interface InternalLinksProps {
  type: InternalLinksType;
  className?: string;
}

const linkMap: Record<InternalLinksType, InternalLinksConfig> = {
  market: {
    title: 'Related Insights & Deep Dives',
    links: [
      { label: 'Dubai Property Cycle Explained', href: '/deep-dives/dubai-property-cycle-explained' },
      { label: 'Dubai Rental Market Trends', href: '/deep-dives/dubai-rental-market-trends' },
      { label: 'Dubai Price Trends', href: '/deep-dives/dubai-price-trends' },
      { label: 'Dubai Supply Pipeline', href: '/deep-dives/dubai-supply-pipeline' },
    ],
    pillars: [
      { label: 'Investment Strategy', href: '/strategy' },
      { label: 'UK Investors', href: '/uk-investors' },
    ],
  },
  strategy: {
    title: 'Related Insights & Deep Dives',
    links: [
      { label: 'Off-Plan vs Ready', href: '/deep-dives/off-plan-vs-ready' },
      { label: 'Off-Plan Risk Framework', href: '/deep-dives/off-plan-risk-framework' },
      { label: 'Cashflow Management', href: '/deep-dives/cashflow-management' },
      { label: 'Exit Strategy', href: '/deep-dives/exit-strategy' },
    ],
    pillars: [
      { label: 'Dubai Property Market', href: '/market' },
      { label: 'UK Investors', href: '/uk-investors' },
    ],
  },
  ukInvestors: {
    title: 'Related Insights & Deep Dives',
    links: [
      { label: 'Dubai vs UK Property Market', href: '/deep-dives/dubai-vs-uk-property' },
      { label: 'Exchange-Rate Advantage', href: '/deep-dives/exchange-rate-advantage' },
      { label: 'Tax for UK Investors', href: '/deep-dives/tax-for-uk-investors' },
      { label: 'UK Investor Financing', href: '/deep-dives/uk-investor-financing' },
    ],
    pillars: [
      { label: 'Dubai Property Market', href: '/market' },
      { label: 'Investment Strategy', href: '/strategy' },
    ],
  },
};

const InternalLinks: React.FC<InternalLinksProps> = ({ type, className = '' }) => {
  const data = linkMap[type];

  if (!data) {
    return null;
  }

  return (
    <section className={`rounded-3xl border border-white/80 bg-white p-8 shadow-[0_20px_60px_rgba(10,25,47,0.06)] ${className}`}>
      <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">{data.title}</div>
      <div className="mt-6 grid gap-8 lg:grid-cols-2">
        <div>
          <h3 className="text-xl font-serif italic text-brand-navy">{data.title}</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-grey">
            {data.links.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="hover:text-brand-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-serif italic text-brand-navy">Related Pillars</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-grey">
            {data.pillars.map((link) => (
              <li key={link.href}>
                <Link to={link.href} className="hover:text-brand-gold">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default InternalLinks;