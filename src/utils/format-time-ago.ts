export default function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const secondsAgo = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  let counter;
  for (const [unit, seconds] of Object.entries(intervals)) {
    counter = Math.floor(secondsAgo / seconds);
    if (counter > 0) {
      return `${counter} ${unit}${counter === 1 ? '' : 's'} ago`;
    }
  }

  if (secondsAgo < 60) {
    return 'just now';
  }

  return dateString; // Fallback to original date
}
