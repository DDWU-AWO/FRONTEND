// TODO: 백엔드 API가 정해지면 client.js의 request()로 교체
// 지금은 Figma 예시 데이터를 돌려주는 가짜(mock) 함수입니다.

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const MEETING_PLAN = [
  {
    id: 1,
    name: '회의 요약',
    agent: '요약 담당 AI',
    tagline: '회의의 핵심을 한눈에',
    description: '회의록에서 주요 논의와 결정된 내용을 골라 짧게 요약해요.',
    volume: '핵심 요약 5줄 안팎',
    resultType: 'document',
  },
  {
    id: 2,
    name: '할 일 정리',
    agent: '정리 담당 AI',
    tagline: '할 일을 빠짐없이',
    description: '요약한 내용을 바탕으로 할 일, 담당자, 마감일을 보기 쉽게 정리해요.',
    volume: '담당자별 할 일 목록 1개',
    resultType: 'document',
  },
];

const BLOG_PLAN = [
  {
    id: 1,
    name: '자료 조사',
    agent: '조사 담당 AI',
    tagline: '최신 자료 모으기',
    description: '최신 소형 AI 모델 3종의 특징과 성능 자료를 출처와 함께 모아요.',
    volume: '모델 3종 · 핵심 자료 목록',
    resultType: 'document',
  },
  {
    id: 2,
    name: '목차 정하기',
    agent: '기획 담당 AI',
    tagline: '글의 뼈대 세우기',
    description: '조사한 자료를 바탕으로 개발자가 읽기 좋은 글의 목차를 정해요.',
    volume: '소제목 4개',
    resultType: 'outline',
  },
  {
    id: 3,
    name: '글 쓰기',
    agent: '작성 담당 AI',
    tagline: '읽기 쉬운 블로그 글로',
    description: '목차에 맞춰 실무 개발자를 위한 블로그 글을 써요.',
    volume: '2,000자 내외',
    resultType: 'document',
  },
  {
    id: 4,
    name: '맞춤법 검사',
    agent: '검수 담당 AI',
    tagline: '마지막으로 한 번 더 확인',
    description: '글의 맞춤법과 어색한 문장을 고쳐요.',
    volume: '고친 문장 목록',
    resultType: 'review',
  },
];

const RESEARCH_PLAN = [
  {
    id: 1,
    name: '자료 조사',
    agent: '조사 담당 AI',
    tagline: '비교할 자료 모으기',
    description: '경쟁 서비스 3개의 주요 기능, 가격, 이용 대상을 찾아 출처와 함께 모아요.',
    volume: '서비스 3개 · 핵심 자료 목록',
    resultType: 'document',
  },
  {
    id: 2,
    name: '비교 분석',
    agent: '비교 분석 담당 AI',
    tagline: '서비스별 차이 살펴보기',
    description: '조사한 자료를 같은 기준으로 비교하고, 서비스마다 강점과 아쉬운 점을 짚어요.',
    volume: '비교표 1개 · 핵심 차이 3가지',
    resultType: 'document',
  },
  {
    id: 3,
    name: '보고서 작성',
    agent: '보고서 작성 담당 AI',
    tagline: '읽기 쉬운 보고서로',
    description: '비교 내용을 바탕으로 주요 발견과 참고할 점을 보고서로 정리해요.',
    volume: '요약을 포함한 보고서 2쪽 안팎',
    resultType: 'document',
  },
  {
    id: 4,
    name: '발표 대본',
    agent: '발표 대본 작성 담당 AI',
    tagline: '말하기 편한 대본으로',
    description: '보고서의 핵심을 자연스럽게 설명할 수 있는 발표 대본을 만들어요.',
    detail: '보고서의 핵심을 소개하는 5분 발표 대본을 만들어요. 도입, 주요 비교, 결론 순서로 정리해요.',
    volume: '5분 발표 대본',
    resultType: 'outline',
  },
  {
    id: 5,
    name: '검수',
    agent: '검수 담당 AI',
    tagline: '마지막으로 한 번 더 확인',
    description: '보고서와 대본의 빠진 내용, 어색한 문장과 맞춤법을 확인해요.',
    volume: '고친 문장 목록',
    resultType: 'review',
  },
];

function pickPlan(request) {
  if (request.includes('회의')) return MEETING_PLAN;
  if (request.includes('블로그')) return BLOG_PLAN;
  return RESEARCH_PLAN;
}

/** 요청을 단계(담당 AI)로 나눈 계획표를 받아옵니다. */
export async function createPlan(request) {
  await delay(1500);
  const steps = pickPlan(request);
  return { request, steps, finalStepId: steps[steps.length - 1].id };
}

/** 담당 AI에게 맡길 내용을 바꿔 달라고 요청하고, 바뀐 결과를 받아옵니다. */
export async function previewAgentChange(step, changeRequest) {
  await delay(800);
  if (step.id === 4 && changeRequest.includes('3분')) {
    return {
      description:
        '핵심 차이와 결론 중심의 3분 발표 대본을 만들어요. 마지막에 예상 질문과 답변 3개를 덧붙여요.',
      volume: '3분 발표 대본 + 예상 질문 3개',
    };
  }
  return {
    description: `${step.description} 요청한 내용(${changeRequest})을 반영해요.`,
    volume: step.volume,
  };
}
