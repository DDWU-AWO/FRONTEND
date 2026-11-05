import styled from 'styled-components';

/** 단계 상태 값과 화면 문구 */
export const STEP_STATUS = {
  done: '완료',
  running: '진행 중',
  waiting: '대기',
  paused: '멈춤',
  skipped: '건너뜀',
};

// 상태별 (배경, 글자) 색상. 건너뜀은 배경 없이 테두리만 그립니다.
const statusColors = {
  done: ['successBg', 'success'],
  running: ['primarySoft', 'primary'],
  waiting: ['neutralBg', 'textMuted'],
  paused: ['dangerTint', 'danger'],
  skipped: [null, 'textMuted'],
};

const Chip = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  background: ${({ theme, $status }) => theme.colors[statusColors[$status][0]] ?? 'transparent'};
  color: ${({ theme, $status }) => theme.colors[statusColors[$status][1]]};
  ${({ theme, $status }) =>
    $status === 'skipped' && `padding: 2px 7px; border: 1px solid ${theme.colors.borderNeutral};`}
`;

/**
 * Figma: StatusBadge
 * status: done / running / waiting / paused / skipped
 */
function StatusBadge({ status = 'done', ...rest }) {
  return (
    <Chip $status={status} {...rest}>
      {STEP_STATUS[status]}
    </Chip>
  );
}

export default StatusBadge;
