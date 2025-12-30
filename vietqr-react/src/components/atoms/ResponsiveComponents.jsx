/**
 * Responsive Components
 * Ready-to-use responsive wrapper components
 */

import React from 'react';
import styled from 'styled-components';
import { 
  media, 
  hideOn, 
  showOn, 
  responsiveContainer,
  touchTarget,
  horizontalScroll,
} from '../../utils/responsive';
import { useBreakpoint } from '../../hooks/useResponsive';

// ============================================
// Container Component
// ============================================

const StyledContainer = styled.div`
  ${responsiveContainer()}
`;

export const Container = ({ children, ...props }) => (
  <StyledContainer {...props}>{children}</StyledContainer>
);

// ============================================
// Show/Hide Components
// ============================================

const HiddenElement = styled.div`
  ${props => hideOn(props.$breakpoints)}
`;

export const Hide = ({ on, children, ...props }) => (
  <HiddenElement $breakpoints={Array.isArray(on) ? on : [on]} {...props}>
    {children}
  </HiddenElement>
);

const VisibleElement = styled.div`
  ${props => showOn(props.$breakpoints)}
`;

export const Show = ({ on, children, ...props }) => (
  <VisibleElement $breakpoints={Array.isArray(on) ? on : [on]} {...props}>
    {children}
  </VisibleElement>
);

// ============================================
// Responsive Grid
// ============================================

const GridContainer = styled.div`
  display: grid;
  gap: ${props => props.$gap || props.theme.spacing.md};
  
  ${props => props.$columns?.mobile && media.mobile`
    grid-template-columns: repeat(${props.$columns.mobile}, 1fr);
  `}
  ${props => props.$columns?.tablet && media.tablet`
    grid-template-columns: repeat(${props.$columns.tablet}, 1fr);
  `}
  ${props => props.$columns?.desktop && media.desktop`
    grid-template-columns: repeat(${props.$columns.desktop}, 1fr);
  `}
  ${props => props.$columns?.wide && media.wide`
    grid-template-columns: repeat(${props.$columns.wide}, 1fr);
  `}
`;

export const ResponsiveGrid = ({ columns, gap, children, ...props }) => (
  <GridContainer $columns={columns} $gap={gap} {...props}>
    {children}
  </GridContainer>
);

// ============================================
// Responsive Stack (Flex)
// ============================================

const StackContainer = styled.div`
  display: flex;
  gap: ${props => props.$gap || props.theme.spacing.md};
  
  ${props => props.$direction?.mobile && media.mobile`
    flex-direction: ${props.$direction.mobile};
  `}
  ${props => props.$direction?.tablet && media.tablet`
    flex-direction: ${props.$direction.tablet};
  `}
  ${props => props.$direction?.desktop && media.desktop`
    flex-direction: ${props.$direction.desktop};
  `}
  ${props => props.$direction?.wide && media.wide`
    flex-direction: ${props.$direction.wide};
  `}
  
  ${props => props.$align && `align-items: ${props.$align};`}
  ${props => props.$justify && `justify-content: ${props.$justify};`}
  ${props => props.$wrap && `flex-wrap: ${props.$wrap};`}
`;

export const Stack = ({ 
  direction = 'column', 
  gap, 
  align, 
  justify, 
  wrap,
  children, 
  ...props 
}) => (
  <StackContainer 
    $direction={typeof direction === 'string' ? { mobile: direction } : direction}
    $gap={gap}
    $align={align}
    $justify={justify}
    $wrap={wrap}
    {...props}
  >
    {children}
  </StackContainer>
);

// ============================================
// Touch-Friendly Button Wrapper
// ============================================

const TouchWrapper = styled.div`
  ${props => touchTarget(props.$size)}
  display: inline-flex;
  align-items: center;
  justify-content: center;
`;

export const TouchTarget = ({ size = 44, children, ...props }) => (
  <TouchWrapper $size={size} {...props}>
    {children}
  </TouchWrapper>
);

// ============================================
// Horizontal Scroll Container
// ============================================

const ScrollContainer = styled.div`
  ${horizontalScroll()}
  gap: ${props => props.$gap || props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md} 0;
`;

export const HorizontalScroll = ({ gap, children, ...props }) => (
  <ScrollContainer $gap={gap} {...props}>
    {children}
  </ScrollContainer>
);

// ============================================
// Responsive Value Component
// ============================================

export const ResponsiveValue = ({ mobile, tablet, desktop, wide, render, children }) => {
  const { breakpoint } = useBreakpoint();
  
  const values = { mobile, tablet, desktop, wide };
  const breakpointOrder = ['wide', 'desktop', 'tablet', 'mobile'];
  const currentIndex = breakpointOrder.indexOf(breakpoint);
  
  let value;
  for (let i = currentIndex; i < breakpointOrder.length; i++) {
    const bp = breakpointOrder[i];
    if (values[bp] !== undefined) {
      value = values[bp];
      break;
    }
  }
  
  if (render) return render(value);
  if (typeof children === 'function') return children(value);
  return value;
};

// ============================================
// Breakpoint Component (Conditional Rendering)
// ============================================

export const Breakpoint = ({ mobile, tablet, desktop, wide }) => {
  const { breakpoint } = useBreakpoint();
  
  const content = {
    mobile,
    tablet: tablet || mobile,
    desktop: desktop || tablet || mobile,
    wide: wide || desktop || tablet || mobile,
  };
  
  return content[breakpoint] || null;
};

// ============================================
// Aspect Ratio Box
// ============================================

const AspectRatioBox = styled.div`
  position: relative;
  width: 100%;
  
  &::before {
    content: '';
    display: block;
    padding-top: ${props => (1 / props.$ratio) * 100}%;
  }
`;

const AspectRatioContent = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export const AspectRatio = ({ ratio = 16/9, children, ...props }) => (
  <AspectRatioBox $ratio={ratio} {...props}>
    <AspectRatioContent>
      {children}
    </AspectRatioContent>
  </AspectRatioBox>
);

// ============================================
// Responsive Image
// ============================================

const StyledImage = styled.img`
  max-width: 100%;
  height: auto;
  display: block;
  
  ${props => props.$objectFit && `object-fit: ${props.$objectFit};`}
  ${props => props.$objectPosition && `object-position: ${props.$objectPosition};`}
`;

export const ResponsiveImage = ({ 
  src, 
  alt, 
  objectFit, 
  objectPosition,
  ...props 
}) => (
  <StyledImage 
    src={src} 
    alt={alt}
    $objectFit={objectFit}
    $objectPosition={objectPosition}
    loading="lazy"
    {...props}
  />
);

// ============================================
// Spacer Component
// ============================================

const SpacerDiv = styled.div`
  ${props => props.$size?.mobile && media.mobile`
    height: ${props.theme.spacing[props.$size.mobile] || props.$size.mobile};
  `}
  ${props => props.$size?.tablet && media.tablet`
    height: ${props.theme.spacing[props.$size.tablet] || props.$size.tablet};
  `}
  ${props => props.$size?.desktop && media.desktop`
    height: ${props.theme.spacing[props.$size.desktop] || props.$size.desktop};
  `}
  ${props => props.$size?.wide && media.wide`
    height: ${props.theme.spacing[props.$size.wide] || props.$size.wide};
  `}
  
  ${props => typeof props.$size === 'string' && `
    height: ${props.theme.spacing[props.$size] || props.$size};
  `}
  ${props => typeof props.$size === 'number' && `
    height: ${props.$size}px;
  `}
`;

export const Spacer = ({ size = 'md', ...props }) => (
  <SpacerDiv $size={size} {...props} />
);

// ============================================
// Export All
// ============================================

export default {
  Container,
  Hide,
  Show,
  ResponsiveGrid,
  Stack,
  TouchTarget,
  HorizontalScroll,
  ResponsiveValue,
  Breakpoint,
  AspectRatio,
  ResponsiveImage,
  Spacer,
};