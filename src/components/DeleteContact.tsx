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
      const { data } = await deleteItem({
        variables: { id },
      });
      if (data?.deleteItem.success) {
        deleted()
      } else {
        deleted()
      }
    } catch (error) {
      // Handle any errors that occurred during the mutation.
    }
  };

  return (
    <Button onClick={handleDelete} disabled={loading}>
      {loading ? 'Deleting...' : 'Delete'}
    </Button>
  );
};

export default DeleteItemButton;
