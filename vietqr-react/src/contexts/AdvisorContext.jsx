import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '../hooks';

const AdvisorContext = createContext();

export const useAdvisor = () => {
  const context = useContext(AdvisorContext);
  if (!context) {
    throw new Error('useAdvisor must be used within AdvisorProvider');
  }
  return context;
};

export const AdvisorProvider = ({ children }) => {
  // Advisor/Salesperson state
  const [advisors, setAdvisors] = useLocalStorage('advisors', []);
  const [currentAdvisor, setCurrentAdvisor] = useLocalStorage('currentAdvisor', null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Add advisor
   */
  const addAdvisor = useCallback((advisorData) => {
    try {
      const newAdvisor = {
        id: Date.now(),
        ...advisorData,
        createdAt: new Date().toISOString(),
      };

      setAdvisors(prev => [...prev, newAdvisor]);
      return newAdvisor;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [setAdvisors]);

  /**
   * Update advisor
   */
  const updateAdvisor = useCallback((advisorId, updates) => {
    try {
      setAdvisors(prev => 
        prev.map(advisor => 
          advisor.id === advisorId
            ? { ...advisor, ...updates, updatedAt: new Date().toISOString() }
            : advisor
        )
      );

      if (currentAdvisor?.id === advisorId) {
        setCurrentAdvisor(prev => ({ ...prev, ...updates }));
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [currentAdvisor, setAdvisors, setCurrentAdvisor]);

  /**
   * Delete advisor
   */
  const deleteAdvisor = useCallback((advisorId) => {
    try {
      setAdvisors(prev => prev.filter(advisor => advisor.id !== advisorId));
      
      if (currentAdvisor?.id === advisorId) {
        setCurrentAdvisor(null);
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [currentAdvisor, setAdvisors, setCurrentAdvisor]);

  /**
   * Set active advisor (login)
   */
  const loginAdvisor = useCallback((advisorId) => {
    const advisor = advisors.find(a => a.id === advisorId);
    if (advisor) {
      setCurrentAdvisor(advisor);
      return advisor;
    }
    throw new Error('Advisor not found');
  }, [advisors, setCurrentAdvisor]);

  /**
   * Logout current advisor
   */
  const logoutAdvisor = useCallback(() => {
    setCurrentAdvisor(null);
  }, [setCurrentAdvisor]);

  /**
   * Get advisor by ID
   */
  const getAdvisor = useCallback((advisorId) => {
    return advisors.find(advisor => advisor.id === advisorId);
  }, [advisors]);

  /**
   * Search advisors
   */
  const searchAdvisors = useCallback((query) => {
    const lowerQuery = query.toLowerCase();
    return advisors.filter(advisor => 
      advisor.name?.toLowerCase().includes(lowerQuery) ||
      advisor.code?.toLowerCase().includes(lowerQuery) ||
      advisor.email?.toLowerCase().includes(lowerQuery)
    );
  }, [advisors]);

  const value = {
    advisors,
    currentAdvisor,
    isLoading,
    error,
    addAdvisor,
    updateAdvisor,
    deleteAdvisor,
    loginAdvisor,
    logoutAdvisor,
    getAdvisor,
    searchAdvisors,
  };

  return (
    <AdvisorContext.Provider value={value}>
      {children}
    </AdvisorContext.Provider>
  );
};
