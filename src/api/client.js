const BASE_URL = process.env.REACT_APP_API_BASE_URL ?? ''

/** 공통 fetch 래퍼: JSON 요청/응답과 에러 처리 */
export async function request(path, { method = 'GET', body, headers } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...headers },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    throw new Error(`${method} ${path} failed: ${res.status}`)
  }
  return res.status === 204 ? null : res.json()
}
