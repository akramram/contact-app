import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { SearchForm, SearchInput, ClearSearchButton, ContactCard, InfoContainer, Name, PhoneNumber, ToggleButton, PaginationButton, PaginationContainer } from '../style';
import CreateContact from './CreateContact';
import { GET_CONTACT_LIST } from '../queries';
import DeleteItemButton from './DeleteContact';

export interface Contact {
  created_at?: string
  first_name: string
  id?: number
  last_name: string
  phones: Phone[]
}

export interface Phone {
  number: string
}


export default function ContactList() {
  const [page, setPage] = useState(0)
  const [search, setSearch] = useState('')
  const [searchQuery, setsearchQuery] = useState({
    first_name: { _like: `%%` }
  })
  const limit = 10
  const { loading, error, data, fetchMore } = useQuery(GET_CONTACT_LIST, {
    variables: {
      offset: page,
      limit,
      where: searchQuery
    },
  });

  const handleFormSubmit = (event: any) => {
    event.preventDefault();
    setPage(0)
    setsearchQuery({ ...searchQuery, first_name: { _like: `%${search}%` } })
  }

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      <CreateContact onClose={() => fetchMore({
        variables: {
          offset: page
        },
      })} />
      <SearchForm onSubmit={handleFormSubmit}>
        <SearchInput id='search_field' type='text' placeholder='Search Contact' value={search} onChange={(e: any) => {
          setSearch(e.target.value)
        }}>
        </SearchInput>
        {
          search ? <ClearSearchButton type="reset" content='Clear' onClick={() => {
            setSearch('')
            setsearchQuery({
              first_name: { _like: `%%` }
            })
          }}>🧹</ClearSearchButton> : ''
        }
      </SearchForm>
      <PaginationContainer>
        <PaginationButton disabled={!page} onClick={() => {
          if (page < 0) return
          setPage(page - limit)
          fetchMore({
            variables: {
              offset: page
            },
          })
        }}>
          {'<'}
        </PaginationButton>
        <PaginationButton disabled={data.contact.length < limit} onClick={() => {
          setPage(page + limit)
          fetchMore({
            variables: {
              offset: page
            },
          })
        }}>
          {'>'}
        </PaginationButton>
      </PaginationContainer>
      {
        data.contact.map((contact: Contact) => (
          <div key={contact.id}>
            <ContactCard>
              <InfoContainer>
                <Name>
                  {contact.first_name} {contact.last_name}
                </Name>
                {contact.phones.map((phone) => <PhoneNumber>{phone.number}</PhoneNumber>)}

              </InfoContainer>
              <DeleteItemButton id={contact.id} deleted={() => setsearchQuery({
                first_name: { _like: `%%` }
              })} />
              <ToggleButton>
                ⭐
              </ToggleButton>
            </ContactCard>
          </div>
        ))
      }
    </div>
  )
}
