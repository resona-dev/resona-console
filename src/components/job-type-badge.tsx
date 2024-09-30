import { Badge } from "./ui/badge";
import { TriggerType } from "@/client/types.gen";

export interface JobTypeBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  type: TriggerType;
}

export function JobTypeBadge({
  className,
  type,
  ...props
}: JobTypeBadgeProps) {

  const mapping: {[key: string]: TriggerType} = {
    "One Time": "one-time",
    "Cron": "cron",
  };

  const text: any =
    Object.entries(mapping).find(([key, value]) => value === type)?.[0] ?? "Unknown";

  return (
    <Badge variant="secondary" {...props} className={className}>
      {text}
    </Badge>
  );
}
