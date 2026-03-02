import React from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, Calendar, Percent } from 'lucide-react';
import { Card } from '../../components';
import { formatCurrency } from '../../utils/formatUtils';

const StyledCard = styled(Card)`
  padding: ${props => props.$compact ? props.theme.spacing.sm : props.theme.spacing.xl};
  min-height: ${props => props.$compact ? 'auto' : '400px'};
  display: flex;
  flex-direction: column;
  ${props => props.$compact && 'flex: 1;'}

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.$compact ? props.theme.spacing.sm : props.theme.spacing.md};
    min-height: auto;
  }
`;

const ResultsTitle = styled.h2`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.lg};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSize.lg};
    margin-bottom: ${props => props.theme.spacing.md};
  }
`;

const ResultsGrid = styled.div`
  display: ${props => props.$compact ? 'flex' : 'grid'};
  ${props => props.$compact ? `
    flex-direction: column;
    gap: ${props.theme.spacing.xs};
  ` : `
    gap: ${props.theme.spacing.md};
  `}
  flex: 1;
`;

const ResultItem = styled(motion.div)`
  padding: ${props => props.$compact ? props.theme.spacing.sm : props.theme.spacing.lg};
  background: ${props => props.theme.colors.background.alt};
  border-radius: ${props => props.theme.borderRadius.lg};
  border-left: ${props => props.$compact ? '3px' : '4px'} solid ${props => props.color || props.theme.colors.primary.main};
  ${props => props.$compact && 'flex: 1;'}
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.$compact ? props.theme.spacing.xs + ' ' + props.theme.spacing.sm : props.theme.spacing.md};
  }
`;

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.$compact ? '6px' : props.theme.spacing.sm};
  margin-bottom: ${props => props.$compact ? '4px' : props.theme.spacing.sm};
`;

const ResultIcon = styled.div`
  width: ${props => props.$compact ? '24px' : '32px'};
  height: ${props => props.$compact ? '24px' : '32px'};
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.color}20;
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.color};

  svg {
    width: ${props => props.$compact ? '14px' : '20px'};
    height: ${props => props.$compact ? '14px' : '20px'};
  }
`;

const ResultLabel = styled.div`
  font-size: ${props => props.$compact ? '10px' : props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  ${props => props.$compact && `
    line-height: 1.2;
  `}
`;

const ResultValue = styled(motion.div)`
  font-size: ${props => props.$compact ? props.theme.typography.fontSize.base : props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-top: ${props => props.$compact ? '4px' : props.theme.spacing.xs};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.$compact ? props.theme.typography.fontSize.sm : props.theme.typography.fontSize.xl};
  }
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

const CalculatorResults = ({ results, formData, compact }) => {
  if (!results) {
    return (
      <StyledCard variant="glass">
        <ResultsTitle>Kết Quả Tính Toán</ResultsTitle>
        <EmptyState>
          <EmptyIcon>📊</EmptyIcon>
          <p>Nhập thông tin khoản vay để xem kết quả</p>
        </EmptyState>
      </StyledCard>
    );
  }

  // Tính toán các giá trị cần hiển thị - TẤT CẢ LÀM TRÒN ĐẾN HÀNG NGHÌN
  const roundToThousand = (value) => Math.round(value / 1000) * 1000;

  // SỬ DỤNG TRỰC TIẾP monthlyPayment đã tính sẵn từ LoanCalculatorTab
  // KHÔNG tính lại để tránh sai số làm tròn
  const monthlyPaymentRounded = results.monthlyPayment;

  const monthlyPrincipal = roundToThousand(results.monthlyLoan);
  const monthlyInsuranceRounded = roundToThousand(results.monthlyInsurance);
  const monthlyCollectionFee = results.monthlyCollectionFee; // 12.000đ

  const monthlyTotalFee = roundToThousand(results.monthlyTotalFee);
  const totalFees = roundToThousand(results.totalFees);
  const totalPayment = roundToThousand(results.totalPayment);
  const totalWithDownPayment = roundToThousand(results.totalWithDownPayment);
  const downPaymentAmount = formData?.downPaymentAmount || 0;

  // Lấy tên chương trình lãi suất
  const getLoanProgramName = () => {
    if (results.loanProgram === 'regular') return 'theo chương trình thường';
    if (results.loanProgram === '0') return '0%';
    if (results.loanProgram === '0.005') return '0.5%/tháng';
    if (results.loanProgram === '0.01') return '1%/tháng';
    return results.loanProgram;
  };

  const resultItems = [
    {
      label: 'Số Tiền Thanh Toán Hàng Tháng',
      value: formatCurrency(monthlyPaymentRounded),
      icon: <Calendar size={20} />,
      color: '#6366F1',
      subtext: `Gốc: ${formatCurrency(monthlyPrincipal)} + BH: ${formatCurrency(monthlyInsuranceRounded)} + Phí: ${formatCurrency(monthlyCollectionFee)}`,
    },
    {
      label: 'Tổng Chi Phí Mỗi Tháng',
      value: formatCurrency(monthlyTotalFee),
      icon: <TrendingUp size={20} />,
      color: '#8B5CF6',
      subtext: `Phí thu hộ: ${formatCurrency(results.monthlyCollectionFee)} + BH: ${formatCurrency(monthlyInsuranceRounded)}`,
    },
    {
      label: 'Tổng Tiền Phí',
      value: formatCurrency(totalFees),
      icon: <Percent size={20} />,
      color: '#F59E0B',
      subtext: `Lãi suất: ${getLoanProgramName()} | BH 5% | Thu hộ ${formatCurrency(results.monthlyCollectionFee)}/tháng`,
    },
    {
      label: 'Tổng Thanh Toán',
      value: formatCurrency(totalWithDownPayment),
      icon: <DollarSign size={20} />,
      color: '#10B981',
      subtext: `Trả trước: ${formatCurrency(downPaymentAmount)} + Khoản vay: ${formatCurrency(totalPayment)} (Gốc + Lãi ${getLoanProgramName()} + Phí + BH)`,
    },
  ];

  return (
    <StyledCard variant="glass" $compact={compact}>
      {!compact && <ResultsTitle>Kết Quả Tính Toán</ResultsTitle>}

      <ResultsGrid $compact={compact}>
        <AnimatePresence mode="wait">
          {resultItems.map((item, index) => (
            <ResultItem
              key={item.label}
              color={item.color}
              $compact={compact}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ResultHeader $compact={compact}>
                <ResultIcon color={item.color} $compact={compact}>{item.icon}</ResultIcon>
                <ResultLabel $compact={compact}>{item.label}</ResultLabel>
              </ResultHeader>
              <ResultValue
                key={item.value}
                $compact={compact}
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              >
                {item.value}
              </ResultValue>
              {!compact && item.subtext && <ResultSubtext>{item.subtext}</ResultSubtext>}
            </ResultItem>
          ))}
        </AnimatePresence>
      </ResultsGrid>
    </StyledCard>
  );
};

export default CalculatorResults;
