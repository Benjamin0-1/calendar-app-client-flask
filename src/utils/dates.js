import { format, isBefore, parseISO, startOfToday } from 'date-fns';

// Booking dates come from the server as strings. Turn them into a local Date for display.
// Returns null when the value can't be parsed, so callers can fall back to the raw string.
export const parseBookingDate = (value) => {
    if (!value) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return parseISO(value);

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return null;
    // Server dates carry no meaningful time; read them in UTC so they don't shift a day in negative-offset timezones.
    return new Date(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate());
};

// yyyy-MM-dd, the format <input type="date"> expects.
export const toDateInputValue = (value) => {
    const date = parseBookingDate(value);
    return date ? format(date, 'yyyy-MM-dd') : '';
};

export const isPastDate = (date) => isBefore(date, startOfToday());
