
import React from 'react';
import Card from '../components/Card';

const Highlight = ({ children }: { children: React.ReactNode }) => (
  <strong className="text-brand-navy font-black">{children}</strong>
);

const MarketOverview: React.FC = () => {
  return (
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
          Grounding Dubai's property landscape in verified sovereign data. Analyzing economic resilience and structural forces shaping long-term performance.
        </p>
      </header>

      {/* Professional 2x2 Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        <Card
          category="Global Benchmarking"
          title="Global Value Delta"
          image="https://images.unsplash.com/photo-1528702748617-c64d49f918af?auto=format&fit=crop&q=80&w=800"
          points={[
            <>Prime Residential: <Highlight>$400–$650/sqft</Highlight> (<Highlight>50–75%</Highlight> discount vs. London, NY, HK).</>,
            <>Commercial Office: <Highlight>$350–$700/sqft</Highlight> (materially cheaper than Singapore or Paris).</>,
            <>Ultra-Luxury: <Highlight>$1,200–$2,500/sqft</Highlight> (far below Monaco or Hong Kong Peak).</>,
            <span className="text-[10px] opacity-60 uppercase font-black tracking-widest">[Source: SME Strategic Insights]</span>
          ]}
          isPremium
        />
        
        <Card
          category="Supply & Demand"
          title="The Demand-Supply Gap"
          image="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=800"
          points={[
            <>Growth: Population reached <Highlight>4.0M</Highlight> in 2025 (<Highlight>6.1%</Highlight> growth); projected <Highlight>4.2M</Highlight> by 2026.</>,
            <>The Gap: <Highlight>182,500</Highlight> new residents vs. only <Highlight>55,400</Highlight> units delivered in 2025.</>,
            <>Trajectory: Anchored by <Highlight>5M</Highlight> residents by 2030 and <Highlight>5.8M</Highlight> by 2040.</>,
            <span className="text-[10px] opacity-60 uppercase font-black tracking-widest">[Source: SME Strategic Insights]</span>
          ]}
        />

        <Card
          category="Sovereign Strategy"
          title="Institutional Growth Targets"
          image="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
          points={[
            <>Economic Scale: D33 aims to double the economy to <Highlight>AED 32 Trillion</Highlight> by 2033.</>,
            <>FDI Attraction: Target of doubling annual FDI to <Highlight>AED 60 Billion</Highlight>.</>,
            <>Foreign Trade: <Highlight>80%</Highlight> expansion target to <Highlight>AED 25.6 Trillion</Highlight>.</>,
            <>Urban Structure: Development strictly focused on six major urban centres within controlled boundaries.</>,
            <span className="text-[10px] opacity-60 uppercase font-black tracking-widest">[Source: Combined Strategy]</span>
          ]}
        />

        <Card
          category="Market Performance"
          title="Transaction & Yield Health"
          image="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800"
          points={[
            <>Volume: <Highlight>AED 917B</Highlight> in total transactions (<Highlight>20% YoY</Highlight> increase).</>,
            <>Yields: Apartment yields at <Highlight>7.0–7.3%</Highlight>; Villas at <Highlight>~5%</Highlight>.</>,
            <>Stability: Transitioning into a stable, mature phase supported by a high share of <Highlight>cash buyers</Highlight>.</>,
            <span className="text-[10px] opacity-60 uppercase font-black tracking-widest">[Source: SME Strategic Insights]</span>
          ]}
        />
      </div>

      <div className="mt-24 bg-brand-navy p-16 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale" alt="Background" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-serif font-bold mb-6 italic">Strategic Advisory</h2>
          <p className="text-brand-gold/70 text-sm uppercase tracking-[0.2em] mb-10 max-w-2xl mx-auto">Connect with a specialized strategist to receive a tailored portfolio analysis.</p>
          <button className="border border-brand-gold text-brand-gold px-12 py-5 text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-brand-gold hover:text-brand-navy transition-all duration-500">
              Initialize Connection
          </button>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;
