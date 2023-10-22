
import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import { MockedProvider } from '@apollo/client/testing';
import Modal from './components/DialogGeneral';
import DeleteItemButton from './components/DeleteContact';
import CreateContact from './components/CreateContact';
import ContactList from './components/ContactList';
import { Button } from './components/Button';
import { ADD_CONTACT_WITH_PHONES, EDIT_CONTACT_BY_ID, EDIT_CONTACT_PHONE_NUMBER, GET_CONTACT_LIST, DELETE_CONTACT } from './queries';

// Button General Test
describe('Button Component', () => {
  it('renders the button with provided text', () => {
    const { getByText } = render(<Button onClick={() => {}}>Click Me</Button>);
    const button = getByText('Click Me');
    expect(button).toBeInTheDocument();
  });

  it('disables the button when the "disabled" prop is true', () => {
    const { getByText } = render(<Button onClick={() => {}} disabled={true}>Click Me</Button>);
    const button = getByText('Click Me');

    expect(button).toBeDisabled();
  });

  it('enables the button when the "disabled" prop is false', () => {
    const { getByText } = render(<Button onClick={() => {}} disabled={false}>Click Me</Button>);
    const button = getByText('Click Me');

    expect(button).not.toBeDisabled();
  });
});

// Dialog General Test 
describe('Modal Component', () => {
  it('does not render the modal when isOpen is false', () => {
    const { queryByTestId } = render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );

    const modalOverlay = queryByTestId('modal-overlay');
    const modalContent = queryByTestId('modal-content');

    expect(modalOverlay).toBeNull();
    expect(modalContent).toBeNull();
  });

  it('calls onClose when close button is clicked', () => {
    const onCloseMock = jest.fn();
    const { getByText } = render(
      <Modal isOpen={true} onClose={onCloseMock}>
        <div>Modal Content</div>
      </Modal>
    );

    const closeButton = getByText('X');
    fireEvent.click(closeButton);
  });
});


// Delete Button Test 
const id = 123; // Sample ID for testing

const mocks = [
  {
    request: {
      query: DELETE_CONTACT,
      variables: {
        id,
      },
    },
    result: {
      data: {
        // Your expected response data after deletion
      },
    },
  },
];

describe('DeleteItemButton Component', () => {
  it('renders the button', () => {
    const { getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DeleteItemButton id={id} deleted={() => {}} />
      </MockedProvider>
    );

    const deleteButton = getByText('Delete');
    expect(deleteButton).toBeInTheDocument();
  });

  it('displays "Deleting..." when clicked', async () => {
    const { getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DeleteItemButton id={id} deleted={() => {}} />
      </MockedProvider>
    );

    const deleteButton = getByText('Delete');

    fireEvent.click(deleteButton);

    // Wait for the "Deleting..." text to appear
    await waitFor(() => getByText('Deleting...'));
  });

  it('calls the deleted callback after successful deletion', async () => {
    const deletedCallback = jest.fn();

    const { getByText } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <DeleteItemButton id={id} deleted={deletedCallback} />
      </MockedProvider>
    );

    const deleteButton = getByText('Delete');

    fireEvent.click(deleteButton);

    // Wait for the "Deleting..." text to appear
    await waitFor(() => getByText('Deleting...'));

    // Wait for the deleted callback to be called
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
  });
});

// Create Contact Test 
const mockAddContact= [
  {
    request: {
      query: ADD_CONTACT_WITH_PHONES,
      variables: {
        // Provide the expected variables for ADD_CONTACT_WITH_PHONES mutation
      },
    },
    result: {
      data: {
        // Your expected response data after adding a contact
      },
    },
  },
  {
    request: {
      query: EDIT_CONTACT_BY_ID,
      variables: {
        // Provide the expected variables for EDIT_CONTACT_BY_ID mutation
      },
    },
    result: {
      data: {
        // Your expected response data after editing a contact
      },
    },
  },
  {
    request: {
      query: EDIT_CONTACT_PHONE_NUMBER,
      variables: {
        // Provide the expected variables for EDIT_CONTACT_PHONE_NUMBER mutation
      },
    },
    result: {
      data: {
        // Your expected response data after editing phone numbers
      },
    },
  },
];

const mockedContactListQueryCreate = {
  request: {
    query: GET_CONTACT_LIST,
    variables: {
      limit: 1,
      where: {
        first_name: { _like: 'Test Name' }, // Replace with the value used in your test
      },
    },
  },
  result: {
    data: {
      contact: [] // Empty array to simulate a unique name
    },
  },
};

describe('CreateContact Component', () => {
  it('renders the "Add Contact" button', () => {
    const { getByText } = render(
      <MockedProvider mocks={[mockedContactListQueryCreate]} addTypename={false}>
        <CreateContact onClose={() => {}} />
      </MockedProvider>
    );

    const addButton = getByText('Add Contact');
    expect(addButton).toBeInTheDocument();
  });

  it('displays "Adding contact..." while loading',() => {
    const { getByText } = render(
      <MockedProvider mocks={mockAddContact} addTypename={false}>
        <CreateContact onClose={() => {}} />
      </MockedProvider>
    );

    const addButton = getByText('Add Contact');
    fireEvent.click(addButton);
  });

  it('calls the submit function on button click', () => {
    const submitCallback = jest.fn();

    const { getByText } = render(
      <MockedProvider mocks={mockAddContact} addTypename={false}>
        <CreateContact onClose={submitCallback} />
      </MockedProvider>
    );

    const addButton = getByText('Add Contact');
    fireEvent.click(addButton);
  });
});
