import React, { useState } from 'react';
import styled from 'styled-components';
import { FileText, QrCode, Shield, FileSignature, Printer, Download, Trash2 } from 'lucide-react';
import { Button, Input } from '../../components';

const CardContainer = styled.div`
  background: ${props => props.theme.colors.background.secondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  border: 1px solid ${props => props.theme.colors.border.default};
  overflow: hidden;
  margin-bottom: ${props => props.theme.spacing.md};
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.md} ${props => props.theme.spacing.lg};
  background: ${props => props.theme.colors.background.tertiary};
  border-bottom: 1px solid ${props => props.theme.colors.border.default};

  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.sm};
    align-items: flex-start;
  }
`;

const ContractInfo = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const ContractNumber = styled.span`
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.primary[500]};
`;

const CustomerName = styled.span`
  color: ${props => props.theme.colors.text.primary};
`;

const InsuranceFee = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-weight: 500;
`;

const BrandSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
  margin-top: ${props => props.theme.spacing.sm};
`;

const BrandLabel = styled.span`
  color: ${props => props.theme.colors.text.secondary};
  font-size: 0.9rem;
`;

const BrandInput = styled(Input)`
  max-width: 150px;
  font-size: 0.9rem;
`;

const DeleteButton = styled(Button)`
  background: ${props => props.theme.colors.error[500]};
  color: white;
  border: none;
  
  &:hover {
    background: ${props => props.theme.colors.error[600]};
  }
`;

const FilesList = styled.div`
  padding: ${props => props.theme.spacing.sm};
`;

const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  background: ${props => props.theme.colors.background.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: ${props => props.theme.spacing.xs};
  border: 1px solid ${props => props.theme.colors.border.light};
  
  &:hover {
    background: ${props => props.theme.colors.background.secondary};
  }
`;

const FileItemLeft = styled.div`
  display: flex;
  align-items: center;
  gap: ${props => props.theme.spacing.sm};
`;

const FileIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: ${props => props.color || props.theme.colors.primary[500]};
`;

const FileName = styled.span`
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
`;

const FileActions = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.xs};
`;

const IconButton = styled.a`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: ${props => props.theme.borderRadius.sm};
  background: ${props => props.theme.colors.background.tertiary};
  color: ${props => props.theme.colors.text.secondary};
  cursor: pointer;
  text-decoration: none;
  transition: all 0.2s;

  &:hover {
    background: ${props => props.theme.colors.primary[500]};
    color: white;
  }
`;

const PrintButtonsWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: ${props => props.theme.spacing.md};
  padding: ${props => props.theme.spacing.md};
  border-top: 1px solid ${props => props.theme.colors.border.default};
`;

const PrintButton = styled(Button)`
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.lg};
`;

const formatCurrency = (num) => {
  if (!num) return '';
  // Remove commas/dots from string before parsing (e.g. "77,500" -> "77500")
  const cleanNum = String(num).replace(/[,.]/g, '');
  return parseInt(cleanNum).toLocaleString('vi-VN');
};

const ContractFileCard = ({ file, isSelected, onToggleSelect, onUpdate, onDelete }) => {
  const [brandName, setBrandName] = useState(file.brandName || '');
  const [brandTimeout, setBrandTimeout] = useState(null);

  const handleBrandChange = (e) => {
    const value = e.target.value;
    setBrandName(value);

    // Debounce update
    if (brandTimeout) clearTimeout(brandTimeout);
    setBrandTimeout(setTimeout(() => {
      onUpdate({ brandName: value });
    }, 1000));
  };

  const { fileSet, shd, tenKH, insuranceFee, qrData } = file;
  const contractNumber = shd || qrData?.contract || file.contractNumber || '';
  const customerName = tenKH || file.customerName || '';
  const isDL = contractNumber.startsWith('DL');

  // File definitions
  const fileItems = [
    {
      id: 'hopDong',
      icon: <FileText size={18} />,
      color: '#F59E0B',
      name: 'Hợp Đồng Tín Dụng',
      url: fileSet?.hopDongUrl,
      downloadName: `HopDongTinDung_${contractNumber}.pdf`
    },
    {
      id: 'thanhToan',
      icon: <QrCode size={18} />,
      color: '#10B981',
      name: 'Hướng Dẫn Thanh Toán (có QR chuyển tiền)',
      url: fileSet?.thanhToanUrl,
      downloadName: `HuongDanThanhToan_${contractNumber}.pdf`
    },
    {
      id: 'baoHiem',
      icon: <Shield size={18} />,
      color: '#6366F1',
      name: 'Bản Yêu Cầu Bảo Hiểm',
      url: fileSet?.baoHiemUrl,
      downloadName: `YeuCauBaoHiem_${contractNumber}.pdf`
    }
  ];

  // Add PDK only for non-DL contracts
  if (!isDL && fileSet?.pdkUrl) {
    fileItems.push({
      id: 'pdk',
      icon: <FileSignature size={18} />,
      color: '#EC4899',
      name: 'Phiếu Đăng Ký 0%',
      url: fileSet.pdkUrl,
      downloadName: `PDK_0%_${contractNumber}${brandName ? '_' + brandName.toUpperCase() : ''}.pdf`
    });
  }

  const handlePrint = (url) => {
    if (url) window.open(url, '_blank');
  };

  const handlePrintFront = () => {
    // TODO: Combine PDFs for front printing
    console.log('Print front for', contractNumber);
  };

  const handlePrintBack = () => {
    // TODO: Combine PDFs for back printing
    console.log('Print back for', contractNumber);
  };

  return (
    <CardContainer>
      <CardHeader>
        <ContractInfo>
          <ContractNumber>{contractNumber}</ContractNumber>
          <span>-</span>
          <CustomerName>{customerName}</CustomerName>
          {insuranceFee && (
            <>
              <span>-</span>
              <InsuranceFee>Phí BH: {formatCurrency(insuranceFee)} VNĐ/tháng</InsuranceFee>
            </>
          )}
        </ContractInfo>

        <DeleteButton
          size="sm"
          icon={<Trash2 size={16} />}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        />
      </CardHeader>

      <div style={{ padding: '0 16px' }}>
        <BrandSection>
          <BrandLabel>Tên hãng:</BrandLabel>
          <BrandInput
            value={brandName}
            onChange={handleBrandChange}
            placeholder="Nhập tên hãng"
            size="sm"
            onClick={(e) => e.stopPropagation()}
          />
        </BrandSection>
      </div>

      <FilesList>
        {fileItems.map((item) => (
          item.url && (
            <FileItem key={item.id}>
              <FileItemLeft>
                <FileIcon color={item.color}>{item.icon}</FileIcon>
                <FileName>{item.name}</FileName>
              </FileItemLeft>
              <FileActions>
                <IconButton
                  href={item.url}
                  target="_blank"
                  title="In"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Printer size={16} />
                </IconButton>
                <IconButton
                  href={item.url}
                  download={item.downloadName}
                  title="Tải về"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download size={16} />
                </IconButton>
              </FileActions>
            </FileItem>
          )
        ))}
      </FilesList>

      <PrintButtonsWrapper>
        <PrintButton
          variant="primary"
          icon={<Printer size={18} />}
          onClick={(e) => {
            e.stopPropagation();
            handlePrintFront();
          }}
        >
          In mặt trước
        </PrintButton>
        <PrintButton
          variant="warning"
          icon={<Printer size={18} />}
          onClick={(e) => {
            e.stopPropagation();
            handlePrintBack();
          }}
        >
          In mặt sau
        </PrintButton>
      </PrintButtonsWrapper>
    </CardContainer>
  );
};

export default ContractFileCard;
