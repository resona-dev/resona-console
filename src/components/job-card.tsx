import { ScheduledJob } from "@/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import {
  Copy,
  ChevronLeft,
  ChevronRight,
  SquareDashedMousePointer,
} from "lucide-react";
import { Countdown } from "./countdown";
import { JobStatusBadge } from "./job-status-badge";
import { Pagination, PaginationContent, PaginationItem } from "./ui/pagination";
import { JobTypeBadge } from "./job-type-badge";
import { Separator } from "./ui/separator";
import { JobContextMenu } from "./job-context-menu";
import { useQueryClient } from "@tanstack/react-query";
import {
  getAllCompletedJobsQueryKey,
  getAllJobsQueryKey,
} from "@/client/@tanstack/react-query.gen";
import { isCompleted } from "@/lib/utils";
import { SelectedJob } from "@/app/page";

export interface JobCardProps extends React.HTMLAttributes<HTMLDivElement> {
  job?: SelectedJob;
}

export function JobCard({ className, job, ...props }: JobCardProps) {
  if (!job) {
    return (
      <Card className="overflow-hidden" {...props}>
        <CardContent className="flex justify-center items-center p-32 text-muted-foreground flex-col gap-4">
          <SquareDashedMousePointer className="h-12 w-12" />
          <span className="text-center">Select a Job to view details.</span>
        </CardContent>
      </Card>
    );
  }

  const queryClient = useQueryClient();
  const jobData =
    queryClient
      .getQueryData<ScheduledJob[]>(getAllJobsQueryKey())
      ?.find((j) => j.id === job.id) ??
    queryClient
      .getQueryData<ScheduledJob[]>(getAllCompletedJobsQueryKey())
      ?.find(
        (j) => j.id === job.id && j.result?.completed_at === job.completedAt
      );

  if (!jobData) {
    return (
      <Card className="overflow-hidden" {...props}>
        <CardContent className="flex justify-center items-center p-32 text-muted-foreground">
          Job not found. Please refresh the page.
        </CardContent>
      </Card>
    );
  }

  let cronExpression = "";
  if (jobData.trigger.type === "cron") {
    const fields = jobData.trigger.fields;
    cronExpression = `${fields.minute} ${fields.hour} ${fields.day} ${fields.month} ${fields.day_of_week}`;
  }

  return (
    <Card className="overflow-hidden" {...props}>
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="flex items-center gap-2 text-lg">
            Job {jobData.id}
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6"
              onClick={() => navigator.clipboard.writeText(jobData.id ?? "")}
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy Job ID</span>
            </Button>
          </CardTitle>
          <CardDescription>
            <JobStatusBadge status={jobData.status} />
          </CardDescription>
        </div>
        {!isCompleted(jobData) && (
          <div className="ml-auto flex items-center gap-1">
            <JobContextMenu job={jobData} />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Details</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">ID</span>
              <code>{jobData.id}</code>
            </li>
            {jobData.name && (
              <li className="flex items-start gap-8 justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="text-right">{jobData.name}</span>
              </li>
            )}
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Type</span>
              <JobTypeBadge type={jobData.trigger.type} />
            </li>
            {jobData.trigger.type === "cron" && (
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Cron Expression</span>
                <code>{cronExpression}</code>
              </li>
            )}
            {!isCompleted(jobData) && (
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Next Run Time</span>
                <div>
                  {jobData.next_run_time ? (
                    <>
                      <span>
                        {new Date(jobData.next_run_time).toLocaleString()}
                      </span>
                      <span className="text-muted-foreground block text-right">
                        in <Countdown targetTime={jobData.next_run_time!} />
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </div>
              </li>
            )}
            {isCompleted(jobData) && (
              <>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed At</span>
                  <div>
                    <span>
                      {new Date(jobData.result?.completed_at!).toLocaleString()}
                    </span>
                  </div>
                </li>

                {jobData.result?.error_message && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Error Message</span>
                    <div>
                      <span>{jobData.result?.error_message}</span>
                    </div>
                  </li>
                )}
              </>
            )}
          </ul>
          {isCompleted(jobData) && (
            <>
              <Separator className="my-2" />
              <div className="font-semibold">Response</div>
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status Code</span>
                  <span>{jobData.result?.response.status_code}</span>
                </li>
                <li className="flex flex-col  justify-between">
                  <span className="text-muted-foreground">Headers</span>
                  <pre className="block">
                    {JSON.stringify(jobData.result?.response.headers, null, 2)}
                  </pre>
                </li>
                <li className="flex flex-col  justify-between">
                  <span className="text-muted-foreground">Body</span>
                  <pre className="block">
                    {JSON.stringify(jobData.result?.response.body, null, 2)}
                  </pre>
                </li>
              </ul>
            </>
          )}
          <Separator className="my-2" />
          <div className="font-semibold">Scheduled Request</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">URL</span>
              <span>{jobData.request.url}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Method</span>
              <span>{jobData.request.method}</span>
            </li>
            <li className="flex flex-col  justify-between">
              <span className="text-muted-foreground">Headers</span>
              <pre className="block">
                {JSON.stringify(jobData.request.headers, null, 2)}
              </pre>
            </li>
            <li className="flex flex-col  justify-between">
              <span className="text-muted-foreground">Body</span>
              <pre className="block">
                {JSON.stringify(jobData.request.body, null, 2)}
              </pre>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Created{" "}
          <time dateTime={jobData.created_at}>
            {new Date(jobData.created_at).toLocaleString()}
          </time>
        </div>
      </CardFooter>
    </Card>
  );
}
