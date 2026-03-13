import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type CurrencyCode = 'AED' | 'USD' | 'EUR' | 'GBP' | 'SAR' | 'INR' | 'CNY';

const STORAGE_KEY = 'dxb-edge-display-currency';

const AED_TO_CURRENCY_RATE: Record<CurrencyCode, number> = {
  AED: 1,
  USD: 0.2723,
  EUR: 0.251,
  GBP: 0.212,
  SAR: 1.021,
  INR: 22.57,
  CNY: 1.959,
};

const CURRENCY_LABELS: Record<CurrencyCode, string> = {
  AED: 'UAE Dirham',
  USD: 'US Dollar',
  EUR: 'Euro',
  GBP: 'British Pound',
  SAR: 'Saudi Riyal',
  INR: 'Indian Rupee',
  CNY: 'Chinese Yuan',
};

interface CurrencyContextValue {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  currencyOptions: { code: CurrencyCode; name: string }[];
  convertFromAED: (amountAED: number) => number;
  convertToAED: (amountInSelectedCurrency: number) => number;
  formatFromAED: (amountAED: number, options?: Intl.NumberFormatOptions) => string;
  formatRangeFromAED: (minAED: number, maxAED: number, options?: Intl.NumberFormatOptions) => string;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrencyState] = useState<CurrencyCode>('AED');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as CurrencyCode | null;
    if (saved && AED_TO_CURRENCY_RATE[saved]) {
      setCurrencyState(saved);
    }
  }, []);

  const setCurrency = (nextCurrency: CurrencyCode) => {
    setCurrencyState(nextCurrency);
    localStorage.setItem(STORAGE_KEY, nextCurrency);
  };

  const convertFromAED = (amountAED: number) => {
    if (!Number.isFinite(amountAED)) return 0;
    return amountAED * AED_TO_CURRENCY_RATE[currency];
  };

  const convertToAED = (amountInSelectedCurrency: number) => {
    if (!Number.isFinite(amountInSelectedCurrency)) return 0;
    return amountInSelectedCurrency / AED_TO_CURRENCY_RATE[currency];
  };

  const formatFromAED = (amountAED: number, options?: Intl.NumberFormatOptions) => {
    const converted = convertFromAED(amountAED);
    const shouldCompact = Math.abs(converted) >= 1_000_000;

    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency,
      notation: shouldCompact ? 'compact' : 'standard',
      compactDisplay: 'short',
      maximumFractionDigits: shouldCompact ? 1 : 0,
      ...options,
    }).format(converted);
  };

  const formatRangeFromAED = (minAED: number, maxAED: number, options?: Intl.NumberFormatOptions) => {
    return `${formatFromAED(minAED, options)}–${formatFromAED(maxAED, options)}`;
  };

  const currencyOptions = useMemo(
    () =>
      (Object.keys(CURRENCY_LABELS) as CurrencyCode[]).map((code) => ({
        code,
        name: CURRENCY_LABELS[code],
      })),
    []
  );

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        currencyOptions,
        convertFromAED,
        convertToAED,
        formatFromAED,
        formatRangeFromAED,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
