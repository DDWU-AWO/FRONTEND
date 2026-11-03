import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { ReactComponent as FlowIcon } from '../assets/icon-flow.svg';

const Bar = styled.header`
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Inner = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1112px;
  margin: 0 auto;
  padding: 12px 16px;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18px;
  font-weight: 700;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.text};
  text-decoration: none;
`;

const Mark = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primary};
`;

const Nav = styled.nav`
  display: flex;
  gap: 4px;
`;

const NavItem = styled(Link)`
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.2;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;

  &.active {
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
  }
`;

// match: 해당 메뉴를 활성화할 경로
const menus = [
  { to: '/', label: '새 작업', match: (path) => path === '/' || path.startsWith('/new') },
  { to: '/tasks', label: '내 작업', match: (path) => path.startsWith('/tasks') },
  { to: '/report', label: '절약 리포트', match: (path) => path.startsWith('/report') },
];

/** Figma: 상단 내비게이션 */
function Header() {
  const { pathname } = useLocation();

  return (
    <Bar>
      <Inner>
        <Logo to="/">
          <Mark>
            <FlowIcon width={18} height={18} aria-hidden />
          </Mark>
          AWO
        </Logo>
        <Nav>
          {menus.map(({ to, label, match }) => (
            <NavItem key={to} to={to} className={match(pathname) ? 'active' : undefined}>
              {label}
            </NavItem>
          ))}
        </Nav>
      </Inner>
    </Bar>
  );
}

export default Header;
