/**
 * 단어의 마지막 글자 받침에 맞는 조사를 붙입니다.
 * 예: josa('보고서', '을/를') → '보고서를', josa('발표 구성', '을/를') → '발표 구성을'
 */
export function josa(word, pair) {
  const [withBatchim, withoutBatchim] = pair.split('/');
  const code = word.charCodeAt(word.length - 1) - 0xac00;
  if (code < 0 || code > 11171) return `${word}${withoutBatchim}`;
  return `${word}${code % 28 ? withBatchim : withoutBatchim}`;
}
