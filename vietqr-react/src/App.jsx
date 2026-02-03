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
  FileSpreadsheet,
  Award,
} from 'lucide-react';

// Lazy load feature tabs
const QRGeneratorTab = lazy(() => import('./features/qr-generator/QRGeneratorTab'));
const PrintContractTab = lazy(() => import('./features/contract-files/ContractFilesTab'));
const LoanCalculatorTab = lazy(() => import('./features/loan-calculator/LoanCalculatorTab'));
const ExportTab = lazy(() => import('./features/export/ExportTab'));
const DLBonusTab = lazy(() => import('./features/dl-bonus/DLBonusTab'));

const QRViewer = lazy(() => import('./features/qr-generator/QRViewer'));

// Determine default tab based on device type
const getDefaultTab = () => {
  if (typeof window === 'undefined') return 'print-contract';
  // Mobile/tablet: default to loan calculator (ED), Desktop: default to print contract
  return window.innerWidth < BREAKPOINTS.desktop ? 'loan-calculator' : 'print-contract';
};

function AppContent() {
  const [activeTab, setActiveTab] = useState(getDefaultTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isViewerMode, setIsViewerMode] = useState(false);

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('c') && params.get('a')) {
      setIsViewerMode(true);
    }
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
        { id: 'export', label: 'Trích xuất hợp đồng', icon: <FileSpreadsheet size={20} /> },
        { id: 'dl-bonus', label: 'Tính thưởng DL', icon: <Award size={20} /> },
      ]
    }
  ];

  const mobileNavItems = [
    { id: 'print-contract', label: 'In HĐ', icon: <Printer size={20} /> },
    { id: 'qr-generator', label: 'QR', icon: <QrCode size={20} /> },
    { id: 'loan-calculator', label: 'Tính toán', icon: <Calculator size={20} /> },
    { id: 'export', label: 'Trích xuất', icon: <FileSpreadsheet size={20} /> },
    { id: 'dl-bonus', label: 'Thưởng DL', icon: <Award size={20} /> },
  ];

  const handleNavigationClick = (itemId) => {
    setActiveTab(itemId);
    setSidebarOpen(false);
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'print-contract': return 'In bộ hợp đồng';
      case 'qr-generator': return 'Tạo mã QR';
      case 'loan-calculator': return 'Tính Khoản Vay (ED)';
      case 'export': return 'Trích xuất hợp đồng';
      case 'dl-bonus': return 'Tính thưởng DL';
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
        <div style={{ display: activeTab === 'export' ? 'block' : 'none' }}>
          <ExportTab />
        </div>
        <div style={{ display: activeTab === 'dl-bonus' ? 'block' : 'none' }}>
          <DLBonusTab />
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
