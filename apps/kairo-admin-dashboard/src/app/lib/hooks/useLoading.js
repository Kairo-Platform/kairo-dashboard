import { useState } from "react";

export const useLoading = (initialState = false) => {
  const [loading, setLoading] = useState(initialState);
  const startLoading = () => setLoading(true);
  const stopLoading = () => setLoading(false);

  return {
    loading,
    startLoading,
    stopLoading,
  };
};

export default useLoading;
