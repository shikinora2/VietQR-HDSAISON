import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';
import { Card } from '../../components';
import { formatCurrency } from '../../utils/formatUtils';

const StyledCard = styled(Card)`
  padding: ${props => props.theme.spacing.xl};
  min-height: 400px;
  display: flex;
  flex-direction: column;
`;

const ResultsTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const ResultsGrid = styled.div`
  display: grid;
  gap: ${props => props.theme.spacing.md};
  flex: 1;
`;

const ResultItem = styled(motion.div)`
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background.alt};
  border-radius: ${props => props.theme.borderRadius.lg};
  border-left: 4px solid ${props => props.color || props.theme.colors.primary.main};
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ResultIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color}20;
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.color};
`;

const ResultLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const ResultValue = styled(motion.div)`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-top: ${props => props.theme.spacing.xs};
`;

const ResultSubtext = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  margin-top: ${props => props.theme.spacing.xs};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  color: ${props => props.theme.colors.text.secondary};
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  margin-bottom: ${props => props.theme.spacing.md};
  opacity: 0.3;
`;

const CalculatorResults = ({ results, formData }) => {
  if (!results) {
    return (
      <StyledCard variant="elevated">
        <ResultsTitle>Kết Quả Tính Toán</ResultsTitle>
        <EmptyState>
          <EmptyIcon>📊</EmptyIcon>
          <p>Nhập thông tin khoản vay để xem kết quả</p>
        </EmptyState>
      </StyledCard>
    );
  }

  const resultItems = [
    {
      label: 'Trả Hàng Tháng',
      value: formatCurrency(results.monthlyPayment),
      icon: <Calendar size={20} />,
      color: '#6366F1',
      subtext: `Gốc: ${formatCurrency(results.monthlyLoan)}${
        results.monthlyInsurance > 0 ? ` + BH: ${formatCurrency(results.monthlyInsurance)}` : ''
      }`,
    },
    {
      label: 'Tổng Tiền Lãi',
      value: formatCurrency(results.totalInterest),
      icon: <Percent size={20} />,
      color: '#F59E0B',
      subtext: `Lãi suất hiệu dụng: ${results.effectiveInterestRate.toFixed(2)}%`,
    },
    {
      label: 'Tổng Thanh Toán',
      value: formatCurrency(results.totalPayment),
      icon: <DollarSign size={20} />,
      color: '#10B981',
      subtext: `Gốc: ${formatCurrency(results.principal)} + Lãi: ${formatCurrency(results.totalInterest)}`,
    },
    {
      label: 'Tổng Chi Phí',
      value: formatCurrency(results.totalWithDownPayment),
      icon: <TrendingUp size={20} />,
      color: '#EF4444',
      subtext: `Bao gồm trả trước ${formatCurrency(formData.downPaymentAmount)}`,
    },
  ];

  return (
    <StyledCard variant="elevated">
      <ResultsTitle>Kết Quả Tính Toán</ResultsTitle>

      <ResultsGrid>
        <AnimatePresence mode="wait">
          {resultItems.map((item, index) => (
            <ResultItem
              key={item.label}
              color={item.color}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ResultHeader>
                <ResultIcon color={item.color}>{item.icon}</ResultIcon>
                <ResultLabel>{item.label}</ResultLabel>
              </ResultHeader>
              <ResultValue
                key={item.value}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                {item.value}
              </ResultValue>
              {item.subtext && <ResultSubtext>{item.subtext}</ResultSubtext>}
            </ResultItem>
          ))}
        </AnimatePresence>
      </ResultsGrid>
    </StyledCard>
  );
};

export default CalculatorResults;
