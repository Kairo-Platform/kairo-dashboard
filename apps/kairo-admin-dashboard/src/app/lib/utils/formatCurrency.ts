export const formatCurrency = ({
  amount = 0,
  symbol = "",
  decimalPlaces = 0,
} = {}) => {
  const formattedAmount = Number(amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces || 2,
  });
  if (symbol) return `${symbol}${formattedAmount}`;
  return formattedAmount;
};

export default formatCurrency;
