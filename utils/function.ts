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

export const generateRandomColor = ({
  darkMode = false,
}: { darkMode?: boolean } = {}) => {
  const getRandomValue = () => Math.floor(Math.random() * 255);
  const baseColor = darkMode ? 50 : 200; // Adjust base color for darker/lighter tones

  const randomColor = `rgba(${getRandomValue()}, ${getRandomValue()}, ${getRandomValue()}, 0.8)`;
  const adjustedColor = darkMode
    ? `rgba(${baseColor}, ${baseColor}, ${baseColor}, 0.8)` // Darker tone
    : `rgba(${255 - baseColor}, ${255 - baseColor}, ${255 - baseColor}, 0.8)`; // Lighter tone

  return {
    backgroundColor: randomColor,
    borderColor: adjustedColor,
  };
};
