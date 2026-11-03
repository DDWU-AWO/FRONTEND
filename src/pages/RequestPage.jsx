import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { createPlan } from '../api/plan';
import { Button, SavingsCard } from '../components';
import { ReactComponent as Spinner } from '../assets/loading-spinner.svg';

const SKELETON_COUNT = 3;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const RequestSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.text};
`;

const Description = styled.p`
  font-size: 16px;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const InputBox = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 7px; /* Figma 테두리(안쪽 1px) 포함 8px */
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  ${({ $locked, theme }) =>
    $locked &&
    css`
      background: ${theme.colors.surfaceMuted};

      &:focus-within {
        border-color: ${theme.colors.border};
      }
    `}
`;

const TextArea = styled.textarea`
  flex: 1;
  min-width: 0;
  padding: 12px 14px;
  border: none;
  outline: none;
  resize: none;
  background: transparent;
  font-family: inherit;
  font-size: 17px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
  field-sizing: content;
  min-height: calc(17px * 1.6 + 24px);
  max-height: 240px;

  &::placeholder,
  &:disabled {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const PrepCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 28px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const LoadingRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

const SpinningIcon = styled(Spinner)`
  flex-shrink: 0;
  animation: ${spin} 1s linear infinite;
`;

const LoadingText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const LoadingTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.text};
`;

const LoadingDescription = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const SkeletonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
`;

const SkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
  width: 246px;
  height: 127px;
  padding: 64px 18px 0;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

const SkeletonBar = styled.span`
  display: block;
  width: ${({ $width }) => $width}px;
  height: ${({ $height }) => $height}px;
  border-radius: 6px;
  background: ${({ theme }) => theme.colors.skeleton};
`;

const Hint = styled.p`
  font-size: 14px;
  line-height: 1.2;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
`;

/**
 * Figma: 01 요청 입력
 * 요청을 입력하고 시작하면, 단계가 나뉘는 동안 '단계 준비 중' 상태를 보여줍니다.
 */
function RequestPage() {
  const [request, setRequest] = useState('');
  const [isPreparing, setIsPreparing] = useState(false);
  const navigate = useNavigate();

  const canSubmit = request.trim().length > 0 && !isPreparing;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    setIsPreparing(true);
    try {
      const plan = await createPlan(request.trim());
      navigate('/new/agents', { state: { plan } });
    } catch {
      setIsPreparing(false);
    }
  };

  const handleKeyDown = (e) => {
    // Enter: 제출, Shift+Enter: 줄바꿈 (한글 조합 중인 Enter는 무시)
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      handleSubmit(e);
    }
  };

  return (
    <Wrapper>
      <RequestSection>
        <Title>어떤 일을 맡길까요?</Title>
        <Description>
          하고 싶은 일을 편하게 적으면, 여러 AI가 나눠서 차례대로 처리해요.
        </Description>
        <InputBox onSubmit={handleSubmit} $locked={isPreparing}>
          <TextArea
            value={request}
            onChange={(e) => setRequest(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="예: 최신 소형 AI 모델 동향을 조사해서 개발자용 블로그 글을 써 주고, 마지막에 맞춤법 검사까지 해 줘."
            aria-label="요청 내용"
            rows={1}
            disabled={isPreparing}
          />
          <Button type="submit" disabled={!canSubmit}>
            시작하기
          </Button>
        </InputBox>
      </RequestSection>

      {isPreparing && (
        <>
          <PrepCard aria-busy="true">
            <LoadingRow>
              <SpinningIcon width={32} height={32} aria-hidden />
              <LoadingText>
                <LoadingTitle>요청을 단계로 나누고 있어요</LoadingTitle>
                <LoadingDescription>
                  요청에 맞는 순서와 필요한 단계를 정리하고 있어요. 잠시만 기다려 주세요.
                </LoadingDescription>
              </LoadingText>
            </LoadingRow>
            <SkeletonRow>
              {Array.from({ length: SKELETON_COUNT }, (_, i) => (
                <SkeletonCard key={i}>
                  <SkeletonBar $width={156} $height={16} />
                  <SkeletonBar $width={112} $height={12} />
                </SkeletonCard>
              ))}
            </SkeletonRow>
            <Hint>단계 수와 담당 AI는 요청을 나눈 뒤에 정해져요.</Hint>
          </PrepCard>

          <SavingsCard
            layout="banner"
            bannerTitle="절약한 분량은 작업이 진행되면 알려드릴게요"
            description="아직 요청을 나누고 있어요. 작업이 진행되면 절약한 분량을 확인할 수 있어요."
          />
        </>
      )}
    </Wrapper>
  );
}

export default RequestPage;
