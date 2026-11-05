import { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { createPlan } from '../api/plan';
import { Button, RequestForm, SavingsCard } from '../components';
import { ReactComponent as Spinner } from '../assets/loading-spinner.svg';

const SKELETON_COUNT = 3;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
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
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 13px;
  width: 246px;
  height: 127px;
  padding: 64px 18px 0;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surfaceMuted};

  /* 상태 칩 자리 */
  &::before {
    content: '';
    position: absolute;
    top: 23px;
    left: 59px;
    width: 16px;
    height: 22px;
    border-radius: 999px;
    background: ${({ theme }) => theme.colors.neutralBg};
  }
`;

const ErrorArea = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const ErrorCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 28px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.errorBg};
`;

const ErrorText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const ErrorTitle = styled.h2`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.error};
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const GuideCard = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 28px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surfaceMuted};

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const GuideList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 15px;
  line-height: 1.6;
`;

const Text = styled.p`
  font-size: ${({ $size = 14 }) => $size}px;
  line-height: 1.6;
  color: ${({ theme, $color = 'textMuted' }) => theme.colors[$color]};
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
 * Figma: 01 요청 입력 (01-0 입력 전, 01-1 단계 준비 중, 01-2 단계 나누기 실패)
 * 요청을 입력하고 시작하면, 단계가 나뉘는 동안 '단계 준비 중' 상태를 보여줍니다.
 */
function RequestPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  // 다른 화면에서 넘어온 요청 문구가 있으면 채워 둡니다. (예: '요청 바꿔서 다시 하기')
  const [request, setRequest] = useState(state?.request ?? '');
  const [isPreparing, setIsPreparing] = useState(false);
  const [failed, setFailed] = useState(false);

  const submit = async (text) => {
    setIsPreparing(true);
    setFailed(false);
    try {
      const plan = await createPlan(text);
      navigate('/new/agents', { state: { plan } });
    } catch {
      setIsPreparing(false);
      setFailed(true);
    }
  };

  const fixRequest = () => {
    setFailed(false);
    inputRef.current?.focus();
  };

  return (
    <Wrapper>
      <RequestForm
        ref={inputRef}
        value={request}
        onChange={setRequest}
        onSubmit={submit}
        locked={isPreparing}
      />

      {failed && (
        <ErrorArea>
          <ErrorCard role="alert">
            <ErrorText>
              <ErrorTitle>요청을 단계로 나누지 못했어요</ErrorTitle>
              <Text>
                요청이 너무 짧거나 여러 작업이 섞여 있으면 나누기 어려울 수 있어요. 조금 더
                구체적으로 적거나 다시 시도해 주세요.
              </Text>
            </ErrorText>
            <ButtonRow>
              <Button onClick={() => submit(request.trim())}>다시 시도</Button>
              <Button variant="secondary" onClick={fixRequest}>
                요청 고치기
              </Button>
            </ButtonRow>
          </ErrorCard>
          <GuideCard>
            <h3>이렇게 적으면 잘 나눠져요</h3>
            <GuideList>
              <Text $size={15} $color="textSecondary">
                무엇을 조사할지 + 어떤 결과물이 필요한지
              </Text>
              <Text $size={15}>예: 경쟁 서비스 3곳을 조사해서 비교 보고서를 만들어 줘</Text>
            </GuideList>
          </GuideCard>
        </ErrorArea>
      )}

      {isPreparing && (
        <>
          <PrepCard aria-busy="true">
            <LoadingRow>
              <SpinningIcon width={32} height={32} aria-hidden />
              <LoadingText>
                <LoadingTitle>요청을 단계로 나누는 중…</LoadingTitle>
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
