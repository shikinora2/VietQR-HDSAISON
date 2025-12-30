import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks';
import { isValidContractNumber, validateAmount, isValidPhone } from '../utils/validationUtils';

const ContractContext = createContext();

export const useContract = () => {
  const context = useContext(ContractContext);
  if (!context) {
    throw new Error('useContract must be used within ContractProvider');
  }
  return context;
};

export const ContractProvider = ({ children }) => {
  // State management
  const [contracts, setContracts] = useLocalStorage('contracts', []);
  const [currentContract, setCurrentContract] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Add new contract
   */
  const addContract = useCallback((contractData) => {
    try {
      // Validate contract data
      if (!isValidContractNumber(contractData.contractNumber)) {
        throw new Error('Invalid contract number');
      }

      const newContract = {
        id: Date.now(),
        ...contractData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setContracts(prev => [...prev, newContract]);
      setCurrentContract(newContract);
      return newContract;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [setContracts]);

  /**
   * Update existing contract
   */
  const updateContract = useCallback((contractId, updates) => {
    try {
      setContracts(prev => 
        prev.map(contract => 
          contract.id === contractId
            ? { ...contract, ...updates, updatedAt: new Date().toISOString() }
            : contract
        )
      );

      if (currentContract?.id === contractId) {
        setCurrentContract(prev => ({ ...prev, ...updates }));
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [currentContract, setContracts]);

  /**
   * Delete contract
   */
  const deleteContract = useCallback((contractId) => {
    try {
      setContracts(prev => prev.filter(contract => contract.id !== contractId));
      
      if (currentContract?.id === contractId) {
        setCurrentContract(null);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [currentContract, setContracts]);

  /**
   * Get contract by ID
   */
  const getContract = useCallback((contractId) => {
    return contracts.find(contract => contract.id === contractId);
  }, [contracts]);

  /**
   * Search contracts
   */
  const searchContracts = useCallback((query) => {
    const lowerQuery = query.toLowerCase();
    return contracts.filter(contract => 
      contract.contractNumber?.toLowerCase().includes(lowerQuery) ||
      contract.customerName?.toLowerCase().includes(lowerQuery) ||
      contract.phoneNumber?.includes(query)
    );
  }, [contracts]);

  /**
   * Clear all contracts
   */
  const clearContracts = useCallback(() => {
    setContracts([]);
    setCurrentContract(null);
  }, [setContracts]);

  const value = {
    contracts,
    currentContract,
    setCurrentContract,
    isLoading,
    error,
    addContract,
    updateContract,
    deleteContract,
    getContract,
    searchContracts,
    clearContracts,
  };

  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};
