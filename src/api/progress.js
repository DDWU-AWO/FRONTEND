// TODO: 백엔드 API가 정해지면 실제 요청(폴링/SSE 등)으로 교체
// 지금은 단계 하나를 처리하고 결과물을 돌려주는 가짜(mock) 함수입니다.

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 단계 이름별 '다음 AI에게 넘긴 요약' 예시
const HANDOFF_EXAMPLES = {
  '자료 조사': ['조사한 모델 3종과 특징', '모델별 성능 비교 자료', '참고한 출처 5곳'],
  '목차 정하기': ['글의 독자는 실무 개발자', '소제목 4개, 2,000자 내외', '조사한 모델 3종과 특징'],
  '글 쓰기': ['완성한 글 2,100자', '소제목 4개 구성', '맞춤법 확인이 필요한 문장 표시'],
  '회의 요약': ['주요 논의 3가지', '결정된 내용 2가지', '참석자 5명'],
};

/**
 * 단계 하나를 실행하고 결과물을 받아옵니다.
 * fail이 true면 AI가 양식을 지키지 못한 상황(멈춤)을 흉내 냅니다.
 */
export async function runStep(step, { fail = false } = {}) {
  await delay(2500);
  if (fail) {
    throw new Error(`${step.name} 단계가 양식에 맞는 답을 주지 않았어요.`);
  }

  const points = HANDOFF_EXAMPLES[step.name] ?? [
    `${step.name} 결과의 핵심 내용`,
    `${step.volume}`,
    '다음 단계에 필요한 조건',
  ];

  return {
    stepId: step.id,
    content: `# ${step.name}\n\n${step.description}`,
    handoff: {
      points,
      full: `${step.agent}가 정리한 내용 중 다음 단계에 꼭 필요한 것만 골라 전달했어요.\n\n${points
        .map((p) => `- ${p}`)
        .join('\n')}`,
    },
    usage: { savedPercent: 85 },
  };
}
