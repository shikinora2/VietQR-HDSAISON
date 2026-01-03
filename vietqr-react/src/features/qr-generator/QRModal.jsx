import React from 'react';
import styled from 'styled-components';
import { Download, Printer, Share2, X } from 'lucide-react';
import { Modal, Button } from '../../components';
import useQRGenerator from '../../hooks/useQRGenerator';
import { useToast } from '../../contexts';
import { formatCurrency } from '../../utils/formatUtils';
import { printQRCode, shareQRCode } from '../../utils/qrUtils';

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.lg};
  padding: ${props => props.theme.spacing.md};

  @media (min-width: ${props => props.theme.breakpoints.tablet}) {
    flex-direction: row;
    gap: ${props => props.theme.spacing.xl};
  }
`;

const QRSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${props => props.theme.spacing.md};
`;

const QRImageLarge = styled.img`
  width: 100%;
  max-width: 280px;
  height: auto;
  aspect-ratio: 1;
  object-fit: contain;
  background: white;
  padding: ${props => props.theme.spacing.sm};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.md};
`;

const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.sm};
`;

const InfoTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0 0 8px 0;
`;

const InfoItem = styled.div`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.bg.tertiary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border.default};
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const InfoLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: 2px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const InfoValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.base};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const Actions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.sm};
`;

const BankInfo = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.bg.tertiary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px dashed ${props => props.theme.colors.border.default};
  margin-top: auto;
`;

const BankLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const BankValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.md};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.primary.main};
`;

const QRModal = ({ contract, bank, onClose }) => {
  const { generateContractQRCode, downloadQR } = useQRGenerator();
  const toast = useToast();

  const qrUrl = generateContractQRCode(contract);

  const handleDownload = async () => {
    try {
      await downloadQR(qrUrl, `QR_${contract.contractNumber}.jpg`);
      toast.success('Đã tải xuống mã QR');
    } catch (error) {
      toast.error('Lỗi khi tải xuống: ' + error.message);
    }
  };

  const handlePrint = () => {
    try {
      printQRCode(qrUrl, contract);
      toast.info('Đang mở cửa sổ in...');
    } catch (error) {
      toast.error('Lỗi khi in: ' + error.message);
    }
  };

  const handleShare = async () => {
    try {
      const shared = await shareQRCode(qrUrl, contract);
      if (shared) {
        toast.success('Đã chia sẻ mã QR');
      }
    } catch (error) {
      toast.error('Lỗi khi chia sẻ: ' + error.message);
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Xem Mã QR"
      size="medium"
    >
      <ModalContent>
        <QRSection>
          <QRImageLarge src={qrUrl} alt="QR Code" />

        </QRSection>

        <InfoSection>
          <InfoTitle>Thông Tin Chuyển Khoản</InfoTitle>

          <InfoItem style={{ padding: '12px' }}>
            <InfoLabel>Số Hợp Đồng</InfoLabel>
            <InfoValue style={{ fontSize: '16px' }}>{contract.contractNumber}</InfoValue>
          </InfoItem>


          {contract.customerName && (
            <InfoItem style={{ padding: '12px' }}>
              <InfoLabel>Tên Khách Hàng</InfoLabel>
              <InfoValue style={{ fontSize: '16px' }}>{contract.customerName}</InfoValue>
            </InfoItem>
          )}


          <InfoItem style={{ padding: '12px' }}>
            <InfoLabel>Số Tiền</InfoLabel>
            <InfoValue style={{ fontSize: '18px', color: '#EF4444' }}>{formatCurrency(contract.amount)}</InfoValue>
          </InfoItem>

          {contract.phoneNumber && (
            <InfoItem>
              <InfoLabel>Số Điện Thoại</InfoLabel>
              <InfoValue>{contract.phoneNumber}</InfoValue>
            </InfoItem>
          )}

          <BankInfo>
            <BankLabel>Ngân Hàng</BankLabel>
            <BankValue>{bank?.bankName || 'HD SAISON (HDBANK)'}</BankValue>
            <BankLabel style={{ marginTop: '8px' }}>Số Tài Khoản</BankLabel>
            <BankValue>{bank?.accountNumber || '002704070014601'}</BankValue>
            <BankLabel style={{ marginTop: '8px' }}>Tên người thụ hưởng</BankLabel>
            <BankValue>{bank?.accountName || 'HD SAISON'}</BankValue>
          </BankInfo>

          <Actions>
            <Button
              variant="primary"
              icon={<Download size={16} />}
              onClick={handleDownload}
              fullWidth
              size="small"
            >
              Tải
            </Button>
            <Button
              variant="secondary"
              icon={<Printer size={16} />}
              onClick={handlePrint}
              fullWidth
              size="small"
            >
              In
            </Button>
            <Button
              variant="secondary"
              icon={<Share2 size={16} />}
              onClick={handleShare}
              fullWidth
              size="small"
            >
              Chia sẻ
            </Button>
          </Actions>
        </InfoSection>
      </ModalContent>
    </Modal>
  );
};

export default QRModal;
