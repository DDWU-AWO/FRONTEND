import styled from 'styled-components';

const Main = styled.main`
  max-width: 960px;
  margin: 0 auto;
  padding: 4rem 1.5rem;

  h1 {
    font-size: 2.25rem;
    margin: 0 0 0.75rem;
  }
`;

function HomePage() {
  return (
    <Main>
      <h1>AI Workflow Optimizer</h1>
      <p>여러 AI의 작업을 하나의 흐름으로 연결하고, 토큰 사용량과 실행 비용을 최적화합니다.</p>
    </Main>
  );
}

export default HomePage;
