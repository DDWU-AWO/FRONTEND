import styled from 'styled-components';

const Box = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 24px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

const Label = styled.span`
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Text = styled.p`
  flex: 1;
  font-size: 16px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

/** Figma: '내 요청' 읽기 전용 상자 (02 담당 AI 확인, 03 작업 진행) */
function MyRequest({ children }) {
  return (
    <Box>
      <Label>내 요청</Label>
      <Text>{children}</Text>
    </Box>
  );
}

export default MyRequest;
