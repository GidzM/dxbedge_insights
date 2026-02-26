
import React from 'react';

const TICKER_ITEMS = [
  { label: "GLOBAL VALUE", value: "Prime Residential 50-75% discount vs London/NY" },
  { label: "DEMAND GAP", value: "182.5k New Residents vs 55.4k Units Delivered (2025)" },
  { label: "YIELDS", value: "Apartments 7.0-7.3% | Villas ~5%" },
  { label: "D33 GOAL", value: "Doubling Economy to AED 32 Trillion by 2033" },
  { label: "POPULATION", value: "+6.1% Growth | Target 5.8M by 2040" },
  { label: "FDI TARGET", value: "Doubling to AED 60 Billion annually" },
  { label: "2025 GDP GROWTH", value: ">4%" },
  { label: "DUBAI", value: "3rd Safest City in the World" }
];

const DataTicker: React.FC = () => {
  // Triple the list to ensure there's always content filling the screen 
  // and the translateX(-50%) loop remains seamless.
  const list = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];

  return (
    <div className="w-full bg-brand-navy border-b border-white/5 overflow-hidden py-3 shrink-0 marquee-container relative z-30">
      <div className="flex animate-marquee whitespace-nowrap marquee-content w-max">
        {list.map((item, idx) => (
          <div key={idx} className="flex items-center px-12 shrink-0">
            <span className="text-white text-[11px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
              {item.label}:
            </span>
            <span className="text-[#00E676] text-[11px] font-black tracking-wide ml-2 uppercase whitespace-nowrap">
              {item.value}
            </span>
            <span className="text-white/20 ml-12 text-[11px]">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataTicker;
