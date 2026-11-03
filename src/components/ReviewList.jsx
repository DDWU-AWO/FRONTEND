import styled from 'styled-components';

const List = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Item = styled.li`
  display: flex;
  gap: 16px;
  padding: 20px 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const Number = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  line-height: 1.7;
`;

const Before = styled.del`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const After = styled.ins`
  font-size: 15px;
  font-weight: 500;
  text-decoration: none;
  white-space: pre-wrap;
  color: ${({ theme }) => theme.colors.primary};

  &::before {
    content: '→  ';
  }
`;

const Reason = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/** Figma: 04-4 검수형 / 고친 내용 목록 */
function ReviewList({ corrections }) {
  return (
    <List>
      {corrections.map(({ before, after, reason }, i) => (
        <Item key={before}>
          <Number>{i + 1}</Number>
          <Body>
            <Before>{before}</Before>
            <After>{after}</After>
            <Reason>{reason}</Reason>
          </Body>
        </Item>
      ))}
    </List>
  );
}

export default ReviewList;
