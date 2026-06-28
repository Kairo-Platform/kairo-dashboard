import { useState } from "react";
import { ConfirmationModal } from "@/app/components/ui/Modal";

export const useConfirmModal = (initialState = false) => {
  const [showConfirmModal, setShowConfirmModal] = useState(initialState);

  const openConfirmModal = () => setShowConfirmModal(true);
  const closeConfirmModal = () => setShowConfirmModal(false);
  const ConfirmModal = ({
    title,
    children,
    style,
    cancelButtonClasses,
    confirmButtonClasses,
    cancelButtonText,
    confirmButtonText,
    onCancel,
    onConfirm,
    closeOnConfirm,
    asForm,
  }) => {
    if (showConfirmModal) {
      return ConfirmationModal({
        title,
        children,
        style,
        cancelButtonClasses,
        confirmButtonClasses,
        cancelButtonText,
        confirmButtonText,
        onClose: closeConfirmModal,
        onCancel,
        onConfirm,
        closeOnConfirm,
        asForm,
      });
    }
    return null;
  };

  return {
    showConfirmModal,
    // setShowConfirmModal,
    openConfirmModal,
    closeConfirmModal,
    ConfirmModal,
  };
};

export default useConfirmModal;
