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
  const variantMapping = {
    active: "success",
    paused: "info",
    pending: "warning",
    "completed-request-error": "destructive",
    "completed-response-error": "destructive",
    "completed-successful": "success",
  };

  const contentMapping = {
    active: "Active",
    paused: "Paused",
    pending: "Pending",
    "completed-request-error": "Request Error",
    "completed-response-error": "Response Error",
    "completed-successful": "Successful",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const variant: any =
    Object.entries(variantMapping).find(([key]) => key === status)?.[1] ??
    "default";

  const content: string =
    Object.entries(contentMapping).find(([key]) => key === status)?.[1] ??
    "Unknown";

  return (
    <Badge variant={variant} {...props} className={className}>
      {content}
    </Badge>
  );
}
