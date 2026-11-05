import { forwardRef } from 'react';
import styled, { css } from 'styled-components';

// 모든 버튼이 1px 테두리를 가지고, 테두리를 포함해 M 47px · S 35px 높이가 되도록 맞춥니다.
const sizeStyles = {
  M: css`
    padding: 13px 19px;
    font-size: 16px;
  `,
  S: css`
    padding: 8px 13px;
    font-size: 14px;
  `,
};

const variantStyles = {
  primary: css`
    background: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.onPrimary};
    border: 1px solid ${({ theme }) => theme.colors.primary};
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
const Button = forwardRef(function Button(
  { variant = 'primary', size = 'M', type = 'button', children, ...rest },
  ref
) {
  return (
    <StyledButton ref={ref} type={type} $variant={variant} $size={size} {...rest}>
      {children}
    </StyledButton>
  );
});

export default Button;
