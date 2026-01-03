/**
 * QR Code generation and VietQR utilities
 * Matching HTML legacy logic exactly
 */

const VIETQR_API_BASE = 'https://img.vietqr.io/image';

// HD SAISON Bank Info - matching HTML legacy
const HD_SAISON_BANK_CODE = '970437';
const HD_SAISON_ACCOUNT = '002704070014601';
const HD_SAISON_ACCOUNT_NAME = 'HD SAISON';

/**
 * Strip Vietnamese diacritics from text
 * @param {string} text - Vietnamese text
 * @returns {string} Text without diacritics
 */
export const stripVietnamese = (text) => {
  if (!text) return '';
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
};

/**
 * Get only digits from text
 * @param {string} text - Input text
 * @returns {string} Only digits
 */
export const digitsOnly = (text) => {
  if (!text) return '';
  return String(text).replace(/\D/g, '');
};

/**
 * Build VietQR URL for HD SAISON bank - matching HTML legacy exactly
 * @param {object} params - QR parameters
 * @param {string} params.contract - Contract number
 * @param {string} params.name - Customer name
 * @param {string|number} params.amount - Transfer amount
 * @param {string} params.template - QR template (default: 'qr_only.png')
 * @returns {string} VietQR URL
 */
export const buildQRUrl = ({
  contract = '',
  name = '',
  amount = 0,
  template = 'qr_only.png',
}) => {
  // Build addInfo: contract + name (stripped Vietnamese)
  const addInfo = `${contract} ${stripVietnamese(name)}`.trim().toUpperCase();

  // Build URL params - matching HTML legacy exactly
  const params = new URLSearchParams({
    accountName: HD_SAISON_ACCOUNT_NAME,
    amount: digitsOnly(amount),
    addInfo,
    template,
  });

  // Build URL: https://img.vietqr.io/image/970437-002704070014601-qr_only.png?...
  return `${VIETQR_API_BASE}/${HD_SAISON_BANK_CODE}-${HD_SAISON_ACCOUNT}-${template}?${params}`;
};

/**
 * Fetch QR code image as blob
 * @param {string} url - QR code URL
 * @returns {Promise<Blob>} QR code image blob
 */
export const fetchQRImage = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch QR code: ${response.status}`);
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    console.error('Error fetching QR code:', error);
    throw error;
  }
};

/**
 * Download QR code image
 * @param {string} url - QR code URL
 * @param {string} filename - Download filename
 * @returns {Promise<void>}
 */
export const downloadQRImage = async (url, filename = 'vietqr.jpg') => {
  try {
    const blob = await fetchQRImage(url);
    const blobUrl = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up blob URL
    setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
  } catch (error) {
    console.error('Error downloading QR code:', error);
    throw error;
  }
};

/**
 * Generate QR code for contract - matching HTML legacy
 * @param {object} contract - Contract data
 * @param {string} contract.contractNumber - Contract number
 * @param {string} contract.customerName - Customer name
 * @param {string|number} contract.amount - Payment amount
 * @returns {string} QR code URL
 */
export const generateContractQR = (contract) => {
  const { contractNumber, customerName, amount } = contract;

  // Match HTML legacy: buildQRUrl({ contract, name, amount })
  return buildQRUrl({
    contract: contractNumber || '',
    name: customerName || '',
    amount: amount || 0,
    template: 'qr_only.png',
  });
};

export const printQRCode = async (url, contract = {}) => {
  const {
    contractNumber = '',
    customerName = '',
    amount = 0,
  } = contract;

  try {
    const blob = await fetchQRImage(url);
    const blobUrl = URL.createObjectURL(blob);

    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      throw new Error('Could not open print window');
    }

    // Format amount with thousands separator
    const formatAmount = (num) => {
      if (!num) return '0';
      return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    };

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>VietQR Payment - ${contractNumber}</title>
          <style>
            @page {
              size: A5;
              margin: 0;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              width: 148mm;
              height: 210mm;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
              padding: 15mm;
              background: white;
            }
            .container {
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 20px;
            }
            h1 {
              font-size: 22px;
              font-weight: 700;
              color: #1F2937;
              margin-bottom: 5px;
            }
            .qr-image {
              width: 200px;
              height: 200px;
              border-radius: 12px;
              box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              padding: 8px;
              background: white;
            }
            .info-section {
              width: 100%;
              display: flex;
              flex-direction: column;
              gap: 12px;
            }
            .info-title {
              font-size: 18px;
              font-weight: 700;
              color: #1F2937;
              text-align: center;
              margin-bottom: 8px;
            }
            .info-item {
              padding: 12px 16px;
              background: #F3F4F6;
              border-radius: 8px;
              border: 1px solid #E5E7EB;
            }
            .info-label {
              font-size: 11px;
              color: #6B7280;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              margin-bottom: 4px;
            }
            .info-value {
              font-size: 16px;
              font-weight: 600;
              color: #1F2937;
            }
            .info-value.amount {
              font-size: 20px;
              color: #EF4444;
            }
            .bank-info {
              width: 100%;
              padding: 12px 16px;
              background: #F9FAFB;
              border-radius: 8px;
              border: 1px dashed #D1D5DB;
              margin-top: 8px;
            }
            .bank-info-row {
              margin-bottom: 12px;
            }
            .bank-info-row:last-child {
              margin-bottom: 0;
            }
            .bank-label {
              font-size: 11px;
              color: #6B7280;
              margin-bottom: 2px;
            }
            .bank-value {
              font-size: 14px;
              font-weight: 600;
              color: #3B82F6;
            }
            @media print {
              body {
                padding: 10mm;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>VietQR Payment</h1>
            <img src="${blobUrl}" alt="VietQR Code" class="qr-image" />
            
            <div class="info-section">
              <div class="info-title">Thông Tin Chuyển Khoản</div>
              
              ${contractNumber ? `
                <div class="info-item">
                  <div class="info-label">Số Hợp Đồng</div>
                  <div class="info-value">${contractNumber}</div>
                </div>
              ` : ''}
              
              ${customerName ? `
                <div class="info-item">
                  <div class="info-label">Tên Khách Hàng</div>
                  <div class="info-value">${customerName}</div>
                </div>
              ` : ''}
              
              ${amount ? `
                <div class="info-item">
                  <div class="info-label">Số Tiền</div>
                  <div class="info-value amount">${formatAmount(amount)} đ</div>
                </div>
              ` : ''}
              
              <div class="bank-info">
                <div class="bank-info-row">
                  <div class="bank-label">Ngân Hàng</div>
                  <div class="bank-value">HD SAISON (HDBANK)</div>
                </div>
                <div class="bank-info-row">
                  <div class="bank-label">Số Tài Khoản</div>
                  <div class="bank-value">002704070014601</div>
                </div>
                <div class="bank-info-row">
                  <div class="bank-label">Tên người thụ hưởng</div>
                  <div class="bank-value">HD SAISON</div>
                </div>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        URL.revokeObjectURL(blobUrl);
      }, 250);
    };
  } catch (error) {
    console.error('Error printing QR code:', error);
    throw error;
  }
};

/**
 * Share QR code via Web Share API
 * @param {string} url - QR code URL
 * @param {string} title - Share title
 * @returns {Promise<void>}
 */
export const shareQRCode = async (url, title = 'VietQR Payment') => {
  try {
    const blob = await fetchQRImage(url);
    const file = new File([blob], 'vietqr.jpg', { type: 'image/jpeg' });

    if (navigator.share && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title,
        text: 'Quét mã QR để thanh toán',
        files: [file],
      });
    } else {
      // Fallback: copy URL to clipboard
      await navigator.clipboard.writeText(url);
      console.log('QR URL copied to clipboard');
    }
  } catch (error) {
    console.error('Error sharing QR code:', error);
    throw error;
  }
};

/**
 * Validate QR parameters - matching new buildQRUrl API
 * @param {object} params - QR parameters to validate
 * @returns {object} Validation result {valid: boolean, errors: string[]}
 */
export const validateQRParams = (params) => {
  const errors = [];

  // Contract is optional but amount should be positive
  if (params.amount && (isNaN(params.amount) || params.amount < 0)) {
    errors.push('Amount must be a positive number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Get QR code templates
 * @returns {array} Available QR templates
 */
export const getQRTemplates = () => {
  return [
    { value: 'compact', label: 'Compact', description: 'Small QR code' },
    { value: 'compact2', label: 'Compact 2', description: 'Small QR code variant' },
    { value: 'qr_only', label: 'QR Only', description: 'QR code without branding' },
    { value: 'print', label: 'Print', description: 'Optimized for printing' },
  ];
};
