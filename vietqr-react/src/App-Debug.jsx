import React, { Suspense, lazy, useState } from 'react';
import styled from 'styled-components';
import { QrCode, FileText, Calculator, Download } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import GlobalStyles from './styles/GlobalStyles';
import { ThemeProvider } from './styles/ThemeProvider';
import { ToastProvider } from './components/molecules/Toast';
import {
  ContractProvider,
  POSProvider,
  AdvisorProvider,
  UIProvider,
  NotificationProvider,
} from './contexts';
import { AppShell, Sidebar, TopBar, MobileNav } from './components/organisms';
import { Loading } from './components/molecules';
import { AnimatedPage } from './animations/AnimationComponents';
import { GlobalErrorBoundary } from './components/molecules/ErrorBoundary';

console.log('App-Debug.jsx loaded');

// Lazy load feature tabs
const QRGeneratorTab = lazy(() => {
  console.log('Loading QRGeneratorTab...');
  return import('./features/qr-generator/QRGeneratorTab').then(module => {
    console.log('QRGeneratorTab loaded successfully');
    return module;
  }).catch(err => {
    console.error('Failed to load QRGeneratorTab:', err);
    throw err;
  });
});

const ContractFilesTab = lazy(() => {
  console.log('Loading ContractFilesTab...');
  return import('./features/contract-files/ContractFilesTab').then(module => {
    console.log('ContractFilesTab loaded successfully');
    return module;
  }).catch(err => {
    console.error('Failed to load ContractFilesTab:', err);
    throw err;
  });
});

const LoanCalculatorTab = lazy(() => {
  console.log('Loading LoanCalculatorTab...');
  return import('./features/loan-calculator/LoanCalculatorTab').then(module => {
    console.log('LoanCalculatorTab loaded successfully');
    return module;
  }).catch(err => {
    console.error('Failed to load LoanCalculatorTab:', err);
    throw err;
  });
});

const ExportTab = lazy(() => {
  console.log('Loading ExportTab...');
  return import('./features/export/ExportTab').then(module => {
    console.log('ExportTab loaded successfully');
    return module;
  }).catch(err => {
    console.error('Failed to load ExportTab:', err);
    throw err;
  });
});

const MainContent = styled.div`
  flex: 1;
  overflow-y: auto;
  background: ${props => props.theme.colors.background.default};
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
`;

function AppContent() {
  console.log('AppContent rendering');
  const [activeTab, setActiveTab] = useState('qr-generator');

  const sidebarItems = [
    {
      id: 'qr-generator',
      label: 'Tạo Mã QR',
      icon: <QrCode size={20} />,
    },
    {
      id: 'contract-files',
      label: 'Quản Lý HĐ',
      icon: <FileText size={20} />,
    },
    {
      id: 'loan-calculator',
      label: 'Tính Khoản Vay',
      icon: <Calculator size={20} />,
    },
    {
      id: 'export',
      label: 'Xuất Dữ Liệu',
      icon: <Download size={20} />,
    },
  ];

  const renderTabContent = () => {
    console.log('Rendering tab content for:', activeTab);
    const LoadingFallback = (
      <LoadingContainer>
        <Loading type="spinner" size="large" />
      </LoadingContainer>
    );

    let TabComponent;
    switch (activeTab) {
      case 'qr-generator':
        TabComponent = QRGeneratorTab;
        break;
      case 'contract-files':
        TabComponent = ContractFilesTab;
        break;
      case 'loan-calculator':
        TabComponent = LoanCalculatorTab;
        break;
      case 'export':
        TabComponent = ExportTab;
        break;
      default:
        TabComponent = QRGeneratorTab;
    }

    return (
      <AnimatePresence mode="wait">
        <AnimatedPage key={activeTab} variant="slide">
          <Suspense fallback={LoadingFallback}>
            <TabComponent />
          </Suspense>
        </AnimatedPage>
      </AnimatePresence>
    );
  };

  try {
    console.log('Rendering AppShell');
    return (
      <AppShell>
        <TopBar />
        <Sidebar 
          items={sidebarItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        <MainContent>
          {renderTabContent()}
        </MainContent>
        <MobileNav 
          items={sidebarItems}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </AppShell>
    );
  } catch (error) {
    console.error('Error rendering AppContent:', error);
    throw error;
  }
}

function App() {
  console.log('App rendering');
  
  try {
    return (
      <GlobalErrorBoundary>
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
      </GlobalErrorBoundary>
    );
  } catch (error) {
    console.error('Error rendering App:', error);
    return (
      <div style={{
        padding: '20px',
        color: 'red',
        fontFamily: 'monospace'
      }}>
        <h1>Application Error</h1>
        <pre>{error.message}</pre>
        <pre>{error.stack}</pre>
      </div>
    );
  }
}

export default App;
