import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks';

const UIContext = createContext();

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within UIProvider');
  }
  return context;
};

export const UIProvider = ({ children }) => {
  // UI state management
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage('sidebarCollapsed', false);
  const [activeTab, setActiveTab] = useLocalStorage('activeTab', 'qr-generator');
  const [modals, setModals] = useState({});
  const [loading, setLoading] = useState({});

  /**
   * Toggle sidebar
   */
  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, [setSidebarCollapsed]);

  /**
   * Open modal
   */
  const openModal = useCallback((modalId, data = null) => {
    setModals(prev => ({
      ...prev,
      [modalId]: { isOpen: true, data }
    }));
  }, []);

  /**
   * Close modal
   */
  const closeModal = useCallback((modalId) => {
    setModals(prev => ({
      ...prev,
      [modalId]: { isOpen: false, data: null }
    }));
  }, []);

  /**
   * Check if modal is open
   */
  const isModalOpen = useCallback((modalId) => {
    return modals[modalId]?.isOpen || false;
  }, [modals]);

  /**
   * Get modal data
   */
  const getModalData = useCallback((modalId) => {
    return modals[modalId]?.data || null;
  }, [modals]);

  /**
   * Set loading state for a component/action
   */
  const setLoadingState = useCallback((key, value) => {
    setLoading(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  /**
   * Check if something is loading
   */
  const isLoading = useCallback((key) => {
    return loading[key] || false;
  }, [loading]);

  /**
   * Navigate to tab
   */
  const navigateToTab = useCallback((tabId) => {
    setActiveTab(tabId);
  }, [setActiveTab]);

  const value = {
    // Sidebar
    sidebarCollapsed,
    toggleSidebar,
    setSidebarCollapsed,
    
    // Tabs
    activeTab,
    navigateToTab,
    setActiveTab,
    
    // Modals
    openModal,
    closeModal,
    isModalOpen,
    getModalData,
    
    // Loading states
    setLoadingState,
    isLoading,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
};
