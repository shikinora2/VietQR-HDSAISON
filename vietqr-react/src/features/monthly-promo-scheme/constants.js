export const MONTHLY_PROMO_PROGRAM_OPTIONS = [
  { value: 'ed', label: 'Chương trình ED' },
  { value: 'dl', label: 'Chương trình DL' },
];

export const MONTHLY_PROMO_CUSTOMER_TYPE_OPTIONS = [
  { value: 'all', label: 'Tất cả khách hàng' },
  { value: 'gaming', label: 'Khách hàng chơi game' },
];

export const MONTHLY_PROMO_LOAN_TERM_OPTIONS = [3, 6, 9, 12, 15, 18, 21, 24, 30, 36];

export const MONTHLY_PROMO_INITIAL_FORM_DATA = {
  productPrice: 0,
  downPaymentAmount: 0,
  downPaymentPercent: 0,
  loanTerm: 6,
  loanProgram: 'ed',
  customerType: 'all',
  includeInsurance: true,
};
