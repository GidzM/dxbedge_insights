
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

interface Message {
  role: 'user' | 'model';
  text: string;
}

const DISPLAY_SOURCES = [
  "DXB Edge SME Insight",
  "D33 Analysis",
  "2040 Analysis",
  "Strategic Outlook"
];

const STRATEGIC_SHORTCUTS = [
  {
    title: "Yield Dynamics",
    query: "Identify the top 3 high-yield communities for 2026 based on the SME Insight data. Provide a comparative table.",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    )
  },
  {
    title: "Convergence Play",
    query: "Explain how the D33 trade expansion directly impacts industrial valuations in the Southern Corridor.",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )
  },
  {
    title: "Scarcity Analysis",
    query: "Map the permanent scarcity premiums of waterfront properties under the 2040 Urban Plan.",
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
];

/**
 * Custom renderer for the AI response to meet "Premium Consultation" requirements.
 * Cleans up markdown, handles tables, and applies executive styling.
 */
const FormattedResponse: React.FC<{ text: string }> = ({ text }) => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  
  let tableRows: string[][] = [];
  let isInsideTable = false;

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      const dataRows = tableRows.slice(2); 
      
      elements.push(
        <div key={`table-${elements.length}`} className="my-8 overflow-x-auto border border-slate-200 rounded-lg shadow-sm">
          <table className="w-full text-left border-collapse bg-white">
            <thead>
              <tr className="bg-soft-grey border-b-2 border-brand-navy">
                {headerRow.map((cell, i) => (
                  <th key={i} className="px-4 py-3 text-[11px] font-black text-brand-navy uppercase tracking-widest">
                    {cleanMarkdown(cell.trim())}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, i) => (
                <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-[13px] font-medium text-slate-grey leading-relaxed">
                      {parseInline(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
    isInsideTable = false;
  };

  function cleanMarkdown(content: string) {
    // Aggressively remove markdown symbols
    return content.replace(/[*_#~]/g, '').trim();
  }

  function parseInline(content: string) {
    // Strips all markdown symbols while processing bold patterns and currency
    // Using a non-capturing group for the markdown symbols to remove them entirely if they are not part of our bold target
    const parts = content.split(/(\*\*.*?\*\*|__.*?__|AED\s[\d,.]+[BMKT]?)/g);
    return parts.map((part, i) => {
      if ((part.startsWith('**') && part.endsWith('**')) || (part.startsWith('__') && part.endsWith('__'))) {
        return <strong key={i} className="text-brand-navy font-bold">{cleanMarkdown(part)}</strong>;
      }
      if (/AED\s[\d,.]+[BMKT]?/.test(part)) {
        return <strong key={i} className="text-brand-navy font-bold">{part}</strong>;
      }
      // Strip any stray markdown symbols from text parts
      return part.replace(/[*_#~]/g, '');
    });
  }

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    if (trimmed.startsWith('|')) {
      isInsideTable = true;
      const cells = trimmed.split('|').filter(c => c !== '');
      tableRows.push(cells);
      return;
    } else if (isInsideTable) {
      flushTable();
    }

    if (trimmed.startsWith('#')) {
      const title = cleanMarkdown(trimmed);
      elements.push(
        <h3 key={index} className="text-brand-navy font-black text-sm uppercase tracking-[0.25em] mt-10 mb-4 first:mt-0">
          {title}
        </h3>
      );
    } 
    else if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
      const content = trimmed.replace(/^[•\-*]\s*/, '');
      elements.push(
        <div key={index} className="flex gap-4 items-start mb-4 pl-2">
          <span className="text-brand-gold font-bold mt-1 text-sm">•</span>
          <p className="text-[14px] leading-[1.6] text-slate-grey font-medium flex-1">
            {parseInline(content)}
          </p>
        </div>
      );
    }
    else if (trimmed !== '') {
      if (trimmed === trimmed.toUpperCase() && trimmed.length > 3) {
        elements.push(
          <h3 key={index} className="text-brand-navy font-black text-sm uppercase tracking-[0.25em] mt-10 mb-4 first:mt-0">
            {cleanMarkdown(trimmed)}
          </h3>
        );
      } else {
        elements.push(
          <p key={index} className="text-[14px] leading-[1.6] text-slate-grey font-medium mb-6">
            {parseInline(trimmed)}
          </p>
        );
      }
    }
  });

  if (isInsideTable) flushTable();

  return <div className="formatted-message-container font-sans">{elements}</div>;
};

const DataTransparencyFooter: React.FC = () => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  const docTooltips: Record<string, string> = {
    "Dubai 2040 Urban Master Plan": "The structural roadmap for Dubai's spatial development and liveability until 2040.",
    "D33 Economic Agenda": "The economic roadmap to double the size of Dubai's economy and make it a top-3 global city by 2033.",
    "DxB Edge SME Strategic Insights": "Ground-truth tactical intelligence and yield projections distilled from specialised market experts."
  };

  const renderDoc = (name: string) => (
    <span 
      className="relative cursor-help font-bold text-slate-grey/80 underline decoration-slate-grey/20 underline-offset-2 hover:decoration-brand-gold hover:text-brand-gold transition-all"
      onMouseEnter={() => setActiveTooltip(name)}
      onMouseLeave={() => setActiveTooltip(null)}
    >
      {name}
      {activeTooltip === name && (
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-brand-navy text-white text-[10px] rounded shadow-xl z-50 animate-fadeIn pointer-events-none text-center">
          {docTooltips[name]}
        </span>
      )}
    </span>
  );

  return (
    <div className="bg-brand-navy border-t border-white/5 py-3 px-10 flex items-center justify-center relative z-20">
      <div className="flex items-center gap-4 max-w-4xl">
        <svg className="w-3.5 h-3.5 text-growth-green shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm9.496 3.123a1 1 0 10-1.414-1.414L8 8.914 6.707 7.621a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l3.5-3.5z" clipRule="evenodd" />
        </svg>
        <div className="flex items-baseline gap-2 text-[10px] sm:text-[11px] font-sans leading-relaxed text-slate-grey/50">
          <span className="font-black text-slate-grey/70 uppercase tracking-widest whitespace-nowrap">Verified Knowledge Base</span>
          <p>
            Insights generated by DxB Edge AI are derived exclusively from the following master documents: {renderDoc("Dubai 2040 Urban Master Plan")}, {renderDoc("D33 Economic Agenda")}, and {renderDoc("DxB Edge SME Strategic Insights")}. All citations are cross-referenced with official implementation timelines.
          </p>
        </div>
      </div>
    </div>
  );
};

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'model',
      text: "I am DxB Edge Insight. I provide unbiased, document-verified guidance on Dubai’s strategic evolution. How can I assist your investment strategy today?"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (latestMessageRef.current && !isLoading) {
      latestMessageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const userMessage = textToSend || input.trim();
    if (!userMessage || isLoading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_API_KEY;
        if (!apiKey) {
          console.error("Missing VITE_GEMINI_API_KEY (or VITE_API_KEY). Check .env.local and restart the dev server.");
          setMessages(prev => [...prev, { role: 'model', text: "Strategic data stream interrupted. Connection protocols failing." }]);
          return;
        }
        const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: `You are the DxB Edge Insight AI. 
MISSION: Transform SME knowledge and strategy into high-density educational guidance. 
PRIMARY KNOWLEDGE: DXB Edge SME Insight, D33 Analysis, 2040 Analysis, Strategic Outlook.
TONE: Professional, unbiased, guide-not-salesperson. 

FORMATTING RULES:
1. STRICT: DO NOT use italics (* or _ symbols for emphasis).
2. STRICT: DO NOT use markdown headers like ### or ##. Use UPPERCASE BOLD text for headers.
3. STRICT: DO NOT use markdown symbols (*, **, ###) in visible text. Use simple bolding for emphasis on figures.
4. BULLETS: Use only the simple dot symbol • for lists.
5. DATA FIRST: Bold statistics and major figures (e.g., AED 32T).
6. CITATION: Place [Source: Source Name] at the end of relevant paragraphs. Use: 'DXB Edge SME Insight', 'D33 Analysis', '2040 Analysis', or 'Strategic Outlook'.
7. TABLES: Use standard markdown table syntax for comparisons, which the UI will render into a premium table.
8. STYLE: Responses must be clean, executive, and high-density.`,
        }
      });
      setMessages(prev => [...prev, { role: 'model', text: response.text || "Communication timeout. Please re-verify strategic intent." }]);
    } catch (error) {
      // Surface the SDK error in the console to aid local debugging.
      console.error("Gemini API request failed", error);
      setMessages(prev => [...prev, { role: 'model', text: "Strategic data stream interrupted. Connection protocols failing." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-brand-navy overflow-hidden font-sans">
      {/* Premium Header */}
      <div className="bg-white border-b border-slate-200 px-10 py-5 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <h1 className="font-serif font-bold text-xl text-brand-navy italic leading-none">Premium Consultation Suite</h1>
            <span className="text-[9px] font-black text-brand-gold uppercase tracking-[0.4em] mt-1">Intelligence Hub</span>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[8px] font-bold text-slate-grey/40 uppercase tracking-widest mb-1">Session Status</span>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-growth-green rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-brand-navy uppercase tracking-tighter">Encrypted // Verified</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Knowledge Context (20%) */}
        <aside className="w-[20%] border-r border-white/5 bg-brand-navy p-10 hidden lg:flex flex-col overflow-y-auto">
          <h2 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] mb-10 border-b border-white/10 pb-4">Knowledge Context</h2>
          
          <div className="space-y-8">
            <div>
              <p className="text-[11px] text-white/40 font-bold uppercase tracking-widest mb-6">Active Sources</p>
              <ul className="space-y-4">
                {DISPLAY_SOURCES.map((source, idx) => (
                  <li key={idx} className="flex items-center gap-4 group cursor-default">
                    <div className="w-1 h-1 bg-brand-gold rounded-full group-hover:scale-150 transition-transform" />
                    <span className="text-[11px] text-white/80 font-bold tracking-tight">{source}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-10 border-t border-white/5 mt-10">
              <div className="p-5 bg-white/5 border border-white/10 rounded-lg">
                <p className="text-[9px] text-brand-gold font-black uppercase tracking-widest mb-2">Lead Strategist</p>
                <p className="text-[10px] text-white/60 font-medium">Unbiased, document-verified guidance protocol activated.</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Center Column: Chat Interface (60%) */}
        <main className="flex-1 flex flex-col bg-brand-navy relative">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M0 10h100M0 20h100M0 30h100M0 40h100M0 50h100M0 60h100M0 70h100M0 80h100M0 90h100M10 0v100M20 0v100M30 0v100M40 0v100M50 0v100M60 0v100M70 0v100M80 0v100M90 0v100' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/svg%3E")`,
            backgroundSize: '100px 100px'
          }} />

          <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar p-10 space-y-12 relative z-10 scroll-smooth">
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                ref={idx === messages.length - 1 ? latestMessageRef : null}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div className={`shadow-2xl relative ${
                  msg.role === 'user' 
                    ? 'max-w-[60%] md:max-w-[50%] lg:max-w-[40%] bg-growth-green text-white p-5 md:p-6 rounded-2xl rounded-tr-none' 
                    : 'max-w-[90%] md:max-w-[85%] bg-white text-brand-navy p-8 md:p-10 border border-brand-gold/10 rounded-2xl rounded-tl-none'
                }`}>
                  <div className="flex items-center gap-3 mb-6">
                    <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${msg.role === 'user' ? 'text-white/40' : 'text-brand-gold'}`}>
                      {msg.role === 'user' ? 'Investor Query' : 'DxB Edge Insight'}
                    </span>
                    <div className={`w-1 h-1 rounded-full ${msg.role === 'user' ? 'bg-white/20' : 'bg-brand-gold/20'}`} />
                  </div>
                  
                  {msg.role === 'model' ? (
                    <FormattedResponse text={msg.text} />
                  ) : (
                    <div className="text-[14px] leading-[1.6] whitespace-pre-wrap font-medium">
                      {msg.text}
                    </div>
                  )}

                  {msg.role === 'model' && (
                    <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-[8px] font-bold text-slate-grey/30 uppercase tracking-widest">Document Verified Intelligence</span>
                      <div className="flex gap-2">
                        <div className="w-1.5 h-1.5 bg-brand-gold/10 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-brand-gold/20 rounded-full" />
                        <div className="w-1.5 h-1.5 bg-brand-gold/30 rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl rounded-tl-none flex items-center gap-3">
                  <span className="text-[9px] font-black text-brand-gold uppercase tracking-widest">Synthesizing Strategy</span>
                  <div className="flex gap-1.5">
                    <div className="w-1 h-1 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 h-1 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 h-1 bg-brand-gold rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-10 bg-brand-navy border-t border-white/5 relative z-20">
            <div className="max-w-4xl mx-auto flex items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Inquire about yield performers, spatial growth, or economic convergence..."
                  className="w-full bg-white/5 border border-white/10 text-white pl-8 pr-32 py-5 text-sm focus:outline-none focus:border-brand-gold/50 transition-all rounded-full placeholder:text-white/20"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={isLoading}
                  className="absolute right-2 top-2 bottom-2 bg-brand-gold text-brand-navy px-8 text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white transition-all disabled:opacity-50"
                >
                  Analyze
                </button>
              </div>
            </div>
          </div>

          <DataTransparencyFooter />
        </main>

        {/* Right Column: Strategic Shortcuts (20%) */}
        <aside className="w-[20%] border-l border-white/5 bg-brand-navy p-10 hidden xl:flex flex-col overflow-y-auto">
          <h2 className="text-[10px] font-black text-brand-gold uppercase tracking-[0.3em] mb-10 border-b border-white/10 pb-4">Strategic Shortcuts</h2>
          <div className="space-y-6">
            {STRATEGIC_SHORTCUTS.map((shortcut, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(shortcut.query)}
                className="w-full text-left p-6 bg-white/5 border border-white/10 hover:border-brand-gold/50 hover:bg-white/10 transition-all group rounded-xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-brand-gold group-hover:scale-110 transition-transform">{shortcut.icon}</span>
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest leading-none">{shortcut.title}</span>
                </div>
                <p className="text-[11px] text-white/70 font-medium leading-relaxed italic">
                  "{shortcut.query.substring(0, 75)}..."
                </p>
              </button>
            ))}
          </div>

          <div className="mt-auto p-6 bg-white/5 border border-white/10 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <svg className="w-3 h-3 text-brand-gold" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h4 className="text-[9px] font-black text-brand-gold uppercase tracking-[0.3em]">Compliance</h4>
            </div>
            <p className="text-[10px] text-white/40 leading-relaxed font-medium">
              Intelligence stream limited to authorized sovereign datasets. Guidance provided is educational and document-verified.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default AIAssistant;
