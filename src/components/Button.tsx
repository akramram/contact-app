import styled from '@emotion/styled'

const ButtonStyle = styled.input`
  padding: 12px;
  background-color: hotpink;
  font-size: 24px;
  border-radius: 4px;
  color: black;
  font-weight: bold;
  &:hover {
    color: white;
  }
`

export function Button({ search='' }) { 
    return <ButtonStyle value={search}>
        
    </ButtonStyle> 
}