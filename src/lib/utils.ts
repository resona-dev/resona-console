import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface RemainingTime {
  seconds: number;
  minutes: number;
  hours: number;
  days: number;
  totalMilliseconds: number;
}

export function remainingTime(
  target_time: Date | string | number
): RemainingTime {
  const target = new Date(target_time);
  const diff = target.getTime() - Date.now();
  return {
    seconds: Math.floor((diff % (1000 * 60)) / 1000),
    minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    days: Math.floor(diff / 1000 / 60 / 60 / 24),
    totalMilliseconds: diff,
  };
}

export function remainingTimeString(time: Date | string | number) {
  const { days, hours, minutes, seconds } = remainingTime(time);

  let newTimeDiffString = "";
  if (days > 0) {
    newTimeDiffString += `${days}d `;
  }
  if (hours > 0) {
    newTimeDiffString += `${hours}h `;
  }
  if (minutes > 0) {
    newTimeDiffString += `${minutes}m `;
  }
  if (seconds > 0 && minutes < 10 && days == 0 && hours == 0) {
    newTimeDiffString += `${seconds}s`;
  }
  if (newTimeDiffString === "") {
    newTimeDiffString = "< 1s";
  }

  return newTimeDiffString;
}
