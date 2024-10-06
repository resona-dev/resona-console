import { remainingTime, remainingTimeString } from "@/lib/utils";
import * as React from "react";

export interface CountdownProps extends React.HTMLAttributes<HTMLDivElement> {
  targetTime: Date | string | number;
}

function determineUpdateInterval(targetTime: Date | string | number) {
  const { seconds, totalMilliseconds } = remainingTime(targetTime);
  // More than 10 minutes remaining
  if (totalMilliseconds > 1000 * 60 * 10) {
    return {
      interval: 1000 * 60, // Update every minute
      timeout: seconds * 1000, // Start interval at the beginning of the next minute
    };
  }
  return {
    interval: 1000, // Update every second
    timeout: 0, // Start interval immediately
  };
}

export function Countdown({
  className,
  targetTime: targetTime,
  ...props
}: CountdownProps) {
  const [timeDiffString, setTimeDiffString] = React.useState(
    remainingTimeString(targetTime)
  );

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    let timeout: NodeJS.Timeout;
    const { interval: initialInterval, timeout: timeoutMs } = determineUpdateInterval(targetTime);
    let updateInterval = initialInterval;

    timeout = setTimeout(() => {
      interval = setInterval(() => {
        setTimeDiffString(remainingTimeString(targetTime));
        const { interval: newInterval } = determineUpdateInterval(targetTime);
        if (newInterval !== updateInterval) {
          clearInterval(interval);
          // The timeout makes sure all countdowns update at the same time
          timeout = setTimeout(() => {
            interval = setInterval(() => {
              setTimeDiffString(remainingTimeString(targetTime));
            }, newInterval);
            updateInterval = newInterval;
          }, Date.now() % 1000);
        }
      }, 1000);
    }, timeoutMs);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [targetTime]);

  return (
    <span className={className} {...props}>
      {timeDiffString}
    </span>
  );
}
