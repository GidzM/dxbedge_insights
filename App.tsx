
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DataTicker from './components/DataTicker';
import MarketOverview from './pages/MarketOverview';
import Dubai2040 from './pages/Dubai2040';
import D33Agenda from './pages/D33Agenda';
import CombinedStrategy from './pages/CombinedStrategy';
import SMEInsights from './pages/SMEInsights';
import Calculators from './pages/Calculators';
import AIAssistant from './pages/AIAssistant';
import LeadCaptureModal from './components/LeadCaptureModal';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const scrollContainer = document.querySelector('main');
    if (scrollContainer) scrollContainer.scrollTo(0, 0);
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  const [modalState, setModalState] = useState<{isOpen: boolean, type: 'Expert' | 'Investment Strategist' | 'Strategic Advisory' | 'Developer' | 'Mortgage Advisor' | 'Services'}>({
    isOpen: false,
    type: 'Expert'
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const openModal = (type: 'Expert' | 'Investment Strategist' | 'Strategic Advisory' | 'Developer' | 'Mortgage Advisor' | 'Services') => {
    setModalState({ isOpen: true, type });
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex min-h-screen bg-soft-grey font-sans selection:bg-brand-gold selection:text-brand-navy">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[70] flex">
            <button
              type="button"
              aria-label="Close navigation"
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <div className="relative z-10 h-full">
              <Sidebar
                isMobile
                onNavigate={() => setMobileMenuOpen(false)}
                onClose={() => setMobileMenuOpen(false)}
              />
            </div>
          </div>
        )}

        <main className="flex-1 lg:ml-64 min-h-screen flex flex-col overflow-y-auto overflow-x-hidden">
          <div className="lg:hidden sticky top-0 z-50 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-sm font-serif font-bold text-brand-navy tracking-tight">DXB EDGE</h1>
              <p className="text-[8px] text-brand-gold font-bold tracking-[0.25em] uppercase">Investor Intelligence</p>
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center w-10 h-10 border border-slate-200 rounded-md text-brand-navy"
              aria-label="Open navigation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Header standard desktop */}
          <Routes>
            <Route path="/ai-assistant" element={null} />
            <Route path="*" element={
              <div className="bg-white border-b border-slate-200 px-10 py-4 flex items-center justify-end gap-10 hidden lg:flex sticky top-0 z-40 shrink-0">
                 <button onClick={() => openModal('Expert')} className="text-[9px] font-bold text-brand-navy hover:text-brand-gold transition-colors uppercase tracking-[0.2em]">Connect to Investment Strategist</button>
                 <button onClick={() => openModal('Mortgage Advisor')} className="text-[9px] font-bold text-brand-navy hover:text-brand-gold transition-colors uppercase tracking-[0.2em]">Connect to Finance Expert</button>
                 <div className="w-px h-3 bg-slate-200 mx-2" />
              </div>
            } />
          </Routes>

          {/* Global Data Ticker */}
          <DataTicker />

          <div className="flex-1">
            <Routes>
              <Route path="/" element={<MarketOverview openModal={openModal} />} />
              <Route path="/expert-insights" element={<SMEInsights />} />
              <Route path="/combined" element={<CombinedStrategy />} />
              <Route path="/dubai-2040" element={<Dubai2040 />} />
              <Route path="/d33-agenda" element={<D33Agenda />} />
              <Route path="/calculators" element={<Calculators openModal={openModal} />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
            </Routes>
          </div>

          <Routes>
            <Route path="/ai-assistant" element={null} />
            <Route path="*" element={
              <footer className="bg-brand-navy py-12 px-10 text-white">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-12">
                    <div className="w-full lg:max-w-4xl xl:max-w-5xl">
                        <h3 className="font-sans font-bold text-white text-2xl mb-4">DxB Edge Insight</h3>
                        <p className="text-[13px] leading-relaxed mb-6 text-white/70 font-medium">
                            The definitive, unbiased intelligence guide for the Dubai property market. We transform raw data from our Subject Matter Experts and strategic sovereign agendas into executable investor insight.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="p-5 sm:p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col">
                              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">Investment Strategist</h3>
                              <p className="text-white/70 text-[12px] leading-relaxed flex-1">
                                Engage a senior strategist to map opportunity windows, risk profiles, and capital allocation priorities.
                              </p>
                              <button
                                onClick={() => openModal('Investment Strategist')}
                                className="mt-4 border border-brand-gold text-brand-gold px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-gold hover:text-brand-navy transition-all duration-500 w-full min-h-[72px] flex items-center justify-center text-center"
                              >
                                Connect to Investment Strategist
                              </button>
                            </div>
                            <div className="p-5 sm:p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col">
                              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">Strategic Advisory</h3>
                              <p className="text-white/70 text-[12px] leading-relaxed flex-1">
                                Receive strategic guidance based on your current portfolio, risk posture, and near-term investment priorities.
                              </p>
                              <button
                                onClick={() => openModal('Strategic Advisory')}
                                className="mt-4 border border-brand-gold text-brand-gold px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-gold hover:text-brand-navy transition-all duration-500 w-full min-h-[72px] flex items-center justify-center text-center"
                              >
                                Initialise Connection
                              </button>
                            </div>
                            <div className="p-5 sm:p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col">
                              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">Finance Expert</h3>
                              <p className="text-white/70 text-[12px] leading-relaxed flex-1">
                                Secure mortgage and financing guidance tailored to acquisition timelines, leverage thresholds, and cash-flow targets.
                              </p>
                              <button
                                onClick={() => openModal('Mortgage Advisor')}
                                className="mt-4 border border-brand-gold text-brand-gold px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-gold hover:text-brand-navy transition-all duration-500 w-full min-h-[72px] flex items-center justify-center text-center"
                              >
                                Connect to Finance Expert
                              </button>
                            </div>
                            <div className="p-5 sm:p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col">
                              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">Services</h3>
                              <p className="text-white/70 text-[12px] leading-relaxed flex-1">
                                Access specialist support teams for post-acquisition execution, legal coordination, and operational setup.
                              </p>
                              <button
                                onClick={() => openModal('Services')}
                                className="mt-4 border border-brand-gold text-brand-gold px-4 py-3 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-brand-gold hover:text-brand-navy transition-all duration-500 w-full min-h-[72px] flex items-center justify-center text-center"
                              >
                                Connect to Services
                              </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-x-16 gap-y-10 w-full lg:w-auto">
                        <div>
                            <h4 className="text-[11px] font-black text-brand-gold uppercase tracking-[0.15em] mb-8">THE PLATFORM</h4>
                            <ul className="text-[12px] space-y-4 font-medium text-white/60">
                                <li><a href="/" className="hover:text-brand-gold transition-colors">Home/Market Overview</a></li>
                                <li><a href="#/expert-insights" className="hover:text-brand-gold transition-colors">Expert Insights</a></li>
                                <li><a href="#/combined" className="hover:text-brand-gold transition-colors">Strategic Outlook</a></li>
                                <li><a href="#/dubai-2040" className="hover:text-brand-gold transition-colors">2040 Vision</a></li>
                                <li><a href="#/d33-agenda" className="hover:text-brand-gold transition-colors">D33 Growth</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black text-brand-gold uppercase tracking-[0.15em] mb-8">EXPERTISE</h4>
                            <ul className="text-[12px] space-y-4 font-medium text-white/60">
                                <li><button onClick={() => openModal('Expert')} className="hover:text-brand-gold transition-colors text-left">Expert Connect</button></li>
                                <li><button onClick={() => openModal('Developer')} className="hover:text-brand-gold transition-colors text-left">Developer Access</button></li>
                                <li><button onClick={() => openModal('Mortgage Advisor')} className="hover:text-brand-gold transition-colors text-left">Mortgage Support</button></li>
                                <li><button onClick={() => openModal('Services')} className="hover:text-brand-gold transition-colors text-left">Additional Services</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">© 2026 DXB EDGE INSIGHT | UNBIASED STRATEGIC INTELLIGENCE</p>
                    {/* <div className="flex gap-8">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">GROWTH GREEN FRAMEWORK</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">VERIFIED SOVEREIGN DATA</span>
                    </div> */}
                </div>
              </footer>
            } />
          </Routes>
        </main>

        <LeadCaptureModal 
          isOpen={modalState.isOpen} 
          type={modalState.type} 
          onClose={() => setModalState(prev => ({...prev, isOpen: false}))} 
        />
      </div>
    </Router>
  );
};

export default App;
