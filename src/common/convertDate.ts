export function toISO(date: Date): string {
  return date.toISOString().replaceAll("-", "").replaceAll(":", "").replace("Z", "").slice(0, 13);
}

export function toDate(ISOString: string): Date {
  const iso = ISOString.replaceAll("-", "").replaceAll(":", "").replace("Z", "").slice(0, 13);
  const year = Number(iso.slice(0, 4));
  const month = Number(iso.slice(4, 6))-1;
  const day = Number(iso.slice(6, 8));
  const hour = Number(iso.slice(9, 11));
  const minute = Number(iso.slice(11, 13));

  const date = new Date();
  date.setMilliseconds(0);
  date.setSeconds(0);
  date.setMinutes(minute);
  date.setHours(hour);
  date.setDate(day);
  date.setMonth(month);
  date.setFullYear(year);

  return date;
}