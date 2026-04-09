const PROGRAM_GROUP_MAP = {
  dl: {
    dataKey: 'DL',
    amountBasis: 'loan',
    customerGroups: {
      all: 'AG2_PhoThong',
      gaming: 'WG2_Game',
      gamer: 'WG2_Game',
    },
  },
  ed: {
    dataKey: 'ED',
    amountBasis: 'product',
    customerGroups: {
      all: 'AG1_PhoThong',
      gaming: 'WG1_Game',
      gamer: 'WG1_Game',
    },
  },
};

const INSURANCE_RATE = 0.003325;
const COLLECTION_FEE = 12000;

// Linear offset rule on top of monthly base rate (baseRate / 12).
// Unit is percentage point of monthly flat rate.
const TERM_FLAT_RATE_OFFSETS = {
  12: 0.005,
  15: 0.005,
  18: 0.015,
  21: 0.025,
  24: 0.055,
};

const ED_PRIORITY_PACKAGE_NAME = 'sản phẩm điện máy và công nghệ';

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const normalizeKey = (value) => String(value || '').trim().toLowerCase();

const isEdPriorityPackage = (plan) => normalizeKey(plan?.packageName).startsWith(ED_PRIORITY_PACKAGE_NAME);

const getDocsPriority = (plan) => {
  const docs = Array.isArray(plan?.requiredDocs)
    ? plan.requiredDocs.map(normalizeKey).filter(Boolean)
    : [];

  if (docs.length === 1 && docs[0] === 'cccd') return 0;

  const hasCccd = docs.includes('cccd');
  const hasBlx = docs.includes('blx');

  if (docs.length === 2 && hasCccd && hasBlx) return 1;
  if (docs.length >= 3) return 2;
  if (docs.length === 2) return 3;
  if (docs.length === 1) return 4;

  return 5;
};

const inRange = (value, min, max) => value >= min && value <= max;

const selectCodeByInsurance = (plan, includeInsurance) => {
  if (includeInsurance) return plan.codeIns || plan.codeNoIns || null;
  return plan.codeNoIns || plan.codeIns || null;
};

const getFlatRateOffsetByTerm = (months) => {
  const term = toNumber(months, 0);
  return TERM_FLAT_RATE_OFFSETS[term] ?? 0;
};

const resolveFlatRatePercent = (plan, months) => {
  const monthKey = String(months);

  if (plan?.flatRateByTerm && plan.flatRateByTerm[monthKey] !== undefined) {
    return toNumber(plan.flatRateByTerm[monthKey], 0);
  }

  if (plan?.flatRatePercentByTerm && plan.flatRatePercentByTerm[monthKey] !== undefined) {
    return toNumber(plan.flatRatePercentByTerm[monthKey], 0);
  }

  if (plan?.flatRatePercent !== undefined) {
    return toNumber(plan.flatRatePercent, 0);
  }

  if (plan?.flatRateMonth !== undefined) {
    return toNumber(plan.flatRateMonth, 0);
  }

  // Fallback: derive monthly flat rate from annual base rate plus term-based linear offset.
  const monthlyBaseRate = toNumber(plan?.baseRate, 0) / 12;
  return monthlyBaseRate + getFlatRateOffsetByTerm(months);
};

export const calculatePromoLoan = (loanAmount, months, flatRatePercent, hasInsurance) => {
  const principal = toNumber(loanAmount, 0);
  const termMonths = toNumber(months, 0);

  if (principal <= 0 || termMonths <= 0) {
    return {
      monthlyLoan: 0,
      monthlyPrincipal: 0,
      monthlyInterest: 0,
      monthlyInsurance: 0,
      monthlyCollectionFee: COLLECTION_FEE,
      monthlyTotalFee: 0,
      monthlyPaymentRaw: 0,
      monthlyPayment: 0,
      totalFees: 0,
      totalPayment: 0,
      flatRatePercent: toNumber(flatRatePercent, 0),
    };
  }

  const flatRate = toNumber(flatRatePercent, 0) / 100;

  const monthlyPrincipal = principal / termMonths;
  const monthlyInterest = principal * flatRate;
  const monthlyInsurance = hasInsurance ? principal * INSURANCE_RATE : 0;

  const monthlyPaymentRaw = monthlyPrincipal + monthlyInterest + monthlyInsurance + COLLECTION_FEE;
  const monthlyPayment = Math.round(monthlyPaymentRaw / 1000) * 1000;

  const monthlyTotalFee = monthlyInterest + monthlyInsurance + COLLECTION_FEE;
  const totalFees = monthlyTotalFee * termMonths;
  const totalPayment = monthlyPayment * termMonths;

  return {
    monthlyLoan: monthlyPrincipal + monthlyInterest,
    monthlyPrincipal,
    monthlyInterest,
    monthlyInsurance,
    monthlyCollectionFee: COLLECTION_FEE,
    monthlyTotalFee,
    monthlyPaymentRaw,
    monthlyPayment,
    totalFees,
    totalPayment,
    flatRatePercent: toNumber(flatRatePercent, 0),
  };
};

const buildNoMatchReason = ({ amountForFilter, term, prepayPercent }) => (
  `Không tìm thấy gói phù hợp với số tiền đối chiếu ${amountForFilter}, kỳ hạn ${term} tháng, trả trước ${prepayPercent.toFixed(2)}%.`
);

export const calculateMonthlyPromoScheme = (formData = {}, schemeData = {}) => {
  const loanProgram = normalizeKey(formData.loanProgram);
  const customerType = normalizeKey(formData.customerType || 'all');

  const productPrice = toNumber(formData.productPrice, 0);
  const downPaymentAmount = toNumber(formData.downPaymentAmount, 0);
  const loanAmountFromInputs = productPrice > 0
    ? Math.max(productPrice - downPaymentAmount, 0)
    : 0;
  const loanAmount = loanAmountFromInputs > 0 ? loanAmountFromInputs : productPrice;

  const downPaymentPercent = toNumber(formData.downPaymentPercent, 0);
  const prepayPercent = downPaymentPercent > 0
    ? downPaymentPercent
    : (productPrice > 0 ? (downPaymentAmount / productPrice) * 100 : 0);

  const term = toNumber(formData.loanTerm, 0);
  const includeInsurance = Boolean(formData.includeInsurance);

  const mapping = PROGRAM_GROUP_MAP[loanProgram];

  if (!mapping) {
    return {
      ok: false,
      error: 'Chương trình vay không hợp lệ.',
      matchedCount: 0,
      matchedPackages: [],
      bestMatch: null,
      input: {
        loanProgram,
        customerType,
        productPrice,
        loanAmount,
        amountForFilter: loanAmount,
        term,
        prepayPercent,
        includeInsurance,
      },
    };
  }

  const dataKey = mapping.dataKey;
  const amountForFilter = mapping.amountBasis === 'product'
    ? productPrice
    : loanAmount;
  const groupKey = mapping.customerGroups[customerType] || mapping.customerGroups.all;
  const programData = schemeData?.[dataKey] || {};
  const plans = Array.isArray(programData?.[groupKey]) ? programData[groupKey] : [];

  if (amountForFilter <= 0 || term <= 0) {
    return {
      ok: false,
      error: 'Thiếu dữ liệu để lọc gói vay (số tiền vay hoặc kỳ hạn).',
      matchedCount: 0,
      matchedPackages: [],
      bestMatch: null,
      input: {
        loanProgram,
        customerType,
        productPrice,
        loanAmount,
        amountForFilter,
        term,
        prepayPercent,
        includeInsurance,
      },
      source: {
        dataKey,
        groupKey,
        amountBasis: mapping.amountBasis,
        totalPlans: plans.length,
      },
    };
  }

  const filtered = plans
    .filter((plan) => {
      const minAmount = toNumber(plan.minAmount, 0);
      const maxAmount = toNumber(plan.maxAmount, Number.MAX_SAFE_INTEGER);
      const minTerm = toNumber(plan.minTerm, 0);
      const maxTerm = toNumber(plan.maxTerm, Number.MAX_SAFE_INTEGER);
      const prepayMin = toNumber(plan.prepayMin, 0);
      const prepayMax = toNumber(plan.prepayMax, 100);

      return (
        inRange(amountForFilter, minAmount, maxAmount)
        && inRange(term, minTerm, maxTerm)
        && inRange(prepayPercent, prepayMin, prepayMax)
      );
    })
    .map((plan) => {
      const flatRatePercent = resolveFlatRatePercent(plan, term);
      const cashflow = calculatePromoLoan(loanAmount, term, flatRatePercent, includeInsurance);

      return {
        ...plan,
        selectedCode: selectCodeByInsurance(plan, includeInsurance),
        selectedByInsurance: includeInsurance ? 'codeIns' : 'codeNoIns',
        amountMatched: amountForFilter,
        termMatched: term,
        prepayMatched: prepayPercent,
        loanAmountUsed: loanAmount,
        flatRatePercent,
        cashflow,
        monthlyPayment: cashflow.monthlyPayment,
      };
    })
    .sort((a, b) => {
      const baseRateDiff = toNumber(a.baseRate) - toNumber(b.baseRate);
      if (baseRateDiff !== 0) return baseRateDiff;

      const docsPriorityDiff = getDocsPriority(a) - getDocsPriority(b);
      if (docsPriorityDiff !== 0) return docsPriorityDiff;

      const reducingRateDiff = toNumber(a.reducingRate) - toNumber(b.reducingRate);
      if (reducingRateDiff !== 0) return reducingRateDiff;

      const maxAmountDiff = toNumber(b.maxAmount) - toNumber(a.maxAmount);
      if (maxAmountDiff !== 0) return maxAmountDiff;

      return toNumber(a.minAmount) - toNumber(b.minAmount);
    });

  const edPriorityCandidates = loanProgram === 'ed'
    ? filtered.filter(isEdPriorityPackage)
    : filtered;

  const bestMatch = edPriorityCandidates[0] || filtered[0] || null;

  return {
    ok: true,
    error: null,
    input: {
      loanProgram,
      customerType,
      productPrice,
      loanAmount,
      amountForFilter,
      term,
      prepayPercent,
      includeInsurance,
    },
    source: {
      dataKey,
      groupKey,
      amountBasis: mapping.amountBasis,
      description: programData?.description || '',
      totalPlans: plans.length,
    },
    matchedCount: filtered.length,
    matchedPackages: filtered,
    bestMatch,
    noMatchReason: filtered.length === 0
      ? buildNoMatchReason({ amountForFilter, term, prepayPercent })
      : null,
  };
};
