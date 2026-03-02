
import React from 'react';
import { useLocation } from 'react-router-dom';

interface CardProps {
  title: string;
  category: string;
  points: string[];
  image: string;
  isPremium?: boolean;
  onMore?: () => void; // This is now optional
}

const Card: React.FC<CardProps> = ({ title, category, points, image, isPremium, onMore }) => {
  return (
    <div className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col h-full border border-slate-100">
      <div className="relative h-48 overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/80 to-transparent" />
          {isPremium && (
            <span className="absolute top-4 right-4 bg-brand-gold text-brand-navy text-[9px] font-black px-2 py-1 rounded tracking-tighter uppercase">
              Premium Insight
            </span>
          )}
        <div className="absolute bottom-4 left-6">
            <span className="text-[10px] font-bold text-brand-gold uppercase tracking-[0.2em]">{category}</span>
          <h3 className="text-xl font-serif font-bold text-white italic">{title}</h3>
        </div>
      </div>
      
      <div className="p-8 flex-1 flex flex-col">
        <div className="space-y-4 mb-8 flex-1">
          {points.map((point, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="w-1 h-1 bg-brand-gold mt-2 shrink-0 rounded-full" />
              <p className="text-slate-grey text-[13px] leading-relaxed font-medium">{point}</p>
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