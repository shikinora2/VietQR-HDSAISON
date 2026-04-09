import React, { useState, lazy, Suspense } from 'react';
import { ThemeProvider } from './styles/ThemeProvider';
import GlobalStyles from './styles/GlobalStyles';
import { ResponsiveLayout } from './layouts';
import { ContractProvider } from './contexts/ContractContext';
import { ToastProvider } from './components/molecules/Toast';
import { POSProvider } from './contexts/POSContext';
import { AdvisorProvider } from './contexts/AdvisorContext';
import { UIProvider } from './contexts/UIContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { BREAKPOINTS } from './hooks/useResponsive';
import {
  QrCode,
  Printer,
  Calculator,
  Award,
  Gift,
} from 'lucide-react';

const BASE_PATH = '/hdsaison';
const TAB_ID_TO_PATH = {
  'print-contract': 'inhopdong',
  'qr-generator': 'QR',
  'loan-calculator': 'tinhED',
  'dl-bonus': 'bounsDL',
  'monthly-promo-scheme': 'schemekm',
};

const PATH_TO_TAB_ID = Object.entries(TAB_ID_TO_PATH).reduce((acc, [tabId, path]) => {
  acc[path.toLowerCase()] = tabId;
  return acc;
}, {});

// Lazy load feature tabs
const QRGeneratorTab = lazy(() => import('./features/qr-generator/QRGeneratorTab'));
const PrintContractTab = lazy(() => import('./features/contract-files/ContractFilesTab'));
const LoanCalculatorTab = lazy(() => import('./features/loan-calculator/LoanCalculatorTab'));

const DLBonusTab = lazy(() => import('./features/dl-bonus/DLBonusTab'));
const MonthlyPromoSchemeTab = lazy(() => import('./features/monthly-promo-scheme/MonthlyPromoSchemeTab'));

const QRViewer = lazy(() => import('./features/qr-generator/QRViewer'));

// Determine default tab based on device type
const getDefaultTab = () => {
  if (typeof window === 'undefined') return 'print-contract';
  // Mobile/tablet: default to loan calculator (ED), Desktop: default to print contract
  return window.innerWidth < BREAKPOINTS.desktop ? 'loan-calculator' : 'print-contract';
};

const isViewerRequest = () => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return Boolean(params.get('c') && params.get('a'));
};

const getPathState = (pathname) => {
  const normalizedPath = (pathname || '/').replace(/\/+$/, '') || '/';
  const basePathLower = BASE_PATH.toLowerCase();
  const normalizedPathLower = normalizedPath.toLowerCase();

  if (normalizedPathLower === basePathLower) {
    return {
      tabId: getDefaultTab(),
      isInsideBasePath: true,
      isValid: true,
    };
  }

  if (!normalizedPathLower.startsWith(`${basePathLower}/`)) {
    return {
      tabId: null,
      isInsideBasePath: false,
      isValid: false,
    };
  }

  const pathSegment = normalizedPath.slice(BASE_PATH.length + 1);
  const tabId = PATH_TO_TAB_ID[pathSegment.toLowerCase()];

  if (!tabId) {
    return {
      tabId: getDefaultTab(),
      isInsideBasePath: true,
      isValid: false,
    };
  }

  return {
    tabId,
    isInsideBasePath: true,
    isValid: true,
  };
};

const getPathForTab = (tabId) => `${BASE_PATH}/${TAB_ID_TO_PATH[tabId] || TAB_ID_TO_PATH['print-contract']}`;

function AppContent() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === 'undefined') return getDefaultTab();
    const pathState = getPathState(window.location.pathname);
    return pathState.tabId || getDefaultTab();
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isViewerMode, setIsViewerMode] = useState(false);

  React.useEffect(() => {
    if (isViewerRequest()) {
      setIsViewerMode(true);
      return;
    }

    const syncTabFromPath = () => {
      const pathState = getPathState(window.location.pathname);

      if (!pathState.isInsideBasePath || !pathState.isValid) {
        window.history.replaceState({}, '', `${BASE_PATH}${window.location.search}${window.location.hash}`);
      }

      setActiveTab(pathState.tabId || getDefaultTab());
    };

    syncTabFromPath();

    window.addEventListener('popstate', syncTabFromPath);
    return () => {
      window.removeEventListener('popstate', syncTabFromPath);
    };
  }, []);

  if (isViewerMode) {
    return (
      <Suspense fallback={<div>Loading Viewer...</div>}>
        <ThemeProvider>
          <GlobalStyles />
          <QRViewer />
        </ThemeProvider>
      </Suspense>
    );
  }

  const navigationSections = [
    {
      title: 'Main Features',
      items: [
        { id: 'print-contract', label: 'In bộ hợp đồng', icon: <Printer size={20} /> },
        { id: 'qr-generator', label: 'Tạo mã QR', icon: <QrCode size={20} /> },
        { id: 'loan-calculator', label: 'Tính Khoản Vay (ED)', icon: <Calculator size={20} /> },
        { id: 'dl-bonus', label: 'Tính thưởng DL', icon: <Award size={20} /> },
        { id: 'monthly-promo-scheme', label: 'Scheme khuyến mãi hàng tháng', icon: <Gift size={20} /> },
      ]
    }
  ];

  const mobileNavItems = [
    { id: 'print-contract', label: 'In HĐ', icon: <Printer size={20} /> },
    { id: 'qr-generator', label: 'QR', icon: <QrCode size={20} /> },
    { id: 'loan-calculator', label: 'Tính toán', icon: <Calculator size={20} /> },
    { id: 'dl-bonus', label: 'Thưởng DL', icon: <Award size={20} /> },
    { id: 'monthly-promo-scheme', label: 'Scheme KM', icon: <Gift size={20} /> },
  ];

  const handleNavigationClick = (itemId) => {
    const nextPath = getPathForTab(itemId);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, '', nextPath);
    }
    setActiveTab(itemId);
    setSidebarOpen(false);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'print-contract': return 'In bộ hợp đồng';
      case 'qr-generator': return 'Tạo mã QR';
      case 'loan-calculator': return 'Tính Khoản Vay (ED)';
      case 'dl-bonus': return 'Tính thưởng DL';
      case 'monthly-promo-scheme': return 'Scheme khuyến mãi hàng tháng';
      default: return 'VietQR HD SAISON';
    }
  };

  const renderTabContent = () => {
    // Use CSS display to hide/show tabs instead of unmounting
    // This preserves state when switching between tabs
    return (
      <Suspense fallback={<div style={{ padding: '2rem' }}>Loading...</div>}>
        <div style={{ display: activeTab === 'print-contract' ? 'block' : 'none' }}>
          <PrintContractTab />
        </div>
        <div style={{ display: activeTab === 'qr-generator' ? 'block' : 'none' }}>
          <QRGeneratorTab />
        </div>
        <div style={{ display: activeTab === 'loan-calculator' ? 'block' : 'none' }}>
          <LoanCalculatorTab />
        </div>

        <div style={{ display: activeTab === 'dl-bonus' ? 'block' : 'none' }}>
          <DLBonusTab />
        </div>
        <div style={{ display: activeTab === 'monthly-promo-scheme' ? 'block' : 'none' }}>
          <MonthlyPromoSchemeTab />
        </div>
      </Suspense>
    );
  };

  return (
    <ResponsiveLayout
      navigationSections={navigationSections}
      mobileNavItems={mobileNavItems}
      activeTab={activeTab}
      onNavigate={handleNavigationClick}
      sidebarOpen={sidebarOpen}
      onSidebarClose={() => setSidebarOpen(false)}
      onSidebarToggle={() => setSidebarOpen(!sidebarOpen)}
      tabTitle={getTabTitle()}
    >
      {renderTabContent()}
    </ResponsiveLayout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <GlobalStyles />
      <ToastProvider>
        <ContractProvider>
          <POSProvider>
            <AdvisorProvider>
              <UIProvider>
                <NotificationProvider>
                  <AppContent />
                </NotificationProvider>
              </UIProvider>
            </AdvisorProvider>
          </POSProvider>
        </ContractProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
