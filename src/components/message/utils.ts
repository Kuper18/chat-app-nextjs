import { differenceInCalendarDays, format } from 'date-fns';

export const getTimestamp = (date: Date) => {
  const difference = differenceInCalendarDays(new Date(), date);
  const timestamp = difference > 0
    ? format(date, 'dd MMM yyyy')
    : format(date, 'h:mm:ss bbb');

  return timestamp;
};
