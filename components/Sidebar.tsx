
import React from 'react';
import { NavLink } from 'react-router-dom';

interface NavItem {
  name: string;
  path: string;
  children?: NavItem[];
}

const NAV_ITEMS = [
  { name: 'Home', path: '/' },
  { name: 'Market', path: '/market' },
  { name: 'Strategy', path: '/strategy' },
  { name: 'UK Investors', path: '/uk-investors' },
  {
    name: 'Insights Hub',
    path: '/insights',
    children: [
      { name: 'Deep Dives', path: '/deep-dives' },
      { name: 'Communities', path: '/communities' },
      { name: 'Expert Insights', path: '/insights/expert-insights' },
      {
        name: 'Strategic Outlook',
        path: '/insights/strategic-outlook',
        children: [
          { name: 'Dubai 2040 Plan', path: '/insights/strategic-outlook/dubai-2040' },
          { name: 'D33 Agenda', path: '/insights/strategic-outlook/d33-agenda' },
        ],
      },
    ]
  },
  { name: 'Calculators', path: '/calculators' },
  { name: 'AI Assistant', path: '/ai-assistant' },
  { name: 'About Us', path: '/about-us' },
] as NavItem[];

interface SidebarProps {
  isMobile?: boolean;
  onNavigate?: () => void;
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isMobile = false, onNavigate, onClose }) => {
  const renderItems = (items: NavItem[], depth = 0) => {
    const containerClass =
      depth === 0
        ? 'space-y-4'
        : depth === 1
          ? 'mt-3 ml-4 space-y-3 border-l border-white/10 pl-4'
          : 'mt-2 ml-3 space-y-2 border-l border-white/10 pl-3';

    return (
      <ul className={containerClass}>
        {items.map((item) => {
          const activeClass =
            depth === 0
              ? 'text-brand-gold pl-2 border-l border-brand-gold'
              : 'text-brand-gold';

          const idleClass =
            depth === 0
              ? 'text-white/60 hover:text-white'
              : depth === 1
                ? 'text-white/50 hover:text-white'
                : 'text-white/45 hover:text-white';

          const textClass =
            depth === 0
              ? 'text-[11px] tracking-[0.15em]'
              : depth === 1
                ? 'text-[10px] tracking-[0.18em]'
                : 'text-[10px] tracking-[0.12em]';

          return (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end
                onClick={onNavigate}
                className={({ isActive }) =>
                  `block font-bold uppercase transition-all duration-300 ${textClass} ${isActive ? activeClass : idleClass}`
                }
              >
                {item.name}
              </NavLink>

              {item.children && renderItems(item.children, depth + 1)}
            </li>
          );
        })}
      </ul>
    );
  };

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

      <nav className="flex-1 px-6 py-10 overflow-y-auto custom-scrollbar custom-scrollbar-prominent">
        {renderItems(NAV_ITEMS)}
      </nav>
    </div>
  );
};

export default Sidebar;