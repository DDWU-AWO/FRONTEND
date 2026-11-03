import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { createPlan } from '../api/plan';
import { RequestForm, SavingsCard } from '../components';
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
  const { state } = useLocation();
  const navigate = useNavigate();
  // 다른 화면에서 넘어온 요청 문구가 있으면 채워 둡니다. (예: '요청 바꿔서 다시 하기')
  const [request, setRequest] = useState(state?.request ?? '');
  const [isPreparing, setIsPreparing] = useState(false);

  const submit = async (text) => {
    setIsPreparing(true);
    try {
      const plan = await createPlan(text);
      navigate('/new/agents', { state: { plan } });
    } catch {
      setIsPreparing(false);
    }
  };

  // 작업 진행 화면에서 '시작하기'로 넘어온 경우 바로 시작합니다.
  useEffect(() => {
    if (state?.autoStart && state.request) submit(state.request);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Wrapper>
      <RequestForm
        value={request}
        onChange={setRequest}
        onSubmit={submit}
        locked={isPreparing}
        showExamples
      />

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
