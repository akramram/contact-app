import styled from '@emotion/styled'

// Create a styled input element
export const SearchInput = styled.input`
  padding: 10px;
  border: 0;
  border-radius: 25px;
  width: 100%;
  background-color: #176B87;
  color: #DAFFFB;
  margin: 2.5px 0px 2.5px 0px;
  &:focus {
    outline: none;
  }
  &::placeholder {
    color: #839AA8;
  }
`;

// Create a styled button element
export const ClearSearchButton = styled.button`
  padding: 5px 5px;
  margin-top: auto;
  margin-bottom: auto;
  background-color: transparent;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: -35px
`;

// Create a styled form element
export const SearchForm = styled.form`
  display: flex;
`;

// Styled contact card container
export const ContactCard = styled.div`
  border-bottom: 1px solid #176B87;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

// Styled container for name and phone number
export const InfoContainer = styled.div`
  flex: 1;
`;

// Styled first and last name with larger text
export const Name = styled.div`
  font-size: 1rem;
`;

// Styled phone number with smaller muted text
export const PhoneNumber = styled.div`
  font-size: 0.9rem;
  color: #999;
`;

// Styled toggle button
export const ToggleButton = styled.button`
  border: none;
  border-radius: 4px;
  background-color: transparent;
  padding: 5px 10px;
  cursor: pointer;
`;

// Styled pagination container
export const PaginationContainer = styled.div`
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  width: fit-content;
  margin: 5px 0px 5px auto;
`;
// Styled pagination button
export const PaginationButton = styled.button`
  background-color: #176B87;
  color: #fff;
  border:0;
  padding: 5px 10px;
  cursor: pointer;
`;

// Styled circle add button
export const AddButton = styled.button`
  background-color: #176B87;
  color: #fff;
  border:0;
  text-align: center;
  width: 30 px;
  height: 30 px;
  margin: 5px 0 5px;
  font-size: 1.3rem;
  border-radius: 50px;
  cursor: pointer;
`;