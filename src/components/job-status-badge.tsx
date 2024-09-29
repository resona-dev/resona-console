import { Badge } from "./ui/badge";
import { JobStatus } from "@/client/types.gen";

export interface JobStatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement> {
  status: JobStatus;
}

export function JobStatusBadge({
  className,
  status,
  ...props
}: JobStatusBadgeProps) {
  const mapping = {
    active: "success",
    paused: "info",
    failed: "destructive",
    pending: "warning",
    completed: "secondary",
  };

  const variant: any =
    Object.entries(mapping).find(([key, value]) => key === status)?.[1] ??
    "default";

  return (
    <Badge variant={variant} {...props} className={className}>
      {status}
    </Badge>
  );
}
