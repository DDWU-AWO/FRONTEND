// TODO: 백엔드 API가 정해지면 실제 요청(폴링/SSE 등)으로 교체
// 지금은 단계 하나를 처리하고 결과물을 돌려주는 가짜(mock) 함수입니다.
import { getMockResult } from './mockResults';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 단계 하나를 실행하고 결과물을 받아옵니다.
 * fail이 true면 AI가 양식을 지키지 못한 상황(멈춤)을 흉내 냅니다.
 */
export async function runStep(step, { fail = false } = {}) {
  await delay(2500);
  if (fail) {
    throw new Error(`${step.name} 단계가 양식에 맞는 답을 주지 않았어요.`);
  }

  return {
    stepId: step.id,
    ...getMockResult(step),
    usage: { savedPercent: 85 },
  };
}
