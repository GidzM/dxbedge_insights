import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SEO from '@/components/SEO';

type LeadCaptureType = 'Expert' | 'Investment Strategist' | 'Strategic Advisory' | 'Developer' | 'Mortgage Advisor' | 'Services';

interface ComingSoonProps {
  title: string;
  description: string;
  openModal: (type: LeadCaptureType) => void;
  ctaType?: LeadCaptureType;
  backPath?: string;
  backLabel?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  title,
  description,
  openModal,
  ctaType = 'Expert',
  backPath = '/market',
  backLabel = 'Back to Market',
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <SEO
        title={`${title} | DXB Edge`}
        description={description}
        path={location.pathname}
        type="article"
        schemaType="WebPage"
        image="/media/dxb-edge-default.jpg"
        imageAlt={title}
      />

      <div className="bg-[radial-gradient(circle_at_top,_rgba(201,168,106,0.16),_transparent_38%),linear-gradient(180deg,_#f8f9fa_0%,_#ffffff_42%,_#f7f4ee_100%)] px-10 py-16 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/80 bg-white p-10 shadow-[0_30px_100px_rgba(10,25,47,0.08)]">
          <div className="text-[10px] font-bold uppercase tracking-[0.28em] text-brand-gold">Coming Soon</div>
          <h1 className="mt-4 text-4xl font-serif italic text-brand-navy">{title}</h1>
          <p className="mt-6 text-base leading-relaxed text-slate-grey">{description}</p>
          <p className="mt-4 text-sm leading-relaxed text-slate-grey/90">
            This topic is already linked for SEO depth and will be expanded into a full page. Until then, use the advisory channel below if you need a tailored answer now.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate(backPath)}
              className="inline-flex items-center justify-center border border-brand-navy bg-brand-navy px-6 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-white transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy"
            >
              {backLabel}
            </button>
            <button
              type="button"
              onClick={() => openModal(ctaType)}
              className="inline-flex items-center justify-center border border-brand-gold px-6 py-3 text-[11px] font-bold uppercase tracking-[0.24em] text-brand-gold transition-all duration-300 hover:bg-brand-gold hover:text-brand-navy"
            >
              Request tailored guidance
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ComingSoon;