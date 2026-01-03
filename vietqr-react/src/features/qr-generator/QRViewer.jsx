import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Download, ExternalLink } from 'lucide-react';
import { Button } from '../../components'; // Adjust path if needed
import { generateContractQR, downloadQRImage } from '../../utils/qrUtils';
import { formatCurrency } from '../../utils/formatUtils';

const ViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  items-align: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
  background: ${props => props.theme.colors.bg.secondary};
`;

const Card = styled.div`
  background: white;
  padding: 32px;
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.xl};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 420px;
  width: 100%;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  color: ${props => props.theme.colors.primary.main};
  margin: 0;
  text-align: center;
`;

const QRImage = styled.img`
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  border-radius: 12px;
  border: 1px solid ${props => props.theme.colors.border.light};
`;

const InfoTable = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 16px;
  background: ${props => props.theme.colors.bg.tertiary};
  border-radius: 12px;
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
`;

const Label = styled.div`
  color: ${props => props.theme.colors.text.secondary};
`;

const Value = styled.div`
  font-weight: 600;
  color: ${props => props.theme.colors.text.primary};
  text-align: right;
`;

const Amount = styled(Value)`
  color: ${props => props.theme.colors.error.main};
  font-size: 18px;
`;

const Brand = styled.div`
  margin-top: 12px;
  font-size: 12px;
  color: ${props => props.theme.colors.text.tertiary};
  text-align: center;
`;

const QRViewer = () => {
    const [params, setParams] = useState(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const c = searchParams.get('c');
        const n = searchParams.get('n');
        const a = searchParams.get('a');

        if (c && a) {
            setParams({
                contractNumber: c,
                customerName: n,
                amount: a
            });
        }
    }, []);

    if (!params) {
        return (
            <ViewerContainer>
                <div style={{ textAlign: 'center', color: '#666' }}>
                    Đang tải hoặc liên kết không hợp lệ...
                </div>
            </ViewerContainer>
        );
    }

    const qrUrl = generateContractQR(params);

    return (
        <ViewerContainer>
            <Card>
                <Title>Thanh toán VietQR</Title>
                <QRImage src={qrUrl} alt="QR Code" />

                <InfoTable>
                    <InfoRow>
                        <Label>Hợp đồng</Label>
                        <Value>{params.contractNumber}</Value>
                    </InfoRow>
                    {params.customerName && (
                        <InfoRow>
                            <Label>Khách hàng</Label>
                            <Value>{params.customerName}</Value>
                        </InfoRow>
                    )}
                    <InfoRow>
                        <Label>Số tiền</Label>
                        <Amount>{formatCurrency(params.amount)}</Amount>
                    </InfoRow>
                    <div style={{ margin: '8px 0', borderTop: '1px dashed #ddd' }} />
                    <InfoRow>
                        <Label>Ngân hàng</Label>
                        <Value>HD SAISON (HDBANK)</Value>
                    </InfoRow>
                    <InfoRow>
                        <Label>Số TK</Label>
                        <Value>002704070014601</Value>
                    </InfoRow>
                </InfoTable>

                <Button
                    fullWidth
                    icon={<Download size={18} />}
                    onClick={() => downloadQRImage(qrUrl, `QR_${params.contractNumber}.jpg`)}
                >
                    Tải mã QR
                </Button>
            </Card>

            <Brand>
                Powered by VietQR HD SAISON
            </Brand>
        </ViewerContainer>
    );
};

export default QRViewer;
