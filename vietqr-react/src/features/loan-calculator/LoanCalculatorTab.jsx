import React, { useState, useEffect } from 'react';
import { useBreakpoint } from '../../hooks/useResponsive';
import LoanCalculatorDesktop from './LoanCalculatorDesktop';
import LoanCalculatorMobile from './LoanCalculatorMobile';

const LoanCalculatorTab = () => {
  const { isMobileOrTablet } = useBreakpoint();

  const [formData, setFormData] = useState({
    productPrice: 0,
    downPaymentAmount: 0,
    downPaymentPercent: 0,
    loanTerm: 6,
    loanProgram: '0',
    includeInsurance: true,
  });

  const [results, setResults] = useState(null);

  useEffect(() => {
    calculateLoan();
  }, [formData]);

  const calculateLoan = () => {
    const {
      productPrice,
      downPaymentAmount,
      loanTerm,
      loanProgram,
      includeInsurance,
    } = formData;

    const loanAmount = (productPrice > 0 && productPrice >= downPaymentAmount)
      ? productPrice - downPaymentAmount
      : 0;

    if (loanAmount <= 0) {
      setResults(null);
      return;
    }

    let monthlyInstallment = 0;
    let totalDifference = 0;
    let totalPriceWithFees = 0;
    let totalInterest = 0;

    const totalInsurance = includeInsurance ? loanAmount * 0.05 : 0;
    const monthlyInsurance = totalInsurance / loanTerm;

    if (loanProgram === 'regular') {
      const coefficients = { '6': 0.20, '9': 0.1393, '12': 0.11135, '15': 0.0947, '7': 0.175 };
      const coefficient = coefficients[String(loanTerm)];
      if (coefficient) {
        const basePaymentWithInsurance = loanAmount * coefficient;
        const basePayment = includeInsurance ? basePaymentWithInsurance - monthlyInsurance : basePaymentWithInsurance;
        monthlyInstallment = basePayment + monthlyInsurance + 12000;
        totalDifference = (monthlyInstallment * loanTerm) - loanAmount;
        totalDifference = Math.round(totalDifference / 1000) * 1000;
      } else {
        monthlyInstallment = (loanAmount / loanTerm) + 12000 + monthlyInsurance;
      }
    } else {
      const interestRate = parseFloat(loanProgram);

      if (interestRate === 0.005) {
        // Lãi suất 0.5% chỉ áp dụng cho 9 và 12 tháng
        // Công thức: Lãi = Số tiền vay × 0.5% × Số tháng
        const interestCoefficients = {
          '9': 0.045,   // 0.5% × 9 = 4.5%
          '12': 0.06    // 0.5% × 12 = 6%
        };
        const coeff = interestCoefficients[String(loanTerm)];

        if (coeff) {
          totalInterest = loanAmount * coeff;
        } else {
          // Nếu không phải 9 hoặc 12 tháng, không áp dụng lãi suất 0.5%
          totalInterest = 0;
        }
      } else {
        totalInterest = loanAmount * interestRate * loanTerm;
      }

      const totalCollectionFee = 12000 * loanTerm;
      totalDifference = Math.round((totalInsurance + totalInterest + totalCollectionFee) / 1000) * 1000;
      monthlyInstallment = (loanAmount + totalDifference) / loanTerm;
    }

    totalPriceWithFees = productPrice + totalDifference;
    const displayMonthly = Math.ceil(monthlyInstallment / 1000) * 1000;
    const monthlyCollectionFee = 12000;
    const totalCollectionFee = monthlyCollectionFee * loanTerm;
    const monthlyTotalFee = totalDifference / loanTerm;

    setResults({
      principal: loanAmount,
      loanTerm: loanTerm,
      monthlyPayment: displayMonthly,
      monthlyLoan: loanAmount / loanTerm,
      monthlyInsurance: monthlyInsurance,
      monthlyCollectionFee: monthlyCollectionFee,
      monthlyTotalFee: monthlyTotalFee,
      totalPayment: loanAmount + totalDifference,
      totalInterest: totalInterest,
      totalInsurance: totalInsurance,
      totalCollectionFee: totalCollectionFee,
      totalFees: totalDifference,
      totalWithDownPayment: totalPriceWithFees,
      effectiveInterestRate: (totalDifference / loanAmount) * 100,
      displayDifference: totalDifference,
      loanProgram: loanProgram,
    });
  };

  const handleFormChange = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    setFormData({
      productPrice: 0,
      downPaymentAmount: 0,
      downPaymentPercent: 0,
      loanTerm: 6,
      loanProgram: '0',
      includeInsurance: true,
    });
    setResults(null);
  };

  const layoutProps = {
    formData,
    results,
    onFormChange: handleFormChange,
    onReset: handleReset,
  };

  return isMobileOrTablet ? (
    <LoanCalculatorMobile {...layoutProps} />
  ) : (
    <LoanCalculatorDesktop {...layoutProps} />
  );
};

export default LoanCalculatorTab;

