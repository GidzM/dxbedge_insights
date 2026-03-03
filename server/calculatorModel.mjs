export const DATA_LICENSE_TYPES = {
  OPEN: 'open',
  LICENSED: 'licensed',
  INTERNAL: 'internal',
};

export const CALCULATOR_SCHEMA = {
  version: '1.0.0',
  dimensions: [
    'livingCostUsdMonthly',
    'gdpGrowthAnnualPct',
    'fdiInflowsPctGdp',
  ],
  governance: {
    requiredFields: ['source', 'licenseType', 'asOfDate', 'city', 'metric', 'value', 'unit'],
    allowedLicenseTypes: Object.values(DATA_LICENSE_TYPES),
    policy: 'Only licensed, open, or internal-authorized metrics are publishable to app clients.',
  },
};

export const SOURCE_CATALOG = [
  {
    source: 'World Bank API',
    licenseType: DATA_LICENSE_TYPES.OPEN,
    metrics: ['gdpGrowthAnnualPct', 'fdiInflowsPctGdp'],
  },
  {
    source: 'Livingcost.org',
    licenseType: DATA_LICENSE_TYPES.OPEN,
    metrics: ['livingCostUsdMonthly'],
  },
];

export const SNAPSHOT_DATA = [
  { city: 'Dubai', metric: 'livingCostUsdMonthly', value: 2514, unit: 'USD', asOfDate: '2025-10-14', source: 'Livingcost.org', licenseType: DATA_LICENSE_TYPES.OPEN },
  { city: 'Singapore', metric: 'livingCostUsdMonthly', value: 3201, unit: 'USD', asOfDate: '2025-10-14', source: 'Livingcost.org', licenseType: DATA_LICENSE_TYPES.OPEN },
  { city: 'Hong Kong', metric: 'livingCostUsdMonthly', value: 2718, unit: 'USD', asOfDate: '2025-10-14', source: 'Livingcost.org', licenseType: DATA_LICENSE_TYPES.OPEN },
  { city: 'London', metric: 'livingCostUsdMonthly', value: 3851, unit: 'USD', asOfDate: '2025-10-14', source: 'Livingcost.org', licenseType: DATA_LICENSE_TYPES.OPEN },
  { city: 'New York', metric: 'livingCostUsdMonthly', value: 4203, unit: 'USD', asOfDate: '2025-10-14', source: 'Livingcost.org', licenseType: DATA_LICENSE_TYPES.OPEN },

  { city: 'Dubai', metric: 'gdpGrowthAnnualPct', value: 3.99, unit: 'pct', asOfDate: '2024-12-31', source: 'World Bank API', licenseType: DATA_LICENSE_TYPES.OPEN },
  { city: 'Singapore', metric: 'gdpGrowthAnnualPct', value: 4.39, unit: 'pct', asOfDate: '2024-12-31', source: 'World Bank API', licenseType: DATA_LICENSE_TYPES.OPEN },
  { city: 'Hong Kong', metric: 'gdpGrowthAnnualPct', value: 2.5, unit: 'pct', asOfDate: '2024-12-31', source: 'World Bank API', licenseType: DATA_LICENSE_TYPES.OPEN },
  { city: 'London', metric: 'gdpGrowthAnnualPct', value: 1.13, unit: 'pct', asOfDate: '2024-12-31', source: 'World Bank API', licenseType: DATA_LICENSE_TYPES.OPEN },
  { city: 'New York', metric: 'gdpGrowthAnnualPct', value: 2.79, unit: 'pct', asOfDate: '2024-12-31', source: 'World Bank API', licenseType: DATA_LICENSE_TYPES.OPEN },

  { city: 'Dubai', metric: 'fdiInflowsPctGdp', value: 8.26, unit: 'pct', asOfDate: '2024-12-31', source: 'World Bank API', licenseType: DATA_LICENSE_TYPES.OPEN },
  { city: 'Singapore', metric: 'fdiInflowsPctGdp', value: 27.76, unit: 'pct', asOfDate: '2024-12-31', source: 'World Bank API', licenseType: DATA_LICENSE_TYPES.OPEN },
  { city: 'Hong Kong', metric: 'fdiInflowsPctGdp', value: 30.92, unit: 'pct', asOfDate: '2024-12-31', source: 'World Bank API', licenseType: DATA_LICENSE_TYPES.OPEN },
  { city: 'London', metric: 'fdiInflowsPctGdp', value: -0.35, unit: 'pct', asOfDate: '2024-12-31', source: 'World Bank API', licenseType: DATA_LICENSE_TYPES.OPEN },
  { city: 'New York', metric: 'fdiInflowsPctGdp', value: 1.03, unit: 'pct', asOfDate: '2024-12-31', source: 'World Bank API', licenseType: DATA_LICENSE_TYPES.OPEN },
];

export function validateSnapshotRecord(record) {
  for (const field of CALCULATOR_SCHEMA.governance.requiredFields) {
    if (record[field] === undefined || record[field] === null || record[field] === '') {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }

  if (!CALCULATOR_SCHEMA.governance.allowedLicenseTypes.includes(record.licenseType)) {
    return { valid: false, error: `Unsupported licenseType: ${record.licenseType}` };
  }

  if (!CALCULATOR_SCHEMA.dimensions.includes(record.metric)) {
    return { valid: false, error: `Unsupported metric: ${record.metric}` };
  }

  if (typeof record.value !== 'number' || Number.isNaN(record.value)) {
    return { valid: false, error: 'Metric value must be a number.' };
  }

  return { valid: true };
}

export function snapshotsByCity(records = SNAPSHOT_DATA) {
  const map = new Map();

  for (const row of records) {
    const current = map.get(row.city) || { city: row.city };
    current[row.metric] = row.value;
    map.set(row.city, current);
  }

  return Array.from(map.values());
}

export function computeCityScores({
  monthlyBudget = 3200,
  objective = 'balanced',
  riskTolerance = 'medium',
  timeHorizon = 'medium',
  records = SNAPSHOT_DATA,
} = {}) {
  const markets = snapshotsByCity(records);

  const baseWeightsByObjective = {
    balanced: { affordability: 0.34, growth: 0.33, capitalFlow: 0.33 },
    income: { affordability: 0.55, growth: 0.2, capitalFlow: 0.25 },
    growth: { affordability: 0.15, growth: 0.45, capitalFlow: 0.4 },
    defensive: { affordability: 0.5, growth: 0.2, capitalFlow: 0.3 },
  };

  const selectedWeights = baseWeightsByObjective[objective] || baseWeightsByObjective.balanced;
  const adjustedWeights = { ...selectedWeights };

  if (timeHorizon === 'short') {
    adjustedWeights.affordability += 0.05;
    adjustedWeights.growth -= 0.025;
    adjustedWeights.capitalFlow -= 0.025;
  }

  if (timeHorizon === 'long') {
    adjustedWeights.affordability -= 0.05;
    adjustedWeights.growth += 0.025;
    adjustedWeights.capitalFlow += 0.025;
  }

  const maxLivingCost = Math.max(...markets.map((market) => market.livingCostUsdMonthly || 0), 1);
  const maxGdpGrowth = Math.max(...markets.map((market) => market.gdpGrowthAnnualPct || 0), 1);
  const maxFdiInflows = Math.max(...markets.map((market) => market.fdiInflowsPctGdp || 0), 1);

  const ranking = markets
    .map((market) => {
      const affordabilityScore = Math.max(0, 1 - (market.livingCostUsdMonthly || 0) / maxLivingCost);
      const growthScore = Math.max(0, (market.gdpGrowthAnnualPct || 0) / maxGdpGrowth);
      const capitalFlowScore = Math.max(0, (market.fdiInflowsPctGdp || 0) / maxFdiInflows);
      const budgetFit = Math.min(1, monthlyBudget / Math.max(market.livingCostUsdMonthly || 1, 1));

      let score =
        affordabilityScore * adjustedWeights.affordability +
        growthScore * adjustedWeights.growth +
        capitalFlowScore * adjustedWeights.capitalFlow;

      score = score * (0.85 + budgetFit * 0.15);

      if (riskTolerance === 'low') {
        score = score * (0.9 + affordabilityScore * 0.1);
      }

      if (riskTolerance === 'high') {
        score = score * (0.9 + growthScore * 0.1);
      }

      return {
        city: market.city,
        score,
        signals: {
          affordabilityScore,
          growthScore,
          capitalFlowScore,
          budgetFit,
        },
      };
    })
    .sort((a, b) => b.score - a.score);

  return {
    modelVersion: CALCULATOR_SCHEMA.version,
    inputs: { monthlyBudget, objective, riskTolerance, timeHorizon },
    topPick: ranking[0] || null,
    ranking,
  };
}
