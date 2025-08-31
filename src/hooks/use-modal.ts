import { useCallback, useState } from 'react';

interface UseModalProps {
  onSave: (value: string) => void;
  initialValue?: string;
  validator?: (value: string) => boolean;
}

interface UseModalReturn {
  isOpen: boolean;
  tempValue: string;
  isValid: boolean;
  openModal: () => void;
  closeModal: () => void;
  handleValueChange: (value: string) => void;
  handleSave: () => void;
  handleCancel: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
}

export const useModal = ({
  onSave,
  initialValue = '',
  validator = (value: string) => value.trim().length > 0
}: UseModalProps): UseModalReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(initialValue);

  const isValid = validator(tempValue);

  const openModal = useCallback(() => {
    setTempValue(initialValue);
    setIsOpen(true);
  }, [initialValue]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setTempValue('');
  }, []);

  const handleValueChange = useCallback((value: string) => {
    setTempValue(value);
  }, []);

  const handleSave = useCallback(() => {
    if (isValid) {
      onSave(tempValue.trim());
      closeModal();
    }
  }, [isValid, tempValue, onSave, closeModal]);

  const handleCancel = useCallback(() => {
    closeModal();
  }, [closeModal]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSave();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      handleCancel();
    }
  }, [handleSave, handleCancel]);

  return {
    isOpen,
    tempValue,
    isValid,
    openModal,
    closeModal,
    handleValueChange,
    handleSave,
    handleCancel,
    handleKeyDown,
  };
};
