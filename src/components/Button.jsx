import styled, { css } from 'styled-components';

const sizeStyles = {
  M: css`
    padding: 14px 20px;
    font-size: 16px;
  `,
  S: css`
    padding: 9px 14px;
    font-size: 14px;
  `,
};

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
    border: none;
  `,
  secondary: css`
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.primary};
    border: 1px solid ${({ theme }) => theme.colors.border};
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.danger};
    border: 1px solid ${({ theme }) => theme.colors.danger};
  `,
};

const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radius.md};
  font-family: inherit;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;
  cursor: pointer;
  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

/**
 * Figma: Button
 * variant: primary / secondary / danger, size: M / S, disabled: 낮은 불투명도
 */
function Button({ variant = 'primary', size = 'M', type = 'button', children, ...rest }) {
  return (
    <StyledButton type={type} $variant={variant} $size={size} {...rest}>
      {children}
    </StyledButton>
  );
}

export default Button;
