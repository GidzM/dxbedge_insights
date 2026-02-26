
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
  const [modalState, setModalState] = useState<{isOpen: boolean, type: 'Broker' | 'Developer' | 'Mortgage Advisor'}>({
    isOpen: false,
    type: 'Broker'
  });

  const openModal = (type: 'Broker' | 'Developer' | 'Mortgage Advisor') => {
    setModalState({ isOpen: true, type });
  };

  return (
    <Router>
      <ScrollToTop />
      <div className="flex min-h-screen bg-soft-grey font-sans selection:bg-brand-gold selection:text-brand-navy">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <main className="flex-1 lg:ml-64 min-h-screen flex flex-col overflow-y-auto overflow-x-hidden">
          {/* Header standard desktop */}
          <Routes>
            <Route path="/ai-assistant" element={null} />
            <Route path="*" element={
              <div className="bg-white border-b border-slate-200 px-10 py-4 flex items-center justify-end gap-10 hidden lg:flex sticky top-0 z-40 shrink-0">
                 <button onClick={() => openModal('Broker')} className="text-[9px] font-bold text-brand-navy hover:text-brand-gold transition-colors uppercase tracking-[0.2em]">Connect Advisor</button>
                 <button onClick={() => openModal('Developer')} className="text-[9px] font-bold text-brand-navy hover:text-brand-gold transition-colors uppercase tracking-[0.2em]">Developer Access</button>
                 <button onClick={() => openModal('Mortgage Advisor')} className="text-[9px] font-bold text-brand-navy hover:text-brand-gold transition-colors uppercase tracking-[0.2em]">Sovereign Finance</button>
                 <div className="w-px h-3 bg-slate-200 mx-2" />
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-brand-gold rounded-full" />
                    <span className="text-[9px] font-bold text-slate-grey/60 uppercase tracking-widest">Live Pulse</span>
                 </div>
              </div>
            } />
          </Routes>

          {/* Global Data Ticker */}
          <DataTicker />

          <div className="flex-1">
            <Routes>
              <Route path="/" element={<MarketOverview />} />
              <Route path="/sme-insights" element={<SMEInsights />} />
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
              <footer className="bg-brand-navy py-24 px-16 text-white">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-start gap-20">
                    <div className="max-w-md w-full">
                        <h3 className="font-sans font-bold text-white text-2xl mb-4">DxB Edge Insight</h3>
                        <p className="text-[13px] leading-relaxed mb-10 text-white/70 font-medium">
                            The definitive, unbiased intelligence guide for the Dubai property market. We transform raw SME data and strategic sovereign agendas into executable investor insight.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <button onClick={() => openModal('Broker')} className="bg-[#10B981] text-white text-[10px] font-bold uppercase tracking-[0.1em] px-8 py-4 shadow-sm hover:bg-[#059669] transition-all">
                                JOIN ADVISOR NETWORK
                            </button>
                            <div className="border border-white/10 px-8 py-4 flex items-center justify-center bg-white/5">
                                <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.15em]">AUTHORIZED INTELLIGENCE</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-2 gap-x-20 gap-y-12 w-full lg:w-auto">
                        <div>
                            <h4 className="text-[11px] font-black text-brand-gold uppercase tracking-[0.15em] mb-8">THE PLATFORM</h4>
                            <ul className="text-[12px] space-y-4 font-medium text-white/60">
                                <li><a href="/" className="hover:text-brand-gold transition-colors">Market Pulse</a></li>
                                <li><a href="#/dubai-2040" className="hover:text-brand-gold transition-colors">2040 Vision</a></li>
                                <li><a href="#/d33-agenda" className="hover:text-brand-gold transition-colors">D33 Growth</a></li>
                                <li><a href="#/sme-insights" className="hover:text-brand-gold transition-colors">SME Ground Truth</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[11px] font-black text-brand-gold uppercase tracking-[0.15em] mb-8">EXPERTISE</h4>
                            <ul className="text-[12px] space-y-4 font-medium text-white/60">
                                <li><button onClick={() => openModal('Broker')} className="hover:text-brand-gold transition-colors text-left">Broker Connect</button></li>
                                <li><button onClick={() => openModal('Developer')} className="hover:text-brand-gold transition-colors text-left">Developer Access</button></li>
                                <li><button onClick={() => openModal('Mortgage Advisor')} className="hover:text-brand-gold transition-colors text-left">Mortgage Support</button></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">© 2026 DXB EDGE INSIGHT | UNBIASED STRATEGIC INTELLIGENCE</p>
                    <div className="flex gap-8">
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">GROWTH GREEN FRAMEWORK</span>
                        <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-white/30">VERIFIED SOVEREIGN DATA</span>
                    </div>
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
