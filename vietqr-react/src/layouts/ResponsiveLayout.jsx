import React from 'react';
import { useBreakpoint } from '../hooks/useResponsive';
import DesktopLayout from './DesktopLayout';
import MobileLayout from './MobileLayout';

/**
 * Responsive Layout Component
 * Tự động switch giữa Desktop và Mobile layout dựa trên viewport
 */
const ResponsiveLayout = ({
    children,
    navigationSections,
    mobileNavItems,
    activeTab,
    onNavigate,
    sidebarOpen,
    onSidebarClose,
    onSidebarToggle,
    tabTitle,
}) => {
    const { isMobileOrTablet } = useBreakpoint();

    if (isMobileOrTablet) {
        return (
            <MobileLayout
                mobileNavItems={mobileNavItems}
                activeTab={activeTab}
                onNavigate={onNavigate}
                tabTitle={tabTitle}
                onMenuClick={onSidebarToggle}
            >
                {children}
            </MobileLayout>
        );
    }

    return (
        <DesktopLayout
            navigationSections={navigationSections}
            activeTab={activeTab}
            onNavigate={onNavigate}
            sidebarOpen={sidebarOpen}
            onSidebarClose={onSidebarClose}
            tabTitle={tabTitle}
            onMenuClick={onSidebarToggle}
        >
            {children}
        </DesktopLayout>
    );
};

export default ResponsiveLayout;
