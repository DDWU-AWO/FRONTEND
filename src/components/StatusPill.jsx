import styled from 'styled-components';

// 작업 상태별 (배경, 글자) 색상
const pillColors = {
  running: ['primarySoft', 'primary'],
  done: ['successBg', 'success'],
  paused: ['dangerSoft', 'danger'],
};

const labels = {
  running: '진행 중',
  done: '완료',
  paused: '멈춤',
};

const Pill = styled.span`
  flex-shrink: 0;
  padding: 9px 14px;
  border-radius: 999px;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  white-space: nowrap;
  background: ${({ theme, $status }) => theme.colors[pillColors[$status][0]]};
  color: ${({ theme, $status }) => theme.colors[pillColors[$status][1]]};
`;

/**
 * Figma: 05 내 작업 / 작업 상태
 * status: running(진행 중) / done(완료) / paused(멈춤)
 */
function StatusPill({ status }) {
  return <Pill $status={status}>{labels[status]}</Pill>;
}

export default StatusPill;
