import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, FileText, Tag } from 'lucide-react';
import { formatCurrency } from '../../../utils/formatUtils';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.md};
`;

const ResultCard = styled.div`
  background: rgba(30, 41, 59, 0.85);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(248, 250, 252, 0.2);
  border-radius: 14px;
  padding: ${props => props.$compact ? '0.875rem' : '1.25rem'};
  min-height: ${props => props.$compact ? 'auto' : '260px'};
  box-shadow: ${props => props.theme.shadows.card || props.theme.shadows.xl};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    padding: ${props => props.$compact ? '0.75rem' : '1rem'};
  }
`;

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${props => props.$error ? '#b91c1c' : '#0f766e'};
  font-weight: 700;
  margin-bottom: ${props => props.$compact ? '0.625rem' : '0.875rem'};
  font-size: ${props => props.$compact ? '0.92rem' : '1rem'};
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: ${props => props.$compact ? '0.94rem' : '1rem'};
  color: #f8fafc;
`;

const SuggestionHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: ${props => props.$compact ? '0.4rem' : '0.5rem'};
`;

const SuggestionActions = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
`;

const SuggestionMeta = styled.span`
  color: #94a3b8;
  font-size: ${props => props.$compact ? '0.72rem' : '0.78rem'};
  font-weight: 600;
`;

const MainBlock = styled.div`
  border: 1px solid rgba(248, 250, 252, 0.16);
  border-radius: 12px;
  padding: ${props => props.$compact ? '0.7rem' : '0.9rem'};
  background: rgba(15, 23, 42, 0.36);
`;

const NavButton = styled.button`
  width: ${props => props.$compact ? '30px' : '34px'};
  height: ${props => props.$compact ? '30px' : '34px'};
  border-radius: 999px;
  border: 1px solid rgba(125, 211, 252, 0.45);
  background: rgba(14, 116, 144, 0.28);
  color: #a5f3fc;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 8px 20px rgba(2, 132, 199, 0.25);

  &:hover {
    background: rgba(14, 116, 144, 0.45);
    border-color: rgba(125, 211, 252, 0.7);
    transform: scale(1.04);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 130px 1fr;
  gap: 0.75rem;
  margin-bottom: ${props => props.$compact ? '0.4rem' : '0.5rem'};

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
    gap: 0.25rem;
  }
`;

const Label = styled.div`
  color: #cbd5e1;
  font-weight: 600;
  font-size: ${props => props.$compact ? '0.82rem' : '0.875rem'};
`;

const Value = styled.div`
  color: #f1f5f9;
  line-height: ${props => props.$compact ? '1.45' : '1.6'};
  font-size: ${props => props.$compact ? '0.95rem' : '1rem'};
`;

const PaymentCard = styled.div`
  margin: ${props => props.$compact ? '0.6rem 0' : '0.75rem 0'};
  padding: ${props => props.$compact ? '0.6rem 0.75rem' : '0.75rem 0.9rem'};
  border-radius: 12px;
  background: linear-gradient(135deg, rgba(14, 116, 144, 0.25) 0%, rgba(30, 58, 138, 0.25) 100%);
  border: 1px solid rgba(125, 211, 252, 0.28);
`;

const PaymentLabel = styled.div`
  font-size: ${props => props.$compact ? '0.76rem' : '0.82rem'};
  color: #67e8f9;
  font-weight: 700;
`;

const PaymentValue = styled.div`
  margin-top: 0.2rem;
  font-size: ${props => props.$compact ? '1.85rem' : '1.55rem'};
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.2;

  @media (max-width: ${props => props.theme.breakpoints.tablet}) {
    font-size: ${props => props.$compact ? '1.35rem' : '1.5rem'};
  }
`;

const DocHighlight = styled.div`
  padding: ${props => props.$compact ? '0.5rem 0.6rem' : '0.6rem 0.7rem'};
  border-radius: 10px;
  border: 1px solid rgba(245, 158, 11, 0.38);
  background: linear-gradient(135deg, rgba(120, 53, 15, 0.22) 0%, rgba(127, 29, 29, 0.14) 100%);
`;

const DocList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const DocTag = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.55rem;
  background: rgba(251, 191, 36, 0.14);
  border: 1px solid rgba(251, 191, 36, 0.35);
  border-radius: 999px;
  color: #fde68a;
  font-size: ${props => props.$compact ? '0.73rem' : '0.78rem'};
  font-weight: 600;
`;

const Subtle = styled.p`
  margin: 0;
  color: #cbd5e1;
  line-height: 1.6;
`;

const MatchList = styled.div`
  margin-top: ${props => props.$compact ? '0.75rem' : '1rem'};
  border-top: 1px solid rgba(248, 250, 252, 0.14);
  padding-top: ${props => props.$compact ? '0.55rem' : '0.75rem'};
`;

const MatchItem = styled.div`
  padding: ${props => props.$compact ? '0.42rem 0' : '0.5rem 0'};
  border-bottom: 1px dashed rgba(248, 250, 252, 0.12);

  &:last-child {
    border-bottom: none;
  }
`;

const MatchLine = styled.div`
  color: #e2e8f0;
  font-size: ${props => props.$compact ? '0.84rem' : '0.9rem'};
`;

const roundToThousand = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;
  return Math.round(numeric / 1000) * 1000;
};

const formatMoney = (value) => `${formatCurrency(roundToThousand(value), false)} VND`;

const getPackageName = (plan) => plan?.packageName || plan?.description || 'Chưa xác định';

const getPlanKey = (plan) => [
  plan?.selectedCode,
  plan?.codeNoIns,
  plan?.codeIns,
  plan?.packageName,
  plan?.baseRate,
  plan?.reducingRate,
].join('|');

const normalizeText = (value) => String(value || '').trim().toLowerCase();

const NEXT_PRIORITY_PACKAGE_PREFIX = 'sản phẩm điện máy và công nghệ';

const getNextPackagePriority = (plan) => (
  normalizeText(plan?.packageName).startsWith(NEXT_PRIORITY_PACKAGE_PREFIX) ? 0 : 1
);

const getDocsPriority = (plan) => {
  const docs = Array.isArray(plan?.requiredDocs)
    ? plan.requiredDocs.map(normalizeText).filter(Boolean)
    : [];

  if (docs.length === 1 && docs[0] === 'cccd') return 0;

  const hasCccd = docs.includes('cccd');
  const hasBlx = docs.includes('blx');

  if (docs.length === 2 && hasCccd && hasBlx) return 1;
  if (docs.length >= 3) return 2;
  if (docs.length === 2) return 3;
  if (docs.length === 1) return 4;

  return 5;
};

const getNoMatchReason = (result) => {
  const amount = formatCurrency(roundToThousand(result?.input?.amountForFilter), false);
  const term = result?.input?.term || 0;
  const prepay = Number(result?.input?.prepayPercent || 0).toFixed(2);
  return `Không tìm thấy gói phù hợp với số tiền đối chiếu ${amount} VND, kỳ hạn ${term} tháng, trả trước ${prepay}%.`;
};

const formatDocLabel = (doc) => {
  if (doc === 'HDLD_Hoac_BLX_Hoac_Cavet') return 'HĐLĐ/BLX/Cà vẹt xe';
  return doc;
};

const MonthlyPromoSchemeResultPlaceholder = ({ result, compact = false }) => {
  const [activePlanIndex, setActivePlanIndex] = useState(0);
  const hasError = Boolean(result?.error);
  const hasMatch = Boolean(result?.matchedCount);

  const planSequence = useMemo(() => {
    const allPlans = Array.isArray(result?.matchedPackages) ? result.matchedPackages : [];
    if (allPlans.length === 0) return [];

    const best = result?.bestMatch || allPlans[0];
    const bestKey = getPlanKey(best);
    let bestSkipped = false;

    const remainingPlans = allPlans
      .filter((plan) => {
        if (!bestSkipped && getPlanKey(plan) === bestKey) {
          bestSkipped = true;
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        const packagePriorityDiff = getNextPackagePriority(a) - getNextPackagePriority(b);
        if (packagePriorityDiff !== 0) return packagePriorityDiff;

        const docsDiff = getDocsPriority(a) - getDocsPriority(b);
        if (docsDiff !== 0) return docsDiff;

        const baseRateDiff = Number(a?.baseRate || 0) - Number(b?.baseRate || 0);
        if (baseRateDiff !== 0) return baseRateDiff;

        return Number(a?.reducingRate || 0) - Number(b?.reducingRate || 0);
      });

    return [best, ...remainingPlans];
  }, [result]);

  useEffect(() => {
    setActivePlanIndex(0);
  }, [result]);

  const activePlan = planSequence[activePlanIndex] || null;
  const canGoPrev = planSequence.length > 1;
  const canGoNext = planSequence.length > 1;

  const handlePrevPlan = () => {
    if (!canGoPrev) return;
    setActivePlanIndex((prev) => (prev - 1 + planSequence.length) % planSequence.length);
  };

  const handleNextPlan = () => {
    if (!canGoNext) return;
    setActivePlanIndex((prev) => (prev + 1) % planSequence.length);
  };

  if (!result) {
    return (
      <ResultCard>
        <StatusRow $compact={compact}>
          <Tag size={18} />
          <span>Kết quả đối chiếu gói vay</span>
        </StatusRow>
        <Subtle>Nhập thông tin để hệ thống đối chiếu gói vay theo dữ liệu JSON.</Subtle>
      </ResultCard>
    );
  }

  if (hasError) {
    return (
      <ResultCard $compact={compact}>
        <StatusRow $error $compact={compact}>
          <AlertTriangle size={18} />
          <span>Chưa đủ điều kiện lọc gói</span>
        </StatusRow>
        <Subtle>{result.error}</Subtle>
      </ResultCard>
    );
  }

  return (
    <Wrapper>
      <ResultCard $compact={compact}>
        <StatusRow $error={!hasMatch} $compact={compact}>
          {hasMatch ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
          <span>{hasMatch ? `Tìm thấy ${result.matchedCount} gói phù hợp` : 'Không tìm thấy gói phù hợp'}</span>
        </StatusRow>

        {hasMatch && activePlan && (
          <>
            <SuggestionHeader $compact={compact}>
              <SectionTitle $compact={compact}>Gói ưu tiên đề xuất</SectionTitle>
              <SuggestionActions>
                {planSequence.length > 1 && (
                  <SuggestionMeta $compact={compact}>{activePlanIndex + 1}/{planSequence.length}</SuggestionMeta>
                )}
                <NavButton
                  type="button"
                  onClick={handlePrevPlan}
                  disabled={!canGoPrev}
                  aria-label="Previous package"
                  title="Previous"
                  $compact={compact}
                >
                  <ChevronLeft size={18} />
                </NavButton>
                <NavButton
                  type="button"
                  onClick={handleNextPlan}
                  disabled={!canGoNext}
                  aria-label="Next package"
                  title="Next"
                  $compact={compact}
                >
                  <ChevronRight size={18} />
                </NavButton>
              </SuggestionActions>
            </SuggestionHeader>

            <MainBlock $compact={compact}>
              <Row $compact={compact}>
                <Label $compact={compact}>Tên gói</Label>
                <Value $compact={compact}>{getPackageName(activePlan)}</Value>
              </Row>

              <Row $compact={compact}>
                <Label $compact={compact}>Mã gói</Label>
                <Value $compact={compact}>{activePlan.selectedCode || '-'}</Value>
              </Row>

              <Row $compact={compact}>
                <Label $compact={compact}>Số tiền vay</Label>
                <Value $compact={compact}>{formatMoney(activePlan.loanAmountUsed)}</Value>
              </Row>

              <PaymentCard $compact={compact}>
                <PaymentLabel $compact={compact}>Số tiền mỗi tháng</PaymentLabel>
                <PaymentValue $compact={compact}>{formatMoney(activePlan.cashflow?.monthlyPayment)}</PaymentValue>
              </PaymentCard>

              <Row $compact={compact}>
                <Label $compact={compact}>Giấy tờ</Label>
                <Value $compact={compact}>
                  <DocHighlight $compact={compact}>
                    <DocList>
                      {(activePlan.requiredDocs || []).map((doc) => (
                        <DocTag key={doc} $compact={compact}>
                          <FileText size={12} />
                          {formatDocLabel(doc)}
                        </DocTag>
                      ))}
                    </DocList>
                  </DocHighlight>
                </Value>
              </Row>
            </MainBlock>

            {result.matchedCount > 1 && (
              <MatchList $compact={compact}>
                <SectionTitle $compact={compact}>Danh sách gói cùng điều kiện</SectionTitle>
                {result.matchedPackages.slice(0, compact ? 3 : 5).map((plan) => (
                  <MatchItem key={`${plan.codeNoIns}-${plan.codeIns}`} $compact={compact}>
                    <MatchLine $compact={compact}>{getPackageName(plan)}</MatchLine>
                    <MatchLine $compact={compact}>Mã: {plan.selectedCode || '-'}</MatchLine>
                  </MatchItem>
                ))}
              </MatchList>
            )}
          </>
        )}

        {!hasMatch && (
          <Subtle>{result.noMatchReason ? getNoMatchReason(result) : 'Không tìm thấy gói phù hợp với điều kiện đã nhập.'}</Subtle>
        )}
      </ResultCard>
    </Wrapper>
  );
};

export default MonthlyPromoSchemeResultPlaceholder;
