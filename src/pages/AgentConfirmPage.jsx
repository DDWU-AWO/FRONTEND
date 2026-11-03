import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { AgentCard, AGENT_CHOICE, Button } from '../components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-bottom: 72px; /* 고정 작업 바 높이만큼 여유 */
`;

const Intro = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

const Muted = styled.p`
  font-size: ${({ $size = 16 }) => $size}px;
  line-height: ${({ $lineHeight = 1.6 }) => $lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MyRequest = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 18px 24px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

const MyRequestLabel = styled.span`
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const MyRequestText = styled.p`
  flex: 1;
  font-size: 16px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AgentList = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const ListTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.text};
`;

const ActionBar = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const ActionBarInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1112px;
  margin: 0 auto;
  padding: 20px 16px;
`;

const Summary = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const SummaryTitle = styled.p`
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.text};
`;

const StartButton = styled(Button)`
  flex-shrink: 0;
  width: 140px;
`;

/**
 * Figma: 02 담당 AI 확인
 * 계획표의 담당 AI마다 사용 / 빼기 / 바꾸기를 고르고 작업을 시작합니다.
 */
function AgentConfirmPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const plan = state?.plan;

  const [steps, setSteps] = useState(plan?.steps ?? []);
  // 처음에는 AI가 제안한 담당 AI를 모두 '사용'으로 둡니다.
  const [choices, setChoices] = useState(() =>
    Object.fromEntries((plan?.steps ?? []).map((s) => [s.id, AGENT_CHOICE.use]))
  );
  const [beforeChange, setBeforeChange] = useState({});

  // 계획표 없이 바로 들어오면 요청 입력 화면으로 돌려보냅니다.
  if (!plan) return <Navigate to="/" replace />;

  const values = steps.map((s) => choices[s.id]);
  const useCount = values.filter((c) => c === AGENT_CHOICE.use).length;
  const skipCount = values.filter((c) => c === AGENT_CHOICE.skip).length;
  const changeCount = values.filter((c) => c === AGENT_CHOICE.change).length;
  const doneCount = useCount + skipCount;
  const canStart = changeCount === 0 && useCount > 0;

  let summaryText = '담당 AI를 모두 골랐어요. 이제 작업을 시작할 수 있어요.';
  if (changeCount > 0) {
    summaryText = `사용 ${useCount}개 · 빼기 ${skipCount}개 · 바꾸는 내용 ${changeCount}개를 확정해 주세요.`;
  } else if (useCount === 0) {
    summaryText = '담당 AI를 하나 이상 사용해 주세요.';
  }

  const choose = (id, choice) => {
    if (choice === AGENT_CHOICE.change && choices[id] !== AGENT_CHOICE.change) {
      setBeforeChange((prev) => ({ ...prev, [id]: choices[id] }));
    }
    setChoices((prev) => ({ ...prev, [id]: choice }));
  };

  const confirmChange = (id, { description, volume }) => {
    setSteps((prev) =>
      prev.map((s) => (s.id === id ? { ...s, description, volume, detail: undefined } : s))
    );
    setChoices((prev) => ({ ...prev, [id]: AGENT_CHOICE.use }));
  };

  const cancelChange = (id) => {
    setChoices((prev) => ({ ...prev, [id]: beforeChange[id] ?? AGENT_CHOICE.use }));
  };

  const handleStart = () => {
    // TODO: 선택 결과를 백엔드로 보내기
    const usedSteps = steps.filter((s) => choices[s.id] === AGENT_CHOICE.use);
    navigate('/new/progress', { state: { plan: { ...plan, steps: usedSteps } } });
  };

  return (
    <Wrapper>
      <Intro>
        <Heading>
          <Title>이렇게 나눠서 맡길게요</Title>
          <Muted>
            담당 AI {steps.length}개의 역할을 확인해 주세요. 필요 없는 단계는 빼고, 맡길 내용은
            바꿀 수 있어요.
          </Muted>
        </Heading>
        <MyRequest>
          <MyRequestLabel>내 요청</MyRequestLabel>
          <MyRequestText>{plan.request}</MyRequestText>
        </MyRequest>
      </Intro>

      <AgentList>
        <ListHeader>
          <ListTitle>담당 AI {steps.length}개</ListTitle>
          <Muted $size={14} $lineHeight={1.2}>
            선택한 순서대로 나눠서 맡겨요
          </Muted>
        </ListHeader>
        {steps.map((step) => (
          <AgentCard
            key={step.id}
            step={step}
            choice={choices[step.id] ?? AGENT_CHOICE.use}
            onChoose={(choice) => choose(step.id, choice)}
            onConfirmChange={(result) => confirmChange(step.id, result)}
            onCancelChange={() => cancelChange(step.id)}
          />
        ))}
      </AgentList>

      <Muted $size={14}>
        {changeCount > 0
          ? '아직 작업은 시작하지 않았어요. 바꾸는 내용을 확정한 뒤 작업을 시작해 주세요.'
          : '아직 작업은 시작하지 않았어요. 선택한 담당 AI가 위 순서대로 처리해요.'}
      </Muted>

      <ActionBar>
        <ActionBarInner>
          <Summary>
            <SummaryTitle>
              {steps.length}개 중 {doneCount}개 선택 완료
            </SummaryTitle>
            <Muted $size={14} $lineHeight={1.2}>
              {summaryText}
            </Muted>
          </Summary>
          <StartButton disabled={!canStart} onClick={handleStart}>
            작업 시작
          </StartButton>
        </ActionBarInner>
      </ActionBar>
    </Wrapper>
  );
}

export default AgentConfirmPage;
