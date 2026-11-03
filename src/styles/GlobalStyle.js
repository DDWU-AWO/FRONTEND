import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  :root {
    font-family: ${({ theme }) => theme.fonts.base};
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.text};
    background-color: #ffffff;
    -webkit-font-smoothing: antialiased;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
  }

  p {
    margin: 0;
  }
`;

export default GlobalStyle;
