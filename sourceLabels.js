export const CANONICAL_SOURCE_LABELS = [
  'DXB Expert Insights',
  '2040 Analysis',
  'D33 Analysis',
  'D33 and 2040 Strategic Outlook',
];

export const SOURCE_TOOLTIPS = {
  'DXB Expert Insights': 'Consolidated SME intelligence, including strategic notes and commercial investment guidance.',
  '2040 Analysis': 'Urban planning implications derived from the Dubai 2040 analysis document.',
  'D33 Analysis': 'Economic and policy implications derived from the D33 analysis document.',
  'D33 and 2040 Strategic Outlook': 'Combined strategy synthesis across the D33 and Dubai 2040 analysis corpus.',
};

export const SOURCE_LABEL_OVERRIDES_BY_FILE = {
  'sme_notes.txt': 'DXB Expert Insights',
  'investor_project_5_-_commerical_information.txt': 'DXB Expert Insights',
  'knowledge/2040 doc analysis.txt': '2040 Analysis',
  'knowledge/d33 doc analysis.txt': 'D33 Analysis',
  'knowledge/combined d33 2040 doc analysis.txt': 'D33 and 2040 Strategic Outlook',
};
