import { useState } from 'react';
import { AddButton, ClearSearchButton, SearchForm, SearchInput } from '../style';
import Modal from './DialogGeneral';
import { Button } from './Button';
import { useMutation } from '@apollo/client';
import { ADD_CONTACT_WITH_PHONES } from '../queries';
import { Contact } from './ContactList';

interface IFCreateContact {
    onClose: () => void;
}

const CreateContact: React.FC<IFCreateContact> = ({ onClose }) => {
    const [addContact, { loading }] = useMutation(ADD_CONTACT_WITH_PHONES);
    const handleAddContact = async () => {
        const variables = form;

        try {
            const response = await addContact({ variables });
            const newContact = response.data.insert_contact.returning;
            console.log('New Contact:', newContact);
            onClose()
        } catch (error) {
            console.error('Error adding contact:', error);
        }
    };

    const [form, setForm] = useState<Contact>({
        first_name: '',
        last_name: '',
        phones: [{ number: '' }]
    });
    const changePhones = (index: any, value: any) => {
        if (!index) setForm({ ...form, phones: [...form.phones, { number: value }] })
        let phones = [...form.phones]
        phones[index] = { number: value }
        setForm({ ...form, phones: [...phones] })
    }
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleRemoveItem = (index: number) => {
        const newArray = [...form.phones.slice(0, index), ...form.phones.slice(index + 1)];

        setForm({ ...form, phones: newArray })
    }
    return (
        <div>
            <Button onClick={openModal}>Add Contact</Button>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div style={{ minWidth: '300px' }}>
                    <h3 style={{ textAlign: 'center' }}> Create New Contact </h3>
                    <label>First Name</label>
                    <SearchForm>
                        <SearchInput
                            type="text"
                            placeholder="First Name"
                            value={form.first_name}
                            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
                        />
                        <ClearSearchButton>ㅤ</ClearSearchButton>
                    </SearchForm>
                    <label>Last Name</label>
                    <SearchForm>
                        <SearchInput
                            type="text"
                            placeholder="Last Name"
                            value={form.last_name}
                            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
                        />
                        <ClearSearchButton>ㅤ</ClearSearchButton>
                    </SearchForm>
                    <label>Phone Numbers</label>
                    {
                        form.phones.map((item: any, index: any) => {
                            return (
                                <div style={{ display: 'flex', alignItems: 'center', }}>
                                    <SearchInput
                                        type="number"
                                        placeholder="Nomor" onChange={(e) => changePhones(index, e.target.value)}></SearchInput>
                                    {
                                        index > 0 &&
                                        <ClearSearchButton onClick={() => {
                                            handleRemoveItem(index)
                                        }}>
                                            🗑️
                                        </ClearSearchButton>
                                    }
                                </div>
                            )
                        })
                    }
                    <div style={{ textAlign: 'right' }}>
                        <AddButton onClick={() => setForm({ ...form, phones: [...form.phones, { number: '' }] })}>+</AddButton>
                    </div>
                    <Button onClick={handleAddContact}>{loading ? 'Adding contact...' : 'Add Contact'}</Button>
                </div>
            </Modal>
        </div>
    )
}

export default CreateContact