/**
 * PDF Printer Utilities
 * Handle print preparation with front/back page selection and print settings
 */

/**
 * Print options interface
 * @typedef {Object} PrintOptions
 * @property {boolean} frontPage - Print front page
 * @property {boolean} backPage - Print back page
 * @property {number} copies - Number of copies
 * @property {boolean} color - Color or black & white
 * @property {string} orientation - 'portrait' or 'landscape'
 * @property {string} paperSize - 'A4', 'Letter', etc.
 * @property {boolean} duplex - Print on both sides
 */

/**
 * Prepare PDF for printing with specific pages
 * @param {Blob|string} pdfSource - PDF blob or URL
 * @param {PrintOptions} options - Print options
 * @returns {Promise<string>} URL for print-ready PDF
 */
export const preparePdfForPrint = async (pdfSource, options = {}) => {
  const {
    frontPage = true,
    backPage = true,
    copies = 1,
    color = true,
    orientation = 'portrait',
    paperSize = 'A4',
    duplex = false,
  } = options;

  try {
    let pdfUrl;
    
    // Convert to URL if needed
    if (pdfSource instanceof Blob) {
      pdfUrl = URL.createObjectURL(pdfSource);
    } else if (typeof pdfSource === 'string') {
      pdfUrl = pdfSource;
    } else {
      throw new Error('Invalid PDF source');
    }

    // Store print options in sessionStorage for the print dialog
    sessionStorage.setItem('printOptions', JSON.stringify({
      frontPage,
      backPage,
      copies,
      color,
      orientation,
      paperSize,
      duplex,
    }));

    return pdfUrl;
  } catch (error) {
    console.error('Error preparing PDF for print:', error);
    throw new Error('Không thể chuẩn bị PDF để in: ' + error.message);
  }
};

/**
 * Open print dialog for PDF
 * @param {Blob|string} pdfSource - PDF blob or URL
 * @param {PrintOptions} options - Print options
 */
export const printPdf = async (pdfSource, options = {}) => {
  try {
    const pdfUrl = await preparePdfForPrint(pdfSource, options);
    
    // Create hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = pdfUrl;
    
    document.body.appendChild(iframe);

    // Wait for PDF to load, then print
    iframe.onload = () => {
      setTimeout(() => {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          
          // Clean up after printing
          setTimeout(() => {
            document.body.removeChild(iframe);
            if (pdfSource instanceof Blob) {
              URL.revokeObjectURL(pdfUrl);
            }
          }, 1000);
        } catch (error) {
          console.error('Print error:', error);
          document.body.removeChild(iframe);
        }
      }, 500);
    };

    iframe.onerror = () => {
      console.error('Failed to load PDF for printing');
      document.body.removeChild(iframe);
      throw new Error('Không thể tải PDF để in');
    };
  } catch (error) {
    console.error('Error printing PDF:', error);
    throw error;
  }
};

/**
 * Print only front page
 * @param {Blob|string} pdfSource - PDF blob or URL
 * @param {Object} options - Additional print options
 */
export const printFrontPage = async (pdfSource, options = {}) => {
  return printPdf(pdfSource, {
    ...options,
    frontPage: true,
    backPage: false,
  });
};

/**
 * Print only back page
 * @param {Blob|string} pdfSource - PDF blob or URL
 * @param {Object} options - Additional print options
 */
export const printBackPage = async (pdfSource, options = {}) => {
  return printPdf(pdfSource, {
    ...options,
    frontPage: false,
    backPage: true,
  });
};

/**
 * Print both front and back pages
 * @param {Blob|string} pdfSource - PDF blob or URL
 * @param {Object} options - Additional print options
 */
export const printBothPages = async (pdfSource, options = {}) => {
  return printPdf(pdfSource, {
    ...options,
    frontPage: true,
    backPage: true,
    duplex: true,
  });
};

/**
 * Download PDF instead of printing
 * @param {Blob|string} pdfSource - PDF blob or URL
 * @param {string} filename - Download filename
 */
export const downloadPdf = async (pdfSource, filename = 'document.pdf') => {
  try {
    let blob;
    
    if (pdfSource instanceof Blob) {
      blob = pdfSource;
    } else if (typeof pdfSource === 'string') {
      // Fetch from URL
      const response = await fetch(pdfSource);
      blob = await response.blob();
    } else {
      throw new Error('Invalid PDF source');
    }

    // Create download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Không thể tải xuống PDF: ' + error.message);
  }
};

/**
 * Get print preview URL
 * @param {Blob|string} pdfSource - PDF blob or URL
 * @returns {Promise<string>} Preview URL
 */
export const getPrintPreviewUrl = async (pdfSource) => {
  try {
    if (pdfSource instanceof Blob) {
      return URL.createObjectURL(pdfSource);
    } else if (typeof pdfSource === 'string') {
      return pdfSource;
    } else {
      throw new Error('Invalid PDF source');
    }
  } catch (error) {
    console.error('Error getting preview URL:', error);
    throw new Error('Không thể tạo URL xem trước: ' + error.message);
  }
};

/**
 * Check if browser supports printing
 * @returns {boolean}
 */
export const isPrintSupported = () => {
  return typeof window !== 'undefined' && 'print' in window;
};

/**
 * Get recommended print settings based on document type
 * @param {string} documentType - Type of document ('contract', 'pdk', 'schedule', 'qr')
 * @returns {PrintOptions}
 */
export const getRecommendedPrintSettings = (documentType) => {
  const settings = {
    contract: {
      frontPage: true,
      backPage: true,
      copies: 2, // One for customer, one for company
      color: true,
      orientation: 'portrait',
      paperSize: 'A4',
      duplex: true,
    },
    pdk: {
      frontPage: true,
      backPage: false,
      copies: 1,
      color: true,
      orientation: 'portrait',
      paperSize: 'A4',
      duplex: false,
    },
    schedule: {
      frontPage: true,
      backPage: true,
      copies: 1,
      color: false, // B&W to save ink
      orientation: 'portrait',
      paperSize: 'A4',
      duplex: false,
    },
    qr: {
      frontPage: true,
      backPage: false,
      copies: 1,
      color: true, // QR codes must be in color
      orientation: 'portrait',
      paperSize: 'A4',
      duplex: false,
    },
  };

  return settings[documentType] || settings.contract;
};

/**
 * Batch print multiple PDFs
 * @param {Array<{source: Blob|string, filename: string}>} pdfs - Array of PDFs to print
 * @param {PrintOptions} options - Print options
 * @returns {Promise<void>}
 */
export const batchPrintPdfs = async (pdfs, options = {}) => {
  try {
    if (!Array.isArray(pdfs) || pdfs.length === 0) {
      throw new Error('No PDFs provided for batch printing');
    }

    // Print PDFs sequentially with delay
    for (let i = 0; i < pdfs.length; i++) {
      const { source, filename } = pdfs[i];
      
      console.log(`Printing ${i + 1}/${pdfs.length}: ${filename}`);
      
      await printPdf(source, {
        ...options,
        // Add document-specific options if needed
      });
      
      // Wait between prints to avoid conflicts
      if (i < pdfs.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    console.log('Batch print completed');
  } catch (error) {
    console.error('Error in batch printing:', error);
    throw new Error('Không thể in hàng loạt: ' + error.message);
  }
};

/**
 * Create printable contract package (contract + QR + PDK)
 * @param {Object} contractData - Contract data with PDF sources
 * @returns {Promise<void>}
 */
export const printContractPackage = async (contractData) => {
  try {
    const {
      contractPdf,
      qrPdf,
      pdkPdf,
      contractNumber = 'unknown',
    } = contractData;

    const pdfs = [];

    if (contractPdf) {
      pdfs.push({
        source: contractPdf,
        filename: `HopDong_${contractNumber}.pdf`,
      });
    }

    if (qrPdf) {
      pdfs.push({
        source: qrPdf,
        filename: `QR_${contractNumber}.pdf`,
      });
    }

    if (pdkPdf) {
      pdfs.push({
        source: pdkPdf,
        filename: `PDK_${contractNumber}.pdf`,
      });
    }

    if (pdfs.length === 0) {
      throw new Error('No PDFs found in contract package');
    }

    await batchPrintPdfs(pdfs, {
      color: true,
      copies: 1,
      orientation: 'portrait',
      paperSize: 'A4',
    });
  } catch (error) {
    console.error('Error printing contract package:', error);
    throw new Error('Không thể in gói hợp đồng: ' + error.message);
  }
};

/**
 * Validate print options
 * @param {PrintOptions} options - Print options to validate
 * @returns {{valid: boolean, errors: Array<string>}}
 */
export const validatePrintOptions = (options) => {
  const errors = [];

  if (options.copies !== undefined) {
    if (typeof options.copies !== 'number' || options.copies < 1 || options.copies > 10) {
      errors.push('Số bản in phải từ 1 đến 10');
    }
  }

  if (options.orientation && !['portrait', 'landscape'].includes(options.orientation)) {
    errors.push('Hướng giấy không hợp lệ');
  }

  if (options.paperSize && !['A4', 'Letter', 'Legal'].includes(options.paperSize)) {
    errors.push('Kích thước giấy không hợp lệ');
  }

  if (!options.frontPage && !options.backPage) {
    errors.push('Phải chọn ít nhất một mặt để in');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

export default {
  preparePdfForPrint,
  printPdf,
  printFrontPage,
  printBackPage,
  printBothPages,
  downloadPdf,
  getPrintPreviewUrl,
  isPrintSupported,
  getRecommendedPrintSettings,
  batchPrintPdfs,
  printContractPackage,
  validatePrintOptions,
};
