
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { useCurrency } from '../components/CurrencyContext';
import SEO from '@/components/SEO';

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <strong className="text-brand-navy font-black">{children}</strong>
);

interface MarketOverviewProps {
  openModal: (type: 'Expert' | 'Investment Strategist' | 'Strategic Advisory' | 'Developer' | 'Mortgage Advisor' | 'Services') => void;
}

const MarketOverview: React.FC<MarketOverviewProps> = ({ openModal }) => {
  const navigate = useNavigate();
  const { formatFromAED } = useCurrency();

return (
  <>
    <SEO
      title="DXB Edge – Investor Intelligence for Dubai Real Estate"
      description="Unbiased market intelligence and data-driven guidance enabling investors to confidently capitalise on high-growth real estate opportunities in Dubai."
      path="/"
      type="website"
    />
    <div>
      <section className="h-screen w-full">
        <div className="relative h-full w-full overflow-hidden">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src="/media/landing-cta.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-brand-navy/60" />
          <div className="absolute inset-0 flex flex-col items-start justify-center text-left px-10 md:px-16 lg:px-24">
            <h2 className="text-brand-gold font-serif italic text-[32px] sm:text-[40px] lg:text-[50px] mb-6">
              Insight by DXB Edge
            </h2>
            <p className="text-white/90 text-sm md:text-base max-w-3xl leading-relaxed">
              Unbiased Market intelligence and data driven guidance enabling investors to confidently capitalise on high growth real estate opportunities in Dubai.
              <br />
              <br />
              Human strategy with AI precision.
            </p>
          </div>
        </div>
      </section>
    </div>
    <div className="max-w-7xl mx-auto py-16 px-10 lg:px-16 animate-fadeIn pb-32">
      <div className="w-full h-[400px] bg-brand-navy overflow-hidden mb-16 relative">
          <img 
            src="https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=2000" 
            alt="Dubai Downtown" 
            className="w-full h-full object-cover grayscale brightness-[0.7] contrast-[1.2]"
          />
          <div className="absolute inset-0 bg-brand-navy/40 mix-blend-multiply" />
          <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/40">Sovereign Market Nexus</span>
          </div>
      </div>

      <header className="mb-16 border-l border-brand-gold pl-10">
        <h1 className="text-5xl font-serif font-bold text-brand-navy mb-6 italic">Market Overview</h1>
        <p className="text-xl text-slate-grey max-w-4xl leading-relaxed font-serif italic">
          Grounding Dubai's property investment landscape in verified sovereign data. Analysing economic resilience and structural forces shaping long-term performance.
        </p>
      </header>

      {/* Professional 2x2 Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <Card
          category="Global Benchmarking"
          title="Global Value Data"
          image="https://images.unsplash.com/photo-1651467606797-e1c660cf3fda?auto=format&fit=crop&q=80&w=800"
          points={[
            "Prime Residential: - $400–$650/sqft (AED 1,468–AED 2,386/sqft) (50–75% pricing advantage vs. London, NY, HK).",
            "Commercial Office: - $350–$700/sqft (AED 1,285–AED 2,569/sqft) (materially cheaper than Singapore or Paris).",
            "Ultra-Luxury: - $1,200–$2,500/sqft (AED 4,404–AED 9,175/sqft) (far below Monaco or Hong Kong Peak).",
          ]}
          isPremium
        />
        
        <Card
          category="Supply & Demand"
          title="The Demand-Supply Gap"
          image="https://images.unsplash.com/photo-1579525612525-053cd3e8cbd7?auto=format&fit=crop&q=80&w=800"
          points={[
            "Growth: Population reached 4.0M in 2025 (6.1% growth); projected 4.2M by 2026.",
            "The Gap: 182,500 new residents vs. only 55,400 units delivered in 2025.",
            "Trajectory: Anchored by 5M residents by 2030 and 5.8M by 2040.",
          ]}
        />

        <Card
          category="Sovereign Strategy"
          title="Institutional Growth Targets"
          image="https://images.unsplash.com/photo-1462007895615-c8c073bebcd8?auto=format&fit=crop&q=80&w=800"
          points={[
            "Economic Scale: D33 aims to double the economy to AED 32 trillion by 2033.",
            "FDI Attraction: Target of doubling annual FDI to AED 600 billion.",
            "Foreign Trade: 80% expansion target to AED 256 billion.",
            "Urban Structure: Development strictly focused on six major urban centres within controlled boundaries.",
          ]}
        />

        <Card
          category="Market Performance"
          title="Transaction & Yield Health"
          image="https://images.unsplash.com/photo-1688671525781-d9447cf1abd2?auto=format&fit=crop&q=80&w=800"
          points={[
            `Volume: ${formatFromAED(917000000000, { maximumFractionDigits: 0 })} in total transactions (2025) (20% YoY increase).`,
            `Yields: Apartment yields at 7.0–7.3%; Villas at 5%.`,
            `Stability: Transitioning into a stable, mature phase supported by a high share of cash buyers.`,
          ]}
        />
      </div>

    </div>
  </>
);
};

export default MarketOverview;
