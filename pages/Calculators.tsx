import React, { useState, useMemo } from 'react';
import { useCurrency } from '../components/CurrencyContext';

interface CalculatorsProps {
  openModal: (type: 'Expert' | 'Investment Strategist' | 'Strategic Advisory' | 'Developer' | 'Mortgage Advisor' | 'Services') => void;
}

const formatPercent = (val: number) => {
  if (isNaN(val) || !isFinite(val)) return '0.00%';
  return `${(val || 0).toFixed(2)}%`;
};

const InputField = ({ label, value, onChange, type = "number", min, max, placeholder, tooltip }: any) => (
  <div className="space-y-1.5">
    <div className="flex items-center justify-between">
      <label className="text-[10px] font-black text-deep-forest uppercase tracking-widest">{label}</label>
      {tooltip && (
        <div className="group relative">
          <svg className="w-3 h-3 text-slate-grey/40 cursor-help" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
          <div className="absolute bottom-full right-0 mb-2 w-48 p-2 bg-deep-forest text-white text-[10px] rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 leading-relaxed">
            {tooltip}
          </div>
        </div>
      )}
    </div>
    <input
      type={type}
      min={min}
      max={max}
      value={value}
      onChange={(e) => {
        const val = e.target.value;
        // Basic sanitization: prevent negative numbers for financial inputs
        if (type === "number" && parseFloat(val) < 0) return;
        onChange(val);
      }}
      placeholder={placeholder}
      className="w-full bg-soft-grey border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-navy/20 transition-all"
    />
  </div>
);

const ResultCard = ({ title, results, advisory, cta, onCtaClick }: any) => (
  <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm animate-fadeIn sticky top-24">
    <h3 className="text-[11px] font-black text-brand-navy uppercase tracking-widest mb-4">{title}</h3>
    
    {/* Primary Results Display */}
    <div className="grid grid-cols-2 gap-4 mb-8">
      {results.map((res: any, idx: number) => (
        <div key={idx} className={`space-y-1 p-3 rounded-lg ${idx < 2 ? 'bg-brand-navy/5' : ''}`}>
          <p className="text-[9px] font-bold text-slate-grey/60 uppercase tracking-tighter">{res.label}</p>
          <p className={`text-base sm:text-lg font-display font-bold ${idx < 2 ? 'text-brand-navy' : 'text-deep-forest'}`}>
            {res.value}
          </p>
        </div>
      ))}
    </div>

    {/* Integrated Conversion CTA - Moved Up for better UX Flow */}
    <div className="mb-6">
      <button
        onClick={onCtaClick}
        className="w-full bg-brand-navy text-white text-[10px] font-black uppercase tracking-widest py-4 rounded-lg active:scale-95 sm:hover:bg-brand-navy/90 transition-all shadow-md flex items-center justify-center gap-2"
      >
        <span>{cta}</span>
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
      </button>
    </div>

    {advisory && (
      <div className="pt-4 border-t border-slate-100">
        <p className="text-[10px] text-slate-grey italic leading-relaxed flex items-start gap-2">
          <svg className="w-3 h-3 mt-0.5 text-slate-grey/40 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
          {advisory}
        </p>
      </div>
    )}
  </div>
);

const Calculators: React.FC<CalculatorsProps> = ({ openModal }) => {
  const { formatFromAED, currency } = useCurrency();

  const formatCurrency = (val: number) => {
    if (isNaN(val) || !isFinite(val)) return formatFromAED(0);
    return formatFromAED(val, { maximumFractionDigits: 0 });
  };

  const [activeTab, setActiveTab] = useState('rental_roi');

  // RentalROI Calculator State
  const [rentalRoiInputs, setRoiInputs] = useState({
    price: 2000000,
    rent: 160000,
    service: 30000,
    maintenance: 5000,
    mgmt: 5,
    vacancy: 5,
    mortgageAmount: 1000000,
    mortgageRate: 4.5,
    tenure: 25
  });

  // Rental ROI Calculations with Sanitization
  const rentalRoiResults = useMemo(() => {
    const { price, rent, service, maintenance, mgmt, vacancy, mortgageAmount, mortgageRate, tenure } = rentalRoiInputs;
    
    // Safety check: Price must be > 0 to avoid division by zero errors
    const safePrice = Math.max(1, price);
    
    const annualMgmt = rent * (mgmt / 100);
    const annualVacancy = rent * (vacancy / 100);
    const netIncome = rent - service - maintenance - annualMgmt - annualVacancy;
    
    const grossYield = (rent / safePrice) * 100;
    const netYield = (netIncome / safePrice) * 100;

    const r = (mortgageRate || 0) / 100 / 12;
    const n = (tenure || 1) * 12;
    
    let monthlyPayment = 0;
    if (mortgageAmount > 0 && r > 0) {
      monthlyPayment = (mortgageAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else if (mortgageAmount > 0 && r === 0) {
      monthlyPayment = mortgageAmount / n;
    }
    
    const annualMortgage = monthlyPayment * 12;
    const cashInvested = Math.max(0, price - mortgageAmount);
    
    // Safety check: Cash Invested must be > 0 for cash-on-cash yield
    const cashOnCash = cashInvested > 0 ? ((netIncome - annualMortgage) / cashInvested) * 100 : 0;

    return [
      { label: "Gross Yield", value: formatPercent(grossYield) },
      { label: "Net Yield", value: formatPercent(netYield) },
      { label: "Annual Cash Flow", value: formatCurrency(netIncome - annualMortgage) },
      { label: "Cash-on-Cash Return", value: formatPercent(cashOnCash) }
    ];
  }, [rentalRoiInputs, currency]);

  // DLD Calculations with Sanitization
  const [dldInputs, setDldInputs] = useState({ price: 2000000, mortgage: 0 });
  const dldResults = useMemo(() => {
    const fee = dldInputs.price * 0.04;
    const reg = dldInputs.mortgage > 0 ? (dldInputs.mortgage * 0.0025) + 290 : 0;
    const total = fee + reg + 4000 + 500; 
    return [
      { label: "DLD Transfer Fee (4%)", value: formatCurrency(fee) },
      { label: "Mortgage Registration", value: formatCurrency(reg) },
      { label: "Total Acquisition Cost", value: formatCurrency(total) }
    ];
  }, [dldInputs, currency]);

  // Mortgage Calculations with Sanitization
  const [mortgageInputs, setMortgageInputs] = useState({ amount: 1500000, rate: 4.5, tenure: 25 });
  const mortgageResults = useMemo(() => {
    const r = (mortgageInputs.rate || 0) / 100 / 12;
    const n = Math.max(1, (mortgageInputs.tenure || 1)) * 12;
    
    let payment = 0;
    if (mortgageInputs.amount > 0 && r > 0) {
      payment = (mortgageInputs.amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else if (mortgageInputs.amount > 0 && r === 0) {
      payment = mortgageInputs.amount / n;
    }

    return [
      { label: "Monthly Payment", value: formatCurrency(payment) },
      { label: "Total Interest Paid", value: formatCurrency((payment * n) - mortgageInputs.amount) },
      { label: "Total Repayment", value: formatCurrency(payment * n) }
    ];
  }, [mortgageInputs, currency]);

  // Off-Plan Calculations with Sanitization
  const [offPlanInputs, setOffPlanInputs] = useState({ price: 2000000, booking: 10, construction: 40, handover: 50 });
  const offPlanResults = useMemo(() => {
    const { price, booking, construction, handover } = offPlanInputs;
    return [
      { label: "Booking Amount", value: formatCurrency(price * (booking / 100)) },
      { label: "Total During Construction", value: formatCurrency(price * (construction / 100)) },
      { label: "Handover Payment", value: formatCurrency(price * (handover / 100)) }
    ];
  }, [offPlanInputs, currency]);

  // Short-Term ROI (Holiday Let) Calculations
  const [shortTermInputs, setShortTermInputs] = useState({
    price: 2000000,
    rateType: 'nightly',
    averageRate: 650,
    occupancy: 72,
    avgStayNights: 4,
    cleaningPerTurnover: 180,
    service: 30000,
    utilities: 12000,
    maintenance: 7000,
    mgmt: 20,
    platformFee: 15,
  });

  const shortTermResults = useMemo(() => {
    const {
      price,
      rateType,
      averageRate,
      occupancy,
      avgStayNights,
      cleaningPerTurnover,
      service,
      utilities,
      maintenance,
      mgmt,
      platformFee,
    } = shortTermInputs;

    const safePrice = Math.max(1, price);
    const occupiedNights = 365 * ((occupancy || 0) / 100);
    const occupiedWeeks = occupiedNights / 7;

    const annualGrossIncome = rateType === 'weekly'
      ? averageRate * occupiedWeeks
      : averageRate * occupiedNights;

    const annualMgmt = annualGrossIncome * ((mgmt || 0) / 100);
    const annualPlatform = annualGrossIncome * ((platformFee || 0) / 100);
    const turnovers = occupiedNights / Math.max(1, avgStayNights || 1);
    const annualCleaning = turnovers * Math.max(0, cleaningPerTurnover || 0);

    const annualOperatingCosts =
      Math.max(0, service || 0) +
      Math.max(0, utilities || 0) +
      Math.max(0, maintenance || 0) +
      annualMgmt +
      annualPlatform +
      annualCleaning;

    const annualNetIncome = annualGrossIncome - annualOperatingCosts;
    const grossYield = (annualGrossIncome / safePrice) * 100;
    const netYield = (annualNetIncome / safePrice) * 100;

    return [
      { label: 'Gross Yield', value: formatPercent(grossYield) },
      { label: 'Net Yield', value: formatPercent(netYield) },
      { label: 'Annual Gross Income', value: formatCurrency(annualGrossIncome) },
      { label: 'Annual Net Income', value: formatCurrency(annualNetIncome) },
      { label: 'Occupancy Nights/Year', value: `${Math.round(occupiedNights)}` },
      { label: 'Turnovers/Year', value: `${Math.round(turnovers)}` },
    ];
  }, [shortTermInputs, currency]);

  return (
    <div className="max-w-7xl mx-auto py-10 px-6 lg:px-12 animate-fadeIn pb-32">
      <div className="w-full h-[250px] bg-brand-navy overflow-hidden mb-16 relative rounded-2xl">
          <img 
            src="https://images.unsplash.com/photo-1615747476205-991a14cd2358?auto=format&fit=crop&q=80&w=2000" 
            alt="Dubai Night Skyline" 
            className="w-full h-full object-cover grayscale brightness-[0.7] contrast-[1.2]"
          />
            <div className="absolute inset-0 bg-brand-navy/60 mix-blend-multiply transition-opacity duration-700" />
          <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[10px] font-bold uppercase tracking-[0.6em] text-white/40">Financial Modelling Interface</span>
          </div>
      </div>

      <header className="mb-12 border-l border-brand-gold pl-10">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-brand-navy italic mb-4">Tools & Calculators</h1>
        <p className="text-base sm:text-lg text-slate-grey max-w-3xl leading-relaxed italic font-serif">
          Unbiased modelling tools designed to help investors understand the true financial implications of a property purchase.
        </p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-72 flex-shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto lg:overflow-hidden sticky top-24">
            <nav className="flex lg:flex-col p-2 min-w-max lg:min-w-0">
              {[
                { id: 'rental_roi', label: 'Rental ROI' },
                { id: 'short_term_roi', label: 'Short-Term ROI' },
                { id: 'dld', label: 'DLD Fee' },
                { id: 'mortgage', label: 'Mortgage' },
                { id: 'offplan', label: 'Off-Plan' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left px-4 sm:px-5 py-3 sm:py-4 rounded-lg text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-brand-navy !text-white shadow-lg'
                      : 'text-slate-grey/60 hover:bg-soft-grey hover:text-deep-forest'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8 space-y-8">
            {activeTab === 'rental_roi' && (
              <>
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg sm:text-xl font-display font-bold text-deep-forest mb-1">Rental ROI Calculator</h2>
                  <p className="text-[10px] text-slate-grey uppercase tracking-widest opacity-60">Investment Yield Analysis</p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <InputField label={`Price (${currency})`} value={rentalRoiInputs.price} onChange={(v:any) => setRoiInputs({...rentalRoiInputs, price: Number(v)})} />
                  <InputField label={`Annual Rent (${currency})`} value={rentalRoiInputs.rent} onChange={(v:any) => setRoiInputs({...rentalRoiInputs, rent: Number(v)})} />
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label={`Service (${currency}/yr)`} value={rentalRoiInputs.service} onChange={(v:any) => setRoiInputs({...rentalRoiInputs, service: Number(v)})} />
                    <InputField label={`Maint (${currency}/yr)`} value={rentalRoiInputs.maintenance} onChange={(v:any) => setRoiInputs({...rentalRoiInputs, maintenance: Number(v)})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Mgmt Fee (%)" value={rentalRoiInputs.mgmt} onChange={(v:any) => setRoiInputs({...rentalRoiInputs, mgmt: Number(v)})} />
                    <InputField label="Vacancy (%)" value={rentalRoiInputs.vacancy} onChange={(v:any) => setRoiInputs({...rentalRoiInputs, vacancy: Number(v)})} />
                  </div>
                </div>
              </>
            )}
            {activeTab === 'short_term_roi' && (
              <>
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg sm:text-xl font-display font-bold text-deep-forest mb-1">Short-Term ROI Calculator</h2>
                  <p className="text-[10px] text-slate-grey uppercase tracking-widest opacity-60">Holiday Let Yield Analysis</p>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  <InputField label={`Property Price (${currency})`} value={shortTermInputs.price} onChange={(v:any) => setShortTermInputs({ ...shortTermInputs, price: Number(v) })} />

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-deep-forest uppercase tracking-widest">Rate Type</label>
                    <select
                      value={shortTermInputs.rateType}
                      onChange={(e) => setShortTermInputs({ ...shortTermInputs, rateType: e.target.value })}
                      className="w-full bg-soft-grey border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-navy/20 transition-all"
                    >
                      <option value="nightly">Nightly ({currency} per night)</option>
                      <option value="weekly">Weekly ({currency} per week)</option>
                    </select>
                  </div>

                  <InputField
                    label={shortTermInputs.rateType === 'weekly' ? `Average Weekly Rate (${currency})` : `Average Nightly Rate (${currency})`}
                    value={shortTermInputs.averageRate}
                    onChange={(v:any) => setShortTermInputs({ ...shortTermInputs, averageRate: Number(v) })}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Occupancy (%)" value={shortTermInputs.occupancy} onChange={(v:any) => setShortTermInputs({ ...shortTermInputs, occupancy: Number(v) })} />
                    <InputField label="Avg Stay (Nights)" value={shortTermInputs.avgStayNights} onChange={(v:any) => setShortTermInputs({ ...shortTermInputs, avgStayNights: Number(v) })} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="Mgmt Fee (%)" value={shortTermInputs.mgmt} onChange={(v:any) => setShortTermInputs({ ...shortTermInputs, mgmt: Number(v) })} />
                    <InputField label="Platform Fee (%)" value={shortTermInputs.platformFee} onChange={(v:any) => setShortTermInputs({ ...shortTermInputs, platformFee: Number(v) })} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputField label={`Cleaning / Turnover (${currency})`} value={shortTermInputs.cleaningPerTurnover} onChange={(v:any) => setShortTermInputs({ ...shortTermInputs, cleaningPerTurnover: Number(v) })} />
                    <InputField label={`Utilities (${currency}/yr)`} value={shortTermInputs.utilities} onChange={(v:any) => setShortTermInputs({ ...shortTermInputs, utilities: Number(v) })} />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <InputField label={`Service Charge (${currency}/yr)`} value={shortTermInputs.service} onChange={(v:any) => setShortTermInputs({ ...shortTermInputs, service: Number(v) })} />
                    <InputField label={`Maintenance (${currency}/yr)`} value={shortTermInputs.maintenance} onChange={(v:any) => setShortTermInputs({ ...shortTermInputs, maintenance: Number(v) })} />
                  </div>
                </div>
              </>
            )}
            {activeTab === 'dld' && (
              <>
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg sm:text-xl font-display font-bold text-deep-forest mb-1">DLD Fee Calculator</h2>
                  <p className="text-[10px] text-slate-grey uppercase tracking-widest opacity-60">Acquisition Cost breakdown</p>
                </div>
                <div className="space-y-6">
                  <InputField label={`Property Price (${currency})`} value={dldInputs.price} onChange={(v:any) => setDldInputs({...dldInputs, price: Number(v)})} />
                  <InputField label={`Mortgage Amount (${currency})`} value={dldInputs.mortgage} onChange={(v:any) => setDldInputs({...dldInputs, mortgage: Number(v)})} />
                </div>
              </>
            )}
            {activeTab === 'mortgage' && (
              <>
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg sm:text-xl font-display font-bold text-deep-forest mb-1">Mortgage Calculator</h2>
                  <p className="text-[10px] text-slate-grey uppercase tracking-widest opacity-60">Leverage Modeller</p>
                </div>
                <div className="space-y-6">
                  <InputField label={`Loan Amount (${currency})`} value={mortgageInputs.amount} onChange={(v:any) => setMortgageInputs({...mortgageInputs, amount: Number(v)})} />
                  <InputField label="Interest Rate (%)" value={mortgageInputs.rate} onChange={(v:any) => setMortgageInputs({...mortgageInputs, rate: Number(v)})} />
                  <InputField label="Tenure (Years)" value={mortgageInputs.tenure} onChange={(v:any) => setMortgageInputs({...mortgageInputs, tenure: Number(v)})} />
                </div>
              </>
            )}
            {activeTab === 'offplan' && (
              <>
                <div className="border-b border-slate-100 pb-4">
                  <h2 className="text-lg sm:text-xl font-display font-bold text-deep-forest mb-1">Off-Plan Payment Modeller</h2>
                  <p className="text-[10px] text-slate-grey uppercase tracking-widest opacity-60">Milestone Payment Strategy</p>
                </div>
                <div className="space-y-6">
                  <InputField label={`Purchase Price (${currency})`} value={offPlanInputs.price} onChange={(v:any) => setOffPlanInputs({...offPlanInputs, price: Number(v)})} />
                  <div className="grid grid-cols-3 gap-3">
                    <InputField label="Booking (%)" value={offPlanInputs.booking} onChange={(v:any) => setOffPlanInputs({...offPlanInputs, booking: Number(v)})} />
                    <InputField label="Const (%)" value={offPlanInputs.construction} onChange={(v:any) => setOffPlanInputs({...offPlanInputs, construction: Number(v)})} />
                    <InputField label="Handover (%)" value={offPlanInputs.handover} onChange={(v:any) => setOffPlanInputs({...offPlanInputs, handover: Number(v)})} />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="relative">
            {activeTab === 'rental_roi' && <ResultCard title="Rental ROI Analysis" results={rentalRoiResults} advisory="Estimates based on current SME market data and sovereign growth trajectories." cta="Secure Priority Adviser Access" onCtaClick={() => openModal('Expert')} />}
            {activeTab === 'short_term_roi' && <ResultCard title="Short-Term ROI Analysis" results={shortTermResults} advisory="Calculation method: Annual Gross Income = Average Rate × Occupied Nights (or Occupied Weeks for weekly pricing). Occupied Nights = 365 × Occupancy %. Net Yield includes management, platform, cleaning turnover, service charge, utilities, and maintenance." cta="Connect with a Strategic Expert" onCtaClick={() => openModal('Expert')} />}
            {activeTab === 'dld' && <ResultCard title="Acquisition Costs" results={dldResults} advisory="Calculated based on standard DLD fees (4%) and registration trustee charges." cta="Connect with a Strategic Expert" onCtaClick={() => openModal('Expert')} />}
            {activeTab === 'mortgage' && <ResultCard title="Mortgage breakdown" results={mortgageResults} advisory="Based on standard UAE banking tenure and prevailing interest rates." cta="Consult a Mortgage Specialist" onCtaClick={() => openModal('Mortgage Advisor')} />}
            {activeTab === 'offplan' && <ResultCard title="Payment Schedule" results={offPlanResults} advisory="Projected payment flow based on typical developer milestone structures." cta="Verify Developer Track Records" onCtaClick={() => openModal('Developer')} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculators;