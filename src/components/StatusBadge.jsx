import styled from 'styled-components';

/** 단계 상태 값과 화면 문구 */
export const STEP_STATUS = {
  done: '완료',
  running: '진행 중',
  waiting: '대기',
  paused: '멈춤',
  skipped: '건너뜀',
};

const statusColor = {
  done: 'success',
  running: 'primary',
  waiting: 'textMuted',
  paused: 'danger',
  skipped: 'textMuted',
};

const Label = styled.span`
  display: inline-flex;
  align-items: center;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  color: ${({ theme, $status }) => theme.colors[statusColor[$status]]};
`;

/**
 * Figma: StatusBadge
 * status: done / running / waiting / paused / skipped
 * label: 기본 문구 대신 보여줄 문구 (예: '멈췄어요')
 */
function StatusBadge({ status = 'done', label, ...rest }) {
  return (
    <Label $status={status} {...rest}>
      {label ?? STEP_STATUS[status]}
    </Label>
  );
}

export default StatusBadge;
