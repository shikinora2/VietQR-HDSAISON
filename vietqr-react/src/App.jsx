import React, { useState, lazy, Suspense } from 'react';
import { ThemeProvider } from './styles/ThemeProvider';
import GlobalStyles from './styles/GlobalStyles';
import AppShell from './components/organisms/AppShell';
import Sidebar from './components/organisms/Sidebar';
import TopBar from './components/organisms/TopBar';
import MobileNav from './components/organisms/MobileNav';
import { ContractProvider } from './contexts/ContractContext';
import { ToastProvider } from './components/molecules/Toast';
import { POSProvider } from './contexts/POSContext';
import { AdvisorProvider } from './contexts/AdvisorContext';
import { UIProvider } from './contexts/UIContext';
import { NotificationProvider } from './contexts/NotificationContext';
import {
  QrCode,
  Printer,
  Calculator,
  FileSpreadsheet,
} from 'lucide-react';

// Lazy load feature tabs
const QRGeneratorTab = lazy(() => import('./features/qr-generator/QRGeneratorTab'));
const PrintContractTab = lazy(() => import('./features/contract-files/ContractFilesTab'));
const LoanCalculatorTab = lazy(() => import('./features/loan-calculator/LoanCalculatorTab'));
const ExportTab = lazy(() => import('./features/export/ExportTab'));

function AppContent() {
  const [activeTab, setActiveTab] = useState('print-contract');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationSections = [
    {
      title: 'Main Features',
      items: [
        { id: 'print-contract', label: 'In bộ hợp đồng', icon: <Printer size={20} /> },
        { id: 'qr-generator', label: 'Tạo mã QR', icon: <QrCode size={20} /> },
        { id: 'loan-calculator', label: 'Tính Khoản Vay (ED)', icon: <Calculator size={20} /> },
        { id: 'export', label: 'Trích xuất hợp đồng', icon: <FileSpreadsheet size={20} /> },
      ]
    }
  ];

  const mobileNavItems = [
    { id: 'print-contract', label: 'In HĐ', icon: <Printer size={20} /> },
    { id: 'qr-generator', label: 'QR', icon: <QrCode size={20} /> },
    { id: 'loan-calculator', label: 'Tính toán', icon: <Calculator size={20} /> },
    { id: 'export', label: 'Trích xuất', icon: <FileSpreadsheet size={20} /> },
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
      default: return 'VietQR HD SAISON';
    }
  };

  const renderTabContent = () => {
    return (
      <Suspense fallback={<div style={{ padding: '2rem' }}>Loading...</div>}>
        {activeTab === 'print-contract' && <PrintContractTab />}
        {activeTab === 'qr-generator' && <QRGeneratorTab />}
        {activeTab === 'loan-calculator' && <LoanCalculatorTab />}
        {activeTab === 'export' && <ExportTab />}
      </Suspense>
    );
  };

  return (
    <AppShell
      sidebar={
        <Sidebar
          sections={navigationSections}
          activeItem={activeTab}
          onNavigate={handleNavigationClick}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      }
      topbar={
        <TopBar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          title={getTabTitle()}
        />
      }
      mobileNav={
        <MobileNav
          items={mobileNavItems}
          activeItem={activeTab}
          onNavigate={handleNavigationClick}
        />
      }
    >
      {renderTabContent()}
    </AppShell>
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
