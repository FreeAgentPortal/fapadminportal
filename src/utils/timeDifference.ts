export const timeDifference = (current: any, previous: any) => {
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;

  const elapsed = current - previous;

  switch (true) {
    case elapsed < msPerMinute:
      return elapsed / 1000 < 30
        ? "Just now"
        : `${Math.round(elapsed / 1000)} seconds ago`;

    case elapsed < msPerHour:
      return `${Math.round(elapsed / msPerMinute)} minutes ago`;

    case elapsed < msPerDay:
      return `${Math.round(elapsed / msPerHour)} hours ago`;

    default:
      // Return formatted date string for items older than "1 day ago"
      return new Date(previous).toLocaleDateString();
  }
};
