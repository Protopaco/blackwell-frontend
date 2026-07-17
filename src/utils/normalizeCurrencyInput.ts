const normalizeCurrencyInput = (value: string) => {
  if (!value || Number.isNaN(Number(value))) return value;
  return Number(value).toFixed(2);
};

export default normalizeCurrencyInput;
