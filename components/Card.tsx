
import React from 'react';
import { useLocation } from 'react-router-dom';

interface CardProps {
  title: string;
  category: string;
  points: string[];
  image: string;
  isPremium?: boolean;
  onMore?: () => void; // This is now optional
  density?: 'default' | 'compact';
  stretch?: boolean;
}

const Card: React.FC<CardProps> = ({ title, category, points, image, isPremium, onMore, density = 'default', stretch = true }) => {
  const isCompact = density === 'compact';

  return (
    <div className={`group overflow-hidden rounded-xl border border-sand-neutral bg-skyline-grey shadow-[0_8px_24px_rgba(0,0,0,0.05)] transition-all duration-500 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] flex flex-col ${stretch ? 'h-full' : 'h-auto self-start'}`}>
      <div className={`relative overflow-hidden ${isCompact ? 'h-36' : 'h-48'}`}>
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
          {isPremium && (
            <span className={`absolute ${isCompact ? 'top-3 right-3' : 'top-4 right-4'} bg-brand-gold text-brand-navy text-[9px] font-black px-2 py-1 rounded tracking-tighter uppercase`}>
              Premium Insight
            </span>
          )}
        <div className={`absolute ${isCompact ? 'bottom-3 left-4' : 'bottom-4 left-6'}`}>
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em]">{category}</span>
          <h3 className={`${isCompact ? 'text-lg' : 'text-xl'} font-serif font-bold text-white italic`}>{title}</h3>
        </div>
      </div>
      
      <div className={`${isCompact ? 'p-5' : 'p-6'} flex-1 flex flex-col`}>
        <div className={`${isCompact ? 'space-y-3 mb-5' : 'space-y-4 mb-8'} flex-1`}>
          {points.map((point, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="w-1 h-1 bg-brand-gold mt-2 shrink-0 rounded-full" />
              <p className={`${isCompact ? 'text-[12px]' : 'text-[13px]'} text-slate-grey leading-relaxed font-medium`}>{point}</p>
            </div>
          ))}
        </div>

        {/* FIX: Only render the button if onMore is provided */}
        {onMore && (
          <button 
            onClick={onMore}
            className="cta-secondary mt-6 w-full text-sm"
          >
            View Full Analysis
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;