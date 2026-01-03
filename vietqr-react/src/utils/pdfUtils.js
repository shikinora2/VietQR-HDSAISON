/**
 * PDF processing utilities
 * Uses pdf-lib and pdfjs-dist for PDF manipulation
 */

import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
}

/**
 * Extract text from PDF file
 * @param {File|ArrayBuffer} file - PDF file or buffer
 * @returns {Promise<string>} Extracted text
 */
export const extractPdfText = async (file) => {
  try {
    let arrayBuffer;

    if (file instanceof File) {
      arrayBuffer = await file.arrayBuffer();
    } else {
      arrayBuffer = file;
    }

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText;
  } catch (error) {
    console.error('Error extracting PDF text:', error);
    throw error;
  }
};

/**
 * Extract specific page text from PDF
 * @param {File|ArrayBuffer} file - PDF file or buffer
 * @param {number} pageNumber - Page number (1-indexed)
 * @returns {Promise<string>} Extracted page text
 */
export const extractPageText = async (file, pageNumber) => {
  try {
    let arrayBuffer;

    if (file instanceof File) {
      arrayBuffer = await file.arrayBuffer();
    } else {
      arrayBuffer = file;
    }

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    if (pageNumber < 1 || pageNumber > pdf.numPages) {
      throw new Error(`Invalid page number: ${pageNumber}`);
    }

    const page = await pdf.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');

    return pageText;
  } catch (error) {
    console.error('Error extracting page text:', error);
    throw error;
  }
};

/**
 * Extract all data from PDF contract text
 * @param {string} fullText - Full PDF text
 * @param {string} paymentPageText - Payment page text
 * @returns {object} Extracted contract data
 */
export const extractAllDataFromPdfText = (fullText, paymentPageText = '') => {
  const findValue = (regex, text = fullText) => {
    const match = text.match(regex);
    return match?.[1]?.replace('VNĐ', '').trim() || null;
  };

  // Extract QR data from payment page
  let contract = findValue(/Số Hợp Đồng:\s*([A-Z0-9]+)/, paymentPageText) ||
    findValue(/Số HĐ:\s*([A-Z0-9]+)/, paymentPageText) ||
    findValue(/Số:\s*([A-Z0-9]+)/, fullText);

  let name = findValue(/Họ tên:\s*(.*?)\s*Thông tin Khoản Vay:/, paymentPageText) ||
    findValue(/Họ và tên:\s*(.*?)(?:\s*Số|$)/, paymentPageText) ||
    findValue(/1\.1\.\s*Họ tên:\s*(.*?)\s*1\.2\./, fullText);

  let amount = findValue(/Khoản Thanh Toán Hàng Tháng:\s*([\d,.]+)\s*VNĐ/, paymentPageText) ||
    findValue(/Thanh toán hàng tháng:\s*([\d,.]+)\s*VNĐ/, paymentPageText) ||
    findValue(/Số tiền thanh toán:\s*([\d,.]+)\s*VNĐ/, paymentPageText) ||
    findValue(/Monthly Payment:\s*([\d,.]+)\s*VNĐ/, paymentPageText);

  // Debug log for QR data
  console.log('[extractAllDataFromPdfText] Raw Payment Page Text (start):', paymentPageText ? paymentPageText.substring(0, 200) : 'EMPTY');
  console.log('[extractAllDataFromPdfText] Regex Results:', {
    contractMatch: contract,
    nameMatch: name,
    amountMatch: amount
  });

  // Extract additional fields
  const ngaySinh = findValue(/1\.2\.\s*Ngày sinh:\s*([0-9\/]+)/) ||
    findValue(/Ngày sinh:\s*([0-9\/]+)/);

  const soCCCD = findValue(/1\.4\.\s*Số CCCD\/Thẻ căn cước\/Giấy tờ khác:\s*([0-9]+)/) ||
    findValue(/1\.4\.\s*Số CCCD:\s*([0-9]+)/) ||
    findValue(/CMND\/CCCD:\s*([0-9]+)/);

  const sdt = findValue(/1\.7\.\s*Điện thoại di động:\s*(\d+)/) ||
    findValue(/1\.6\.\s*Điện thoại:\s*(\d+)/) ||
    findValue(/Điện thoại:\s*(\d+)/);

  const ngayDongTien = findValue(/5\.6\.\s*Ngày Thanh Toán Đầu Tiên:\s*([0-9\/]+)/) ||
    findValue(/Ngày Thanh Toán Đầu Tiên:\s*([0-9\/]+)/);

  const ngayKetThuc = findValue(/5\.8\.\s*Ngày Thanh Toán Cuối Cùng:\s*([0-9\/]+)/) ||
    findValue(/Ngày Thanh Toán Cuối Cùng:\s*([0-9\/]+)/);

  const ngayGiaiNgan = findValue(/2\.6\.\s*Ngày giải ngân dự kiến:\s*([0-9\/]+)/) ||
    findValue(/Ngày giải ngân:\s*([0-9\/]+)/);

  const thoiHanVay = findValue(/2\.5\. Thời Hạn Vay:\s*(.*?)\s*3\./);

  const insuranceFee = findValue(/4\.3\.\s*Phí bảo hiểm:\s*([0-9,.]+)\s*VNĐ\/tháng/) ||
    findValue(/Phí bảo hiểm:\s*([0-9,.]+)\s*VNĐ\/tháng/);

  // PDK specific fields
  let sanPham = findValue(/5\.9\.1\. Sản Phẩm Được Tài Trợ 1:\s*(.*?)(?:\s*Tổng Giá Bán|\s*5\.9\.2\.)/);
  if (sanPham) {
    sanPham = sanPham.split(',').map(item => item.trim().replace(/^\d+-/, '')).join(', ');
  }
  if (!sanPham) {
    sanPham = findValue(/Sản phẩm:\s*(.*?)(?:\s*Giá|\s*Tổng|$)/) ||
      findValue(/Product:\s*(.*?)(?:\s*Total|$)/) ||
      '';
  }

  let giaBan = findValue(/2\.2\. Tổng giá trị Sản Phẩm Được Tài Trợ:\s*([0-9,.]+(?:\s*VNĐ)?)/);
  if (!giaBan) {
    giaBan = findValue(/Tổng giá trị:\s*([0-9,.]+(?:\s*VNĐ)?)/) ||
      findValue(/Giá bán:\s*([0-9,.]+(?:\s*VNĐ)?)/) ||
      '';
  }

  let traTruoc = findValue(/2\.3\. Khoản Tiền Mặt Trả Trước:\s*([0-9,.]+(?:\s*VNĐ)?)/);
  if (!traTruoc) {
    traTruoc = findValue(/Trả trước:\s*([0-9,.]+(?:\s*VNĐ)?)/) ||
      findValue(/Down payment:\s*([0-9,.]+(?:\s*VNĐ)?)/) ||
      '0';
  }

  let tienVay = findValue(/2\.4\. Số tiền đề nghị vay:\s*([0-9,.]+(?:\s*VNĐ)?)/);
  if (!tienVay) {
    tienVay = findValue(/Số tiền vay:\s*([0-9,.]+(?:\s*VNĐ)?)/) ||
      findValue(/Loan amount:\s*([0-9,.]+(?:\s*VNĐ)?)/) ||
      '';
  }

  return {
    // QR Data
    qrData: {
      contract,
      name,
      amount,
    },
    // Full contract data (includes PDK fields)
    shd: contract,
    tenKH: name,
    sdt,
    ngaySinh,
    soCCCD,
    ngayDongTien,
    ngayKetThuc,
    ngayGiaiNgan,
    thoiHanVay,
    insuranceFee,
    // PDK specific fields
    sanPham,
    giaBan,
    traTruoc,
    tienVay,
    thoiHan: thoiHanVay, // alias for PDK
  };
};

/**
 * Detect contract type from contract number
 * @param {string} contractNumber - Contract number
 * @returns {string} Contract type ('DL' or 'DEFAULT')
 */
export const detectContractType = (contractNumber) => {
  if (!contractNumber) return 'UNKNOWN';

  const contractId = String(contractNumber).trim().toUpperCase();

  // DL contracts start with "DL"
  if (contractId.startsWith('DL')) {
    return 'DL';
  }

  // Other contract types (ED, SP, MB, etc.)
  return 'DEFAULT';
};

/**
 * Get PDF metadata
 * @param {File|ArrayBuffer} file - PDF file or buffer
 * @returns {Promise<object>} PDF metadata
 */
export const getPdfMetadata = async (file) => {
  try {
    let arrayBuffer;

    if (file instanceof File) {
      arrayBuffer = await file.arrayBuffer();
    } else {
      arrayBuffer = file;
    }

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const metadata = await pdf.getMetadata();

    return {
      numPages: pdf.numPages,
      title: metadata.info.Title || null,
      author: metadata.info.Author || null,
      subject: metadata.info.Subject || null,
      creator: metadata.info.Creator || null,
      producer: metadata.info.Producer || null,
      creationDate: metadata.info.CreationDate || null,
    };
  } catch (error) {
    console.error('Error getting PDF metadata:', error);
    throw error;
  }
};

/**
 * Split PDF into individual pages
 * @param {ArrayBuffer} pdfBuffer - PDF buffer
 * @returns {Promise<ArrayBuffer[]>} Array of page buffers
 */
export const splitPdfPages = async (pdfBuffer) => {
  try {
    const { PDFDocument } = await import('pdf-lib');
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pageCount = pdfDoc.getPageCount();
    const pages = [];

    for (let i = 0; i < pageCount; i++) {
      const newDoc = await PDFDocument.create();
      const [copiedPage] = await newDoc.copyPages(pdfDoc, [i]);
      newDoc.addPage(copiedPage);

      const pdfBytes = await newDoc.save();
      pages.push(pdfBytes);
    }

    return pages;
  } catch (error) {
    console.error('Error splitting PDF:', error);
    throw error;
  }
};

/**
 * Merge multiple PDFs into one
 * @param {ArrayBuffer[]} pdfBuffers - Array of PDF buffers
 * @returns {Promise<ArrayBuffer>} Merged PDF buffer
 */
export const mergePdfs = async (pdfBuffers) => {
  try {
    const { PDFDocument } = await import('pdf-lib');
    const mergedPdf = await PDFDocument.create();

    for (const pdfBuffer of pdfBuffers) {
      const pdf = await PDFDocument.load(pdfBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach(page => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    return mergedPdfBytes;
  } catch (error) {
    console.error('Error merging PDFs:', error);
    throw error;
  }
};

/**
 * Validate PDF file
 * @param {File} file - File to validate
 * @returns {object} Validation result {valid: boolean, error: string}
 */
export const validatePdfFile = (file) => {
  if (!file) {
    return { valid: false, error: 'Vui lòng chọn file' };
  }

  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'File phải là định dạng PDF' };
  }

  // Check file size (max 50MB)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    return { valid: false, error: 'File không được vượt quá 50MB' };
  }

  return { valid: true, error: null };
};

/**
 * Create blob URL from PDF buffer
 * @param {ArrayBuffer} pdfBuffer - PDF buffer
 * @returns {string} Blob URL
 */
export const createPdfBlobUrl = (pdfBuffer) => {
  const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
  return URL.createObjectURL(blob);
};

/**
 * Download PDF file
 * @param {ArrayBuffer} pdfBuffer - PDF buffer
 * @param {string} filename - Download filename
 */
export const downloadPdf = (pdfBuffer, filename = 'document.pdf') => {
  const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  setTimeout(() => URL.revokeObjectURL(url), 100);
};

/**
* Strip Vietnamese accents
* @param {string} str - String to strip
* @returns {string} Stripped string
*/
export const stripVietnamese = (str) => {
  if (!str) return '';
  return str.normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd').replace(/Đ/g, 'D');
};

/**
 * Build QR Code URL
 * @param {object} data - { contract, name, amount }
 * @param {string} template - Template name (default: qr_only.png)
 * @returns {string} QR URL
 */
export const buildQRUrl = ({ contract, name, amount }, template = "qr_only.png") => {
  const digitsOnly = (str) => String(str || '').replace(/\D/g, '');
  const contractId = contract || '';
  const customerName = name || '';
  const amountValue = digitsOnly(amount) || '0';
  const addInfo = `${contractId} ${stripVietnamese(customerName)}`.trim().toUpperCase();
  const params = new URLSearchParams({
    accountName: "HD SAISON",
    amount: amountValue,
    addInfo,
    template
  });
  return `https://img.vietqr.io/image/970437-002704070014601-${template}?${params.toString()}`;
};

/**
 * Fetch QR Image with fallback templates
 * @param {object} qrData - QR Data
 * @returns {Promise<object>} { imageBytes, template, isPNG, isJPEG }
 */
export const fetchQRImage = async (qrData) => {
  const templates = ["qr_only.png", "compact.png", "print.png"];

  for (const template of templates) {
    try {
      const qrUrl = buildQRUrl(qrData, template);
      const response = await fetch(qrUrl);

      if (!response.ok) continue;

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('image')) continue;

      const imageBytes = await response.arrayBuffer();
      if (imageBytes.byteLength === 0) continue;

      // Detect Type
      const uint8Array = new Uint8Array(imageBytes);
      const isPNG = uint8Array[0] === 0x89 && uint8Array[1] === 0x50 && uint8Array[2] === 0x4E && uint8Array[3] === 0x47;
      const isJPEG = uint8Array[0] === 0xFF && uint8Array[1] === 0xD8;

      if (isPNG || isJPEG) {
        return { imageBytes, template, isPNG, isJPEG };
      }
    } catch (error) {
      console.warn(`Error fetching QR template ${template}:`, error);
    }
  }
  throw new Error("Không thể tải QR code");
};

/**
 * Find payment page number in PDF
 * @param {object} pdf - Loaded PDF.js document
 * @returns {Promise<object>} { pageNumber, pageText }
 */
export const findPaymentPage = async (pdf) => {
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map(item => item.str).join(' ');
    if (pageText.includes('HƯỚNG DẪN THANH TOÁN') || (pageText.includes('Số Hợp Đồng:') && pageText.includes('Khoản Thanh Toán Hàng Tháng:'))) {
      console.log(`[findPaymentPage] Found payment info on page ${i}`);
      return { pageNumber: i, pageText };
    }
  }
  console.log('[findPaymentPage] Payment page not found via keywords, falling back to last page');

  // Default to last page if not found (fallback)
  const lastPage = await pdf.getPage(pdf.numPages);
  const textContent = await lastPage.getTextContent();
  return { pageNumber: pdf.numPages, pageText: textContent.items.map(item => item.str).join(' ') };
};

/**
 * Generate Contract File Set (HopDong.pdf, ThanhToan.pdf with QR, BaoHiem.pdf, PDK 0%)
 * @param {object} data - { file, qrData, pdkData, brandName, posId }
 * @returns {Promise<object>} { hopDongUrl, thanhToanUrl, baoHiemUrl, pdkUrl }
 */
export const generateContractFileSet = async ({ file, qrData, pdkData, brandName = '', posId = 'POS24414' }) => {
  try {
    const { PDFDocument } = await import('pdf-lib');
    const arrayBuffer = await file.arrayBuffer();

    // Load Original PDF for PDF.js to find payment page index
    // We need to re-load with PDF.js because pdf-lib doesn't extract text easily
    // OR we reuse the metadata if we had it. Use findPaymentPage logic here.
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer.slice(0) }); // Clone buffer
    const pdfJsDoc = await loadingTask.promise;
    const { pageNumber: paymentPageNum } = await findPaymentPage(pdfJsDoc);

    const originalPdfDoc = await PDFDocument.load(arrayBuffer);
    const totalPages = originalPdfDoc.getPageCount();

    // 1. Create HopDong.pdf
    // Logic: DL (1-5), Default (1-4).
    const contractType = detectContractType(qrData?.contract || pdkData?.shd);
    const hopDongDoc = await PDFDocument.create();
    let pagesToCopy = [];
    if (contractType === 'DL') {
      // Copy 0-4
      for (let i = 0; i < 5 && i < totalPages; i++) pagesToCopy.push(i);
    } else {
      // Copy 0-3
      pagesToCopy = [0, 1, 2, 3].filter(i => i < totalPages);
    }

    const copiedPages = await hopDongDoc.copyPages(originalPdfDoc, pagesToCopy);
    copiedPages.forEach(p => hopDongDoc.addPage(p));
    const hopDongBytes = await hopDongDoc.save();
    const hopDongUrl = URL.createObjectURL(new Blob([hopDongBytes], { type: 'application/pdf' }));

    // 2. Create ThanhToan.pdf
    const thanhToanDoc = await PDFDocument.create();
    // paymentPageNum is 1-based
    if (paymentPageNum > 0 && paymentPageNum <= totalPages) {
      const [paymentPage] = await thanhToanDoc.copyPages(originalPdfDoc, [paymentPageNum - 1]);
      thanhToanDoc.addPage(paymentPage);

      // Embed QR
      try {
        const { imageBytes, isPNG, isJPEG } = await fetchQRImage(qrData);
        let qrImage;
        if (isPNG) qrImage = await thanhToanDoc.embedPng(imageBytes);
        else if (isJPEG) qrImage = await thanhToanDoc.embedJpg(imageBytes);

        const { width, height } = paymentPage.getSize();
        const qrDims = qrImage.scale(0.20);
        // Position: Bottom right
        paymentPage.drawImage(qrImage, {
          x: width - qrDims.width - 65,
          y: height - qrDims.height - 65,
          width: qrDims.width,
          height: qrDims.height
        });
      } catch (e) {
        console.error("Failed to embed QR:", e);
      }
    }

    const thanhToanBytes = await thanhToanDoc.save();
    const thanhToanUrl = URL.createObjectURL(new Blob([thanhToanBytes], { type: 'application/pdf' }));

    // 3. Create BaoHiem.pdf - Find page containing 'BẢN YÊU CẦU BẢO HIỂM'
    let baoHiemUrl = null;
    try {
      // Find insurance page by searching for text 'BẢN YÊU CẦU BẢO HIỂM'
      let insurancePageNum = -1;
      for (let i = 1; i <= pdfJsDoc.numPages; i++) {
        const page = await pdfJsDoc.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        if (pageText.includes('BẢN YÊU CẦU BẢO HIỂM') && insurancePageNum === -1) {
          insurancePageNum = i;
          break;
        }
      }

      // If found, copy that page and the next page (2 pages total)
      if (insurancePageNum > 0 && insurancePageNum + 1 <= totalPages) {
        const baoHiemDoc = await PDFDocument.create();
        // insurancePageNum is 1-indexed, convert to 0-indexed
        const pagesToCopyBH = [insurancePageNum - 1, insurancePageNum];

        const baoHiemPages = await baoHiemDoc.copyPages(originalPdfDoc, pagesToCopyBH);
        baoHiemPages.forEach(p => baoHiemDoc.addPage(p));
        const baoHiemBytes = await baoHiemDoc.save();
        baoHiemUrl = URL.createObjectURL(new Blob([baoHiemBytes], { type: 'application/pdf' }));
      }
    } catch (e) {
      console.warn('Could not create BaoHiem PDF:', e);
    }

    // 4. Create PDK 0% - Only for non-DL contracts
    let pdkUrl = null;
    if (contractType !== 'DL') {
      try {
        const pdkBytes = await generatePdkPdfBytes(pdkData, brandName, posId);
        if (pdkBytes) {
          pdkUrl = URL.createObjectURL(new Blob([pdkBytes], { type: 'application/pdf' }));
        }
      } catch (e) {
        console.warn('Could not create PDK PDF:', e);
      }
    }

    return { hopDongUrl, thanhToanUrl, baoHiemUrl, pdkUrl };

  } catch (error) {
    console.error("Error generating file set:", error);
    throw error;
  }
};

// PDK Coordinates for text placement (from HTML legacy)
const PDK_COORDS = {
  "tenKH": { x: 143.32, y: 616.87 },
  "sdt": { x: 143.32, y: 603.04 },
  "sanPham": { x: 117.31, y: 465.25 },
  "giaBan": { x: 112.88, y: 444.78 },
  "ngayGiaoDich": { x: 140.00, y: 425.97 },
  "tienVay": { x: 122.84, y: 385.57 },
  "traTruoc": { x: 145.53, y: 366.20 },
  "thoiHan": { x: 147.19, y: 345.73 },
  "shd": { x: 146.08, y: 325.81 }
};

// POS Info with template URLs
const POS_INFO = {
  "POS24414": {
    templateUrl: 'https://rawcdn.githack.com/shikinora2/VietQR-HDSAISON/e77ada21e72f381e5d8aaa2aecc7b9851fece42d/PDK0IR%20-%20DMCL%20(2).pdf'
  },
  "POS13858": {
    templateUrl: 'https://rawcdn.githack.com/shikinora2/VietQR-HDSAISON/e77ada21e72f381e5d8aaa2aecc7b9851fece42d/PDK0IR%20-%20DMCL%2013858.pdf'
  }
};

const FONT_URL = 'https://rawcdn.githack.com/shikinora2/VietQR-HDSAISON/f0381eb2e75227df3ceeb4ff3e8979f11229af35/SVN-Times%20New%20Roman%20Bold.ttf';

// Resource cache
const CACHED_RESOURCES = {};

/**
 * Fetch font and template with caching
 */
const fetchResources = async (posId = 'POS24414') => {
  try {
    if (!CACHED_RESOURCES.font) {
      console.log('Fetching font...');
      const fontResp = await fetch(FONT_URL);
      CACHED_RESOURCES.font = await fontResp.arrayBuffer();
    }

    if (!CACHED_RESOURCES[posId]) {
      const templateUrl = POS_INFO[posId]?.templateUrl || POS_INFO['POS24414'].templateUrl;
      console.log(`Fetching template for ${posId}...`);
      const templateResp = await fetch(templateUrl);
      CACHED_RESOURCES[posId] = await templateResp.arrayBuffer();
    }

    return {
      fontBytes: CACHED_RESOURCES.font,
      templateBytes: CACHED_RESOURCES[posId]
    };
  } catch (error) {
    console.error('Error fetching resources:', error);
    throw error;
  }
};

/**
 * Format currency for PDK display
 */
const formatPdkCurrency = (numStr) => {
  if (!numStr) return '0 VNĐ';
  const cleanNum = String(numStr).replace(/[^\d]/g, '');
  if (!cleanNum || isNaN(Number(cleanNum))) return '0 VNĐ';
  return Number(cleanNum).toLocaleString('vi-VN') + ' VNĐ';
};

/**
 * Generate PDK 0% PDF bytes
 * @param {object} pdkData - Contract data for PDK
 * @param {string} brandName - Brand name to append to product
 * @param {string} posId - POS ID for template selection
 * @returns {Promise<Uint8Array>} PDF bytes
 */
export const generatePdkPdfBytes = async (pdkData, brandName = '', posId = 'POS24414') => {
  try {
    if (!pdkData) throw new Error('PDK data không hợp lệ');

    const { PDFDocument, rgb } = await import('pdf-lib');
    const fontkit = (await import('@pdf-lib/fontkit')).default;

    const { fontBytes, templateBytes } = await fetchResources(posId);

    if (!fontBytes || !templateBytes) {
      throw new Error('Không thể tải font hoặc template');
    }

    console.log('Loading PDF template...');
    const pdfDoc = await PDFDocument.load(templateBytes);
    pdfDoc.registerFontkit(fontkit);

    console.log('Embedding font...');
    const font = await pdfDoc.embedFont(fontBytes, { subset: false });
    const page = pdfDoc.getPages()[0];
    const today = new Date().toLocaleDateString('vi-VN');

    // Draw text at each coordinate
    for (const key in PDK_COORDS) {
      let text = (key === 'ngayGiaoDich') ? today : (pdkData[key] || '');

      // Format currency fields
      if (['giaBan', 'tienVay', 'traTruoc'].includes(key)) {
        text = formatPdkCurrency(text);
      }

      // Append brand name to product
      if (key === 'sanPham' && brandName) {
        const upperBrandName = brandName.toUpperCase();
        text = text ? `${text} ${upperBrandName}` : upperBrandName;
      }

      page.drawText(String(text), {
        x: PDK_COORDS[key].x,
        y: PDK_COORDS[key].y,
        font,
        size: 13,
        color: rgb(0, 0, 0),
        maxWidth: 400
      });
    }

    // Remove all pages except page 1 (only show first page)
    const pageCount = pdfDoc.getPageCount();
    if (pageCount > 1) {
      for (let i = pageCount - 1; i >= 1; i--) {
        pdfDoc.removePage(i);
      }
    }

    console.log('Saving PDK PDF (page 1 only)...');
    return await pdfDoc.save();
  } catch (error) {
    console.error('Error generating PDK PDF:', error);
    throw error;
  }
};

/**
 * Combine PDFs for specific print layouts (Front/Back)
 * @param {object} fileSet - Object containing file URLs { hopDongUrl, thanhToanUrl, baoHiemUrl, pdkUrl }
 * @param {string} printType - 'front' or 'back'
 * @returns {Promise<string>} Blob URL of the combined PDF
 */
export const combinePdfsForPrinting = async (fileSet, printType) => {
  try {
    const { PDFDocument } = await import('pdf-lib');
    const finalPdfDoc = await PDFDocument.create();

    // Configuration for React app structure (Using Url suffixes)
    const printConfigurations = {
      front: [
        { fileKey: 'pdkUrl', pages: [0] },          // 1. PDK 0% (Page 1)
        { fileKey: 'thanhToanUrl', pages: [0] },    // 2. Guide Payment (Page 1) [Contains QR]
        { fileKey: 'hopDongUrl', pages: [0] },      // 3. Contract (Page 1)
        { fileKey: 'hopDongUrl', pages: [2] },      // 4. Contract (Page 3)
        { fileKey: 'baoHiemUrl', pages: [0] }       // 5. Insurance (Page 1)
      ],
      back: [
        { fileKey: 'baoHiemUrl', pages: [1] },      // 1. Insurance (Page 2)
        { fileKey: 'hopDongUrl', pages: [3] },      // 2. Contract (Page 4)
        { fileKey: 'hopDongUrl', pages: [1] }       // 3. Contract (Page 2)
      ]
    };

    const filesToProcess = printConfigurations[printType];
    if (!filesToProcess) throw new Error(`Invalid print type: ${printType}`);

    for (const item of filesToProcess) {
      const { fileKey, pages } = item;
      const fileUrl = fileSet[fileKey];

      if (fileUrl) {
        try {
          // Fetch the blob from the internal object URL
          const response = await fetch(fileUrl);
          const pdfBytes = await response.arrayBuffer();
          const sourcePdf = await PDFDocument.load(pdfBytes);
          const sourcePageCount = sourcePdf.getPageCount();

          // Filter valid pages
          const validPageIndices = pages.filter(index => index < sourcePageCount);
          if (validPageIndices.length === 0) continue;

          const copiedPages = await finalPdfDoc.copyPages(sourcePdf, validPageIndices);
          copiedPages.forEach(page => finalPdfDoc.addPage(page));
        } catch (err) {
          console.warn(`Error processing ${fileKey} for printing:`, err);
        }
      }
    }

    if (finalPdfDoc.getPageCount() === 0) {
      throw new Error('Không có trang nào hợp lệ để tạo file in.');
    }

    const finalPdfBytes = await finalPdfDoc.save();
    return URL.createObjectURL(new Blob([finalPdfBytes], { type: 'application/pdf' }));
  } catch (error) {
    console.error('Error combining PDFs:', error);
    throw error;
  }
};
