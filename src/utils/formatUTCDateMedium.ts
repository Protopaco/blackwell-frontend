/**
 * Formats a Date in ICU/CLDR "medium" date style, e.g. "Sep 7, 2026".
 * Renders in UTC rather than the browser's local timezone — the API returns
 * date-only values (no time component), which JS parses as UTC midnight;
 * formatting in local time can shift the displayed day backward for
 * timezones behind UTC.
 */
export const formatUTCDateMedium = (date: Date | undefined) => {
  if (!date) return '';
  return date.toLocaleDateString('en-US', { timeZone: 'UTC', dateStyle: 'medium' });
};

export default formatUTCDateMedium;
