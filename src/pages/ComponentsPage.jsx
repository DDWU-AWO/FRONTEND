import { useState } from 'react';
import styled from 'styled-components';
import { Button, SavingsCard, StatusBadge, StepCard, STEP_STATUS } from '../components';

// 재사용 컴포넌트 미리보기 (Figma 'AWO · 재사용 컴포넌트' 섹션과 대조용)
const Page = styled.main`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 16px;
`;

const Section = styled.section`
  margin-bottom: 48px;

  h2 {
    font-size: 18px;
    margin: 0 0 16px;
  }
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 30px;
  margin-bottom: 30px;
`;

const statuses = Object.keys(STEP_STATUS);

function ComponentsPage() {
  const [selectedStep, setSelectedStep] = useState(2);

  return (
    <Page>
      <Section>
        <h2>StatusBadge</h2>
        <Row>
          {statuses.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </Row>
      </Section>

      <Section>
        <h2>StepCard</h2>
        {statuses.map((status) => (
          <Row key={status}>
            {['horizontal', 'vertical'].map((layout) =>
              [false, true].map((selected) => (
                <StepCard
                  key={`${layout}-${selected}`}
                  step={1}
                  title="자료 조사"
                  description="조사 담당 AI"
                  status={status}
                  layout={layout}
                  selected={selected}
                />
              ))
            )}
          </Row>
        ))}
        <h2>StepCard (클릭 선택)</h2>
        <Row>
          {[1, 2, 3].map((step) => (
            <StepCard
              key={step}
              step={step}
              title={`${step}단계`}
              description="담당 AI"
              status={step < 2 ? 'done' : step === 2 ? 'running' : 'waiting'}
              selected={selectedStep === step}
              onClick={() => setSelectedStep(step)}
            />
          ))}
        </Row>
      </Section>

      <Section>
        <h2>Button</h2>
        {['primary', 'secondary', 'danger'].map((variant) => (
          <Row key={variant}>
            {['M', 'S'].map((size) =>
              [false, true].map((disabled) => (
                <Button
                  key={`${size}-${disabled}`}
                  variant={variant}
                  size={size}
                  disabled={disabled}
                >
                  버튼
                </Button>
              ))
            )}
          </Row>
        ))}
      </Section>

      <Section>
        <h2>SavingsCard</h2>
        <Row>
          <SavingsCard />
        </Row>
        <SavingsCard layout="banner" reportTo="/" />
      </Section>
    </Page>
  );
}

export default ComponentsPage;
