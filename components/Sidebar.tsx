
import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { name: 'Market Overview', path: '/' },
  { name: 'SME Insights', path: '/sme-insights' },
  { name: 'Strategic Outlook', path: '/combined' },
  { name: 'Dubai 2040 Plan', path: '/dubai-2040' },
  { name: 'D33 Agenda', path: '/d33-agenda' },
  { name: 'Calculators', path: '/calculators' },
  { name: 'AI Assistant', path: '/ai-assistant' },
];

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-brand-navy text-white h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-50 border-r border-white/5">
      <div className="p-10 border-b border-white/10 shrink-0">
        <div className="mb-2">
            <h1 className="text-2xl font-serif font-bold text-white tracking-tight">DXB EDGE</h1>
        </div>
        <p className="text-[10px] text-brand-gold font-bold tracking-[0.3em] uppercase leading-tight">Investor Intelligence</p>
      </div>

      <nav className="flex-1 px-6 py-10 overflow-y-auto custom-scrollbar">
        <ul className="space-y-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `block text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-300 ${
                    isActive
                      ? 'text-brand-gold pl-2 border-l border-brand-gold'
                      : 'text-white/60 hover:text-white'
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;