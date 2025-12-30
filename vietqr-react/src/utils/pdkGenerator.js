/**
 * PDK (Phiếu Đề Khoản) Generator
 * Generate PDF forms for loan applications with 0% interest
 */

import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { formatCurrency, formatDate } from './formatUtils';

/**
 * Generate PDK 0% form PDF
 * @param {Object} loanData - Loan application data
 * @returns {Promise<{pdfBytes: Uint8Array, blob: Blob, url: string}>}
 */
export const generatePdkForm = async (loanData) => {
  try {
    const {
      // Customer info
      customerName = '',
      customerId = '',
      customerPhone = '',
      customerAddress = '',
      
      // Loan details
      loanAmount = 0,
      loanTerm = 12,
      interestRate = 0, // 0% for this form
      monthlyPayment = 0,
      
      // Contract info
      contractNumber = '',
      contractDate = new Date(),
      
      // POS info
      posName = '',
      posAddress = '',
      
      // Product info
      productName = '',
      productPrice = 0,
      downPayment = 0,
      
      // Advisor info
      advisorName = '',
      advisorCode = '',
      advisorPhone = '',
    } = loanData;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const primaryColor = rgb(0.39, 0.4, 0.95); // #6366F1
    const textColor = rgb(0.2, 0.2, 0.2);
    const grayColor = rgb(0.5, 0.5, 0.5);
    
    let yPosition = height - 60;
    const leftMargin = 50;
    const rightMargin = width - 50;
    const lineHeight = 18;

    // Helper function to draw text
    const drawText = (text, x, y, options = {}) => {
      const {
        size = 11,
        color = textColor,
        font: textFont = font,
        align = 'left',
      } = options;

      let finalX = x;
      if (align === 'center') {
        const textWidth = textFont.widthOfTextAtSize(text, size);
        finalX = (width - textWidth) / 2;
      } else if (align === 'right') {
        const textWidth = textFont.widthOfTextAtSize(text, size);
        finalX = rightMargin - textWidth;
      }

      page.drawText(text, {
        x: finalX,
        y,
        size,
        font: textFont,
        color,
      });
    };

    // Helper function to draw line
    const drawLine = (y, color = grayColor, thickness = 0.5) => {
      page.drawLine({
        start: { x: leftMargin, y },
        end: { x: rightMargin, y },
        thickness,
        color,
      });
    };

    // Helper function to draw box
    const drawBox = (x, y, w, h, options = {}) => {
      const {
        borderColor = grayColor,
        backgroundColor = null,
        borderWidth = 1,
      } = options;

      if (backgroundColor) {
        page.drawRectangle({
          x,
          y,
          width: w,
          height: h,
          color: backgroundColor,
        });
      }

      page.drawRectangle({
        x,
        y,
        width: w,
        height: h,
        borderColor,
        borderWidth,
      });
    };

    // === HEADER ===
    drawText('PHIẾU ĐỀ KHOẢN TRẢ GÓP 0%', leftMargin, yPosition, {
      size: 16,
      font: boldFont,
      color: primaryColor,
      align: 'center',
    });
    
    yPosition -= 25;
    drawText('HD SAISON', leftMargin, yPosition, {
      size: 12,
      font: boldFont,
      align: 'center',
    });

    yPosition -= 30;
    drawLine(yPosition);
    yPosition -= 30;

    // === CONTRACT INFO SECTION ===
    drawText('THÔNG TIN HỢP ĐỒNG', leftMargin, yPosition, {
      size: 13,
      font: boldFont,
      color: primaryColor,
    });
    yPosition -= lineHeight;

    drawText(`Số hợp đồng: ${contractNumber}`, leftMargin, yPosition);
    drawText(`Ngày lập: ${formatDate(contractDate)}`, leftMargin + 250, yPosition);
    yPosition -= lineHeight + 5;
    drawLine(yPosition, grayColor, 0.3);
    yPosition -= 20;

    // === CUSTOMER INFO SECTION ===
    drawText('THÔNG TIN KHÁCH HÀNG', leftMargin, yPosition, {
      size: 13,
      font: boldFont,
      color: primaryColor,
    });
    yPosition -= lineHeight;

    drawText('Họ và tên:', leftMargin, yPosition, { font: boldFont });
    drawText(customerName, leftMargin + 120, yPosition);
    yPosition -= lineHeight;

    drawText('CMND/CCCD:', leftMargin, yPosition, { font: boldFont });
    drawText(customerId, leftMargin + 120, yPosition);
    yPosition -= lineHeight;

    drawText('Số điện thoại:', leftMargin, yPosition, { font: boldFont });
    drawText(customerPhone, leftMargin + 120, yPosition);
    yPosition -= lineHeight;

    drawText('Địa chỉ:', leftMargin, yPosition, { font: boldFont });
    // Wrap long address
    const addressMaxWidth = rightMargin - (leftMargin + 120);
    const words = customerAddress.split(' ');
    let currentLine = '';
    let addressY = yPosition;
    
    words.forEach((word, index) => {
      const testLine = currentLine + (currentLine ? ' ' : '') + word;
      const testWidth = font.widthOfTextAtSize(testLine, 11);
      
      if (testWidth > addressMaxWidth && currentLine) {
        drawText(currentLine, leftMargin + 120, addressY);
        addressY -= lineHeight;
        currentLine = word;
      } else {
        currentLine = testLine;
      }
      
      if (index === words.length - 1) {
        drawText(currentLine, leftMargin + 120, addressY);
      }
    });
    
    yPosition = addressY - 5;
    drawLine(yPosition, grayColor, 0.3);
    yPosition -= 20;

    // === PRODUCT INFO SECTION ===
    drawText('THÔNG TIN SẢN PHẨM', leftMargin, yPosition, {
      size: 13,
      font: boldFont,
      color: primaryColor,
    });
    yPosition -= lineHeight;

    drawText('Tên sản phẩm:', leftMargin, yPosition, { font: boldFont });
    drawText(productName, leftMargin + 120, yPosition);
    yPosition -= lineHeight;

    drawText('Giá sản phẩm:', leftMargin, yPosition, { font: boldFont });
    drawText(formatCurrency(productPrice), leftMargin + 120, yPosition);
    yPosition -= lineHeight;

    drawText('Đặt cọc:', leftMargin, yPosition, { font: boldFont });
    drawText(formatCurrency(downPayment), leftMargin + 120, yPosition);
    yPosition -= lineHeight + 5;
    drawLine(yPosition, grayColor, 0.3);
    yPosition -= 20;

    // === LOAN INFO SECTION ===
    drawText('THÔNG TIN KHOẢN VAY', leftMargin, yPosition, {
      size: 13,
      font: boldFont,
      color: primaryColor,
    });
    yPosition -= lineHeight;

    // Draw box for loan summary
    const boxY = yPosition - 85;
    drawBox(leftMargin, boxY, rightMargin - leftMargin, 80, {
      backgroundColor: rgb(0.98, 0.98, 1),
      borderColor: primaryColor,
      borderWidth: 1.5,
    });

    drawText('Số tiền vay:', leftMargin + 15, yPosition - 20, { font: boldFont, size: 12 });
    drawText(formatCurrency(loanAmount), leftMargin + 250, yPosition - 20, { 
      size: 14, 
      font: boldFont,
      color: primaryColor,
    });

    drawText('Lãi suất:', leftMargin + 15, yPosition - 40, { font: boldFont, size: 12 });
    drawText(`${interestRate}%`, leftMargin + 250, yPosition - 40, { 
      size: 14, 
      font: boldFont,
      color: rgb(0.13, 0.77, 0.45), // Green
    });

    drawText('Thời hạn:', leftMargin + 15, yPosition - 60, { font: boldFont, size: 12 });
    drawText(`${loanTerm} tháng`, leftMargin + 250, yPosition - 60, { size: 12 });

    drawText('Trả hàng tháng:', leftMargin + 15, yPosition - 80, { font: boldFont, size: 12 });
    drawText(formatCurrency(monthlyPayment), leftMargin + 250, yPosition - 80, { 
      size: 14, 
      font: boldFont,
    });

    yPosition = boxY - 20;

    // === POS INFO SECTION ===
    drawText('ĐẠI LÝ BÁN HÀNG', leftMargin, yPosition, {
      size: 13,
      font: boldFont,
      color: primaryColor,
    });
    yPosition -= lineHeight;

    drawText('Tên đại lý:', leftMargin, yPosition, { font: boldFont });
    drawText(posName, leftMargin + 120, yPosition);
    yPosition -= lineHeight;

    drawText('Địa chỉ:', leftMargin, yPosition, { font: boldFont });
    drawText(posAddress, leftMargin + 120, yPosition);
    yPosition -= lineHeight + 5;
    drawLine(yPosition, grayColor, 0.3);
    yPosition -= 20;

    // === ADVISOR INFO SECTION ===
    drawText('TƯ VẤN VIÊN', leftMargin, yPosition, {
      size: 13,
      font: boldFont,
      color: primaryColor,
    });
    yPosition -= lineHeight;

    drawText('Họ và tên:', leftMargin, yPosition, { font: boldFont });
    drawText(advisorName, leftMargin + 120, yPosition);
    yPosition -= lineHeight;

    drawText('Mã TVBH:', leftMargin, yPosition, { font: boldFont });
    drawText(advisorCode, leftMargin + 120, yPosition);
    yPosition -= lineHeight;

    drawText('Số điện thoại:', leftMargin, yPosition, { font: boldFont });
    drawText(advisorPhone, leftMargin + 120, yPosition);
    yPosition -= 30;

    // === SIGNATURE SECTION ===
    drawLine(yPosition);
    yPosition -= 25;

    const signatureY = yPosition - 60;
    
    drawText('KHÁCH HÀNG', leftMargin + 50, yPosition, {
      font: boldFont,
      size: 11,
      align: 'left',
    });
    
    drawText('TƯ VẤN VIÊN', rightMargin - 100, yPosition, {
      font: boldFont,
      size: 11,
      align: 'left',
    });

    drawText('(Ký, ghi rõ họ tên)', leftMargin + 30, signatureY, {
      size: 9,
      color: grayColor,
    });
    
    drawText('(Ký, ghi rõ họ tên)', rightMargin - 120, signatureY, {
      size: 9,
      color: grayColor,
    });

    // === FOOTER ===
    const footerY = 40;
    drawText('HD SAISON - Tài chính tiêu dùng', leftMargin, footerY, {
      size: 8,
      color: grayColor,
      align: 'center',
    });
    
    drawText(`Được tạo tự động bởi VietQR System - ${formatDate(new Date())}`, leftMargin, footerY - 12, {
      size: 7,
      color: grayColor,
      align: 'center',
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    return {
      pdfBytes,
      blob,
      url: URL.createObjectURL(blob),
      filename: `PDK_${contractNumber}_${formatDate(new Date(), 'yyyyMMdd')}.pdf`,
    };
  } catch (error) {
    console.error('Error generating PDK form:', error);
    throw new Error('Không thể tạo phiếu đề khoản: ' + error.message);
  }
};

/**
 * Generate payment schedule table
 * @param {Object} loanData - Loan details
 * @returns {Promise<{pdfBytes: Uint8Array, blob: Blob, url: string}>}
 */
export const generatePaymentSchedule = async (loanData) => {
  try {
    const {
      contractNumber = '',
      loanAmount = 0,
      loanTerm = 12,
      monthlyPayment = 0,
      startDate = new Date(),
    } = loanData;

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const primaryColor = rgb(0.39, 0.4, 0.95);
    const textColor = rgb(0.2, 0.2, 0.2);
    const grayColor = rgb(0.5, 0.5, 0.5);
    
    let yPosition = height - 60;
    const leftMargin = 40;
    const rightMargin = width - 40;
    const lineHeight = 16;

    // Header
    page.drawText('LỊCH TRẢ NỢ TRẢ GÓP', {
      x: (width - boldFont.widthOfTextAtSize('LỊCH TRẢ NỢ TRẢ GÓP', 16)) / 2,
      y: yPosition,
      size: 16,
      font: boldFont,
      color: primaryColor,
    });
    
    yPosition -= 25;
    page.drawText(`Hợp đồng: ${contractNumber}`, {
      x: (width - font.widthOfTextAtSize(`Hợp đồng: ${contractNumber}`, 11)) / 2,
      y: yPosition,
      size: 11,
      font,
      color: textColor,
    });

    yPosition -= 35;

    // Table header
    const colWidths = [60, 120, 120, 120, 120];
    const colX = [
      leftMargin,
      leftMargin + colWidths[0],
      leftMargin + colWidths[0] + colWidths[1],
      leftMargin + colWidths[0] + colWidths[1] + colWidths[2],
      leftMargin + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3],
    ];
    const headers = ['Kỳ', 'Ngày thanh toán', 'Gốc', 'Lãi (0%)', 'Số tiền'];

    // Draw header background
    page.drawRectangle({
      x: leftMargin,
      y: yPosition - 18,
      width: rightMargin - leftMargin,
      height: 20,
      color: rgb(0.95, 0.95, 0.97),
    });

    // Draw header text
    headers.forEach((header, i) => {
      page.drawText(header, {
        x: colX[i] + 5,
        y: yPosition - 13,
        size: 10,
        font: boldFont,
        color: textColor,
      });
    });

    yPosition -= 20;

    // Draw table rows
    let remainingBalance = loanAmount;
    const principal = monthlyPayment; // Since interest is 0%
    
    for (let i = 1; i <= loanTerm; i++) {
      // Alternate row background
      if (i % 2 === 0) {
        page.drawRectangle({
          x: leftMargin,
          y: yPosition - lineHeight,
          width: rightMargin - leftMargin,
          height: lineHeight + 2,
          color: rgb(0.99, 0.99, 1),
        });
      }

      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + i);
      
      const currentPrincipal = i === loanTerm ? remainingBalance : principal;
      remainingBalance -= currentPrincipal;

      // Draw row data
      const rowData = [
        i.toString(),
        formatDate(paymentDate, 'dd/MM/yyyy'),
        formatCurrency(currentPrincipal),
        formatCurrency(0),
        formatCurrency(currentPrincipal),
      ];

      rowData.forEach((data, j) => {
        page.drawText(data, {
          x: colX[j] + 5,
          y: yPosition - 12,
          size: 9,
          font,
          color: textColor,
        });
      });

      yPosition -= lineHeight + 2;

      // Add new page if needed
      if (yPosition < 100 && i < loanTerm) {
        const newPage = pdfDoc.addPage([595, 842]);
        yPosition = height - 60;
        // Redraw header on new page
        // (simplified - in production, extract to function)
      }
    }

    // Total row
    yPosition -= 5;
    page.drawRectangle({
      x: leftMargin,
      y: yPosition - 18,
      width: rightMargin - leftMargin,
      height: 20,
      color: rgb(0.39, 0.4, 0.95, 0.1),
      borderColor: primaryColor,
      borderWidth: 1,
    });

    page.drawText('TỔNG CỘNG', {
      x: colX[0] + 5,
      y: yPosition - 13,
      size: 10,
      font: boldFont,
      color: textColor,
    });

    page.drawText(formatCurrency(loanAmount), {
      x: colX[2] + 5,
      y: yPosition - 13,
      size: 10,
      font: boldFont,
      color: textColor,
    });

    page.drawText(formatCurrency(0), {
      x: colX[3] + 5,
      y: yPosition - 13,
      size: 10,
      font: boldFont,
      color: textColor,
    });

    page.drawText(formatCurrency(loanAmount), {
      x: colX[4] + 5,
      y: yPosition - 13,
      size: 10,
      font: boldFont,
      color: primaryColor,
    });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });

    return {
      pdfBytes,
      blob,
      url: URL.createObjectURL(blob),
      filename: `LichTraNo_${contractNumber}_${formatDate(new Date(), 'yyyyMMdd')}.pdf`,
    };
  } catch (error) {
    console.error('Error generating payment schedule:', error);
    throw new Error('Không thể tạo lịch trả nợ: ' + error.message);
  }
};

export default {
  generatePdkForm,
  generatePaymentSchedule,
};
