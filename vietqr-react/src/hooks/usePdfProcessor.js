import { useState, useCallback } from 'react';
import { extractPdfText, extractPageText, extractAllDataFromPdfText, validatePdfFile } from '../utils/pdfUtils';

/**
 * Custom hook for PDF processing
 * @returns {object} PDF processor methods and state
 */
const usePdfProcessor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  /**
   * Process single PDF file
   * @param {File} file - PDF file to process
   * @returns {Promise<object>} Extracted data
   */
  const processPdf = useCallback(async (file) => {
    setIsProcessing(true);
    setProgress(0);
    setError(null);

    try {
      // Validate file
      const validation = validatePdfFile(file);
      if (!validation.valid) {
        throw new Error(validation.error);
      }

      setProgress(20);

      // Extract full text
      const fullText = await extractPdfText(file);
      setProgress(50);

      // Extract payment page text (usually last page)
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = await import('pdfjs-dist');
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const lastPageNumber = pdf.numPages;
      
      const paymentPageText = await extractPageText(file, lastPageNumber);
      setProgress(70);

      // Extract all data
      const extractedData = extractAllDataFromPdfText(fullText, paymentPageText);
      setProgress(100);

      return {
        ...extractedData,
        fileName: file.name,
        fileSize: file.size,
        numPages: pdf.numPages,
      };
    } catch (err) {
      console.error('Error processing PDF:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
    }
  }, []);

  /**
   * Process multiple PDF files
   * @param {FileList|File[]} files - PDF files to process
   * @param {function} onProgress - Progress callback for each file
   * @returns {Promise<object[]>} Array of extracted data
   */
  const processMultiplePdfs = useCallback(async (files, onProgress) => {
    setIsProcessing(true);
    setError(null);

    const filesArray = Array.from(files);
    const results = [];
    const totalFiles = filesArray.length;

    try {
      for (let i = 0; i < totalFiles; i++) {
        const file = filesArray[i];
        const fileProgress = ((i + 1) / totalFiles) * 100;
        setProgress(fileProgress);

        if (onProgress) {
          onProgress(i + 1, totalFiles, file.name);
        }

        const data = await processPdf(file);
        results.push(data);
      }

      return results;
    } catch (err) {
      console.error('Error processing multiple PDFs:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [processPdf]);

  /**
   * Reset processor state
   */
  const reset = useCallback(() => {
    setIsProcessing(false);
    setProgress(0);
    setError(null);
  }, []);

  return {
    processPdf,
    processMultiplePdfs,
    isProcessing,
    progress,
    error,
    reset,
  };
};

export default usePdfProcessor;
