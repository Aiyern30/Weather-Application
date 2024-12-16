export const formatTime = (datetime: string): string => {
  const date = new Date(datetime);

  // Format date to "MMM DD, HH:mm" (e.g., "Dec 13, 00:00")
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  return date.toLocaleString(undefined, options);
};
