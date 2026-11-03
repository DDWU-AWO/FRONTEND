import styled from 'styled-components';

const List = styled.div`
  display: flex;
  gap: 4px;
`;

const Tab = styled.button`
  padding: 10px 14px;
  border: none;
  border-radius: 8px;
  background: transparent;
  font-family: inherit;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.2;
  white-space: nowrap;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;

  &[aria-selected='true'] {
    background: ${({ theme }) => theme.colors.primarySoft};
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
  }
`;

/**
 * Figma: 상태 탭 (상단 메뉴와 같은 모양)
 * items: [{ value, label }]
 */
function Tabs({ items, value, onChange, label }) {
  return (
    <List role="tablist" aria-label={label}>
      {items.map((item) => (
        <Tab
          key={item.value}
          type="button"
          role="tab"
          aria-selected={item.value === value}
          onClick={() => onChange(item.value)}
        >
          {item.label}
        </Tab>
      ))}
    </List>
  );
}

export default Tabs;
