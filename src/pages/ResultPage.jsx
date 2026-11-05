import { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import {
  Button,
  MarkdownView,
  ReviewList,
  SavingsCard,
  StatusBadge,
  StepCard,
} from '../components';
import { josa } from '../utils/josa';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`;

const Top = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Title = styled.h1`
  margin: 0;
  font-size: 32px;
  font-weight: 700;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.text};
`;

const Muted = styled.p`
  font-size: ${({ $size = 14 }) => $size}px;
  line-height: ${({ $lineHeight = 1.6 }) => $lineHeight};
  color: ${({ theme }) => theme.colors.textMuted};
  white-space: pre-wrap;
`;

const ErrorBanner = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.errorBg};
`;

const ErrorText = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

const ErrorTitle = styled.p`
  font-size: 15px;
  font-weight: 700;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.error};
`;

const ErrorActions = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 10px;
`;

const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  font-family: inherit;
  font-size: 22px;
  font-weight: 700;
  line-height: 1;
  color: ${({ theme }) => theme.colors.error};
  cursor: pointer;
`;

const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const Body = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 24px;
`;

const Side = styled.aside`
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 16px;
  width: 240px;
`;

const SideHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const SideTitle = styled.h2`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.text};
`;

const DoneCount = styled.span`
  font-size: 13px;
  font-weight: 500;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.success};
`;

const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SideStepCard = styled(StepCard)`
  width: 240px;
`;

const Viewing = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 4px;
  font-size: 13px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textMuted};

  /* 선택 표시 점 */
  &::before {
    content: '';
    flex-shrink: 0;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
  }
`;

const SideHandoff = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 18px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};

  h3 {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Preview = styled.section`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 28px;
  min-width: 0;
  padding: 32px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`;

const PreviewInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const ReviewTitle = styled.h2`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

const Lead = styled.p`
  font-size: 15px;
  line-height: 1.85;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Divider = styled.hr`
  width: 100%;
  height: 1px;
  margin: 0;
  border: none;
  background: ${({ theme }) => theme.colors.border};
`;

const CheckBadge = styled.span`
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.success};
`;

const IntermediateTitle = styled.h2`
  margin: 0;
  font-size: 17px;
  font-weight: 700;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};
`;

const HandoffBox = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};

  h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 700;
    line-height: 1.2;
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Bullets = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.textSecondary};

  li::before {
    content: '•  ';
    white-space: pre;
  }
`;

const ExpandButton = styled(Button)`
  align-self: flex-start;
`;

// 결과 종류별 미리보기 이름과 분량
function previewLabel(step) {
  return step.resultType === 'review' ? `${step.name} 결과` : `${step.name} 미리보기`;
}

function amountLabel(step, result) {
  if (step.resultType === 'review') return `고친 내용 ${result.review.corrections.length}곳`;
  const pattern = step.resultType === 'outline' ? /^\d+\.\s/gm : /^##\s/gm;
  const count = (result.content.match(pattern) ?? []).length;
  return count > 0 ? `${count}개 항목` : step.volume;
}

/** 검수형: 고친 내용 목록 ↔ 완성된 글 */
function ReviewPreview({ result }) {
  const [showFinal, setShowFinal] = useState(false);
  const { corrections, description } = result.review;

  if (showFinal) {
    return (
      <>
        <Row>
          <CheckBadge>✓ 맞춤법 검사 완료</CheckBadge>
          <Button variant="secondary" onClick={() => setShowFinal(false)}>
            고친 내용 보기
          </Button>
        </Row>
        <MarkdownView content={result.content} />
      </>
    );
  }

  return (
    <>
      <Row>
        <ReviewTitle>고친 내용 {corrections.length}곳</ReviewTitle>
        <Button variant="secondary" onClick={() => setShowFinal(true)}>
          완성된 글 보기
        </Button>
      </Row>
      <Lead>{description}</Lead>
      <Divider />
      <ReviewList corrections={corrections} />
    </>
  );
}

/**
 * Figma: 04 결과 확인
 * 왼쪽에서 단계를 고르면 결과 종류(문서형·목차형·검수형)에 맞는 미리보기를 보여줍니다.
 * 최종 결과가 아닌 단계는 먼저 '중간 결과'(04-1)로 보여주고, 펼치면 전체 결과를 보여줍니다.
 */
function ResultPage() {
  const { state, search } = useLocation();
  const plan = state?.plan;
  const results = state?.results ?? {};
  const steps = plan?.steps ?? [];
  const finalStepId = plan?.finalStepId ?? steps[steps.length - 1]?.id;

  const [selectedId, setSelectedId] = useState(
    steps.some((s) => s.id === finalStepId) ? finalStepId : steps[steps.length - 1]?.id
  );
  const [expanded, setExpanded] = useState({});
  const [copied, setCopied] = useState(false);
  const [downloadFailed, setDownloadFailed] = useState(false);
  const simulateDownloadFail = new URLSearchParams(search).get('simulate') === 'download-fail';

  if (!plan || steps.length === 0) return <Navigate to="/" replace />;

  const step = steps.find((s) => s.id === selectedId) ?? steps[steps.length - 1];
  const result = results[step.id];
  const isFinal = step.id === finalStepId || step.id === steps[steps.length - 1].id;
  const isCollapsed = !isFinal && !expanded[step.id];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(result.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const handleDownload = () => {
    setDownloadFailed(false);
    try {
      // 개발용: 주소 뒤에 ?simulate=download-fail 을 붙이면 파일 받기 실패(Figma 04-5)를 볼 수 있어요.
      if (simulateDownloadFail) throw new Error('파일을 만들지 못했어요.');
      const blob = new Blob([result.content], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${step.name}.md`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setDownloadFailed(true);
    }
  };

  let preview;
  if (isCollapsed) {
    preview = (
      <>
        <Heading>
          <IntermediateTitle>중간 결과 · {step.agent}</IntermediateTitle>
          <Muted $lineHeight={1.6}>최종 결과가 아니에요</Muted>
        </Heading>
        <HandoffBox>
          <h3>다음 AI에게 전달한 내용</h3>
          <Muted>앞 단계 결과를 통째로 넘기지 않고, 꼭 필요한 것만 골라서 전달했어요.</Muted>
          <Bullets>
            {result.handoff.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </Bullets>
        </HandoffBox>
        <ExpandButton
          variant="secondary"
          onClick={() => setExpanded((prev) => ({ ...prev, [step.id]: true }))}
        >
          전체 결과 펼치기
        </ExpandButton>
      </>
    );
  } else {
    preview = (
      <>
        <PreviewInfo>
          <Row>
            <Muted $lineHeight={1.2}>{previewLabel(step)}</Muted>
            <StatusBadge status="done" />
          </Row>
          <Muted $size={13}>
            {`담당 AI  ${step.agent}   ·   분량  ${amountLabel(step, result)}`}
          </Muted>
        </PreviewInfo>
        {step.resultType === 'review' && result.review ? (
          <ReviewPreview key={step.id} result={result} />
        ) : (
          <MarkdownView content={result.content} variant={step.resultType} />
        )}
      </>
    );
  }

  return (
    <Wrapper>
      <Top>
        <Heading>
          <Title>다 됐어요!</Title>
          <Muted $size={16}>
            {steps[0].name}부터 {steps[steps.length - 1].name}까지, 모든 단계를 마쳤어요.
          </Muted>
        </Heading>
        <ButtonRow>
          <Button variant="secondary" onClick={handleCopy}>
            {copied ? '복사했어요' : '복사'}
          </Button>
          <Button onClick={handleDownload}>파일로 받기</Button>
        </ButtonRow>
      </Top>

      {downloadFailed && (
        <ErrorBanner role="alert">
          <ErrorText>
            <ErrorTitle>파일을 만들지 못했어요</ErrorTitle>
            <Muted>결과는 그대로 남아 있어요. 다시 받거나 내용을 복사해서 쓸 수 있어요.</Muted>
          </ErrorText>
          <ErrorActions>
            <Button size="S" variant="secondary" onClick={handleDownload}>
              다시 받기
            </Button>
            <CloseButton
              type="button"
              aria-label="오류 안내 닫기"
              onClick={() => setDownloadFailed(false)}
            >
              ×
            </CloseButton>
          </ErrorActions>
        </ErrorBanner>
      )}

      <Body>
        <Side>
          <SideHeader>
            <SideTitle>단계별 결과</SideTitle>
            <DoneCount>
              {steps.length} / {steps.length} 완료
            </DoneCount>
          </SideHeader>
          <StepList>
            {steps.map((s) => (
              <SideStepCard
                key={s.id}
                step={s.id}
                title={s.name}
                description={s.agent}
                status="done"
                selected={s.id === step.id}
                onClick={() => setSelectedId(s.id)}
              />
            ))}
          </StepList>
          <Viewing>지금은 {josa(step.name, '을/를')} 보고 있어요.</Viewing>
          {!isCollapsed && (
            <SideHandoff>
              <h3>다음 AI에게 전달한 내용</h3>
              <Muted $size={13} $lineHeight={1.8}>
                {result.handoff.summary}
              </Muted>
            </SideHandoff>
          )}
        </Side>

        <Preview aria-live="polite">{preview}</Preview>
      </Body>

      <SavingsCard layout="banner" percent={result.usage.savedPercent} reportTo="/report" />
    </Wrapper>
  );
}

export default ResultPage;
