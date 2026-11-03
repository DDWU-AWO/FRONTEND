import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { runStep } from '../api/progress';
import { Button, RequestForm, SavingsCard, StepCard } from '../components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
`;

const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 28px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.text};
`;

const ProgressText = styled.p`
  font-size: 15px;
  font-weight: 500;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.primary};
`;

const Bar = styled.div`
  height: 8px;
  overflow: hidden;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.surfaceMuted};
`;

const BarValue = styled.div`
  width: ${({ $ratio }) => $ratio * 100}%;
  height: 100%;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 0.4s ease;
`;

const Steps = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const FlexStepCard = styled(StepCard)`
  flex: 1;
  min-width: 246px;
  width: auto;
`;

const PausedNotice = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.dangerSoft};
`;

const NoticeText = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const NoticeTitle = styled.p`
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.danger};
`;

const Muted = styled.p`
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`;

const Bottom = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 16px;
`;

const Handoff = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
  padding: 24px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const HandoffTitle = styled.h3`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.text};
`;

const HandoffList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: pre-wrap;

  li::before {
    content: '•  ';
  }
`;

const FullText = styled.p`
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: pre-wrap;
`;

const TextButton = styled.button`
  align-self: flex-start;
  padding: 0;
  border: none;
  background: none;
  font-family: inherit;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

const FlexSavingsCard = styled(SavingsCard)`
  && {
    max-width: none;
  }
`;

const STATUS = {
  waiting: 'waiting',
  running: 'running',
  done: 'done',
  paused: 'paused',
};

function progressLabel(total, statuses, current) {
  const doneCount = statuses.filter((s) => s === STATUS.done).length;
  if (doneCount === total) return `${total}단계 모두 완료`;
  if (statuses[current] === STATUS.paused) {
    return `${total}단계 중 ${doneCount}단계 완료 · ${current + 1}단계 멈춤`;
  }
  return `${total}단계 중 ${current + 1}단계 진행 중`;
}

/**
 * Figma: 03 작업 진행
 * 담당 AI가 단계를 차례대로 처리하는 모습을 보여주고, 멈춘 단계는 다시 하거나 요청을 바꿀 수 있습니다.
 */
function ProgressPage() {
  const { state, search } = useLocation();
  const navigate = useNavigate();
  const plan = state?.plan;
  const steps = plan?.steps ?? [];
  // 개발용: 주소 뒤에 ?simulate=pause 를 붙이면 3단계(없으면 마지막 단계)에서 한 번 멈춥니다.
  const simulatePause = new URLSearchParams(search).get('simulate') === 'pause';
  const pauseIndex = Math.min(2, steps.length - 1);

  const [request, setRequest] = useState(plan?.request ?? '');
  const [statuses, setStatuses] = useState(() => steps.map(() => STATUS.waiting));
  const [results, setResults] = useState({});
  const [current, setCurrent] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [showFull, setShowFull] = useState(false);

  const setStatus = (index, status) =>
    setStatuses((prev) => prev.map((s, i) => (i === index ? status : s)));

  // 현재 단계를 실행하고, 끝나면 다음 단계로 넘어갑니다.
  useEffect(() => {
    if (current >= steps.length) return undefined;
    let ignore = false;
    const step = steps[current];
    const fail = simulatePause && current === pauseIndex && attempt === 0;

    setStatus(current, STATUS.running);
    runStep(step, { fail })
      .then((result) => {
        if (ignore) return;
        setResults((prev) => ({ ...prev, [step.id]: result }));
        setStatus(current, STATUS.done);
        setCurrent((i) => i + 1);
      })
      .catch(() => {
        if (!ignore) setStatus(current, STATUS.paused);
      });

    return () => {
      ignore = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, attempt]);

  // 모든 단계가 끝나면 잠시 완료 상태를 보여준 뒤 결과 확인 화면으로 이동합니다.
  const allDone = steps.length > 0 && statuses.every((s) => s === STATUS.done);
  useEffect(() => {
    if (!allDone) return undefined;
    const timer = setTimeout(() => {
      navigate('/new/result', { state: { plan, results } });
    }, 1200);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDone]);

  if (!plan) return <Navigate to="/" replace />;

  const total = steps.length;
  const doneCount = statuses.filter((s) => s === STATUS.done).length;
  const isRunning = statuses[current] === STATUS.running;
  const isPaused = statuses[current] === STATUS.paused;
  const ratio = (doneCount + (isRunning ? 0.5 : 0)) / total;

  // 가장 최근에 끝난 단계의 결과물
  const lastDone = [...steps].reverse().find((s) => results[s.id]);
  const lastResult = lastDone && results[lastDone.id];

  const retryStep = () => setAttempt((n) => n + 1);
  const changeRequest = () => navigate('/', { state: { request: plan.request } });
  const startNew = (text) => navigate('/', { state: { request: text, autoStart: true } });

  return (
    <Wrapper>
      <RequestForm value={request} onChange={setRequest} onSubmit={startNew} showExamples />

      <Card aria-live="polite">
        <CardHeader>
          <CardTitle>진행 상황</CardTitle>
          <ProgressText>{progressLabel(total, statuses, current)}</ProgressText>
        </CardHeader>
        <Bar
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={doneCount}
        >
          <BarValue $ratio={ratio} />
        </Bar>
        <Steps>
          {steps.map((step, i) => (
            <FlexStepCard
              key={step.id}
              step={step.id}
              title={step.name}
              description={step.agent}
              status={statuses[i]}
              selected={statuses[i] === STATUS.running}
              emphasized
            />
          ))}
        </Steps>
        {isPaused && (
          <PausedNotice role="alert">
            <NoticeText>
              <NoticeTitle>{steps[current].name} 단계가 멈췄어요</NoticeTitle>
              <Muted>
                {doneCount > 0 &&
                  `완료된 ${doneCount === 1 ? '1' : `1~${doneCount}`}단계 결과는 그대로 유지돼요. `}
                이 단계부터 다시 하거나 요청을 바꿔서 다시 해 보세요.
              </Muted>
            </NoticeText>
            <ButtonRow>
              <Button onClick={retryStep}>이 단계부터 다시 하기</Button>
              <Button variant="secondary" onClick={changeRequest}>
                요청 바꿔서 다시 하기
              </Button>
            </ButtonRow>
          </PausedNotice>
        )}
      </Card>

      <Bottom>
        <Handoff>
          <HandoffTitle>다음 AI에게 전달한 내용</HandoffTitle>
          {lastResult ? (
            <>
              <Muted>앞 단계 결과를 통째로 넘기지 않고, 꼭 필요한 것만 골라서 전달했어요.</Muted>
              {showFull ? (
                <FullText>{lastResult.handoff.full}</FullText>
              ) : (
                <HandoffList>
                  {lastResult.handoff.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </HandoffList>
              )}
              <TextButton type="button" onClick={() => setShowFull((v) => !v)}>
                {showFull ? '접기' : '전체 내용 보기'}
              </TextButton>
            </>
          ) : (
            <Muted>첫 단계가 끝나면 다음 AI에게 전달한 내용을 보여드려요.</Muted>
          )}
        </Handoff>
        <FlexSavingsCard
          percent={lastResult?.usage.savedPercent ?? null}
          description={
            lastResult
              ? undefined
              : '첫 단계가 끝나면 다음 AI에게 넘긴 분량을 얼마나 줄였는지 알려드려요.'
          }
        />
      </Bottom>
    </Wrapper>
  );
}

export default ProgressPage;
