
import React from 'react';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { name: 'Home', path: '/' },
  { name: 'Expert Insights', path: '/expert-insights' },
  {
    name: 'Strategic Outlook',
    path: '/combined',
    children: [
      { name: 'Dubai 2040 Plan', path: '/dubai-2040' },
      { name: 'D33 Agenda', path: '/d33-agenda' }
    ]
  },
  { name: 'Calculators', path: '/calculators' },
  { name: 'AI Assistant', path: '/ai-assistant' },
];

interface SidebarProps {
  isMobile?: boolean;
  onNavigate?: () => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, onNavigate, onClose }) => {
  return (
    <div className={`bg-brand-navy text-white flex flex-col border-r border-white/5 ${isMobile ? 'w-[85vw] max-w-80 h-full shadow-2xl' : 'w-64 h-screen fixed left-0 top-0 shadow-2xl z-50'}`}>
      <div className="p-10 border-b border-white/10 shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-2">
                <h1 className="text-2xl font-serif font-bold text-white tracking-tight">DXB EDGE</h1>
            </div>
            <p className="text-[10px] text-brand-gold font-bold tracking-[0.3em] uppercase leading-tight">Investor Intelligence</p>
          </div>
          {isMobile && onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="inline-flex items-center justify-center w-8 h-8 border border-white/20 rounded-md text-white/80 hover:text-white hover:border-white/40 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 px-6 py-10 overflow-y-auto custom-scrollbar">
        <ul className="space-y-4">
          {NAV_ITEMS.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onNavigate}
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

              {item.children && (
                <ul className="mt-3 ml-4 space-y-3 border-l border-white/10 pl-4">
                  {item.children.map((child) => (
                    <li key={child.path}>
                      <NavLink
                        to={child.path}
                        onClick={onNavigate}
                        className={({ isActive }) =>
                          `block text-[10px] font-bold uppercase tracking-[0.18em] transition-all duration-300 ${
                            isActive
                              ? 'text-brand-gold'
                              : 'text-white/50 hover:text-white'
                          }`
                        }
                      >
                        {child.name}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;