import Markdown from 'react-markdown';
import styled, { css } from 'styled-components';

// 결과 글(마크다운)의 제목·소제목·목록에 정해진 디자인을 입힙니다.
// 글 내용이 바뀌어도 글씨 크기와 간격은 항상 같아요.
const Article = styled.article`
  color: ${({ theme }) => theme.colors.textSecondary};

  & > :first-child {
    margin-top: 0;
  }

  h1 {
    margin: 0;
    font-size: 26px;
    font-weight: 700;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text};
  }

  /* 제목 바로 아래 소개 문단 + 구분선 */
  h1 + p {
    margin: ${({ $variant }) => ($variant === 'outline' ? '12px' : '16px')} 0 0;
    padding-bottom: 28px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }

  h2 {
    margin: 28px 0 0;
    font-size: 18px;
    font-weight: 700;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text};
  }

  h1 + p + h2 {
    margin-top: 28px;
  }

  p {
    margin: 12px 0 0;
    font-size: 15px;
    line-height: 1.85;
  }

  ul {
    margin: 12px 0 0;
    padding-left: 20px;
    font-size: 15px;
    line-height: 1.85;
  }

  ${({ $variant, theme }) =>
    $variant === 'outline' &&
    css`
      /* 목차형: 번호 상자 + 제목 + 설명 */
      ol {
        counter-reset: item;
        margin: 28px 0 0;
        padding: 0;
        list-style: none;
      }

      ol > li {
        counter-increment: item;
        display: flex;
        gap: 16px;
        padding: 18px 0;
        border-bottom: 1px solid ${theme.colors.border};
        font-size: 14px;
        line-height: 1.7;
      }

      ol > li:last-child {
        border-bottom: none;
      }

      ol > li strong {
        display: block;
        margin-bottom: 7px;
        font-size: 17px;
        line-height: 1.6;
        color: ${theme.colors.text};
      }

      ol > li br {
        display: none;
      }
    `}
`;

const ItemNumber = styled.span`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.primarySoft};
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};

  &::before {
    content: counter(item);
  }
`;

const outlineComponents = {
  li: ({ children }) => (
    <li>
      <ItemNumber aria-hidden />
      <div>{children}</div>
    </li>
  ),
};

/**
 * Figma: 04-2 목차형 / 04-3 문서형 미리보기
 * variant: document(문서형) / outline(목차형)
 */
function MarkdownView({ content, variant = 'document' }) {
  return (
    <Article $variant={variant}>
      <Markdown components={variant === 'outline' ? outlineComponents : undefined}>
        {content}
      </Markdown>
    </Article>
  );
}

export default MarkdownView;
