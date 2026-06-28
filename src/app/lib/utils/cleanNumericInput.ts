const DEFAULT_DECIMAL_PLACES = 3;

export const cleanNumericInput = (value = "") => {
  if (!value) return "";
  return (
    value
      .replace(/[^0-9.]/g, "")
      .replace(/(\..*)\./g, "$1")
      // .replace(/(\.[0-9]{1})./g, '$1')
      .replace(new RegExp(`(\\.[0-9]{${DEFAULT_DECIMAL_PLACES}}).`), "$1")
  );
};

export default cleanNumericInput;
