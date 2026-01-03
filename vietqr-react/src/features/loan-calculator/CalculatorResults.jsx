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

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.md};
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
  display: grid;
  gap: ${props => props.theme.spacing.md};
  flex: 1;
`;

const ResultItem = styled(motion.div)`
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background.alt};
  border-radius: ${props => props.theme.borderRadius.lg};
  border-left: 4px solid ${props => props.color || props.theme.colors.primary.main};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.theme.spacing.md};
  }
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

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSize.xl};
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

const CalculatorResults = ({ results, formData }) => {
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
      value: formatCurrency(totalPayment),
      icon: <DollarSign size={20} />,
      color: '#10B981',
      subtext: `Gốc + Lãi (${getLoanProgramName()}) + Phí thu hộ + BH`,
    },
  ];

  return (
    <StyledCard variant="glass">
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
