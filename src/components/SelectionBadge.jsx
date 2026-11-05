import styled from 'styled-components';

const labels = {
  use: '사용',
  skip: '빼기',
  change: '바꾸는 중',
};

// 선택별 (배경, 글자) 색상. 빼기는 배경 없이 테두리만 그립니다.
const choiceColors = {
  use: ['primarySoft', 'primary'],
  skip: [null, 'textMuted'],
  change: ['warningBg', 'warning'],
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
  background: ${({ theme, $choice }) => theme.colors[choiceColors[$choice][0]] ?? 'transparent'};
  color: ${({ theme, $choice }) => theme.colors[choiceColors[$choice][1]]};
  ${({ theme, $choice }) =>
    $choice === 'skip' && `padding: 2px 7px; border: 1px solid ${theme.colors.borderNeutral};`}
`;

/**
 * Figma: SelectionBadge
 * 담당 AI 카드의 선택 상태입니다. (단계 진행 상태는 StatusBadge를 사용)
 * choice: use(사용) / skip(빼기) / change(바꾸는 중)
 */
function SelectionBadge({ choice = 'use' }) {
  return <Chip $choice={choice}>{labels[choice]}</Chip>;
}

export default SelectionBadge;
