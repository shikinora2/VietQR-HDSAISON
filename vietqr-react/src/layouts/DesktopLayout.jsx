import React from 'react';
import styled from 'styled-components';
import Sidebar from '../components/organisms/Sidebar';
import TopBar from '../components/organisms/TopBar';

const DesktopContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background: transparent;
  overflow-x: hidden;
`;

const MainWrapper = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow-x: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.spacing[8]};
  overflow-y: auto;

  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    padding: ${({ theme }) => theme.spacing[6]};
  }
`;

/**
 * Desktop Layout Component
 * Layout cho màn hình lớn (>= 768px) với Sidebar bên trái
 */
const DesktopLayout = ({
  children,
  navigationSections,
  activeTab,
  onNavigate,
  sidebarOpen,
  onSidebarClose,
  tabTitle,
  onMenuClick,
}) => {
  return (
    <DesktopContainer>
      <Sidebar
        sections={navigationSections}
        activeItem={activeTab}
        onNavigate={onNavigate}
        isOpen={sidebarOpen}
        onClose={onSidebarClose}
      />
      <MainWrapper>
        <ContentArea>
          {children}
        </ContentArea>
      </MainWrapper>
    </DesktopContainer>
  );
};

export default DesktopLayout;
