/**
 * Dark Mode Test Page
 * Comprehensive test of all components in light/dark modes
 */

import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../styles/ThemeProvider';
import Button from '../components/atoms/Button';
import Card from '../components/atoms/Card';
import Input from '../components/atoms/Input';
import { ThemeToggleMenu, ThemeToggleCompact } from '../components/molecules/ThemeToggle';
import { Sun, Moon, Monitor, Check, X, AlertCircle } from 'lucide-react';

const TestContainer = styled.div`
  min-height: 100vh;
  padding: ${props => props.theme.spacing.xl};
  background: ${props => props.theme.colors.background.default};
  color: ${props => props.theme.colors.text.primary};
  transition: all ${props => props.theme.transitions.base};
`;

const TestSection = styled.section`
  max-width: 1200px;
  margin: 0 auto ${props => props.theme.spacing['2xl']};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const TestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${props => props.theme.spacing.md};
  margin-bottom: ${props => props.theme.spacing.lg};
`;

const TestCard = styled(Card)`
  padding: ${props => props.theme.spacing.lg};
`;

const ColorSwatch = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.md};
  background: ${props => props.theme.colors.background.paper};
  border: 1px solid ${props => props.theme.colors.border.main};
  margin-bottom: ${props => props.theme.spacing.sm};
`;

const ColorBox = styled.div`
  width: 60px;
  height: 40px;
  border-radius: ${props => props.theme.borderRadius.sm};
  background: ${props => props.bg};
  border: 1px solid ${props => props.theme.colors.border.main};
`;

const ColorLabel = styled.div`
  flex: 1;
  font-size: ${props => props.theme.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
`;

const ThemeInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background.elevated};
  border: 2px solid ${props => props.theme.colors.border.main};
  border-radius: ${props => props.theme.borderRadius.lg};
  margin-bottom: ${props => props.theme.spacing.xl};
`;

const ThemeIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.theme.colors.primary.main};
  color: white;
`;

const ThemeDetails = styled.div`
  flex: 1;
  
  h3 {
    font-size: ${props => props.theme.fontSize.lg};
    font-weight: ${props => props.theme.fontWeight.semibold};
    color: ${props => props.theme.colors.text.primary};
    margin: 0 0 ${props => props.theme.spacing.xs};
  }
  
  p {
    font-size: ${props => props.theme.fontSize.sm};
    color: ${props => props.theme.colors.text.secondary};
    margin: 0;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  flex-wrap: wrap;
`;

const DarkModeTest = () => {
  const { themeMode, activeTheme, systemTheme, isDarkMode, isLightMode, isAutoMode } = useTheme();

  const themeIcons = {
    light: <Sun size={24} />,
    dark: <Moon size={24} />,
    auto: <Monitor size={24} />,
  };

  const themeLabels = {
    light: 'Chế độ Sáng',
    dark: 'Chế độ Tối',
    auto: 'Tự động (Theo hệ thống)',
  };

  return (
    <TestContainer>
      <TestSection>
        <SectionTitle>🎨 Kiểm Tra Dark Mode</SectionTitle>
        
        {/* Theme Info */}
        <ThemeInfo>
          <ThemeIcon>
            {themeIcons[themeMode]}
          </ThemeIcon>
          <ThemeDetails>
            <h3>{themeLabels[themeMode]}</h3>
            <p>
              Chế độ hiện tại: <strong>{themeMode}</strong> • 
              Theme đang dùng: <strong>{activeTheme.name}</strong> • 
              Hệ thống: <strong>{systemTheme}</strong>
            </p>
          </ThemeDetails>
          <div>
            <ThemeToggleMenu />
          </div>
        </ThemeInfo>

        {/* Color Palette Test */}
        <SectionTitle>Bảng Màu</SectionTitle>
        <TestGrid>
          <TestCard>
            <h3 style={{ marginTop: 0 }}>Primary Colors</h3>
            <ColorSwatch>
              <ColorBox bg={activeTheme.colors.primary.main} />
              <ColorLabel>Primary Main</ColorLabel>
            </ColorSwatch>
            <ColorSwatch>
              <ColorBox bg={activeTheme.colors.primary.light} />
              <ColorLabel>Primary Light</ColorLabel>
            </ColorSwatch>
            <ColorSwatch>
              <ColorBox bg={activeTheme.colors.primary.dark} />
              <ColorLabel>Primary Dark</ColorLabel>
            </ColorSwatch>
          </TestCard>

          <TestCard>
            <h3 style={{ marginTop: 0 }}>Success Colors</h3>
            <ColorSwatch>
              <ColorBox bg={activeTheme.colors.success.main} />
              <ColorLabel>Success Main</ColorLabel>
            </ColorSwatch>
            <ColorSwatch>
              <ColorBox bg={activeTheme.colors.success.light} />
              <ColorLabel>Success Light</ColorLabel>
            </ColorSwatch>
            <ColorSwatch>
              <ColorBox bg={activeTheme.colors.success.dark} />
              <ColorLabel>Success Dark</ColorLabel>
            </ColorSwatch>
          </TestCard>

          <TestCard>
            <h3 style={{ marginTop: 0 }}>Warning Colors</h3>
            <ColorSwatch>
              <ColorBox bg={activeTheme.colors.warning.main} />
              <ColorLabel>Warning Main</ColorLabel>
            </ColorSwatch>
            <ColorSwatch>
              <ColorBox bg={activeTheme.colors.warning.light} />
              <ColorLabel>Warning Light</ColorLabel>
            </ColorSwatch>
            <ColorSwatch>
              <ColorBox bg={activeTheme.colors.warning.dark} />
              <ColorLabel>Warning Dark</ColorLabel>
            </ColorSwatch>
          </TestCard>

          <TestCard>
            <h3 style={{ marginTop: 0 }}>Error Colors</h3>
            <ColorSwatch>
              <ColorBox bg={activeTheme.colors.error.main} />
              <ColorLabel>Error Main</ColorLabel>
            </ColorSwatch>
            <ColorSwatch>
              <ColorBox bg={activeTheme.colors.error.light} />
              <ColorLabel>Error Light</ColorLabel>
            </ColorSwatch>
            <ColorSwatch>
              <ColorBox bg={activeTheme.colors.error.dark} />
              <ColorLabel>Error Dark</ColorLabel>
            </ColorSwatch>
          </TestCard>
        </TestGrid>

        {/* Button Test */}
        <SectionTitle>Buttons</SectionTitle>
        <TestCard>
          <ButtonGroup>
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="success">Success Button</Button>
            <Button variant="danger">Danger Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button disabled>Disabled Button</Button>
          </ButtonGroup>

          <div style={{ marginTop: '24px' }}>
            <ButtonGroup>
              <Button size="sm" variant="primary">Small</Button>
              <Button size="md" variant="primary">Medium</Button>
              <Button size="lg" variant="primary">Large</Button>
            </ButtonGroup>
          </div>
        </TestCard>

        {/* Input Test */}
        <SectionTitle>Form Inputs</SectionTitle>
        <TestGrid>
          <TestCard>
            <Input 
              label="Text Input"
              placeholder="Enter text..."
            />
          </TestCard>

          <TestCard>
            <Input 
              label="Email Input"
              type="email"
              placeholder="email@example.com"
            />
          </TestCard>

          <TestCard>
            <Input 
              label="Disabled Input"
              placeholder="Disabled..."
              disabled
            />
          </TestCard>

          <TestCard>
            <Input 
              label="Error State"
              placeholder="Invalid input"
              error="This field is required"
            />
          </TestCard>
        </TestGrid>

        {/* Card Test */}
        <SectionTitle>Cards & Surfaces</SectionTitle>
        <TestGrid>
          <TestCard>
            <h3 style={{ marginTop: 0 }}>Default Card</h3>
            <p>This is a standard card with default styling. It should adapt to both light and dark modes.</p>
          </TestCard>

          <TestCard variant="elevated">
            <h3 style={{ marginTop: 0 }}>Elevated Card</h3>
            <p>This card has elevation with shadow effect for better visual hierarchy.</p>
          </TestCard>

          <TestCard variant="glass">
            <h3 style={{ marginTop: 0 }}>Glass Card</h3>
            <p>This card uses glassmorphism effect with backdrop blur.</p>
          </TestCard>
        </TestGrid>

        {/* Icon Test */}
        <SectionTitle>Icons & Status</SectionTitle>
        <TestCard>
          <ButtonGroup>
            <Button variant="success">
              <Check size={18} style={{ marginRight: '8px' }} />
              Success Action
            </Button>
            <Button variant="danger">
              <X size={18} style={{ marginRight: '8px' }} />
              Cancel Action
            </Button>
            <Button variant="outline">
              <AlertCircle size={18} style={{ marginRight: '8px' }} />
              Warning Action
            </Button>
          </ButtonGroup>
        </TestCard>

        {/* Text Test */}
        <SectionTitle>Typography</SectionTitle>
        <TestCard>
          <h1 style={{ color: activeTheme.colors.text.primary }}>Heading 1</h1>
          <h2 style={{ color: activeTheme.colors.text.primary }}>Heading 2</h2>
          <h3 style={{ color: activeTheme.colors.text.primary }}>Heading 3</h3>
          <p style={{ color: activeTheme.colors.text.primary }}>
            Primary text: Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </p>
          <p style={{ color: activeTheme.colors.text.secondary }}>
            Secondary text: Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
          <p style={{ color: activeTheme.colors.text.disabled }}>
            Disabled text: Ut enim ad minim veniam, quis nostrud exercitation ullamco.
          </p>
        </TestCard>
      </TestSection>
    </TestContainer>
  );
};

export default DarkModeTest;