
import React, { useState } from 'react';

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'Expert' | 'Developer' | 'Mortgage Advisor';
}

const CURRENCIES = [
  { code: 'AED', name: 'UAE Dirham' },
  { code: 'USD', name: 'US Dollar' },
  { code: 'EUR', name: 'Euro' },
  { code: 'GBP', name: 'British Pound' },
  { code: 'SAR', name: 'Saudi Riyal' },
  { code: 'INR', name: 'Indian Rupee' },
  { code: 'CNY', name: 'Chinese Yuan' },
];

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose, type }) => {
  const [submitted, setSubmitted] = useState(false);
  const [currency, setCurrency] = useState('AED');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 3000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-deep-forest/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden relative border border-slate-200">
        <button onClick={onClose} className="absolute top-4 right-4 sm:top-6 sm:right-6 text-slate-400 hover:text-deep-forest transition-colors z-10">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {!submitted ? (
          <div className="p-6 sm:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-growth-green/10 p-2.5 sm:p-3 rounded-xl text-growth-green">
                <svg className="w-5 h-5 sm:w-6 sm:text-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-deep-forest leading-tight">Connect with a {type}</h2>
                <p className="text-[10px] sm:text-sm text-slate-grey font-medium uppercase tracking-widest opacity-60">Premium Advisory Pathway</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-grey leading-relaxed mb-8">
              Based on your interest, we will connect you with a vetted, high-reputation {type.toLowerCase()} specialised in the current market cycle.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-bold text-deep-forest uppercase tracking-widest mb-1.5">Full Name</label>
                <input required type="text" className="w-full bg-soft-grey border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-growth-green/20" placeholder="John Doe" />
              </div>
              
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-bold text-deep-forest uppercase tracking-widest mb-1.5">Email Address</label>
                  <input required type="email" className="w-full bg-soft-grey border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-growth-green/20" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-bold text-deep-forest uppercase tracking-widest mb-1.5">Phone (WhatsApp)</label>
                  <input required type="tel" className="w-full bg-soft-grey border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-growth-green/20" placeholder="+971 ..." />
                </div>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[9px] sm:text-[10px] font-bold text-deep-forest uppercase tracking-widest mb-1.5">Investment Budget</label>
                  <input required type="number" className="w-full bg-soft-grey border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-growth-green/20" placeholder="e.g. 2,000,000" />
                </div>
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-bold text-deep-forest uppercase tracking-widest mb-1.5">Currency</label>
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-soft-grey border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-growth-green/20 appearance-none cursor-pointer"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.code} ({c.name})</option>
                    ))}
                  </select>
                </div>
              </div>

              <button type="submit" className="w-full bg-growth-green text-white font-bold py-4 rounded-xl mt-4 hover:bg-growth-green/90 transition-all shadow-lg active:scale-95 sm:hover:scale-[1.02]">
                Request Professional Connection
              </button>
              <p className="text-center text-[9px] sm:text-[10px] text-slate-grey/50 font-medium px-4">
                Your data is exclusively shared with vetted partners. No sales spam.
              </p>
            </form>
          </div>
        ) : (
          <div className="p-12 sm:p-16 text-center animate-fadeIn">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-growth-green/10 rounded-full flex items-center justify-center mx-auto mb-6 text-growth-green">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-deep-forest mb-3">Request Received</h2>
            <p className="text-sm sm:text-base text-slate-grey leading-relaxed">
              A specialised {type.toLowerCase()} will reach out shortly to provide tailored guidance.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadCaptureModal;
