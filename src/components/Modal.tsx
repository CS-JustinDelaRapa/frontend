import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';

interface ModalProps {
    open: boolean;
    children: React.ReactNode;
    onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ open, children, onClose }) => {
    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            PaperProps={{
                sx: {
                    borderRadius: "30px",
                    backgroundColor: "#34b4eb"
                } 
            }}
        >
            {children}
        </Dialog>
    );
};

export default Modal;