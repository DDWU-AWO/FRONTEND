/** 글자 수를 '만 자' 단위로 표시합니다. 예: 120000 → '12만 자' */
export function formatChars(count, { unit = true } = {}) {
  const man = Math.round((count / 10_000) * 10) / 10;
  return unit ? `${man.toLocaleString('ko-KR')}만 자` : `${man.toLocaleString('ko-KR')}만`;
}

/** 금액을 원 단위로 표시합니다. 예: 18000 → '18,000원' */
export function formatWon(amount) {
  return `${amount.toLocaleString('ko-KR')}원`;
}

/** 줄어든 비율(%)을 계산합니다. */
export function savedPercent(before, after) {
  return before > 0 ? Math.round(((before - after) / before) * 100) : 0;
}
