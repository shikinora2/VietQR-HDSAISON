import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components';
import { useBreakpoint } from '../../hooks/useResponsive';
import MonthlyPromoSchemeForm from './components/MonthlyPromoSchemeForm';
import MonthlyPromoSchemeResultPlaceholder from './components/MonthlyPromoSchemeResultPlaceholder';
import { MONTHLY_PROMO_INITIAL_FORM_DATA } from './constants';
import schemeData from './data/monthlyPromoSchemeData.json';
import { calculateMonthlyPromoScheme } from './utils/monthlyPromoCalculator';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${props => props.$mobile ? props.theme.spacing.xs : props.theme.spacing.xl};
  min-height: ${props => props.$mobile ? 'calc(100vh - 60px)' : 'auto'};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(248, 250, 252, 0.2);
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.card || props.theme.shadows.lg};
  flex-wrap: wrap;
  gap: ${props => props.theme.spacing.sm};
`;

const MobileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.surface.default};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  box-shadow: ${props => props.theme.shadows.sm};
  gap: ${props => props.theme.spacing.xs};
  margin: -${props => props.theme.spacing.md} -${props => props.theme.spacing.md} 0 -${props => props.theme.spacing.md};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.theme.typography.fontSize.base};
  }
`;

const DesktopContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.xl};
`;

const MobileContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
  flex: 1;
`;

const MonthlyPromoSchemeTab = () => {
  const { isMobileOrTablet } = useBreakpoint();
  const [formData, setFormData] = useState(MONTHLY_PROMO_INITIAL_FORM_DATA);

  const calculationResult = useMemo(
    () => calculateMonthlyPromoScheme(formData, schemeData),
    [formData]
  );

  const handleFormChange = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleReset = () => {
    setFormData(MONTHLY_PROMO_INITIAL_FORM_DATA);
  };

  if (isMobileOrTablet) {
    return (
      <Container $mobile>
        <MobileHeader>
          <Title>🎁 Scheme khuyến mãi tháng</Title>
          <Button
            variant="ghost"
            size="sm"
            icon={<RotateCcw size={16} />}
            onClick={handleReset}
          >
            Reset
          </Button>
        </MobileHeader>

        <MobileContent>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <MonthlyPromoSchemeForm
              formData={formData}
              onChange={handleFormChange}
              compact
            />
          </motion.div>

          <motion.div
            style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.05 }}
          >
            <MonthlyPromoSchemeResultPlaceholder result={calculationResult} compact />
          </motion.div>
        </MobileContent>
      </Container>
    );
  }

  return (
    <Container>
      <Header>
        <Title>🎁 Scheme khuyến mãi hàng tháng</Title>
        <Button
          variant="ghost"
          icon={<RotateCcw size={18} />}
          onClick={handleReset}
        >
          Làm mới
        </Button>
      </Header>

      <DesktopContent>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <MonthlyPromoSchemeForm
            formData={formData}
            onChange={handleFormChange}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <MonthlyPromoSchemeResultPlaceholder result={calculationResult} />
        </motion.div>
      </DesktopContent>
    </Container>
  );
};

export default MonthlyPromoSchemeTab;
