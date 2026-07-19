
import React, { useEffect, useRef, useState } from 'react';
import Turnstile from "react-turnstile";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'Expert' | 'Investment Strategist' | 'Strategic Advisory' | 'Developer' | 'Mortgage Advisor' | 'Services';
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

const PHONE_COUNTRY_CODES = [
  { code: '+971', label: 'United Arab Emirates (+971)' },
  { code: '+966', label: 'Saudi Arabia (+966)' },
  { code: '+974', label: 'Qatar (+974)' },
  { code: '+973', label: 'Bahrain (+973)' },
  { code: '+965', label: 'Kuwait (+965)' },
  { code: '+968', label: 'Oman (+968)' },
  { code: '+962', label: 'Jordan (+962)' },
  { code: '+961', label: 'Lebanon (+961)' },
  { code: '+964', label: 'Iraq (+964)' },
  { code: '+20', label: 'Egypt (+20)' },
  { code: '+212', label: 'Morocco (+212)' },
  { code: '+216', label: 'Tunisia (+216)' },
  { code: '+27', label: 'South Africa (+27)' },
  { code: '+44', label: 'United Kingdom (+44)' },
  { code: '+353', label: 'Ireland (+353)' },
  { code: '+33', label: 'France (+33)' },
  { code: '+49', label: 'Germany (+49)' },
  { code: '+34', label: 'Spain (+34)' },
  { code: '+39', label: 'Italy (+39)' },
  { code: '+31', label: 'Netherlands (+31)' },
  { code: '+32', label: 'Belgium (+32)' },
  { code: '+41', label: 'Switzerland (+41)' },
  { code: '+43', label: 'Austria (+43)' },
  { code: '+46', label: 'Sweden (+46)' },
  { code: '+47', label: 'Norway (+47)' },
  { code: '+45', label: 'Denmark (+45)' },
  { code: '+351', label: 'Portugal (+351)' },
  { code: '+30', label: 'Greece (+30)' },
  { code: '+48', label: 'Poland (+48)' },
  { code: '+90', label: 'Turkey (+90)' },
  { code: '+7', label: 'Russia (+7)' },
  { code: '+1', label: 'United States (+1)' },
  { code: '+1', label: 'Canada (+1)' },
  { code: '+52', label: 'Mexico (+52)' },
  { code: '+55', label: 'Brazil (+55)' },
  { code: '+54', label: 'Argentina (+54)' },
  { code: '+56', label: 'Chile (+56)' },
  { code: '+57', label: 'Colombia (+57)' },
  { code: '+91', label: 'India (+91)' },
  { code: '+92', label: 'Pakistan (+92)' },
  { code: '+880', label: 'Bangladesh (+880)' },
  { code: '+94', label: 'Sri Lanka (+94)' },
  { code: '+977', label: 'Nepal (+977)' },
  { code: '+86', label: 'China (+86)' },
  { code: '+852', label: 'Hong Kong (+852)' },
  { code: '+853', label: 'Macau (+853)' },
  { code: '+65', label: 'Singapore (+65)' },
  { code: '+60', label: 'Malaysia (+60)' },
  { code: '+66', label: 'Thailand (+66)' },
  { code: '+84', label: 'Vietnam (+84)' },
  { code: '+62', label: 'Indonesia (+62)' },
  { code: '+63', label: 'Philippines (+63)' },
  { code: '+81', label: 'Japan (+81)' },
  { code: '+82', label: 'South Korea (+82)' },
  { code: '+61', label: 'Australia (+61)' },
  { code: '+64', label: 'New Zealand (+64)' },
];

const DEFAULT_PHONE_COUNTRY_CODE_LABEL = 'United Arab Emirates (+971)';

const DIRECT_EXPERT_PHONE = '+971585610931';
const SERVICE_LABELS: Record<LeadCaptureModalProps['type'], string> = {
  Expert: 'Investment Strategist / Strategic Advisory',
  'Investment Strategist': 'Investment Strategist',
  'Strategic Advisory': 'Strategic Advisory',
  Developer: 'Developer Access',
  'Mortgage Advisor': 'Finance / Mortgage Advisory',
  Services: 'Additional Services',
};

const ADDITIONAL_SERVICES = [
  'Short term team',
  'Renovation/build works team',
  'Transferring funds team',
  'Architects team',
  'Conveyancing team',
  'Legal advice',
  'Crypto funds transfer',
  'Property management',
  'Furniture and interior design team',
];

const FIRST_TOUCH_STORAGE_KEY = 'dxb_edge_first_touch_attribution_v1';

type AttributionData = {
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmTerm: string;
  utmContent: string;
  referralCode: string;
  referrer: string;
  landingPath: string;
};

const getCurrentAttribution = (): AttributionData => {
  const params = new URLSearchParams(window.location.search);
  return {
    utmSource: params.get('utm_source') || '',
    utmMedium: params.get('utm_medium') || '',
    utmCampaign: params.get('utm_campaign') || '',
    utmTerm: params.get('utm_term') || '',
    utmContent: params.get('utm_content') || '',
    referralCode: params.get('ref') || params.get('referral') || params.get('referral_code') || '',
    referrer: document.referrer || '',
    landingPath: `${window.location.pathname}${window.location.search}${window.location.hash}`,
  };
};

const readFirstTouchAttribution = (): AttributionData | null => {
  try {
    const raw = window.localStorage.getItem(FIRST_TOUCH_STORAGE_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') {
      return null;
    }

    return {
      utmSource: typeof parsed.utmSource === 'string' ? parsed.utmSource : '',
      utmMedium: typeof parsed.utmMedium === 'string' ? parsed.utmMedium : '',
      utmCampaign: typeof parsed.utmCampaign === 'string' ? parsed.utmCampaign : '',
      utmTerm: typeof parsed.utmTerm === 'string' ? parsed.utmTerm : '',
      utmContent: typeof parsed.utmContent === 'string' ? parsed.utmContent : '',
      referralCode: typeof parsed.referralCode === 'string' ? parsed.referralCode : '',
      referrer: typeof parsed.referrer === 'string' ? parsed.referrer : '',
      landingPath: typeof parsed.landingPath === 'string' ? parsed.landingPath : '',
    };
  } catch {
    return null;
  }
};

const storeFirstTouchAttribution = (data: AttributionData) => {
  try {
    window.localStorage.setItem(FIRST_TOUCH_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors to avoid blocking form usage.
  }
};

const LeadCaptureModal: React.FC<LeadCaptureModalProps> = ({ isOpen, onClose, type }) => {
  const countryCodeDropdownRef = useRef<HTMLDivElement | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [currency, setCurrency] = useState('AED');
  const [fullName, setFullName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [phoneCountryCode, setPhoneCountryCode] = useState(DEFAULT_PHONE_COUNTRY_CODE_LABEL);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCountryCodeDropdownOpen, setIsCountryCodeDropdownOpen] = useState(false);
  const [investmentBudget, setInvestmentBudget] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [serviceError, setServiceError] = useState('');
  const [copied, setCopied] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const isServicesModal = type === 'Services';
  const headingTypeLabel = isServicesModal ? 'Services Team' : type;
  const serviceLabel = SERVICE_LABELS[type];

  const formatPhoneForWhatsApp = (phone: string) => phone.replace(/\D/g, '');
  const selectedPhoneCountryCode = PHONE_COUNTRY_CODES.find((option) => option.label === phoneCountryCode)?.code
    || (phoneCountryCode.trim().startsWith('+') ? phoneCountryCode.trim() : '');
  const combinedPhoneNumber = [selectedPhoneCountryCode, phoneNumber.trim()].filter(Boolean).join(' ');
  const hasExactCountryCodeMatch = PHONE_COUNTRY_CODES.some((option) => option.label === phoneCountryCode);
  const filteredPhoneCountryCodes = PHONE_COUNTRY_CODES.filter((option) => {
    const query = phoneCountryCode.trim().toLowerCase();
    if (!query || hasExactCountryCodeMatch) {
      return true;
    }

    return option.label.toLowerCase().includes(query) || option.code.includes(query);
  });

  useEffect(() => {
    const existing = readFirstTouchAttribution();
    if (existing) {
      return;
    }

    const current = getCurrentAttribution();
    const hasAttributionSignal = Boolean(
      current.utmSource ||
      current.utmMedium ||
      current.utmCampaign ||
      current.utmTerm ||
      current.utmContent ||
      current.referralCode ||
      current.referrer
    );

    if (hasAttributionSignal) {
      storeFirstTouchAttribution(current);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsCountryCodeDropdownOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isCountryCodeDropdownOpen) {
      return;
    }

    const handlePointerDown = (event: MouseEvent) => {
      if (!countryCodeDropdownRef.current?.contains(event.target as Node)) {
        setIsCountryCodeDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
    };
  }, [isCountryCodeDropdownOpen]);

  const getAttributionData = () => {
    const current = getCurrentAttribution();
    const firstTouch = readFirstTouchAttribution();

    if (!firstTouch) {
      return current;
    }

    return {
      utmSource: firstTouch.utmSource || current.utmSource,
      utmMedium: firstTouch.utmMedium || current.utmMedium,
      utmCampaign: firstTouch.utmCampaign || current.utmCampaign,
      utmTerm: firstTouch.utmTerm || current.utmTerm,
      utmContent: firstTouch.utmContent || current.utmContent,
      referralCode: firstTouch.referralCode || current.referralCode,
      referrer: firstTouch.referrer || current.referrer,
      landingPath: firstTouch.landingPath || current.landingPath,
    };
  };

  const buildContactMessage = () => {
    const lines = [
      'DxB Edge Insight enquiry',
      `Service: ${serviceLabel}`,
      fullName ? `Name: ${fullName}` : '',
      emailAddress ? `Email: ${emailAddress}` : '',
      combinedPhoneNumber ? `Phone: ${combinedPhoneNumber}` : '',
      investmentBudget ? `Investment Budget: ${investmentBudget} ${currency}` : '',
      isServicesModal && selectedServices.length > 0 ? `Additional Services: ${selectedServices.join(', ')}` : '',
    ].filter(Boolean);

    return lines.join('\n');
  };

  const whatsappUrl = `https://wa.me/${formatPhoneForWhatsApp(DIRECT_EXPERT_PHONE)}?text=${encodeURIComponent(buildContactMessage())}`;
  const emailSubject = encodeURIComponent(`DxB Edge Insight enquiry - ${serviceLabel}`);
  const emailBody = encodeURIComponent(buildContactMessage());
  const emailUrl = `mailto:contacts@dxbedge.com?subject=${emailSubject}&body=${emailBody}`;

  const handleCopyDetails = async () => {
    try {
      await navigator.clipboard.writeText(buildContactMessage());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const validateLeadDetails = (requireCaptcha = true) => {
    if (!fullName.trim() || !emailAddress.trim() || !phoneNumber.trim() || !investmentBudget.trim()) {
      setServiceError('Please complete all contact details before continuing.');
      return false;
    }

    if (!selectedPhoneCountryCode) {
      setServiceError('Please select or enter a valid country code.');
      return false;
    }

    if (isServicesModal && selectedServices.length === 0) {
      setServiceError('Select at least one additional service.');
      return false;
    }

    if (requireCaptcha && !captchaToken) {
      setServiceError('Please complete the CAPTCHA');
      return false;
    }

    setServiceError('');
    return true;
  };

  const submitLead = async () => {
    const payload = {
      fullName,
      emailAddress,
      phoneNumber: combinedPhoneNumber,
      investmentBudget,
      currency,
      selectedServices,
      serviceLabel,
      captchaToken,
      ...getAttributionData(),
    };

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!data.ok) {
        setServiceError(data.error || 'Something went wrong');
        return { ok: false as const };
      }

      if (data.whatsappSent === false) {
        console.warn('Lead created, but WhatsApp notification was not delivered.');
      }

      return { ok: true as const };
    } catch (err) {
      console.error(err);
      setServiceError('Submission failed. Please try again.');
      return { ok: false as const };
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDirectChannel = async (channel: 'whatsapp' | 'email') => {
    if (!validateLeadDetails(true) || isSubmitting) {
      return;
    }

    const result = await submitLead();
    if (!result.ok) {
      return;
    }

    setSubmitted(true);

    if (channel === 'whatsapp') {
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      return;
    }

    window.location.href = emailUrl;
  };

  if (!isOpen) return null;

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateLeadDetails(true) || isSubmitting) {
    return;
  }

  const result = await submitLead();
  if (result.ok) {
    setSubmitted(true);
  }
};


  return (
    <div className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-3 sm:p-4 bg-deep-forest/60 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg md:max-w-2xl max-h-[92vh] overflow-hidden relative border border-slate-200 flex flex-col my-2 sm:my-0">
        <button onClick={onClose} className="absolute top-3 right-3 sm:top-6 sm:right-6 text-slate-500 hover:text-deep-forest transition-colors z-20 bg-white/90 rounded-md p-1">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {!submitted ? (
          <div className="p-6 sm:p-10 overflow-y-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-brand-gold/15 p-2.5 sm:p-3 rounded-xl text-brand-gold">
                <svg className="w-5 h-5 sm:w-6 sm:text-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 005.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-deep-forest leading-tight">Connect with a {headingTypeLabel}</h2>
                <p className="text-[10px] sm:text-sm text-slate-grey font-medium uppercase tracking-widest opacity-60">Premium Advisory Pathway</p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-grey leading-relaxed mb-8">
              {isServicesModal
                ? 'Based on your requirements, we will connect you with vetted partner teams aligned to the selected additional services.'
                : `Based on your interest, we will connect you with a vetted, high-reputation ${type.toLowerCase()} specialised in the current market cycle.`}
            </p>

            <div className="mb-6 sm:mb-8 border border-slate-200 rounded-xl p-4 bg-soft-grey/40">
              <p className="text-[10px] sm:text-[11px] font-bold text-deep-forest uppercase tracking-[0.2em] mb-2">Direct Expert Contact</p>
              <p className="text-sm sm:text-base font-semibold text-deep-forest mb-4">{DIRECT_EXPERT_PHONE}</p>
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <a
                  href={`tel:${DIRECT_EXPERT_PHONE}`}
                  className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white text-deep-forest px-3 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.18em] hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a2 2 0 011.95 1.56l.57 2.28a2 2 0 01-.55 1.92L9.1 9.9a16 16 0 006.99 6.99l1.14-1.15a2 2 0 011.92-.55l2.28.57A2 2 0 0122 17.72V21a2 2 0 01-2 2h-1C10.72 23 1 13.28 1 2V1a2 2 0 012-2z" />
                  </svg>
                  Call
                </a>
                <button
                  type="button"
                  onClick={() => openDirectChannel('whatsapp')}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white text-deep-forest px-3 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.18em] hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.52 3.48A11.86 11.86 0 0012.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.16 1.6 5.98L0 24l6.3-1.65a11.84 11.84 0 005.76 1.48h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.24-6.17-3.45-8.45zM12.07 21.8h-.01a9.83 9.83 0 01-5.01-1.37l-.36-.21-3.74.98 1-3.65-.24-.37a9.79 9.79 0 01-1.52-5.27c0-5.43 4.42-9.85 9.86-9.85 2.63 0 5.1 1.02 6.97 2.89a9.8 9.8 0 012.88 6.97c0 5.43-4.42 9.85-9.84 9.85zm5.4-7.38c-.3-.15-1.79-.88-2.06-.98-.28-.1-.48-.15-.69.15-.2.3-.79.98-.96 1.18-.18.2-.35.23-.65.08-.3-.15-1.25-.46-2.38-1.48-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.69-1.66-.95-2.28-.25-.6-.5-.52-.69-.53l-.59-.01c-.2 0-.52.08-.8.38s-1.05 1.02-1.05 2.48 1.08 2.87 1.23 3.08c.15.2 2.12 3.24 5.14 4.54.72.31 1.28.49 1.72.63.72.23 1.37.2 1.89.12.58-.09 1.79-.73 2.05-1.44.25-.71.25-1.32.17-1.44-.08-.12-.27-.2-.57-.35z" />
                  </svg>
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => openDirectChannel('email')}
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white text-deep-forest px-3 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.18em] hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l8.52 5.68a1 1 0 001.11 0L21 8m-16 9h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Email
                </button>
                <button
                  type="button"
                  onClick={handleCopyDetails}
                  className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white text-deep-forest px-3 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.18em] hover:border-brand-gold hover:text-brand-gold transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16h8M8 12h8m-8-4h8M7 4h10a2 2 0 012 2v12a2 2 0 01-2 2H7a2 2 0 01-2-2V6a2 2 0 012-2z" />
                  </svg>
                  {copied ? 'Copied' : 'Copy Details'}
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[9px] sm:text-[10px] font-bold text-deep-forest uppercase tracking-widest mb-1.5">Full Name</label>
                <input required type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full bg-soft-grey border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20" placeholder="John Doe" />
              </div>
              
              <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-bold text-deep-forest uppercase tracking-widest mb-1.5">Email Address</label>
                  <input required type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} className="w-full bg-soft-grey border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-bold text-deep-forest uppercase tracking-widest mb-1.5">Phone (WhatsApp)</label>
                  <div className="grid grid-cols-[140px_minmax(0,1fr)] gap-2">
                    <div ref={countryCodeDropdownRef} className="relative">
                      <input
                        value={phoneCountryCode}
                        onChange={(e) => {
                          setPhoneCountryCode(e.target.value);
                          setIsCountryCodeDropdownOpen(true);
                        }}
                        onFocus={() => setIsCountryCodeDropdownOpen(true)}
                        className="w-full bg-soft-grey border border-slate-200 rounded-xl px-3 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                        placeholder="Search country code"
                      />
                      <button
                        type="button"
                        onClick={() => setIsCountryCodeDropdownOpen((current) => !current)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center text-slate-grey hover:text-deep-forest"
                        aria-label="Toggle country code options"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isCountryCodeDropdownOpen && (
                        <div className="absolute left-0 right-0 top-full z-20 mt-2 max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-xl">
                          {filteredPhoneCountryCodes.length > 0 ? (
                            filteredPhoneCountryCodes.map((option) => (
                              <button
                                key={`${option.label}-${option.code}`}
                                type="button"
                                onClick={() => {
                                  setPhoneCountryCode(option.label);
                                  setIsCountryCodeDropdownOpen(false);
                                }}
                                className="block w-full border-b border-slate-100 px-3 py-2 text-left text-sm text-deep-forest hover:bg-soft-grey/60 last:border-b-0"
                              >
                                {option.label}
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-slate-grey">No matching country codes</div>
                          )}
                        </div>
                      )}
                    </div>
                    <input required type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-soft-grey border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20" placeholder="58 123 4567" />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:grid sm:grid-cols-5 gap-4">
                <div className="sm:col-span-3">
                  <label className="block text-[9px] sm:text-[10px] font-bold text-deep-forest uppercase tracking-widest mb-1.5">Investment Budget</label>
                  <input required type="number" value={investmentBudget} onChange={(e) => setInvestmentBudget(e.target.value)} className="w-full bg-soft-grey border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20" placeholder="e.g. 2,000,000" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[9px] sm:text-[10px] font-bold text-deep-forest uppercase tracking-widest mb-1.5">Currency</label>
                  <select 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-soft-grey border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20 appearance-none cursor-pointer"
                  >
                    {CURRENCIES.map(c => (
                      <option key={c.code} value={c.code}>{c.code} ({c.name})</option>
                    ))}
                  </select>
                </div>
              </div>

              {isServicesModal && (
                <div>
                  <label className="block text-[9px] sm:text-[10px] font-bold text-deep-forest uppercase tracking-widest mb-1.5">Additional Services (Multi-Select)</label>
                  <select
                    multiple
                    value={selectedServices}
                    onChange={(e) => {
                      const select = e.target as HTMLSelectElement;
                      const values = Array.from(select.selectedOptions, (option) => option.value);
                      setSelectedServices(values);
                      if (values.length > 0) {
                        setServiceError('');
                      }
                    }}
                    className="w-full bg-soft-grey border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-gold/20"
                    size={4}
                  >
                    {ADDITIONAL_SERVICES.map((service) => (
                      <option key={service} value={service}>{service}</option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-grey/60 mt-2">Hold Ctrl (Windows) or Cmd (Mac) to select multiple services.</p>
                </div>
              )}



              {isOpen && (
                <Turnstile
                  sitekey={import.meta.env.VITE_TURNSTILE_SITE_KEY || ''}
                  onVerify={(token) => setCaptchaToken(token)}
                />
              )}

              {serviceError && <p className="text-[11px] text-red-600 mt-2">{serviceError}</p>}


              <button type="submit" disabled={isSubmitting} className="w-full bg-brand-navy text-white font-bold py-4 rounded-xl mt-4 hover:bg-brand-gold hover:text-brand-navy transition-all shadow-lg active:scale-95 sm:hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-brand-navy disabled:hover:text-white">
                {isSubmitting ? 'Submitting...' : 'Request Professional Connection'}
              </button>
              <p className="text-center text-[9px] sm:text-[10px] text-slate-grey/50 font-medium px-4">
                Your data is exclusively shared with vetted partners. No sales spam.
              </p>
            </form>
          </div>
        ) : (
          <div className="p-12 sm:p-16 text-center animate-fadeIn">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-brand-gold/15 rounded-full flex items-center justify-center mx-auto mb-6 text-brand-gold">
              <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-deep-forest mb-3">Request Received</h2>
            <p className="text-sm sm:text-base text-slate-grey leading-relaxed">
              {isServicesModal
                ? 'A specialised services coordinator will reach out shortly to action your selected requirements.'
                : `A specialised ${type.toLowerCase()} will reach out shortly to provide tailored guidance.`}
            </p>
            <p className="text-xs sm:text-sm text-slate-grey/80 mt-4 mb-6">Choose your preferred contact method to continue now.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={`tel:${DIRECT_EXPERT_PHONE}`}
                className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white text-deep-forest px-3 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.14em] hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                Call
              </a>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white text-deep-forest px-3 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.14em] hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={emailUrl}
                className="inline-flex items-center justify-center gap-2 border border-slate-300 bg-white text-deep-forest px-3 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.14em] hover:border-brand-gold hover:text-brand-gold transition-colors"
              >
                Email
              </a>
            </div>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setSelectedServices([]);
                setServiceError('');
                onClose();
              }}
              className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-slate-grey hover:text-deep-forest transition-colors"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadCaptureModal;
