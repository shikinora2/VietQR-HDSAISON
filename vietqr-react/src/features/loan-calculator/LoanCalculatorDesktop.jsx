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
  gap: ${props => props.theme.spacing.xl};
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

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const SplitLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${props => props.theme.spacing.xl};
`;

/**
 * Desktop Layout cho LoanCalculator Tab
 * 2-column grid: Form bên trái, Results bên phải
 */
const LoanCalculatorDesktop = ({
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
                    icon={<RotateCcw size={18} />}
                    onClick={onReset}
                >
                    Làm mới
                </Button>
            </Header>

            <SplitLayout>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <CalculatorForm
                        formData={formData}
                        onChange={onFormChange}
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <CalculatorResults results={results} formData={formData} />
                </motion.div>
            </SplitLayout>
        </Container>
    );
};

export default LoanCalculatorDesktop;
