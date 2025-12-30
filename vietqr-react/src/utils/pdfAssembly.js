/**
 * PDF Assembly Utilities
 * Advanced PDF manipulation: split, merge, embed QR codes, add advisor info
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

/**
 * Split PDF into individual pages
 * @param {File|ArrayBuffer} file - PDF file to split
 * @returns {Promise<Array<{pageNumber: number, pdfBytes: Uint8Array, blob: Blob}>>}
 */
export const splitPdfPages = async (file) => {
  try {
    const arrayBuffer = file instanceof File ? await file.arrayBuffer() : file;
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pageCount = pdfDoc.getPageCount();
    const pages = [];

    for (let i = 0; i < pageCount; i++) {
      // Create new document for each page
      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [i]);
      newPdf.addPage(copiedPage);

      // Serialize to bytes
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });

      pages.push({
        pageNumber: i + 1,
        pdfBytes,
        blob,
        url: URL.createObjectURL(blob),
      });
    }

    return pages;
  } catch (error) {
    console.error('Error splitting PDF:', error);
    throw new Error('Không thể tách trang PDF: ' + error.message);
  }
};

/**
 * Merge multiple PDF files into one
 * @param {Array<File|ArrayBuffer>} files - PDF files to merge
 * @returns {Promise<{pdfBytes: Uint8Array, blob: Blob, url: string}>}
 */
export const mergePdfs = async (files) => {
  try {
    const mergedPdf = await PDFDocument.create();

    for (const file of files) {
      const arrayBuffer = file instanceof File ? await file.arrayBuffer() : file;
      const pdf = await PDFDocument.load(arrayBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const pdfBytes = await mergedPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    return {
      pdfBytes,
      blob,
      url: URL.createObjectURL(blob),
    };
  } catch (error) {
    console.error('Error merging PDFs:', error);
    throw new Error('Không thể gộp PDF: ' + error.message);
  }
};

/**
 * Embed QR code image into PDF page
 * @param {File|ArrayBuffer} pdfFile - Original PDF
 * @param {string} qrImageUrl - QR code image URL or data URL
 * @param {Object} options - Position and size options
 * @returns {Promise<{pdfBytes: Uint8Array, blob: Blob, url: string}>}
 */
export const embedQrInPdf = async (
  pdfFile,
  qrImageUrl,
  options = {}
) => {
  try {
    const {
      pageIndex = 0,
      x = 50,
      y = 50,
      width = 150,
      height = 150,
      position = 'bottom-right', // 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'center', 'custom'
    } = options;

    const arrayBuffer = pdfFile instanceof File ? await pdfFile.arrayBuffer() : pdfFile;
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    
    if (pageIndex >= pages.length) {
      throw new Error('Page index out of range');
    }

    const page = pages[pageIndex];
    const { width: pageWidth, height: pageHeight } = page.getSize();

    // Fetch QR image
    const imageBytes = await fetch(qrImageUrl).then(res => res.arrayBuffer());
    const image = qrImageUrl.includes('png') || qrImageUrl.includes('data:image/png')
      ? await pdfDoc.embedPng(imageBytes)
      : await pdfDoc.embedJpg(imageBytes);

    // Calculate position based on preset
    let finalX = x;
    let finalY = y;

    switch (position) {
      case 'top-left':
        finalX = 30;
        finalY = pageHeight - height - 30;
        break;
      case 'top-right':
        finalX = pageWidth - width - 30;
        finalY = pageHeight - height - 30;
        break;
      case 'bottom-left':
        finalX = 30;
        finalY = 30;
        break;
      case 'bottom-right':
        finalX = pageWidth - width - 30;
        finalY = 30;
        break;
      case 'center':
        finalX = (pageWidth - width) / 2;
        finalY = (pageHeight - height) / 2;
        break;
      case 'custom':
        // Use provided x, y
        break;
    }

    // Draw QR code on page
    page.drawImage(image, {
      x: finalX,
      y: finalY,
      width,
      height,
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    return {
      pdfBytes,
      blob,
      url: URL.createObjectURL(blob),
    };
  } catch (error) {
    console.error('Error embedding QR in PDF:', error);
    throw new Error('Không thể chèn mã QR vào PDF: ' + error.message);
  }
};

/**
 * Add advisor information to PDF footer
 * @param {File|ArrayBuffer} pdfFile - Original PDF
 * @param {Object} advisorInfo - Advisor details
 * @returns {Promise<{pdfBytes: Uint8Array, blob: Blob, url: string}>}
 */
export const addAdvisorInfoToPdf = async (pdfFile, advisorInfo) => {
  try {
    const {
      name = '',
      phone = '',
      email = '',
      code = '',
      branch = '',
      position = 'left', // 'left', 'right', 'center'
    } = advisorInfo;

    const arrayBuffer = pdfFile instanceof File ? await pdfFile.arrayBuffer() : pdfFile;
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const fontSize = 9;
    const lineHeight = 12;
    const textColor = rgb(0.3, 0.3, 0.3);
    const marginBottom = 30;

    // Add info to all pages
    pages.forEach((page) => {
      const { width: pageWidth } = page.getSize();
      
      // Prepare text lines
      const lines = [
        name ? `Tư vấn viên: ${name}` : null,
        code ? `Mã TVBH: ${code}` : null,
        phone ? `SĐT: ${phone}` : null,
        email ? `Email: ${email}` : null,
        branch ? `Chi nhánh: ${branch}` : null,
      ].filter(Boolean);

      // Calculate starting Y position
      let startY = marginBottom;

      // Calculate X position based on alignment
      let startX = 50; // default left
      if (position === 'center') {
        // Calculate max text width to center properly
        const maxWidth = Math.max(
          ...lines.map(line => font.widthOfTextAtSize(line, fontSize))
        );
        startX = (pageWidth - maxWidth) / 2;
      } else if (position === 'right') {
        const maxWidth = Math.max(
          ...lines.map(line => font.widthOfTextAtSize(line, fontSize))
        );
        startX = pageWidth - maxWidth - 50;
      }

      // Draw each line
      lines.forEach((line, index) => {
        const currentFont = index === 0 ? boldFont : font;
        page.drawText(line, {
          x: startX,
          y: startY + ((lines.length - 1 - index) * lineHeight),
          size: fontSize,
          font: currentFont,
          color: textColor,
        });
      });
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    return {
      pdfBytes,
      blob,
      url: URL.createObjectURL(blob),
    };
  } catch (error) {
    console.error('Error adding advisor info to PDF:', error);
    throw new Error('Không thể thêm thông tin TVBH vào PDF: ' + error.message);
  }
};

/**
 * Extract specific pages from PDF
 * @param {File|ArrayBuffer} pdfFile - Original PDF
 * @param {Array<number>} pageNumbers - Page numbers to extract (1-indexed)
 * @returns {Promise<{pdfBytes: Uint8Array, blob: Blob, url: string}>}
 */
export const extractPdfPages = async (pdfFile, pageNumbers) => {
  try {
    const arrayBuffer = pdfFile instanceof File ? await pdfFile.arrayBuffer() : pdfFile;
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();

    // Convert to 0-indexed and validate
    const pageIndices = pageNumbers
      .map(num => num - 1)
      .filter(idx => idx >= 0 && idx < pdfDoc.getPageCount());

    if (pageIndices.length === 0) {
      throw new Error('Không có trang hợp lệ để trích xuất');
    }

    const copiedPages = await newPdf.copyPages(pdfDoc, pageIndices);
    copiedPages.forEach((page) => newPdf.addPage(page));

    const pdfBytes = await newPdf.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    return {
      pdfBytes,
      blob,
      url: URL.createObjectURL(blob),
    };
  } catch (error) {
    console.error('Error extracting PDF pages:', error);
    throw new Error('Không thể trích xuất trang PDF: ' + error.message);
  }
};

/**
 * Rotate PDF pages
 * @param {File|ArrayBuffer} pdfFile - Original PDF
 * @param {number} degrees - Rotation angle (90, 180, 270)
 * @param {Array<number>} pageNumbers - Page numbers to rotate (1-indexed), or null for all pages
 * @returns {Promise<{pdfBytes: Uint8Array, blob: Blob, url: string}>}
 */
export const rotatePdfPages = async (pdfFile, degrees, pageNumbers = null) => {
  try {
    if (![90, 180, 270].includes(degrees)) {
      throw new Error('Rotation must be 90, 180, or 270 degrees');
    }

    const arrayBuffer = pdfFile instanceof File ? await pdfFile.arrayBuffer() : pdfFile;
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const pages = pdfDoc.getPages();

    // Determine which pages to rotate
    const pagesToRotate = pageNumbers
      ? pageNumbers.map(num => num - 1).filter(idx => idx >= 0 && idx < pages.length)
      : pages.map((_, idx) => idx);

    // Rotate specified pages
    pagesToRotate.forEach(idx => {
      const page = pages[idx];
      const currentRotation = page.getRotation().angle;
      page.setRotation({ type: 'degrees', angle: (currentRotation + degrees) % 360 });
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    return {
      pdfBytes,
      blob,
      url: URL.createObjectURL(blob),
    };
  } catch (error) {
    console.error('Error rotating PDF pages:', error);
    throw new Error('Không thể xoay trang PDF: ' + error.message);
  }
};

/**
 * Combine QR and advisor info into PDF (convenience function)
 * @param {File|ArrayBuffer} pdfFile - Original PDF
 * @param {string} qrImageUrl - QR code image URL
 * @param {Object} advisorInfo - Advisor details
 * @param {Object} qrOptions - QR embedding options
 * @returns {Promise<{pdfBytes: Uint8Array, blob: Blob, url: string}>}
 */
export const assemblePdfWithQrAndInfo = async (
  pdfFile,
  qrImageUrl,
  advisorInfo,
  qrOptions = {}
) => {
  try {
    // First embed QR code
    const { pdfBytes: pdfWithQr } = await embedQrInPdf(pdfFile, qrImageUrl, qrOptions);
    
    // Then add advisor info
    const result = await addAdvisorInfoToPdf(pdfWithQr, advisorInfo);
    
    return result;
  } catch (error) {
    console.error('Error assembling PDF:', error);
    throw new Error('Không thể hoàn thiện PDF: ' + error.message);
  }
};

export default {
  splitPdfPages,
  mergePdfs,
  embedQrInPdf,
  addAdvisorInfoToPdf,
  extractPdfPages,
  rotatePdfPages,
  assemblePdfWithQrAndInfo,
};
