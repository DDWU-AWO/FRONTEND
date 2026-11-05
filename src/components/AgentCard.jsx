import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import Button from './Button';
import SelectionBadge from './SelectionBadge';
import StepCard from './StepCard';
import { previewAgentChange } from '../api/plan';

/** 담당 AI 선택 값 */
export const AGENT_CHOICE = {
  use: 'use',
  skip: 'skip',
  change: 'change',
};

const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};

  ${({ $choice, theme }) =>
    $choice === 'skip' &&
    css`
      background: ${theme.colors.surfaceMuted};
    `}

  ${({ $choice, theme }) =>
    $choice === 'change' &&
    css`
      border-color: ${theme.colors.primary};
    `}
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`;

const RoleCard = styled(StepCard)`
  flex-shrink: 0;
  width: 290px;
`;

const Body = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
`;

const DescriptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const Description = styled.p`
  flex: 1;
  min-width: 0;
  font-size: 15px;
  line-height: 1.6;
  color: ${({ theme, $muted }) => ($muted ? theme.colors.textMuted : theme.colors.textSecondary)};
`;

const Small = styled.p`
  font-size: 13px;
  line-height: ${({ $lineHeight = 1.2 }) => $lineHeight};
  color: ${({ theme, $primary }) => ($primary ? theme.colors.primary : theme.colors.textMuted)};
  white-space: ${({ $nowrap }) => ($nowrap ? 'nowrap' : 'normal')};
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ChangePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 24px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surfaceSelected};
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.text};
`;

const ChangeInput = styled.textarea`
  padding: 14px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surface};
  resize: none;
  field-sizing: content;
  min-height: calc(15px * 1.6 + 30px);
  font-family: inherit;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const Compare = styled.div`
  display: flex;
  gap: 16px;
`;

const CompareBox = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: 18px;
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid ${({ theme, $after }) => ($after ? theme.colors.primary : theme.colors.border)};
  background: ${({ theme }) => theme.colors.surface};
`;

const CompareTitle = styled.p`
  font-size: 14px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme, $after }) => ($after ? theme.colors.primary : theme.colors.textMuted)};
`;

/** 맡길 내용 바꾸기: 변경 요청 입력 → 바꾸기 전/후 비교 → 확정 */
function AgentChangePanel({ step, onConfirm, onCancel }) {
  const [changeRequest, setChangeRequest] = useState('');
  const [preview, setPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 입력이 멈추면 바뀐 내용을 미리 받아옵니다.
  useEffect(() => {
    const text = changeRequest.trim();
    setPreview(null);
    if (!text) return undefined;

    let ignore = false;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      const result = await previewAgentChange(step, text);
      if (!ignore) {
        setPreview(result);
        setIsLoading(false);
      }
    }, 600);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [changeRequest, step]);

  let afterText = '어떻게 바꿀지 적으면 바뀐 내용을 보여드려요.';
  if (isLoading) afterText = '바뀐 내용을 정리하고 있어요…';
  if (preview) afterText = preview.description;

  return (
    <ChangePanel>
      <Field>
        어떻게 바꿀까요?
        <ChangeInput
          value={changeRequest}
          onChange={(e) => setChangeRequest(e.target.value)}
          placeholder="예: 3분 발표용으로 줄이고, 마지막에 예상 질문 3개도 넣어 줘."
          rows={1}
          autoFocus
        />
      </Field>
      <Compare>
        <CompareBox>
          <CompareTitle>바꾸기 전</CompareTitle>
          <Description>{step.detail ?? step.description}</Description>
          <Small>분량 · {step.volume}</Small>
        </CompareBox>
        <CompareBox $after>
          <CompareTitle $after>바꾼 후</CompareTitle>
          <Description $muted={!preview}>{afterText}</Description>
          {preview && <Small $primary>분량 · {preview.volume}</Small>}
        </CompareBox>
      </Compare>
      <ActionRow>
        <Small $nowrap>바꾼 내용을 확정하면 선택이 끝나요.</Small>
        <ButtonGroup>
          <Button size="S" disabled={!preview} onClick={() => onConfirm(preview)}>
            이걸로 할게요
          </Button>
          <Button size="S" variant="secondary" onClick={onCancel}>
            원래대로
          </Button>
        </ButtonGroup>
      </ActionRow>
    </ChangePanel>
  );
}

/**
 * Figma: 02 담당 AI 확인 / 담당 AI 카드
 * choice: use(사용) / skip(빼기) / change(바꾸는 중)
 */
function AgentCard({ step, choice, onChoose, onConfirmChange, onCancelChange }) {
  const isSkipped = choice === AGENT_CHOICE.skip;

  return (
    <Card $choice={choice}>
      <Row>
        <RoleCard
          step={step.id}
          title={step.agent}
          description={step.tagline}
          status={isSkipped ? 'skipped' : 'waiting'}
          selected={!isSkipped}
          hideStatus={!isSkipped}
        />
        <Body>
          <DescriptionRow>
            <Description $muted={isSkipped}>{step.description}</Description>
            <SelectionBadge choice={choice} />
          </DescriptionRow>
          <Small $lineHeight={1.5}>
            {isSkipped ? '이 단계는 건너뛰어요' : `분량 · ${step.volume}`}
          </Small>
          <ActionRow>
            <ButtonGroup>
              {[
                [AGENT_CHOICE.use, '사용'],
                [AGENT_CHOICE.skip, '빼기'],
                [AGENT_CHOICE.change, '바꾸기'],
              ].map(([value, label]) => (
                <Button
                  key={value}
                  size="S"
                  variant={choice === value ? 'primary' : 'secondary'}
                  aria-pressed={choice === value}
                  onClick={() => onChoose(value)}
                >
                  {label}
                </Button>
              ))}
            </ButtonGroup>
            <Small $nowrap>AI 모델은 자동으로 골라요</Small>
          </ActionRow>
        </Body>
      </Row>
      {choice === AGENT_CHOICE.change && (
        <AgentChangePanel step={step} onConfirm={onConfirmChange} onCancel={onCancelChange} />
      )}
    </Card>
  );
}

export default AgentCard;
