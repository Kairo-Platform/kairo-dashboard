import { useState } from "react";

export const useModal = (initialState = false) => {
  const [showModal, setShowModal] = useState(initialState);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const toggleModal = () => setShowModal(!showModal);

  return {
    showModal,
    setShowModal,
    openModal,
    closeModal,
    toggleModal,
  };
};

export default useModal;
