import { useQuery, gql  } from '@apollo/client';
import { useState } from 'react';

const GET_CONTACT_LIST = gql`
  query GetContactList (
      $distinct_on: [contact_select_column!], 
      $limit: Int, 
      $offset: Int, 
      $order_by: [contact_order_by!], 
      $where: contact_bool_exp
    ) {
    contact(
        distinct_on: $distinct_on, 
        limit: $limit, 
        offset: $offset, 
        order_by: $order_by, 
        where: $where
    ){
      created_at
      first_name
      id
      last_name
      phones {
        number
      }
    }
  }

`;

export interface Contact {
  created_at: string
  first_name: string
  id: number
  last_name: string
  phones: Phone[]
}

export interface Phone {
  number: string
}


export default function ContactList() {
  const [page, setPage] = useState(0)
  const limit = 5
  const { loading, error, data, fetchMore } = useQuery(GET_CONTACT_LIST, {
    variables: {
      offset: page,
      limit,
      where: { first_name: { _like: "%%" } }
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      <button disabled={!page} onClick={() => {
        if(page < 0) return
        setPage(page - limit)
        fetchMore({
          variables: {
            offset: page
          },
        })
      }}>
        bek
      </button>
      <button disabled={data.contact.length < limit} onClick={() => {
        setPage(page + limit)
        fetchMore({
          variables: {
            offset: page
          },
        })
      }}>
        fetchmore
      </button>
      {
        data.contact.map((contact: Contact) => (
          <div key={contact.id}>
            <h3>{contact.first_name} {contact.last_name}</h3>
            <br />
            <b>Phones</b>
            <ul>
              {contact.phones.map((phone) => <li>{phone.number}</li>)}
            </ul>
            <br />
          </div>
        ))
      }

      
    </div>

  )
}
