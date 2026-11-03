# FRONTEND

AI Workflow Optimizer(AWO) 프론트엔드 — React (Create React App)

## 시작하기

```bash
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm start              # http://localhost:3000
```

## 스크립트

| 명령 | 설명 |
| --- | --- |
| `npm start` | 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 (`build/`) |
| `npm test` | 테스트 실행 |

## 폴더 구조

```
public/          # index.html, favicon
src/
├─ api/          # 백엔드 API 호출 (client.js 공통 래퍼)
├─ assets/       # 이미지, 폰트 등 정적 리소스
├─ components/   # 재사용 UI 컴포넌트
├─ hooks/        # 커스텀 훅
├─ pages/        # 화면 단위 컴포넌트
├─ utils/        # 공통 유틸 함수
├─ App.js
└─ index.js
```
