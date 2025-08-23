import { useState } from 'react';

export const useDebouncedLock = (delayMs = 1200) => {
  const [locked, setLocked] = useState(false);
  const acquire = () => {
    if (locked) return false;
    setLocked(true);
    setTimeout(() => setLocked(false), delayMs);
    return true;
  };
  return { locked, acquire };
};