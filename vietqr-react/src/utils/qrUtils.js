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

/**
 * Print QR code
 * @param {string} url - QR code URL
 * @param {object} options - Print options
 */
export const printQRCode = async (url, options = {}) => {
  const {
    title = 'VietQR Payment',
    showAmount = true,
    showDescription = true,
  } = options;

  try {
    const blob = await fetchQRImage(url);
    const blobUrl = URL.createObjectURL(blob);

    const printWindow = window.open('', '_blank');

    if (!printWindow) {
      throw new Error('Could not open print window');
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              padding: 20px;
              font-family: 'IBM Plex Sans', sans-serif;
            }
            img {
              max-width: 400px;
              height: auto;
            }
            h2 {
              margin: 20px 0 10px;
              color: #1F2937;
            }
            p {
              margin: 5px 0;
              color: #6B7280;
            }
            @media print {
              body {
                padding: 0;
              }
            }
          </style>
        </head>
        <body>
          <h2>${title}</h2>
          <img src="${blobUrl}" alt="VietQR Code" />
          <p>Quét mã QR để thanh toán</p>
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
