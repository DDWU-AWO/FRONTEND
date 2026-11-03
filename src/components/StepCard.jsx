import styled, { css } from 'styled-components';
import StatusBadge from './StatusBadge';

// 단계 번호 원형 배지 색상 (배경, 글자)
const numberColors = {
  done: ['successBg', 'success'],
  running: ['primary', 'onPrimary'],
  waiting: ['surfaceMuted', 'textMuted'],
  paused: ['dangerBg', 'danger'],
  skipped: ['surfaceMuted', 'textMuted'],
};

const Card = styled.div`
  display: flex;
  width: 246px;
  padding: 18px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-align: left;
  font-family: inherit;

  ${({ $layout }) =>
    $layout === 'horizontal'
      ? css`
          flex-direction: row;
          align-items: center;
          gap: 16px;
          height: 127px;
        `
      : css`
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        `}

  ${({ $status, theme }) =>
    $status === 'paused' &&
    css`
      border-color: ${theme.colors.danger};
    `}

  ${({ $status, theme }) =>
    $status === 'skipped' &&
    css`
      background: ${theme.colors.surfaceMuted};
    `}

  ${({ $selected, theme }) =>
    $selected &&
    css`
      background: ${theme.colors.surfaceSelected};
      border: 2px solid ${theme.colors.primary};
    `}

  ${({ $clickable }) =>
    $clickable &&
    css`
      cursor: pointer;
    `}
`;

const StatusArea = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;

  ${({ $layout }) =>
    $layout === 'horizontal'
      ? css`
          flex-direction: column;
          gap: 6px;
          width: 64px;
        `
      : css`
          flex-direction: row;
          gap: 10px;
        `}
`;

const StepNumber = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 16px;
  font-size: 13px;
  font-weight: 500;
  background: ${({ theme, $status }) => theme.colors[numberColors[$status][0]]};
  color: ${({ theme, $status }) => theme.colors[numberColors[$status][1]]};
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  ${({ $layout }) => $layout === 'horizontal' && 'flex: 1;'}
`;

const Title = styled.p`
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/**
 * Figma: StepCard
 * status 5종 × layout(horizontal 가로형 / vertical 세로형) × selected
 * 화면에서는 세로형(vertical)을 기본으로 사용합니다.
 */
function StepCard({
  step,
  title,
  description,
  status = 'waiting',
  layout = 'vertical',
  selected = false,
  hideStatus = false,
  onClick,
  ...rest
}) {
  return (
    <Card
      as={onClick ? 'button' : 'div'}
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-pressed={onClick ? selected : undefined}
      $layout={layout}
      $status={status}
      $selected={selected}
      $clickable={Boolean(onClick)}
      {...rest}
    >
      <StatusArea $layout={layout}>
        <StepNumber $status={status}>{step}</StepNumber>
        {!hideStatus && <StatusBadge status={status} />}
      </StatusArea>
      <Info $layout={layout}>
        <Title>{title}</Title>
        {description && <Subtitle>{description}</Subtitle>}
      </Info>
    </Card>
  );
}

export default StepCard;
