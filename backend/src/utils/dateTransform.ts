export function stringToDate(dateString: string): Date {
   return new Date(dateString);
}

export function dateToString(date: Date): string {
   return date.toISOString().split('T')[0] || '';
}

export function dateTimeToString(date: Date): string {
   const isoString = date.toISOString();
   return isoString.replace('T', ' ').substring(0, 19);
}
