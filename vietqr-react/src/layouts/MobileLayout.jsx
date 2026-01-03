import React from 'react';
import styled from 'styled-components';
import TopBar from '../components/organisms/TopBar';
import MobileNav from '../components/organisms/MobileNav';

const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: transparent;
  overflow-x: hidden;
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 6px 4px;
  padding-bottom: ${({ theme }) => theme.spacing[20]};
  overflow-y: auto;
`;

/**
 * Mobile Layout Component
 * Layout cho màn hình nhỏ (< 768px) với bottom navigation
 */
const MobileLayout = ({
    children,
    mobileNavItems,
    activeTab,
    onNavigate,
    tabTitle,
    onMenuClick,
}) => {
    return (
        <MobileContainer>
            <ContentArea>
                {children}
            </ContentArea>
            <MobileNav
                items={mobileNavItems}
                activeItem={activeTab}
                onNavigate={onNavigate}
            />
        </MobileContainer>
    );
};

export default MobileLayout;
