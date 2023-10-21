import styled from "@emotion/styled";

const ButtonStyles = styled.button`
  background-color: #176B87;
  color: #fff;
  border: 0;
  display: inline-block;
  white-space: nowrap;
  min-height: 30px;
  padding: 0 15px;
  margin: 2.8px 5px 2.5px 0;
  font-size: 0.9rem;
  border-radius: 25px;
  cursor: pointer;
`

interface CustomButtonProps {
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<CustomButtonProps> = ({ onClick, children, disabled }) => {
  return (
    <ButtonStyles onClick={onClick} disabled={disabled}>
      {children}
    </ButtonStyles>
  );
}