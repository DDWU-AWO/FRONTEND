import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';

const Page = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.background};
`;

const Content = styled.main`
  max-width: 1112px;
  margin: 0 auto;
  padding: 48px 16px 64px;
`;

/** 상단 내비게이션 + 본문 영역 공통 레이아웃 */
function Layout() {
  return (
    <Page>
      <Header />
      <Content>
        <Outlet />
      </Content>
    </Page>
  );
}

export default Layout;
