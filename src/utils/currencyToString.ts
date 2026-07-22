type Options = {
  decorated?: boolean;
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const currencyToString = (value: number | string | undefined, options: Options = {}) => {
  if (value === undefined || value === '') return '';

  const numericValue = Number(value);
  if (Number.isNaN(numericValue)) return String(value);

  if (options.decorated) return currencyFormatter.format(numericValue);
  return numericValue.toFixed(2);
};

export default currencyToString;
