import { useQuery, gql } from '@apollo/client';
import { useState } from 'react';
import { Contact } from './ContactList';
import { useMutation } from '@apollo/client';

const CREATE_CONTACT = gql`
    mutation AddContactWithPhones(
        $first_name: String!, 
        $last_name: String!, 
        $phones: [phone_insert_input!]!
        ) {
    insert_contact(
        objects: {
            first_name: $first_name, 
            last_name: 
            $last_name, phones: { 
                data: $phones
                }
            }
        ) {
        returning {
        first_name
        last_name
        id
        phones {
            number
        }
        }
    }
    }
`;

export interface Phone {
    number: string
}

export default function CreateContact() {
    const [form, setForm] = useState<any>({
        first_name: '', 
        last_name: '',
        phones: []
    });
    const changePhones = (index:any, value:any) => {
        if (!index) setForm({...form, phones: [...form.phones, value] })
        let phones = [...form.phones]
        phones[index] = value
        setForm({...form, phones: [...phones] })
    }
    return (
        <div>
            {JSON.stringify(form)}
            <input
                type="text"
                placeholder="First Name"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            />
            <input
                type="text"
                placeholder="Last Name"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            />
            {
                form.phones.map((item:any, index:any) => <input
                    type="number"
                    placeholder="nomor" onChange={(e) => changePhones(index, e.target.value)}></input>)
            }
            <button onClick={() => setForm({...form, phones:[...form.phones, '']})}>add</button>
        </div>
    )
}