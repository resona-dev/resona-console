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
    let { interval: updateInterval, timeout } =
      determineUpdateInterval(targetTime);

    setTimeout(() => {
      interval = setInterval(() => {
        setTimeDiffString(remainingTimeString(targetTime));
        const { interval: newInterval } =
          determineUpdateInterval(targetTime);
        if (newInterval !== updateInterval) {
          clearInterval(interval);
          interval = setInterval(() => {
            setTimeDiffString(remainingTimeString(targetTime));
          }, newInterval);
          updateInterval = newInterval;
        }
      }, 1000);
    }, timeout);

    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <span className={className} {...props}>
      {timeDiffString}
    </span>
  );
}
