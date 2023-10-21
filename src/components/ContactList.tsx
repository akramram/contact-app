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
  const [search, setSearch] = useState(new URLSearchParams(window.location.search).get('q') || '')
  const urlSearchQuery = new URLSearchParams(window.location.search).get('q') || '';
  const [searchQuery, setsearchQuery] = useState({
    first_name: { _like: urlSearchQuery ? `%${urlSearchQuery}%` : undefined }
  })
  const limit = 10
  const { loading, error, data, fetchMore, refetch } = useQuery(GET_CONTACT_LIST, {
    variables: {
      offset: page,
      limit,
      where: searchQuery
    },
  });

  // Function to update the URL with a new search query
  const updateSearchQuery = (newQuery: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('q', newQuery);
    window.history.pushState({}, '', url);
  }

  const handleFormSubmit = (event: any) => {
    event.preventDefault();
    setPage(0)
    updateSearchQuery(search)
    setsearchQuery({ ...searchQuery, first_name: { _like: `%${search}%` } })
  }

  // Check if data is available and not loading
  if (!loading && !error && data) {
    // Save the data to localStorage as a JSON string
    localStorage.setItem('dataKey', JSON.stringify(data));
  }
  const [favorite, setFav] = useState<any[]>(() => {
    const storedValue = JSON.parse(localStorage.getItem('dataFav') || '[]')
    return storedValue ? storedValue : [];
  })
  const addFav = (tese: any) => {
    try {
      const foundItem = favorite.find((fave: any) => fave.id === tese.id) || null
      if (!foundItem) {
        const combined = [...favorite, tese]
        setFav(combined)
        console.log(favorite);

        localStorage.setItem('dataFav', JSON.stringify(combined));
      } else {
        const removed = favorite.filter((fave: any) => fave.id !== tese.id)
        setFav(removed)
        localStorage.setItem('dataFav', JSON.stringify(removed));
      }
    } catch (error) {
      console.error(error);

    }
  }
  const storedFav = JSON.parse(localStorage.getItem('dataFav') || '[]');

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;


  return (
    <div>
      <CreateContact onClose={() => refetch()} />
      <SearchForm onSubmit={(e) => handleFormSubmit(e)}>
        <SearchInput id='search_field' type='text' placeholder='Search Contact' value={search} onChange={(e: any) => {
          setSearch(e.target.value)
        }}>
        </SearchInput>
        {
          search ? <ClearSearchButton type="reset" content='Clear' onClick={() => {
            setSearch('')
            setsearchQuery({
              first_name: { _like: undefined }
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
      {storedFav &&
        favorite.map((contact: Contact) => {
          return (
            <div key={contact.id}>
              <ContactCard>
                <InfoContainer>
                  <Name>
                    {contact.first_name} {contact.last_name}
                  </Name>
                  {contact.phones.map((phone) => <PhoneNumber key={phone.number}>{phone.number}</PhoneNumber>)}
                </InfoContainer>
                <CreateContact id={contact.id} item={contact} onClose={() => refetch()} />
                <DeleteItemButton id={contact.id} deleted={() => refetch()} />
                <ToggleButton onClick={() => addFav(contact)}>
                  {favorite.find((fav) => fav.id === contact.id) ? '⭐' : ''}
                </ToggleButton>
              </ContactCard>
            </div>
          )
        })
      }
      {
        data.contact.map((contact: Contact) => {
          if (favorite.find((fav) => fav.id === contact.id)) return ''
          return (
            <div key={contact.id}>
              <ContactCard>
                <InfoContainer>
                  <Name>
                    {contact.first_name} {contact.last_name}
                  </Name>
                  {contact.phones.map((phone) => <PhoneNumber key={phone.number}>{phone.number}</PhoneNumber>)}
                </InfoContainer>
                <CreateContact id={contact.id} item={contact} onClose={() => refetch()} />
                <DeleteItemButton id={contact.id} deleted={() => refetch()} />
                <ToggleButton onClick={() => addFav(contact)}>
                  ➕
                </ToggleButton>
              </ContactCard>
            </div>
          )
        }
        )
      }
    </div>
  )
}
