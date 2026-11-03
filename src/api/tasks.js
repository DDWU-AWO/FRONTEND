// TODO: 백엔드 API가 정해지면 client.js의 request()로 교체
// 지금은 Figma 05 내 작업 예시 데이터를 돌려주는 가짜(mock) 함수입니다.
import { BLOG_PLAN, MEETING_PLAN, RESEARCH_PLAN } from './plan';
import { getMockResult } from './mockResults';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/** 작업 상태 */
export const TASK_STATUS = {
  running: 'running',
  done: 'done',
  paused: 'paused',
};

const TASKS = [
  {
    id: 't3',
    request: '최신 소형 AI 모델 동향을 조사해서 개발자용 블로그 글을 써 주고, 마지막에 맞춤법 검사까지 해 줘.',
    status: TASK_STATUS.running,
    steps: BLOG_PLAN,
    currentStep: 3,
    createdAt: '2026.11.01',
    savedPercent: 85,
  },
  {
    id: 't2',
    request: '이번 주 팀 회의록을 요약하고, 담당자별로 할 일과 마감일을 정리해 줘.',
    status: TASK_STATUS.done,
    steps: [
      ...MEETING_PLAN,
      {
        id: 3,
        name: '마감일 정리',
        agent: '일정 담당 AI',
        tagline: '마감일을 한눈에',
        description: '할 일마다 마감일을 확인하고 날짜순으로 정리해요.',
        volume: '마감일 목록 1개',
        resultType: 'document',
      },
    ],
    currentStep: 3,
    createdAt: '2026.10.31',
    savedPercent: 78,
  },
  {
    id: 't1',
    request: '경쟁 서비스 3곳을 조사해서 주요 기능과 요금제를 비교하는 보고서를 만들어 줘.',
    status: TASK_STATUS.paused,
    steps: RESEARCH_PLAN.slice(0, 4),
    currentStep: 2,
    createdAt: '2026.10.30',
    savedPercent: 62,
  },
];

/** 내 작업 목록을 받아옵니다. empty가 true면 빈 목록을 돌려줍니다. (빈 화면 확인용) */
export async function getTasks({ empty = false } = {}) {
  await delay(300);
  return empty ? [] : TASKS;
}

/**
 * 작업을 다시 열 때 필요한 계획표와 이미 끝난 단계의 결과물을 만듭니다.
 * done: 끝난 단계 수, paused: 현재 단계가 멈춘 상태인지
 */
export function getTaskDetail(task) {
  const steps = task.steps;
  const doneCount = task.status === TASK_STATUS.done ? steps.length : task.currentStep - 1;
  const results = Object.fromEntries(
    steps.slice(0, doneCount).map((step) => [
      step.id,
      { stepId: step.id, ...getMockResult(step), usage: { savedPercent: task.savedPercent } },
    ])
  );

  return {
    plan: { request: task.request, steps, finalStepId: steps[steps.length - 1].id },
    results,
    resume: { doneCount, paused: task.status === TASK_STATUS.paused },
  };
}
