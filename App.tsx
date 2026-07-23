
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import DataTicker from './components/DataTicker';
import MarketOverview from './pages/MarketOverview';
import Market from './pages/Market';
import Strategy from './pages/Strategy';
import UKInvestors from './pages/UKInvestors';
import InsightsHub from './pages/InsightsHub';
import Geopolitics2026 from './pages/GeoPolitics2026.tsx';
import AboutUs from './pages/AboutUs';
import Dubai2040 from './pages/Dubai2040';
import D33Agenda from './pages/D33Agenda';
import CombinedStrategy from './pages/CombinedStrategy';
import SMEInsights from './pages/SMEInsights';
import Calculators from './pages/Calculators';
import AIAssistant from './pages/AIAssistant';
import ComingSoon from './pages/ComingSoon';
import LeadCaptureModal from './components/LeadCaptureModal';
import { CurrencyProvider, useCurrency } from './components/CurrencyContext';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();
  useEffect(() => {
    const scrollContainer = document.querySelector('main');
    if (scrollContainer) scrollContainer.scrollTo(0, 0);
    window.scrollTo(0, 0);

    // SPA navigation does not trigger a full page load, so send GA4 page_view manually.
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: `${pathname}${search}${hash}`,
        page_location: window.location.href,
        page_title: document.title,
      });
    }
  }, [pathname, search, hash]);
  return null;
};

const AppShell: React.FC = () => {
  const [modalState, setModalState] = useState<{isOpen: boolean, type: 'Expert' | 'Investment Strategist' | 'Strategic Advisory' | 'Developer' | 'Mortgage Advisor' | 'Services'}>({
    isOpen: false,
    type: 'Expert'
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currency, setCurrency, currencyOptions } = useCurrency();

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
            <div className="min-w-0">
              <h1 className="text-sm font-serif font-bold text-brand-navy tracking-tight">DXB EDGE</h1>
              <p className="text-[8px] text-brand-gold font-bold tracking-[0.25em] uppercase">Investor Intelligence</p>
              <div className="mt-2">
                <select
                  aria-label="Display currency"
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value as typeof currency)}
                  className="text-[10px] font-bold text-brand-navy border border-slate-200 rounded-md px-2 py-1 bg-white"
                >
                  {currencyOptions.map((option) => (
                    <option key={option.code} value={option.code}>
                      {option.code}
                    </option>
                  ))}
                </select>
              </div>
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
              <div className="bg-white border-b border-slate-200 px-10 py-4 flex items-center justify-end gap-8 hidden lg:flex sticky top-0 z-40 shrink-0">
                 <div className="flex items-center gap-2 mr-2">
                  <span className="text-[9px] font-bold text-slate-grey/70 uppercase tracking-[0.15em]">Display</span>
                  <select
                    aria-label="Display currency"
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value as typeof currency)}
                    className="text-[10px] font-bold text-brand-navy border border-slate-200 rounded-md px-2 py-1 bg-white"
                  >
                    {currencyOptions.map((option) => (
                      <option key={option.code} value={option.code}>
                        {option.code}
                      </option>
                    ))}
                  </select>
                 </div>
                 <button onClick={() => openModal('Expert')} className="text-[9px] font-bold text-brand-navy hover:text-brand-gold transition-colors uppercase tracking-[0.2em]">Connect to Investment Strategist</button>
                 <button onClick={() => openModal('Strategic Advisory')} className="text-[9px] font-bold text-brand-navy hover:text-brand-gold transition-colors uppercase tracking-[0.2em]">Connect for Strategic Advisory</button>
                 <button onClick={() => openModal('Mortgage Advisor')} className="text-[9px] font-bold text-brand-navy hover:text-brand-gold transition-colors uppercase tracking-[0.2em]">Connect to Finance Expert</button>
                 <button onClick={() => openModal('Services')} className="text-[9px] font-bold text-brand-navy hover:text-brand-gold transition-colors uppercase tracking-[0.2em]">Connect to Services</button>
                 <div className="w-px h-3 bg-slate-200 ml-1" />
              </div>
            } />
          </Routes>

          {/* Global Data Ticker */}
          <DataTicker />

          <div className="flex-1">
            <Routes>
              <Route path="/" element={<MarketOverview openModal={openModal} />} />
              <Route path="/market" element={<Market openModal={openModal} />} />
              <Route path="/strategy" element={<Strategy openModal={openModal} />} />
              <Route path="/uk-investors" element={<UKInvestors openModal={openModal} />} />
              <Route path="/insights" element={<InsightsHub openModal={openModal} />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/analysis/geopolitics-2026" element={<Geopolitics2026 />} />
              <Route path="/insights/expert-insights" element={<SMEInsights />} />
              <Route path="/insights/strategic-outlook" element={<CombinedStrategy />} />
              <Route path="/insights/strategic-outlook/dubai-2040" element={<Dubai2040 />} />
              <Route path="/insights/strategic-outlook/d33-agenda" element={<D33Agenda />} />
              <Route path="/expert-insights" element={<Navigate to="/insights/expert-insights" replace />} />
              <Route path="/combined" element={<Navigate to="/insights/strategic-outlook" replace />} />
              <Route path="/dubai-2040" element={<Navigate to="/insights/strategic-outlook/dubai-2040" replace />} />
              <Route path="/d33-agenda" element={<Navigate to="/insights/strategic-outlook/d33-agenda" replace />} />
              <Route path="/calculators" element={<Calculators openModal={openModal} />} />
              <Route path="/ai-assistant" element={<AIAssistant />} />
              <Route
                path="/market/dubai-rental-market-trends/"
                element={<Navigate to="/deep-dives/dubai-rental-market-trends" replace />}
              />
              <Route
                path="/market/dubai-price-trends/"
                element={<Navigate to="/deep-dives/dubai-price-trends" replace />}
              />
              <Route
                path="/market/dubai-supply-pipeline/"
                element={<Navigate to="/deep-dives/dubai-supply-pipeline" replace />}
              />
              <Route
                path="/reports/community"
                element={
                  <ComingSoon
                    title="Community Reports"
                    description="Detailed community reports are being prepared. Use the advisory channel below if you want a tailored brief sooner."
                    openModal={openModal}
                    ctaType="Strategic Advisory"
                  />
                }
              />
              <Route
                path="/strategy/off-plan-risk-framework/"
                element={<Navigate to="/deep-dives/off-plan-risk-framework" replace />}
              />
              <Route
                path="/ready/ready-vs-off-plan/"
                element={
                  <ComingSoon
                    title="Ready vs Off-Plan"
                    description="An upcoming comparison of ready property versus off-plan across yield, timing, risk and capital upside."
                    openModal={openModal}
                    ctaType="Investment Strategist"
                    backPath="/strategy"
                    backLabel="Back to Strategy"
                  />
                }
              />
              <Route
                path="/financing/off-plan-mortgages/"
                element={
                  <ComingSoon
                    title="Off-Plan Mortgages"
                    description="A financing note on off-plan mortgage structures, activation milestones and lender constraints."
                    openModal={openModal}
                    ctaType="Mortgage Advisor"
                    backPath="/strategy"
                    backLabel="Back to Strategy"
                  />
                }
              />
              <Route
                path="/reports/off-plan"
                element={
                  <ComingSoon
                    title="Off-Plan Strategy Guide"
                    description="The full off-plan strategy guide is in preparation. Use the advisory route below if you want a tailored version sooner."
                    openModal={openModal}
                    ctaType="Expert"
                    backPath="/strategy"
                    backLabel="Back to Strategy"
                  />
                }
              />
              <Route
                path="/investors/exchange-rate-advantage/"
                element={<Navigate to="/deep-dives/exchange-rate-advantage" replace />}
              />
              <Route
                path="/legal/tax-for-uk-investors/"
                element={<Navigate to="/deep-dives/tax-for-uk-investors" replace />}
              />
              <Route
                path="/financing/uk-investor-financing/"
                element={<Navigate to="/deep-dives/uk-investor-financing" replace />}
              />
              <Route
                path="/reports/uk-investors"
                element={
                  <ComingSoon
                    title="UK Investor Guide"
                    description="The UK investor guide is in preparation. Use the advisory route below if you want a tailored briefing sooner."
                    openModal={openModal}
                    ctaType="Expert"
                    backPath="/uk-investors"
                    backLabel="Back to UK Investors"
                  />
                }
              />
              <Route
                path="/off-plan"
                element={
                  <ComingSoon
                    title="Off-Plan Property"
                    description="A dedicated off-plan pillar is coming soon, covering payment plans, launch cycles, developer reliability and exit risk."
                    openModal={openModal}
                    ctaType="Expert"
                    backPath="/insights"
                    backLabel="Back to Insights Hub"
                  />
                }
              />
              <Route
                path="/ready"
                element={
                  <ComingSoon
                    title="Ready & Secondary Market"
                    description="This pillar is coming soon, with analysis on yields, resale depth, tenant demand and long-term stability."
                    openModal={openModal}
                    ctaType="Investment Strategist"
                    backPath="/insights"
                    backLabel="Back to Insights Hub"
                  />
                }
              />
              <Route
                path="/communities"
                element={
                  <ComingSoon
                    title="Communities & Areas"
                    description="A full communities pillar is being prepared, including district-level analysis for core and emerging Dubai locations."
                    openModal={openModal}
                    ctaType="Strategic Advisory"
                    backPath="/insights"
                    backLabel="Back to Insights Hub"
                  />
                }
              />
              <Route
                path="/legal"
                element={
                  <ComingSoon
                    title="Legal & Fees"
                    description="This legal pillar is coming soon, covering RERA, DLD fees, ownership structures and rental regulation."
                    openModal={openModal}
                    ctaType="Strategic Advisory"
                    backPath="/insights"
                    backLabel="Back to Insights Hub"
                  />
                }
              />
              <Route
                path="/financing"
                element={
                  <ComingSoon
                    title="Financing & Costs"
                    description="A financing pillar is coming soon, including mortgage pathways, service charges and acquisition cost structures."
                    openModal={openModal}
                    ctaType="Mortgage Advisor"
                    backPath="/insights"
                    backLabel="Back to Insights Hub"
                  />
                }
              />
              <Route
                path="/deep-dives/dubai-property-cycle-explained"
                element={
                  <ComingSoon
                    title="Dubai Property Cycle Explained"
                    description="This deep dive is in development and will provide a full cycle framework for timing and risk interpretation."
                    openModal={openModal}
                    ctaType="Expert"
                    backPath="/insights"
                    backLabel="Back to Insights Hub"
                  />
                }
              />
              <Route
                path="/deep-dives/dubai-investment-strategy-guide"
                element={
                  <ComingSoon
                    title="Dubai Investment Strategy Guide"
                    description="A complete strategy guide is coming soon, with framework-based allocation and execution guidance."
                    openModal={openModal}
                    ctaType="Investment Strategist"
                    backPath="/insights"
                    backLabel="Back to Insights Hub"
                  />
                }
              />
              <Route
                path="/deep-dives/dubai-rental-market-trends"
                element={
                  <ComingSoon
                    title="Dubai Rental Market Trends"
                    description="A focused rental-market briefing on tenant demand, community maturity, layout efficiency and net-yield pressure."
                    openModal={openModal}
                    ctaType="Investment Strategist"
                    backPath="/market"
                    backLabel="Back to Dubai Property Market"
                  />
                }
              />
              <Route
                path="/deep-dives/dubai-price-trends"
                element={
                  <ComingSoon
                    title="Dubai Price Trends"
                    description="An upcoming price-trend page covering cycle phase, pricing power, developer incentives and achieved-versus-asking behaviour."
                    openModal={openModal}
                    ctaType="Strategic Advisory"
                    backPath="/market"
                    backLabel="Back to Dubai Property Market"
                  />
                }
              />
              <Route
                path="/deep-dives/off-plan-risk-framework"
                element={
                  <ComingSoon
                    title="Off-Plan Risk Framework"
                    description="A structured off-plan risk framework covering developer quality, payment exposure, community depth and exit risk."
                    openModal={openModal}
                    ctaType="Expert"
                    backPath="/strategy"
                    backLabel="Back to Strategy"
                  />
                }
              />
              <Route
                path="/deep-dives/cashflow-management"
                element={
                  <ComingSoon
                    title="Cashflow Management"
                    description="A dedicated cashflow deep dive is coming soon, covering stage payments, ownership costs, debt servicing and risk reserves."
                    openModal={openModal}
                    ctaType="Investment Strategist"
                    backPath="/strategy"
                    backLabel="Back to Strategy"
                  />
                }
              />
              <Route
                path="/deep-dives/exit-strategy"
                element={
                  <ComingSoon
                    title="Exit Strategy"
                    description="A practical exit strategy guide is coming soon, including assignment pathways, hold-vs-sell logic and liquidity timing."
                    openModal={openModal}
                    ctaType="Strategic Advisory"
                    backPath="/strategy"
                    backLabel="Back to Strategy"
                  />
                }
              />
              <Route
                path="/deep-dives/off-plan-vs-ready"
                element={
                  <ComingSoon
                    title="Off-Plan vs Ready"
                    description="This comparison deep dive is in progress and will cover yield, risk, liquidity and timing trade-offs."
                    openModal={openModal}
                    ctaType="Strategic Advisory"
                    backPath="/insights"
                    backLabel="Back to Insights Hub"
                  />
                }
              />
              <Route
                path="/deep-dives/best-areas-to-invest"
                element={
                  <ComingSoon
                    title="Best Areas to Invest in Dubai"
                    description="A community-led deep dive is coming soon, ranking areas by long-term fundamentals and investor fit."
                    openModal={openModal}
                    ctaType="Expert"
                    backPath="/insights"
                    backLabel="Back to Insights Hub"
                  />
                }
              />
              <Route
                path="/deep-dives/dubai-property-fees"
                element={
                  <ComingSoon
                    title="Dubai Property Fees Explained"
                    description="This guide is in preparation and will break down fee layers and total acquisition friction by scenario."
                    openModal={openModal}
                    ctaType="Strategic Advisory"
                    backPath="/insights"
                    backLabel="Back to Insights Hub"
                  />
                }
              />
              <Route
                path="/deep-dives/dubai-vs-uk-property"
                element={
                  <ComingSoon
                    title="Dubai vs UK Property Market"
                    description="A side-by-side deep dive is coming soon, comparing yields, tax structures, growth profiles and long-term capital efficiency."
                    openModal={openModal}
                    ctaType="Expert"
                    backPath="/uk-investors"
                    backLabel="Back to UK Investors"
                  />
                }
              />
              <Route
                path="/deep-dives/exchange-rate-advantage"
                element={
                  <ComingSoon
                    title="Exchange-Rate Advantage for UK Investors"
                    description="A deeper exchange-rate briefing covering entry timing, effective GBP yield and currency-adjusted return scenarios."
                    openModal={openModal}
                    ctaType="Expert"
                    backPath="/uk-investors"
                    backLabel="Back to UK Investors"
                  />
                }
              />
              <Route
                path="/deep-dives/tax-for-uk-investors"
                element={
                  <ComingSoon
                    title="Tax for UK Investors"
                    description="A practical tax note covering UK reporting, overseas income treatment, deductions and structuring considerations."
                    openModal={openModal}
                    ctaType="Strategic Advisory"
                    backPath="/uk-investors"
                    backLabel="Back to UK Investors"
                  />
                }
              />
              <Route
                path="/deep-dives/uk-investor-financing"
                element={
                  <ComingSoon
                    title="UK Investor Financing"
                    description="An upcoming financing briefing on equity release, refinancing routes and stage-payment cashflow planning for UK buyers."
                    openModal={openModal}
                    ctaType="Mortgage Advisor"
                    backPath="/uk-investors"
                    backLabel="Back to UK Investors"
                  />
                }
              />
              <Route
                path="/deep-dives/dubai-supply-pipeline"
                element={
                  <ComingSoon
                    title="Dubai Supply Pipeline 2026-2028"
                    description="A supply-focused deep dive is coming soon, covering completions, absorption and yield sensitivity scenarios."
                    openModal={openModal}
                    ctaType="Investment Strategist"
                    backPath="/insights"
                    backLabel="Back to Insights Hub"
                  />
                }
              />
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
                                className="mt-4 border border-brand-gold text-brand-gold px-4 text-[10px] font-bold uppercase tracking-[0.3em] leading-tight hover:bg-brand-gold hover:text-brand-navy transition-all duration-500 block w-full h-[84px] flex items-center justify-center text-center"
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
                                className="mt-4 border border-brand-gold text-brand-gold px-4 text-[10px] font-bold uppercase tracking-[0.3em] leading-tight hover:bg-brand-gold hover:text-brand-navy transition-all duration-500 block w-full h-[84px] flex items-center justify-center text-center"
                              >
                                Connect for Strategic Advisory
                              </button>
                            </div>
                            <div className="p-5 sm:p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col">
                              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold mb-3">Finance Expert</h3>
                              <p className="text-white/70 text-[12px] leading-relaxed flex-1">
                                Secure mortgage and financing guidance tailored to acquisition timelines, leverage thresholds, and cash-flow targets.
                              </p>
                              <button
                                onClick={() => openModal('Mortgage Advisor')}
                                className="mt-4 border border-brand-gold text-brand-gold px-4 text-[10px] font-bold uppercase tracking-[0.3em] leading-tight hover:bg-brand-gold hover:text-brand-navy transition-all duration-500 block w-full h-[84px] flex items-center justify-center text-center"
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
                                className="mt-4 border border-brand-gold text-brand-gold px-4 text-[10px] font-bold uppercase tracking-[0.3em] leading-tight hover:bg-brand-gold hover:text-brand-navy transition-all duration-500 block w-full h-[84px] flex items-center justify-center text-center"
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
                                <li><Link to="/" className="hover:text-brand-gold transition-colors">Home/Market Overview</Link></li>
                              <li><Link to="/market" className="hover:text-brand-gold transition-colors">Dubai Property Market</Link></li>
                                <li><Link to="/strategy" className="hover:text-brand-gold transition-colors">Dubai Investment Strategy</Link></li>
                                <li><Link to="/uk-investors" className="hover:text-brand-gold transition-colors">UK Investors</Link></li>
                                <li><Link to="/insights" className="hover:text-brand-gold transition-colors">Insights Hub</Link></li>
                                <li><Link to="/insights/expert-insights" className="hover:text-brand-gold transition-colors">Expert Insights</Link></li>
                                <li><Link to="/insights/strategic-outlook" className="hover:text-brand-gold transition-colors">Strategic Outlook</Link></li>
                                <li><Link to="/insights/strategic-outlook/dubai-2040" className="hover:text-brand-gold transition-colors">2040 Vision</Link></li>
                                <li><Link to="/insights/strategic-outlook/d33-agenda" className="hover:text-brand-gold transition-colors">D33 Growth</Link></li>
                              <li><Link to="/calculators" className="hover:text-brand-gold transition-colors">Calculators</Link></li>
                              <li><Link to="/ai-assistant" className="hover:text-brand-gold transition-colors">AI Assistant</Link></li>
                                <li><Link to="/about-us" className="hover:text-brand-gold transition-colors">About Us / Our Story</Link></li>
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

const App: React.FC = () => (
  <CurrencyProvider>
    <AppShell />
  </CurrencyProvider>
);

export default App;
