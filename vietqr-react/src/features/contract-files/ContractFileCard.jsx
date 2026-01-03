import React, { useState } from 'react';
import styled from 'styled-components';
import { FileText, QrCode, Shield, FileSignature, Printer, Download, Trash2, X, Loader2 } from 'lucide-react';
import { Button, Input } from '../../components';
import { combinePdfsForPrinting } from '../../utils/pdfUtils';
import { useToast } from '../../contexts';

const CardContainer = styled.div`
  background: rgba(30, 41, 59, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid rgba(148, 163, 184, 0.2);
  box-shadow: ${props => props.theme.shadows.base};
  overflow: hidden;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.sm} ${props => props.theme.spacing.md};
  
  @media (max-width: ${props => props.theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${props => props.theme.spacing.xs};
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
  padding: ${props => props.theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.xs};
`;

const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${props => props.theme.spacing.xs} ${props => props.theme.spacing.sm};
  background: ${props => props.theme.colors.bg.primary};
  border-radius: ${props => props.theme.borderRadius.sm};
  margin-bottom: 4px;
  border: 1px solid ${props => props.theme.colors.border.light};
  
  &:hover {
    background: ${props => props.theme.colors.surface.hover};
  }
  
  &:last-child {
    margin-bottom: 0;
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

const FileName = styled.a`
  font-weight: 500;
  color: ${props => props.theme.colors.text.primary};
  text-decoration: none;
  cursor: pointer;
  
  &:hover {
    color: ${props => props.theme.colors.primary[500]};
    text-decoration: underline;
  }
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
  padding-top: 0;
`;

// Primary button - bright blue
const PrimaryPrintButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background: linear-gradient(135deg, #5BA3E8 0%, #4896de 100%);
  color: #ffffff;
  font-weight: 600;
  font-size: 14px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(72, 150, 222, 0.4);
    background: linear-gradient(135deg, #6BB0F0 0%, #5BA3E8 100%);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

// Secondary button - outline style
const SecondaryPrintButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  color: #4896de;
  font-weight: 600;
  font-size: 14px;
  border: 2px solid #4896de;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(72, 150, 222, 0.1);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
    border-color: rgba(72, 150, 222, 0.5);
    color: rgba(72, 150, 222, 0.5);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const formatCurrency = (num) => {
  if (!num) return '';
  // Remove commas/dots from string before parsing (e.g. "77,500" -> "77500")
  const cleanNum = String(num).replace(/[,.]/g, '');
  return parseInt(cleanNum).toLocaleString('vi-VN');
};

const ContractFileCard = ({ file, isSelected, onToggleSelect, onUpdate, onDelete }) => {
  const { fileSet, shd, tenKH, insuranceFee, qrData } = file;
  const contractNumber = shd || qrData?.contract || file.contractNumber || '';
  const customerName = tenKH || file.customerName || '';
  const isDL = contractNumber.startsWith('DL');

  const { error: showError } = useToast();
  const [loading, setLoading] = useState({ front: false, back: false });

  // File definitions
  const fileItems = [
    {
      id: 'hopDong',
      icon: <FileText size={18} />,
      color: '#4896de',
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
      downloadName: `PDK_0%_${contractNumber}.pdf`
    });
  }

  const handlePrint = async (type) => {
    if (loading.front || loading.back) return;

    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      const url = await combinePdfsForPrinting(fileSet, type);
      window.open(url, '_blank');
    } catch (error) {
      console.error(`In mặt ${type === 'front' ? 'trước' : 'sau'} thất bại:`, error);
      showError('Lỗi tạo file in', error.message);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
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
          icon={<X size={16} />}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        />
      </CardHeader>

      <FilesList>
        {fileItems.map((item) => (
          item.url && (
            <FileItem key={item.id}>
              <FileItemLeft>
                <FileIcon color={item.color}>{item.icon}</FileIcon>
                <FileName
                  href={item.url}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()}
                >
                  {item.name}
                </FileName>
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
        <PrimaryPrintButton
          style={{ flex: 1 }}
          disabled={loading.front}
          onClick={(e) => {
            e.stopPropagation();
            handlePrint('front');
          }}
        >
          {loading.front ? <Loader2 className="animate-spin" /> : <Printer />}
          {loading.front ? 'Đang xử lý...' : 'In mặt trước'}
        </PrimaryPrintButton>
        <SecondaryPrintButton
          style={{ flex: 1 }}
          disabled={loading.back}
          onClick={(e) => {
            e.stopPropagation();
            handlePrint('back');
          }}
        >
          {loading.back ? <Loader2 className="animate-spin" /> : <Printer />}
          {loading.back ? 'Đang xử lý...' : 'In mặt sau'}
        </SecondaryPrintButton>
      </PrintButtonsWrapper>
    </CardContainer>
  );
};

export default ContractFileCard;
