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

export const generateRandomColor = () => {
  // Generate darker colors by limiting the random range to lower values
  const r = Math.floor(Math.random() * 128); // 0-127 (darker values)
  const g = Math.floor(Math.random() * 128); // 0-127 (darker values)
  const b = Math.floor(Math.random() * 128); // 0-127 (darker values)
  const alpha = 0.6; // Transparency for the background
  return {
    backgroundColor: `rgba(${r}, ${g}, ${b}, ${alpha})`,
    borderColor: `rgba(${r}, ${g}, ${b}, 1)`, // Solid color for the border
  };
};
