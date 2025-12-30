/**
 * PDF Processing Examples
 * Demo usage of advanced PDF utilities
 */

import {
  // PDF Assembly
  splitPdfPages,
  mergePdfs,
  embedQrInPdf,
  addAdvisorInfoToPdf,
  extractPdfPages,
  rotatePdfPages,
  assemblePdfWithQrAndInfo,
  
  // PDK Generator
  generatePdkForm,
  generatePaymentSchedule,
  
  // PDF Printer
  printPdf,
  printFrontPage,
  printBackPage,
  printBothPages,
  downloadPdf,
  printContractPackage,
  getRecommendedPrintSettings,
  
  // Cache
  cachePdf,
  getCachedPdf,
  cacheImage,
  getCachedImage,
  getCacheStats,
  clearExpiredCache,
} from '../utils';

// ============================================
// Example 1: Generate PDK Form with Payment Schedule
// ============================================

export const exampleGeneratePdkForm = async () => {
  const loanData = {
    // Customer info
    customerName: 'Nguyễn Văn A',
    customerId: '001234567890',
    customerPhone: '0901234567',
    customerAddress: '123 Đường ABC, Phường XYZ, Quận 1, TP. HCM',
    
    // Loan details
    loanAmount: 30000000, // 30 triệu
    loanTerm: 12, // 12 tháng
    interestRate: 0, // 0%
    monthlyPayment: 2500000, // 2.5 triệu/tháng
    
    // Contract info
    contractNumber: 'HD2024120001',
    contractDate: new Date(),
    
    // POS info
    posName: 'Siêu thị điện máy ABC',
    posAddress: '456 Đường DEF, Quận 2, TP. HCM',
    
    // Product info
    productName: 'iPhone 15 Pro Max 256GB',
    productPrice: 33000000,
    downPayment: 3000000,
    
    // Advisor info
    advisorName: 'Trần Thị B',
    advisorCode: 'TVBH001',
    advisorPhone: '0912345678',
  };

  try {
    // Generate PDK form
    const pdkResult = await generatePdkForm(loanData);
    console.log('PDK Form generated:', pdkResult.filename);
    
    // Generate payment schedule
    const scheduleResult = await generatePaymentSchedule(loanData);
    console.log('Payment Schedule generated:', scheduleResult.filename);
    
    // Download both files
    await downloadPdf(pdkResult.blob, pdkResult.filename);
    await downloadPdf(scheduleResult.blob, scheduleResult.filename);
    
    return { pdkResult, scheduleResult };
  } catch (error) {
    console.error('Error generating PDK:', error);
    throw error;
  }
};

// ============================================
// Example 2: Split PDF and Embed QR Code
// ============================================

export const exampleSplitAndEmbedQr = async (contractPdfFile, qrImageUrl) => {
  try {
    // Step 1: Split PDF into pages
    const pages = await splitPdfPages(contractPdfFile);
    console.log(`PDF split into ${pages.length} pages`);
    
    // Step 2: Embed QR code on the first page
    const qrEmbeddedResult = await embedQrInPdf(
      pages[0].blob,
      qrImageUrl,
      {
        position: 'bottom-right',
        width: 120,
        height: 120,
      }
    );
    
    console.log('QR code embedded successfully');
    
    // Step 3: Add advisor info to the page with QR
    const advisorInfo = {
      name: 'Trần Thị B',
      phone: '0912345678',
      code: 'TVBH001',
      branch: 'Chi nhánh Quận 1',
      position: 'left',
    };
    
    const finalResult = await addAdvisorInfoToPdf(
      qrEmbeddedResult.blob,
      advisorInfo
    );
    
    console.log('Advisor info added successfully');
    
    // Download the result
    await downloadPdf(finalResult.blob, 'contract_with_qr.pdf');
    
    return finalResult;
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw error;
  }
};

// ============================================
// Example 3: Assemble Complete Contract Package
// ============================================

export const exampleAssembleContractPackage = async (
  contractPdfFile,
  qrImageUrl
) => {
  try {
    const advisorInfo = {
      name: 'Trần Thị B',
      phone: '0912345678',
      email: 'tranthib@hdsaison.com',
      code: 'TVBH001',
      branch: 'Chi nhánh Quận 1',
      position: 'left',
    };
    
    const qrOptions = {
      position: 'bottom-right',
      width: 120,
      height: 120,
    };
    
    // Combine QR and advisor info in one operation
    const result = await assemblePdfWithQrAndInfo(
      contractPdfFile,
      qrImageUrl,
      advisorInfo,
      qrOptions
    );
    
    console.log('Contract package assembled successfully');
    
    // Cache the result for faster access
    await cachePdf('contract_HD2024120001', result.blob);
    console.log('Contract cached');
    
    return result;
  } catch (error) {
    console.error('Error assembling contract:', error);
    throw error;
  }
};

// ============================================
// Example 4: Print Contract Package
// ============================================

export const examplePrintContractPackage = async (contractNumber) => {
  try {
    // Check cache first
    const cachedContract = await getCachedPdf(`contract_${contractNumber}`);
    const cachedQr = await getCachedPdf(`qr_${contractNumber}`);
    const cachedPdk = await getCachedPdf(`pdk_${contractNumber}`);
    
    if (!cachedContract || !cachedQr || !cachedPdk) {
      throw new Error('Contract package not found in cache');
    }
    
    // Print all documents
    await printContractPackage({
      contractPdf: cachedContract,
      qrPdf: cachedQr,
      pdkPdf: cachedPdk,
      contractNumber,
    });
    
    console.log('Contract package sent to printer');
  } catch (error) {
    console.error('Error printing contract:', error);
    throw error;
  }
};

// ============================================
// Example 5: Print with Specific Settings
// ============================================

export const examplePrintWithSettings = async (pdfBlob, documentType) => {
  try {
    // Get recommended settings based on document type
    const settings = getRecommendedPrintSettings(documentType);
    
    console.log('Print settings:', settings);
    
    // Print with settings
    await printPdf(pdfBlob, settings);
    
    console.log('Document sent to printer');
  } catch (error) {
    console.error('Error printing:', error);
    throw error;
  }
};

// ============================================
// Example 6: Merge Multiple PDFs
// ============================================

export const exampleMergePdfs = async (pdfFiles) => {
  try {
    // Merge all PDFs
    const mergedResult = await mergePdfs(pdfFiles);
    
    console.log('PDFs merged successfully');
    
    // Download merged PDF
    await downloadPdf(mergedResult.blob, 'merged_contract_package.pdf');
    
    return mergedResult;
  } catch (error) {
    console.error('Error merging PDFs:', error);
    throw error;
  }
};

// ============================================
// Example 7: Extract Specific Pages
// ============================================

export const exampleExtractPages = async (pdfFile, pageNumbers) => {
  try {
    // Extract specific pages (e.g., pages 1, 3, 5)
    const extractedResult = await extractPdfPages(pdfFile, pageNumbers);
    
    console.log(`Extracted pages: ${pageNumbers.join(', ')}`);
    
    // Download extracted pages
    await downloadPdf(extractedResult.blob, 'extracted_pages.pdf');
    
    return extractedResult;
  } catch (error) {
    console.error('Error extracting pages:', error);
    throw error;
  }
};

// ============================================
// Example 8: Rotate PDF Pages
// ============================================

export const exampleRotatePages = async (pdfFile, degrees = 90) => {
  try {
    // Rotate all pages
    const rotatedResult = await rotatePdfPages(pdfFile, degrees);
    
    console.log(`Pages rotated by ${degrees} degrees`);
    
    // Download rotated PDF
    await downloadPdf(rotatedResult.blob, 'rotated_contract.pdf');
    
    return rotatedResult;
  } catch (error) {
    console.error('Error rotating pages:', error);
    throw error;
  }
};

// ============================================
// Example 9: Cache Management
// ============================================

export const exampleCacheManagement = async () => {
  try {
    // Get cache statistics
    const stats = getCacheStats();
    console.log('Cache Statistics:', stats);
    console.log(`Using ${stats.usagePercent}% of ${stats.maxSizeMB}MB`);
    console.log(`Total items: ${stats.itemCount}`);
    console.log(`Expired items: ${stats.expiredCount}`);
    
    // Clear expired items
    const clearedCount = clearExpiredCache();
    console.log(`Cleared ${clearedCount} expired items`);
    
    // Check updated stats
    const updatedStats = getCacheStats();
    console.log('Updated cache usage:', updatedStats.usagePercent + '%');
    
    return updatedStats;
  } catch (error) {
    console.error('Error managing cache:', error);
    throw error;
  }
};

// ============================================
// Example 10: Complete Workflow
// ============================================

export const exampleCompleteWorkflow = async (
  contractPdfFile,
  qrImageUrl,
  loanData
) => {
  try {
    console.log('Starting complete contract workflow...');
    
    // Step 1: Generate PDK and Payment Schedule
    console.log('Step 1: Generating PDK and Payment Schedule...');
    const { pdkResult, scheduleResult } = await exampleGeneratePdkForm();
    
    // Step 2: Assemble contract with QR and advisor info
    console.log('Step 2: Assembling contract with QR code...');
    const contractResult = await exampleAssembleContractPackage(
      contractPdfFile,
      qrImageUrl
    );
    
    // Step 3: Cache all documents
    console.log('Step 3: Caching documents...');
    await cachePdf('pdk_' + loanData.contractNumber, pdkResult.blob);
    await cachePdf('schedule_' + loanData.contractNumber, scheduleResult.blob);
    await cachePdf('contract_' + loanData.contractNumber, contractResult.blob);
    await cacheImage('qr_' + loanData.contractNumber, qrImageUrl);
    
    // Step 4: Merge all PDFs
    console.log('Step 4: Merging all documents...');
    const mergedResult = await mergePdfs([
      contractResult.blob,
      pdkResult.blob,
      scheduleResult.blob,
    ]);
    
    // Step 5: Download complete package
    console.log('Step 5: Downloading complete package...');
    await downloadPdf(
      mergedResult.blob,
      `Complete_Package_${loanData.contractNumber}.pdf`
    );
    
    // Step 6: Print if needed
    console.log('Step 6: Preparing for print...');
    const printSettings = getRecommendedPrintSettings('contract');
    console.log('Recommended print settings:', printSettings);
    
    console.log('Workflow completed successfully!');
    
    return {
      pdkResult,
      scheduleResult,
      contractResult,
      mergedResult,
    };
  } catch (error) {
    console.error('Error in complete workflow:', error);
    throw error;
  }
};

// Export all examples
export default {
  exampleGeneratePdkForm,
  exampleSplitAndEmbedQr,
  exampleAssembleContractPackage,
  examplePrintContractPackage,
  examplePrintWithSettings,
  exampleMergePdfs,
  exampleExtractPages,
  exampleRotatePages,
  exampleCacheManagement,
  exampleCompleteWorkflow,
};
