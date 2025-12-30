/**
 * Main Layout with Responsive Sidebar
 * Complete layout system with mobile drawer support
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useBreakpoint } from '../../hooks/useResponsive';
import { media, preventSelection } from '../../utils/responsive';

// ============================================
// Layout Container
// ============================================

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${props => props.theme.colors.background.default};
  overflow-x: hidden;
`;

// ============================================
// Sidebar (Desktop + Mobile Drawer)
// ============================================

const SidebarWrapper = styled(motion.aside)`
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  background: ${props => props.theme.colors.background.paper};
  border-right: 1px solid ${props => props.theme.colors.border.main};
  box-shadow: ${props => props.theme.shadows.md};
  z-index: ${props => props.theme.zIndex.sidebar};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  /* Desktop styles */
  ${media.desktop`
    position: sticky;
    box-shadow: none;
  `}
`;

const MobileOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: ${props => props.theme.zIndex.modalBackdrop};
  
  ${media.desktop`
    display: none;
  `}
`;

const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-bottom: 1px solid ${props => props.theme.colors.border.main};
  min-height: 64px;
`;

const SidebarContent = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
`;

const SidebarFooter = styled.div`
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  border-top: 1px solid ${props => props.theme.colors.border.main};
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  padding: 0;
  background: transparent;
  border: 1px solid ${props => props.theme.colors.border.main};
  border-radius: ${props => props.theme.borderRadius.md};
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  ${preventSelection()}
  
  &:hover {
    background: ${props => props.theme.colors.action.hover};
    border-color: ${props => props.theme.colors.border.dark};
  }
  
  ${media.desktop`
    display: none;
  `}
`;

// ============================================
// Main Content Area
// ============================================

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevent flex overflow */
  
  /* Add margin when sidebar is visible on desktop */
  ${props => props.$sidebarWidth && media.desktop`
    margin-left: ${props.$sidebarWidth}px;
  `}
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  max-width: 100%;
  
  ${media.mobile`
    padding: ${props => props.theme.spacing.md};
  `}
  
  ${media.tablet`
    padding: ${props => props.theme.spacing.lg};
  `}
  
  ${media.desktop`
    padding: ${props => props.theme.spacing.xl};
  `}
`;

// ============================================
// Main Layout Component
// ============================================

export const MainLayout = ({ 
  sidebar, 
  topbar,
  footer,
  children,
  sidebarWidth = 280,
  collapsedWidth = 80,
  defaultCollapsed = false,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const { isMobile, isTablet, isDesktopOrWider } = useBreakpoint();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleCollapse = () => setIsCollapsed(!isCollapsed);

  const currentSidebarWidth = isCollapsed ? collapsedWidth : sidebarWidth;

  // Animation variants
  const sidebarVariants = {
    hidden: { 
      x: -sidebarWidth,
      transition: { duration: 0.2 }
    },
    visible: { 
      x: 0,
      transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
    },
  };

  const overlayVariants = {
    hidden: { 
      opacity: 0,
      transition: { duration: 0.2 }
    },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    },
  };

  // Clone sidebar with additional props
  const sidebarWithProps = sidebar && React.cloneElement(sidebar, {
    isCollapsed: isCollapsed && isDesktopOrWider,
    onToggleCollapse: toggleCollapse,
    width: currentSidebarWidth,
  });

  // Clone topbar with toggle function
  const topbarWithProps = topbar && React.cloneElement(topbar, {
    onMenuClick: toggleSidebar,
  });

  return (
    <LayoutContainer>
      {/* Mobile Overlay */}
      {(isMobile || isTablet) && (
        <AnimatePresence>
          {isSidebarOpen && (
            <MobileOverlay
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              onClick={closeSidebar}
            />
          )}
        </AnimatePresence>
      )}

      {/* Sidebar */}
      {sidebar && (
        <>
          {/* Mobile/Tablet: Drawer */}
          {(isMobile || isTablet) ? (
            <AnimatePresence>
              {isSidebarOpen && (
                <SidebarWrapper
                  variants={sidebarVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  style={{ width: sidebarWidth }}
                >
                  <SidebarHeader>
                    <div style={{ flex: 1 }}>
                      {/* Logo or title can go here */}
                    </div>
                    <CloseButton onClick={closeSidebar} aria-label="Close sidebar">
                      <X size={20} />
                    </CloseButton>
                  </SidebarHeader>
                  <SidebarContent>
                    {sidebarWithProps}
                  </SidebarContent>
                </SidebarWrapper>
              )}
            </AnimatePresence>
          ) : (
            /* Desktop: Fixed Sidebar */
            <SidebarWrapper
              style={{ width: currentSidebarWidth }}
              initial={false}
            >
              {sidebarWithProps}
            </SidebarWrapper>
          )}
        </>
      )}

      {/* Main Content */}
      <MainContent $sidebarWidth={isDesktopOrWider ? currentSidebarWidth : 0}>
        {topbarWithProps}
        <ContentWrapper>
          {children}
        </ContentWrapper>
        {footer}
      </MainContent>
    </LayoutContainer>
  );
};

// ============================================
// Simple Layout (No Sidebar)
// ============================================

const SimpleLayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${props => props.theme.colors.background.default};
`;

const SimpleContent = styled.main`
  flex: 1;
  padding: ${props => props.theme.spacing.lg};
  
  ${media.mobile`
    padding: ${props => props.theme.spacing.md};
  `}
  
  ${media.desktop`
    padding: ${props => props.theme.spacing.xl};
  `}
`;

export const SimpleLayout = ({ topbar, footer, children }) => (
  <SimpleLayoutContainer>
    {topbar}
    <SimpleContent>{children}</SimpleContent>
    {footer}
  </SimpleLayoutContainer>
);

// ============================================
// Centered Layout (For Auth, Landing, etc.)
// ============================================

const CenteredContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background.default};
  
  ${media.mobile`
    padding: ${props => props.theme.spacing.md};
  `}
`;

const CenteredContent = styled.div`
  width: 100%;
  max-width: ${props => props.$maxWidth || '500px'};
`;

export const CenteredLayout = ({ children, maxWidth }) => (
  <CenteredContainer>
    <CenteredContent $maxWidth={maxWidth}>
      {children}
    </CenteredContent>
  </CenteredContainer>
);

export default MainLayout;