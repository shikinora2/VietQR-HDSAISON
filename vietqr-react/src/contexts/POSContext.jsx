import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks';

const POSContext = createContext();

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within POSProvider');
  }
  return context;
};

export const POSProvider = ({ children }) => {
  // POS system state
  const [posData, setPosData] = useLocalStorage('posData', []);
  const [currentPOS, setCurrentPOS] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Add POS entry
   */
  const addPOSEntry = useCallback((entry) => {
    try {
      const newEntry = {
        id: Date.now(),
        ...entry,
        createdAt: new Date().toISOString(),
      };

      setPosData(prev => [...prev, newEntry]);
      return newEntry;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [setPosData]);

  /**
   * Update POS entry
   */
  const updatePOSEntry = useCallback((entryId, updates) => {
    try {
      setPosData(prev => 
        prev.map(entry => 
          entry.id === entryId
            ? { ...entry, ...updates, updatedAt: new Date().toISOString() }
            : entry
        )
      );
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [setPosData]);

  /**
   * Delete POS entry
   */
  const deletePOSEntry = useCallback((entryId) => {
    try {
      setPosData(prev => prev.filter(entry => entry.id !== entryId));
      
      if (currentPOS?.id === entryId) {
        setCurrentPOS(null);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [currentPOS, setPosData]);

  /**
   * Get POS entries by date range
   */
  const getPOSByDateRange = useCallback((startDate, endDate) => {
    return posData.filter(entry => {
      const entryDate = new Date(entry.createdAt);
      return entryDate >= startDate && entryDate <= endDate;
    });
  }, [posData]);

  /**
   * Calculate total amount for a period
   */
  const calculateTotalAmount = useCallback((entries = posData) => {
    return entries.reduce((total, entry) => total + (entry.amount || 0), 0);
  }, [posData]);

  /**
   * Clear all POS data
   */
  const clearPOSData = useCallback(() => {
    setPosData([]);
    setCurrentPOS(null);
  }, [setPosData]);

  const value = {
    posData,
    currentPOS,
    setCurrentPOS,
    isLoading,
    error,
    addPOSEntry,
    updatePOSEntry,
    deletePOSEntry,
    getPOSByDateRange,
    calculateTotalAmount,
    clearPOSData,
  };

  return (
    <POSContext.Provider value={value}>
      {children}
    </POSContext.Provider>
  );
};
