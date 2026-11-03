import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Wrapper = styled.section`
  display: flex;
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
`;

const CardWrapper = styled(Wrapper)`
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  width: 100%;
  max-width: 531px;
  min-height: 229px;
  padding: 24px;
`;

const BannerWrapper = styled(Wrapper)`
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
  padding: 24px 28px;
`;

const Heading = styled.p`
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
`;

const Value = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  line-height: 1.2;
`;

const Percent = styled.span`
  font-size: 48px;
  font-weight: 700;
`;

const Muted = styled.p`
  font-size: ${({ $size = 14 }) => $size}px;
  font-weight: 400;
  line-height: ${({ $lineHeight = 1.6 }) => $lineHeight};
  color: ${({ theme }) => theme.colors.onPrimaryMuted};
`;

const BannerText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const BannerTitle = styled.p`
  font-size: 20px;
  font-weight: 700;
  line-height: 1.5;
`;

const ReportLink = styled(Link)`
  flex-shrink: 0;
  font-family: ${({ theme }) => theme.fonts.link};
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  color: ${({ theme }) => theme.colors.onPrimary};
  text-decoration: underline;
  white-space: nowrap;
`;

/**
 * Figma: SavingsCard
 * layout: card(큰 카드형) / banner(하단 띠 배너형)
 */
function SavingsCard({
  layout = 'card',
  percent = 85,
  heading = '핵심만 전달해서 아꼈어요',
  bannerTitle,
  unitLabel = '더 적은 분량',
  description,
  reportTo,
  reportLabel = '절약 리포트 보기 →',
  ...rest
}) {
  if (layout === 'banner') {
    return (
      <BannerWrapper {...rest}>
        <BannerText>
          <BannerTitle>{bannerTitle ?? `이번 작업에서 아낀 분량 ${percent}%`}</BannerTitle>
          <Muted>
            {description ?? '다음 AI에게 꼭 필요한 내용만 전달해서 아꼈어요.'}
          </Muted>
        </BannerText>
        {reportTo && <ReportLink to={reportTo}>{reportLabel}</ReportLink>}
      </BannerWrapper>
    );
  }

  return (
    <CardWrapper {...rest}>
      <Heading>{heading}</Heading>
      <Value>
        <Percent>{percent == null ? '—' : `${percent}%`}</Percent>
        <Muted as="span" $size={15} $lineHeight={1.2}>
          {unitLabel}
        </Muted>
      </Value>
      <Muted>
        {description ??
          'AI가 읽어야 할 글이 줄어서 더 빠르고 가볍게 다음 단계를 처리해요.'}
      </Muted>
    </CardWrapper>
  );
}

export default SavingsCard;
