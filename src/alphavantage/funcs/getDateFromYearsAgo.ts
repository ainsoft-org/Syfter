export function getDateFromYearsAgo(yearsAgo) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const year = currentYear - yearsAgo;
  const month = currentDate.getMonth();
  const day = currentDate.getDate();
  const date = new Date(year, month, day);

  return date;
}