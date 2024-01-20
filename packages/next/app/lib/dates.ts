import { parse } from 'date-fns';
import { format } from 'date-fns-tz'
import utcToZonedTime from 'date-fns-tz/utcToZonedTime'
import zonedTimeToUtc from 'date-fns-tz/zonedTimeToUtc'

const safeDateFormatString: string = "yyyyMMdd'T'HHmmss'Z'"
const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;


export function getSafeDate(date: string | Date): string {
  let dateString: string;
  
  if (typeof date === 'string') {
    const dateObject = utcToZonedTime(date, 'UTC');
    dateString = format(dateObject, safeDateFormatString, { timeZone: 'UTC' });
  } else {
    dateString = format(date, safeDateFormatString, { timeZone: 'UTC' });
  }

  return dateString;
}


export function getDateFromSafeDate(safeDate: string): Date {
  const date = parse(safeDate, safeDateFormatString, new Date())
  const utcDate = zonedTimeToUtc(date, 'UTC')
  return utcDate;
}


export function formatTimestamp(seconds: number = 0): string {
  return new Date(seconds * 1000).toISOString().slice(11, 19);
}

export function formatUrlTimestamp(timestampInSeconds: number): string {
  const hours = Math.floor(timestampInSeconds / 3600);
  const minutes = Math.floor((timestampInSeconds % 3600) / 60);
  const seconds = timestampInSeconds % 60;
  return `${hours}h${minutes}m${seconds}s`;
}

export function parseUrlTimestamp(timestamp: string): number | null {
  // Regular expression to match the "XhYmZs" format
  const regex = /^(\d+)h(\d+)m(\d+)s$/;
  const match = timestamp.match(regex);

  if (match) {
      const hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const seconds = parseInt(match[3], 10);

      if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
          return hours * 3600 + minutes * 60 + seconds;
      }
  }

  // If the format doesn't match or parsing fails, return null
  return null;
}