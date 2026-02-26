
import React from 'react';
import { useLocation } from 'react-router-dom';

interface CardProps {
  title: string;
  subtitle?: string;
  points: (string | React.ReactNode)[];
  isPremium?: boolean;
  category?: string;
  image?: string;
  onMore?: () => void;
}

const Card: React.FC<CardProps> = ({ title, subtitle, points, isPremium, category, image, onMore }) => {
  const location = useLocation();
  // Identify if we are on the Market Overview (root) page
  const isMarketOverview = location.pathname === '/';

  return (
    <div className={`group bg-white border border-slate-200 p-8 hover:border-brand-navy transition-all duration-500 flex flex-col h-full relative overflow-hidden ${isPremium ? 'border-brand-gold/40' : ''}`}>
      {isPremium && (
        <div className="absolute top-0 right-0 z-10">
          <div className="bg-brand-gold text-white text-[8px] font-bold px-3 py-1 uppercase tracking-[0.2em] shadow-sm">
            Edge Insight
          </div>
        </div>
      )}

      {image && (
        <div className="relative h-32 mb-8 overflow-hidden -mx-8 -mt-8 grayscale brightness-[0.8] contrast-[1.1] hover:grayscale-0 transition-all duration-700">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-brand-navy/30 mix-blend-multiply" />
        </div>
      )}
      
      <div className="flex flex-col mb-8">
        {category && (
          <span className="text-[9px] font-bold text-brand-gold uppercase tracking-[0.25em] mb-2 block">
            {category}
          </span>
        )}
        <h3 className="text-xl font-serif font-bold text-brand-navy mb-2 leading-tight">
          {title}
        </h3>
        {subtitle && <p className="text-[11px] text-slate-grey/60 font-medium italic leading-relaxed">{subtitle}</p>}
      </div>
      
      <ul className="space-y-4 flex-1">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-4">
            <div className="w-1 h-1 bg-brand-gold mt-2 flex-shrink-0" />
            <p className="text-[13px] text-brand-navy/80 leading-relaxed font-medium">
              {point}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-10 pt-6 border-t border-slate-100 flex items-center justify-between">
        {/* Only display the button if we are NOT on Market Overview and have a callback defined */}
        {!isMarketOverview && onMore ? (
          <button 
            onClick={onMore}
            className="text-[10px] font-bold text-brand-navy hover:text-brand-gold uppercase tracking-[0.2em] transition-colors border-b border-transparent hover:border-brand-gold pb-0.5"
          >
            View Full Analysis
          </button>
        ) : (
          <div className="flex-1" />
        )}
        <span className="text-[8px] font-bold text-slate-grey/30 uppercase tracking-[0.1em]">Verified Strategic Data</span>
      </div>
    </div>
  );
};

export default Card;
