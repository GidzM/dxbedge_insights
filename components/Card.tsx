
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
    <div className={`group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col border border-slate-100 ${stretch ? 'h-full' : 'h-auto self-start'}`}>
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
      
      <div className={`${isCompact ? 'p-5' : 'p-8'} flex-1 flex flex-col`}>
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
            className="w-full py-3 border border-brand-navy/10 text-brand-navy text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-brand-navy hover:text-white transition-all duration-300 rounded-lg"
          >
            View Full Analysis
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;