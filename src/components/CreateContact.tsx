import { useState } from 'react';
import { AddButton, ClearSearchButton, SearchForm, SearchInput } from '../style';
import Modal from './DialogGeneral';
import { Button } from './Button';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_CONTACT_WITH_PHONES, EDIT_CONTACT_BY_ID, EDIT_CONTACT_PHONE_NUMBER, GET_CONTACT_LIST } from '../queries';
import { Contact, Phone } from './ContactList';

interface IFCreateContact {
    onClose: () => void;
    id?: number,
    item?: Contact
}

const CreateContact: React.FC<IFCreateContact> = ({ onClose, id, item }) => {
    const [addContact, { loading }] = useMutation(ADD_CONTACT_WITH_PHONES);
    const handleAddContact = async () => {
        const variables = form;

        try {
            await addContact({ variables }).then(() => closeModal())
            onClose()
        } catch (error) {
            console.error('Error adding contact:', error);
        }
    };

    const [editContact] = useMutation(EDIT_CONTACT_BY_ID);
    const [editContactPhoneNumber] = useMutation(EDIT_CONTACT_PHONE_NUMBER);
    const handleEditContact = async () => {
        try {
            const promises = form.phones.map((phone, index) => handleEditPhoneNumbers(phone, index))
            const editContactInfo = editContact({
                variables: {
                    id, _set: {
                        first_name: form.first_name,
                        last_name: form.last_name,
                    }
                },
            })
            await Promise.all([...promises, editContactInfo]).then(() => setIsModalOpen(false))
        } catch (error) {
            console.error('Error editing contact:', error);
        }
    };
    const handleEditPhoneNumbers = async (contact: Phone, index: number) => {
        try {
            await editContactPhoneNumber({
                variables: {
                    pk_columns: {
                        number: item?.phones[index].number,
                        contact_id: id,
                    },
                    new_phone_number: contact.number,
                }
            }).then(() => closeModal())
            onClose()
        } catch (error) {
            console.error('Error updating phone numbers:', error);
        }
    }

    const [form, setForm] = useState<Contact>({
        first_name: '',
        last_name: '',
        phones: [{ number: '' }]
    });

    const resetForm = () => {
        setForm({
            first_name: '',
            last_name: '',
            phones: [{ number: '' }]
        })
    }
    const changePhones = (index: any, value: any) => {
        if (!index) setForm({ ...form, phones: [...form.phones, { number: value }] })
        let phones = [...form.phones]
        phones[index] = { number: value }
        setForm({ ...form, phones: [...phones] })
    }
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        if (item) {
            setForm({
                first_name: item.first_name,
                last_name: item.last_name,
                phones: item.phones.map((phone) => { return { number: phone.number.toString() } })
            })
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        resetForm()
        setIsModalOpen(false);
    };

    const handleRemoveItem = (index: number) => {
        form.phones.splice(index, 1);
        setForm({ ...form, phones: form.phones })
    }

    const { data, refetch } = useQuery(GET_CONTACT_LIST, {
        variables: {
            limit: 1,
            where: {
                first_name: { _like: form.first_name }
            }
        },
    });

    // State to hold form errors
    const [formErrors, setFormErrors] = useState({
        first_name: '',
    });

    // Function to handle form input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setForm({ ...form, first_name: value });
        setFormErrors({ ...formErrors, first_name: '' });
    };

    // Function to handle form submission
    const handleSubmit = () => {
        refetch()
        // Validate the form fields
        const errors = validateForm(form);
        setFormErrors(errors);

        if (Object.keys(errors).length === 0) {
            // Check if the name is unique
            if (data.contact.length > 0) {
                setFormErrors({ ...errors, first_name: 'Name must be unique' });
            } else {
                return id ? handleEditContact() : handleAddContact()
            }
        }
    };

    // Function to validate form fields
    const validateForm = (data: any) => {
        const errors: any = {};
        if (!data.first_name.trim()) {
            errors.first_name = 'First name is required';
        } else if (!isValidName(data.first_name)) {
            errors.first_name = 'First name contains special characters';
        }
        return errors;
    };

    // Function to validate name (no special characters)
    const isValidName = (name: string) => {
        const namePattern = /^[a-zA-Z\s]*$/;
        return namePattern.test(name);
    };

    return (
        <div>
            <Button onClick={openModal}>{id ? 'Edit' : 'Add Contact'}</Button>
            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <div style={{ minWidth: '300px' }}>
                    <h3 style={{ textAlign: 'center' }}> {id ? 'Edit Contact' : 'Create New Contact'} </h3>
                    <label>First Name</label>
                    <SearchForm>
                        <SearchInput
                            type="text"
                            name="first_name"
                            placeholder="First Name"
                            value={form.first_name}
                            onChange={(e) => handleInputChange(e)}
                        />
                        <ClearSearchButton>ㅤ</ClearSearchButton>
                    </SearchForm>
                    <div style={{ color: '#F875AA', fontSize: '0.8rem' }}>{formErrors.first_name}</div>
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
                        form.phones.map((item: Phone, index: number) => {
                            return (
                                <div style={{ display: 'flex', alignItems: 'center', }} key={index}>
                                    <SearchInput
                                        type="text"
                                        value={item.number}
                                        placeholder="Nomor" onChange={(e) => changePhones(index, e.target.value)}></SearchInput>
                                    {
                                        (index > 0 && !id) &&
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
                    {
                        (!id) && <div style={{ textAlign: 'right' }}>
                            <AddButton onClick={() => setForm({ ...form, phones: [...form.phones, { number: '' }] })}>+</AddButton>
                        </div>
                    }
                    <Button onClick={() => handleSubmit()} disabled={!form.first_name}>{loading ? 'Adding contact...' : id ? 'Save Changes' : 'Add Contact'}</Button>
                </div>
            </Modal>
        </div>
    )
}

export default CreateContact