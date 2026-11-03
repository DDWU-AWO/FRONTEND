import styled, { css } from 'styled-components';
import Button from './Button';

const EXAMPLES = [
  {
    label: '회의록 요약하고 할 일 정리',
    request: '회의록 요약하고 할 일 정리해 줘',
  },
  {
    label: '경쟁 서비스 조사 보고서',
    request: '경쟁 서비스 조사해서 보고서랑 발표 대본 만들어 줘',
  },
  {
    label: '발표 대본 만들기',
    request: '보고서 내용을 바탕으로 5분 발표 대본 만들어 줘',
  },
];

const Section = styled.section`
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
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surface};

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  ${({ $locked, theme }) =>
    $locked &&
    css`
      border-color: ${theme.colors.border};
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

const Examples = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

const ExamplesLabel = styled.span`
  font-size: 14px;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Chip = styled.button`
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid ${({ theme }) => theme.colors.borderStrong};
  background: ${({ theme }) => theme.colors.surface};
  font-family: inherit;
  font-size: 14px;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.textSecondary};
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

/**
 * Figma: 요청 입력 영역 (01 요청 입력, 03 작업 진행 상단)
 * locked: 요청을 처리하는 동안 입력을 잠급니다.
 */
function RequestForm({ value, onChange, onSubmit, locked = false, showExamples = false }) {
  const canSubmit = value.trim().length > 0 && !locked;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (canSubmit) onSubmit(value.trim());
  };

  const handleKeyDown = (e) => {
    // Enter: 제출, Shift+Enter: 줄바꿈 (한글 조합 중인 Enter는 무시)
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) {
      handleSubmit(e);
    }
  };

  return (
    <Section>
      <Title>어떤 일을 맡길까요?</Title>
      <Description>하고 싶은 일을 편하게 적으면, 여러 AI가 나눠서 차례대로 처리해요.</Description>
      <InputBox onSubmit={handleSubmit} $locked={locked}>
        <TextArea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="예: 최신 소형 AI 모델 동향을 조사해서 개발자용 블로그 글을 써 주고, 마지막에 맞춤법 검사까지 해 줘."
          aria-label="요청 내용"
          rows={1}
          disabled={locked}
        />
        <Button type="submit" disabled={!canSubmit}>
          시작하기
        </Button>
      </InputBox>
      {showExamples && !locked && (
        <Examples>
          <ExamplesLabel>예시:</ExamplesLabel>
          {EXAMPLES.map(({ label, request }) => (
            <Chip key={label} type="button" onClick={() => onChange(request)}>
              {label}
            </Chip>
          ))}
        </Examples>
      )}
    </Section>
  );
}

export default RequestForm;
