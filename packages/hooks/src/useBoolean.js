import { useState } from "react";

export const useBoolean = (defaultValue) => {
  const [value, setValue] = useState(!!defaultValue);

  const setTrue = () => setValue(true);
  const setFalse = () => setValue(false);
  const toggle = () => setValue((val) => !val);

  return { value, setValue, setTrue, setFalse, toggle };
};

export default useBoolean;
