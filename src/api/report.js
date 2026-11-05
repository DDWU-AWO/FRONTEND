// TODO: 백엔드 API가 정해지면 client.js의 request()로 교체
// 지금은 Figma 06 절약 리포트 예시 데이터를 돌려주는 가짜(mock) 함수입니다.
// 분량 단위는 글자 수, 비용 단위는 원입니다.

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const NOVEMBER_2026 = {
  month: '2026년 11월',
  period: '11.01–11.30',
  isSample: true,
  totalTasks: 24,
  chars: { before: 1_200_000, after: 300_000 },
  cost: { before: 24_000, after: 6_000 },
  steps: [
    { name: '자료 조사', before: 240_000, after: 120_000 },
    { name: '목차 만들기', before: 240_000, after: 60_000 },
    { name: '글 쓰기', before: 400_000, after: 90_000 },
    { name: '맞춤법 검사', before: 320_000, after: 30_000 },
  ],
  agents: [
    { name: '조사 담당 AI', cost: 2_400 },
    { name: '기획 담당 AI', cost: 1_200 },
    { name: '작성 담당 AI', cost: 1_800 },
    { name: '검수 담당 AI', cost: 600 },
  ],
  recentTasks: [
    {
      title: '최신 소형 AI 모델 동향 · 개발자용 블로그 글',
      summary: '자료 조사부터 글 쓰기, 맞춤법 검사까지',
      completedAt: '2026.11.28',
      savedPercent: 85,
    },
    {
      title: '경쟁 서비스 조사 보고서',
      summary: '서비스 3곳의 특징과 가격을 한눈에 정리',
      completedAt: '2026.11.26',
      savedPercent: 80,
    },
    {
      title: '팀 회의록 요약과 할 일 정리',
      summary: '주요 결정 사항과 담당자별 할 일 정리',
      completedAt: '2026.11.24',
      savedPercent: 72,
    },
    {
      title: '신규 서비스 소개 발표 대본',
      summary: '10분 발표에 맞춘 대본 작성과 문장 다듬기',
      completedAt: '2026.11.21',
      savedPercent: 68,
    },
    {
      title: '고객 의견 정리와 개선 아이디어',
      summary: '반복된 요청을 모아 우선순위 제안',
      completedAt: '2026.11.19',
      savedPercent: 75,
    },
  ],
};

/** 월간 절약 리포트를 받아옵니다. empty가 true면 기록이 없는 달을 돌려줍니다. (빈 화면 확인용) */
export async function getMonthlyReport({ empty = false } = {}) {
  await delay(300);
  if (empty) {
    return { month: NOVEMBER_2026.month, period: NOVEMBER_2026.period, isSample: false, totalTasks: 0 };
  }
  return NOVEMBER_2026;
}
