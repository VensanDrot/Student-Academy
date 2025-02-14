import { SetStateAction } from "react";

let timerInterval: NodeJS.Timeout | null = null;

export const startTimer = (setTime: React.Dispatch<SetStateAction<number>>) => {
  stopTimer();
  timerInterval = setInterval(() => {
    setTime((prevTime) => {
      if (prevTime <= 0) {
        stopTimer(); // Stop the timer when it reaches 0
        return 0;
      }
      return prevTime - 1; // Decrease the time by 1 second
    });
  }, 1000);
};

export const stopTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null; // Reset the interval reference
  }
};
