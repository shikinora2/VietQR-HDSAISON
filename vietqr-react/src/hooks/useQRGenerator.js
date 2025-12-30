import { useState, useCallback } from 'react';
import { buildQRUrl, downloadQRImage, generateContractQR, validateQRParams } from '../utils/qrUtils';

/**
 * Custom hook for QR code generation
 * @returns {object} QR generator methods and state
 */
const useQRGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Generate QR code URL
   * @param {object} params - QR parameters
   * @returns {string} QR code URL
   */
  const generateQR = useCallback((params) => {
    try {
      // Validate parameters
      const validation = validateQRParams(params);
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '));
      }

      const url = buildQRUrl(params);
      return url;
    } catch (err) {
      console.error('Error generating QR:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Generate QR for contract
   * @param {object} contract - Contract data
   * @returns {string} QR code URL
   */
  const generateContractQRCode = useCallback((contract) => {
    try {
      const url = generateContractQR(contract);
      return url;
    } catch (err) {
      console.error('Error generating contract QR:', err);
      setError(err.message);
      throw err;
    }
  }, []);

  /**
   * Download QR code
   * @param {string} url - QR code URL
   * @param {string} filename - Download filename
   */
  const downloadQR = useCallback(async (url, filename) => {
    setIsGenerating(true);
    setError(null);

    try {
      await downloadQRImage(url, filename);
    } catch (err) {
      console.error('Error downloading QR:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * Generate and download multiple QR codes
   * @param {array} contracts - Array of contract data
   * @param {function} onProgress - Progress callback
   */
  const downloadMultipleQRs = useCallback(async (contracts, onProgress) => {
    setIsGenerating(true);
    setError(null);

    try {
      const total = contracts.length;

      for (let i = 0; i < total; i++) {
        const contract = contracts[i];
        const url = generateContractQR(contract);
        const filename = `QR_${contract.contractNumber || i + 1}.jpg`;

        await downloadQRImage(url, filename);

        if (onProgress) {
          onProgress(i + 1, total);
        }

        // Small delay between downloads
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (err) {
      console.error('Error downloading multiple QRs:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, []);

  /**
   * Reset generator state
   */
  const reset = useCallback(() => {
    setIsGenerating(false);
    setError(null);
  }, []);

  return {
    generateQR,
    generateContractQRCode,
    downloadQR,
    downloadMultipleQRs,
    isGenerating,
    error,
    reset,
  };
};

export default useQRGenerator;
