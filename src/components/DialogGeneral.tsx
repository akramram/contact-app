import React from 'react';
import styled from '@emotion/styled';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: any;
}

const Overlay = styled.div`
  background: rgba(0, 0, 0, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  position: relative;
  background: #04364A;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <Overlay id='modal-overlay'>
            <ModalContent id='modal-content'>
                {children}
                <button style={{
                    color: '#fff',
                    background: 'transparent',
                    position: 'absolute',
                    border: 0,
                    top: '10px',
                    right: '10px',
                    cursor: 'pointer',
                }} onClick={onClose}>X</button>
            </ModalContent>
        </Overlay>
    );
};

export default Modal;
