import React from 'react';
import Modal from './Modal';
import Button from './Button';

const ConfirmModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed?",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger", // 'danger' | 'primary'
  loading = false
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="max-w-md">
      <div className="space-y-6">
        <p className="text-slate-600 font-medium leading-relaxed">
          {message}
        </p>
        
        <div className="flex gap-3 pt-2">
          <Button 
            variant="outline-secondary" 
            className="flex-1 !rounded-2xl" 
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button 
            variant={variant === 'danger' ? 'danger' : 'primary'}
            className="flex-1 !rounded-2xl shadow-lg border-none" 
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
