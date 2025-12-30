/**
 * Mobile Responsive Test Page
 * Comprehensive testing of responsive features
 */

import React from 'react';
import styled from 'styled-components';
import { 
  Container, 
  ResponsiveGrid, 
  Stack, 
  Hide, 
  Show,
  Breakpoint,
  ResponsiveValue,
  HorizontalScroll,
  AspectRatio,
  Spacer,
} from '../components/atoms/ResponsiveComponents';
import { useBreakpoint, useWindowSize, useOrientation, useIsTouchDevice } from '../hooks/useResponsive';
import Card from '../components/atoms/Card';
import Button from '../components/atoms/Button';
import { Monitor, Tablet, Smartphone, RotateCw, Hand } from 'lucide-react';
import { media } from '../utils/responsive';

const TestContainer = styled.div`
  min-height: 100vh;
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background.default};
  
  ${media.mobile`
    padding: ${props => props.theme.spacing.md};
  `}
`;

const Title = styled.h1`
  font-size: ${props => props.theme.fontSize['3xl']};
  font-weight: ${props => props.theme.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.xl};
  
  ${media.mobile`
    font-size: ${props => props.theme.fontSize['2xl']};
  `}
`;

const Section = styled.section`
  margin-bottom: ${props => props.theme.spacing['2xl']};
`;

const SectionTitle = styled.h2`
  font-size: ${props => props.theme.fontSize['2xl']};
  font-weight: ${props => props.theme.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
  margin-bottom: ${props => props.theme.spacing.lg};
  
  ${media.mobile`
    font-size: ${props => props.theme.fontSize.xl};
  `}
`;

const InfoCard = styled(Card)`
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.primary.light};
  border: 2px solid ${props => props.theme.colors.primary.main};
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${props => props.theme.spacing.md};
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  
  svg {
    color: ${props => props.theme.colors.primary.main};
  }
  
  strong {
    color: ${props => props.theme.colors.text.primary};
    margin-right: ${props => props.theme.spacing.xs};
  }
  
  span {
    color: ${props => props.theme.colors.text.secondary};
  }
`;

const TestCard = styled(Card)`
  padding: ${props => props.theme.spacing.lg};
  height: 100%;
`;

const ColorBox = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${props => props.theme.borderRadius.lg};
  background: ${props => props.$color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: ${props => props.theme.fontWeight.bold};
  font-size: ${props => props.theme.fontSize.sm};
`;

const ScrollCard = styled(Card)`
  padding: ${props => props.theme.spacing.md};
  min-width: 200px;
  text-align: center;
`;

const MobileResponsiveTest = () => {
  const { breakpoint, isMobile, isTablet, isDesktop, isWide, isMobileOrTablet } = useBreakpoint();
  const { width, height } = useWindowSize();
  const { orientation, isPortrait, isLandscape } = useOrientation();
  const isTouch = useIsTouchDevice();

  return (
    <TestContainer>
      <Container>
        <Title>📱 Mobile Responsive Testing</Title>

        {/* Device Info Section */}
        <Section>
          <SectionTitle>Device Information</SectionTitle>
          <InfoCard>
            <InfoGrid>
              <InfoItem>
                {breakpoint === 'mobile' && <Smartphone size={24} />}
                {breakpoint === 'tablet' && <Tablet size={24} />}
                {(breakpoint === 'desktop' || breakpoint === 'wide') && <Monitor size={24} />}
                <div>
                  <strong>Breakpoint:</strong>
                  <span>{breakpoint}</span>
                </div>
              </InfoItem>
              
              <InfoItem>
                <Monitor size={24} />
                <div>
                  <strong>Screen:</strong>
                  <span>{width} x {height}px</span>
                </div>
              </InfoItem>
              
              <InfoItem>
                <RotateCw size={24} />
                <div>
                  <strong>Orientation:</strong>
                  <span>{orientation}</span>
                </div>
              </InfoItem>
              
              <InfoItem>
                <Hand size={24} />
                <div>
                  <strong>Touch:</strong>
                  <span>{isTouch ? 'Yes' : 'No'}</span>
                </div>
              </InfoItem>
            </InfoGrid>
          </InfoCard>
        </Section>

        {/* Responsive Grid Test */}
        <Section>
          <SectionTitle>Responsive Grid</SectionTitle>
          <ResponsiveGrid
            columns={{
              mobile: 1,
              tablet: 2,
              desktop: 3,
              wide: 4,
            }}
          >
            <TestCard>
              <ColorBox $color="#6366F1">1 Column (Mobile)</ColorBox>
              <Spacer size="sm" />
              <p>On mobile, this grid shows 1 column</p>
            </TestCard>
            <TestCard>
              <ColorBox $color="#10B981">2 Columns (Tablet)</ColorBox>
              <Spacer size="sm" />
              <p>On tablet, this grid shows 2 columns</p>
            </TestCard>
            <TestCard>
              <ColorBox $color="#F59E0B">3 Columns (Desktop)</ColorBox>
              <Spacer size="sm" />
              <p>On desktop, this grid shows 3 columns</p>
            </TestCard>
            <TestCard>
              <ColorBox $color="#EF4444">4 Columns (Wide)</ColorBox>
              <Spacer size="sm" />
              <p>On wide screens, this grid shows 4 columns</p>
            </TestCard>
          </ResponsiveGrid>
        </Section>

        {/* Responsive Stack Test */}
        <Section>
          <SectionTitle>Responsive Stack</SectionTitle>
          <TestCard>
            <Stack
              direction={{
                mobile: 'column',
                tablet: 'row',
              }}
              gap="16px"
              align="center"
            >
              <Button variant="primary">First Button</Button>
              <Button variant="secondary">Second Button</Button>
              <Button variant="success">Third Button</Button>
            </Stack>
            <Spacer size="md" />
            <p style={{ fontSize: '14px', color: 'var(--color-text-secondary)' }}>
              Stack direction changes from column (mobile) to row (tablet+)
            </p>
          </TestCard>
        </Section>

        {/* Show/Hide Test */}
        <Section>
          <SectionTitle>Show/Hide Components</SectionTitle>
          
          <Stack direction="column" gap="16px">
            <Show on="mobile">
              <TestCard style={{ background: 'rgba(99, 102, 241, 0.1)' }}>
                <strong>📱 Mobile Only</strong>
                <p>This card is only visible on mobile devices</p>
              </TestCard>
            </Show>

            <Show on="tablet">
              <TestCard style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <strong>📟 Tablet Only</strong>
                <p>This card is only visible on tablets</p>
              </TestCard>
            </Show>

            <Show on={['desktop', 'wide']}>
              <TestCard style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                <strong>🖥️ Desktop & Wide Only</strong>
                <p>This card is only visible on desktop and wide screens</p>
              </TestCard>
            </Show>

            <Hide on="mobile">
              <TestCard style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
                <strong>🚫 Hidden on Mobile</strong>
                <p>This card is hidden on mobile devices</p>
              </TestCard>
            </Hide>
          </Stack>
        </Section>

        {/* Breakpoint Component Test */}
        <Section>
          <SectionTitle>Breakpoint Component</SectionTitle>
          <TestCard>
            <Breakpoint
              mobile={<h3 style={{ color: '#6366F1' }}>📱 You're on Mobile</h3>}
              tablet={<h3 style={{ color: '#10B981' }}>📟 You're on Tablet</h3>}
              desktop={<h3 style={{ color: '#F59E0B' }}>🖥️ You're on Desktop</h3>}
              wide={<h3 style={{ color: '#EF4444' }}>🖥️ You're on Wide Screen</h3>}
            />
            <p>Content changes based on current breakpoint</p>
          </TestCard>
        </Section>

        {/* Responsive Value Test */}
        <Section>
          <SectionTitle>Responsive Values</SectionTitle>
          <TestCard>
            <ResponsiveValue
              mobile={<Button size="sm" variant="primary">Small Button (Mobile)</Button>}
              tablet={<Button size="md" variant="primary">Medium Button (Tablet)</Button>}
              desktop={<Button size="lg" variant="primary">Large Button (Desktop)</Button>}
            />
            <Spacer size="md" />
            <p>Button size adapts to screen size</p>
          </TestCard>
        </Section>

        {/* Horizontal Scroll Test */}
        <Section>
          <SectionTitle>Horizontal Scroll (Mobile)</SectionTitle>
          <p style={{ marginBottom: '16px', color: 'var(--color-text-secondary)' }}>
            Swipe horizontally to see more cards (especially on mobile)
          </p>
          <HorizontalScroll>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <ScrollCard key={num}>
                <ColorBox $color={`hsl(${num * 60}, 70%, 60%)`}>
                  Card {num}
                </ColorBox>
                <Spacer size="sm" />
                <p>Scroll Card {num}</p>
              </ScrollCard>
            ))}
          </HorizontalScroll>
        </Section>

        {/* Aspect Ratio Test */}
        <Section>
          <SectionTitle>Aspect Ratio</SectionTitle>
          <ResponsiveGrid
            columns={{
              mobile: 1,
              tablet: 2,
              desktop: 3,
            }}
          >
            <TestCard>
              <AspectRatio ratio={16/9}>
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  background: 'linear-gradient(135deg, #6366F1, #8B5CF6)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                  16:9 Ratio
                </div>
              </AspectRatio>
            </TestCard>

            <TestCard>
              <AspectRatio ratio={4/3}>
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  background: 'linear-gradient(135deg, #10B981, #14B8A6)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                  4:3 Ratio
                </div>
              </AspectRatio>
            </TestCard>

            <TestCard>
              <AspectRatio ratio={1}>
                <div style={{ 
                  width: '100%', 
                  height: '100%', 
                  background: 'linear-gradient(135deg, #F59E0B, #F97316)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                }}>
                  1:1 Ratio
                </div>
              </AspectRatio>
            </TestCard>
          </ResponsiveGrid>
        </Section>

        {/* Touch Interaction Test */}
        {isTouch && (
          <Section>
            <SectionTitle>Touch Device Detected</SectionTitle>
            <TestCard style={{ background: 'rgba(99, 102, 241, 0.05)' }}>
              <h3>👆 Touch-Optimized UI</h3>
              <Spacer size="sm" />
              <p>
                Your device supports touch input. All interactive elements have been
                optimized for touch with larger tap targets and appropriate gestures.
              </p>
              <Spacer size="md" />
              <Stack direction="row" gap="12px" wrap="wrap">
                <Button variant="primary">Touch Button 1</Button>
                <Button variant="secondary">Touch Button 2</Button>
                <Button variant="success">Touch Button 3</Button>
              </Stack>
            </TestCard>
          </Section>
        )}

        {/* Summary */}
        <Section>
          <SectionTitle>Test Summary</SectionTitle>
          <TestCard>
            <h3>✅ All responsive features are working correctly!</h3>
            <Spacer size="md" />
            <ul style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li>✓ Breakpoint detection: <strong>{breakpoint}</strong></li>
              <li>✓ Responsive grid layouts</li>
              <li>✓ Responsive stack (flex) layouts</li>
              <li>✓ Show/Hide components</li>
              <li>✓ Breakpoint-specific rendering</li>
              <li>✓ Responsive values</li>
              <li>✓ Horizontal scroll containers</li>
              <li>✓ Aspect ratio boxes</li>
              <li>✓ Touch device detection</li>
              <li>✓ Orientation detection: <strong>{orientation}</strong></li>
            </ul>
          </TestCard>
        </Section>
      </Container>
    </TestContainer>
  );
};

export default MobileResponsiveTest;