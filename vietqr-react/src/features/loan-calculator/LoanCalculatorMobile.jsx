import React from 'react';
import styled from 'styled-components';
import { RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../components';
import CalculatorForm from './CalculatorForm';
import CalculatorResults from './CalculatorResults';

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.surface.default};
  border-bottom: 1px solid ${props => props.theme.colors.border.light};
  box-shadow: ${props => props.theme.shadows.sm};
  gap: ${props => props.theme.spacing.sm};
  margin: -${props => props.theme.spacing.md} -${props => props.theme.spacing.md} 0 -${props => props.theme.spacing.md};
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const StackedLayout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

/**
 * Mobile Layout cho LoanCalculator Tab
 * Stacked layout: Form trên, Results dưới
 */
const LoanCalculatorMobile = ({
    formData,
    results,
    onFormChange,
    onReset,
}) => {
    return (
        <Container>
            <Header>
                <Title>🧮 Tính Khoản Vay</Title>
                <Button
                    variant="ghost"
                    size="sm"
                    icon={<RotateCcw size={16} />}
                    onClick={onReset}
                >
                    Reset
                </Button>
            </Header>

            <StackedLayout>
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <CalculatorForm
                        formData={formData}
                        onChange={onFormChange}
                        compact
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.1 }}
                >
                    <CalculatorResults results={results} formData={formData} compact />
                </motion.div>
            </StackedLayout>
        </Container>
    );
};

export default LoanCalculatorMobile;
