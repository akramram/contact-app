import React from 'react';
import { useMutation } from '@apollo/client';
import { DELETE_CONTACT } from '../queries';
import { Button } from './Button';

interface DeleteItemButtonProps {
    id?: number;
    deleted: () => void;
}

const DeleteItemButton: React.FC<DeleteItemButtonProps> = ({ id, deleted }) => {
    const [deleteItem, { loading }] = useMutation(DELETE_CONTACT);

    const handleDelete = async () => {
        try {
            await deleteItem({
                variables: { id },
            }).then(() => deleted());
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Button onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
        </Button>
    );
};

export default DeleteItemButton;
