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
  max-width: 400px;
  height: auto;
  aspect-ratio: 1;
  object-fit: contain;
  background: white;
  padding: ${props => props.theme.spacing.md};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.xl};
`;

const InfoSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const InfoTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xl};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text.primary};
  margin: 0;
`;

const InfoItem = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.alt};
  border-radius: ${props => props.theme.borderRadius.md};
  border-left: 4px solid ${props => props.theme.colors.primary.main};
`;

const InfoLabel = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.text.secondary};
  margin-bottom: ${props => props.theme.spacing.xs};
`;

const InfoValue = styled.div`
  font-size: ${props => props.theme.typography.fontSize.lg};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.text.primary};
`;

const Actions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.md};
`;

const BankInfo = styled.div`
  padding: ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.primary.main}10;
  border-radius: ${props => props.theme.borderRadius.md};
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

const QRModal = ({ contract, onClose }) => {
  const { generateContractQRCode, downloadQR } = useQRGenerator();
  const { showToast } = useToast();

  const qrUrl = generateContractQRCode(contract);

  const handleDownload = async () => {
    try {
      await downloadQR(qrUrl, `QR_${contract.contractNumber}.jpg`);
      showToast('Đã tải xuống mã QR', 'success');
    } catch (error) {
      showToast('Lỗi khi tải xuống: ' + error.message, 'error');
    }
  };

  const handlePrint = () => {
    try {
      printQRCode(qrUrl, contract);
      showToast('Đang mở cửa sổ in...', 'info');
    } catch (error) {
      showToast('Lỗi khi in: ' + error.message, 'error');
    }
  };

  const handleShare = async () => {
    try {
      const shared = await shareQRCode(qrUrl, contract);
      if (shared) {
        showToast('Đã chia sẻ mã QR', 'success');
      }
    } catch (error) {
      showToast('Lỗi khi chia sẻ: ' + error.message, 'error');
    }
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title="Xem Mã QR"
      size="large"
    >
      <ModalContent>
        <QRSection>
          <QRImageLarge src={qrUrl} alt="QR Code" />
          <Actions>
            <Button
              variant="primary"
              icon={<Download size={18} />}
              onClick={handleDownload}
              fullWidth
            >
              Tải xuống
            </Button>
            <Button
              variant="secondary"
              icon={<Printer size={18} />}
              onClick={handlePrint}
              fullWidth
            >
              In
            </Button>
            <Button
              variant="secondary"
              icon={<Share2 size={18} />}
              onClick={handleShare}
              fullWidth
            >
              Chia sẻ
            </Button>
          </Actions>
        </QRSection>

        <InfoSection>
          <InfoTitle>Thông Tin Chuyển Khoản</InfoTitle>

          <InfoItem>
            <InfoLabel>Số Hợp Đồng</InfoLabel>
            <InfoValue>{contract.contractNumber}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Tên Khách Hàng</InfoLabel>
            <InfoValue>{contract.customerName}</InfoValue>
          </InfoItem>

          <InfoItem>
            <InfoLabel>Số Tiền</InfoLabel>
            <InfoValue>{formatCurrency(contract.amount)}</InfoValue>
          </InfoItem>

          {contract.phoneNumber && (
            <InfoItem>
              <InfoLabel>Số Điện Thoại</InfoLabel>
              <InfoValue>{contract.phoneNumber}</InfoValue>
            </InfoItem>
          )}

          <BankInfo>
            <BankLabel>Ngân Hàng</BankLabel>
            <BankValue>HD SAISON (HDBANK)</BankValue>
            <BankLabel style={{ marginTop: '8px' }}>Số Tài Khoản</BankLabel>
            <BankValue>19036897588015</BankValue>
          </BankInfo>
        </InfoSection>
      </ModalContent>
    </Modal>
  );
};

export default QRModal;
