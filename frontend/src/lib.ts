import { Message } from './types';

const CONSTANT = {
  baseUrl: 'https://forumproject-backend.ts.r.appspot.com',
  baseUrl_local: 'http://localhost:3000',
};

const sortedMessages = (messages: Message[]) =>
  [...messages].sort((a, b) => {
    const dateA =
      a.posted_date._seconds * 1000 + a.posted_date._nanoseconds / 1000000;
    const dateB =
      b.posted_date._seconds * 1000 + b.posted_date._nanoseconds / 1000000;
    return dateB - dateA;
  });

const takeTen = (messages: Message[]) =>
  messages.length ? messages.slice(0, 10) : [];

const formatDate = (postedDate: { _seconds: number; _nanoseconds: number }) => {
  const date = new Date(
    postedDate._seconds * 1000 + postedDate._nanoseconds / 1000000
  );
  return date.toLocaleString(); // Formats the date and time based on locale
};

export { CONSTANT, formatDate, sortedMessages, takeTen };
