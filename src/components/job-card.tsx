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
import { Copy, ChevronLeft, ChevronRight } from "lucide-react";
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

export interface JobCardProps extends React.HTMLAttributes<HTMLDivElement> {
  jobId: string | undefined | null;
}

export function JobCard({ className, jobId, ...props }: JobCardProps) {
  if (!jobId) {
    return (
      <Card className="overflow-hidden" {...props}>
        <CardContent className="flex justify-center items-center p-32 text-muted-foreground">
          Select a Job to view details.
        </CardContent>
      </Card>
    );
  }

  const queryClient = useQueryClient();
  const job =
    queryClient
      .getQueryData<ScheduledJob[]>(getAllJobsQueryKey())
      ?.find((j) => j.id === jobId) ??
    queryClient
      .getQueryData<ScheduledJob[]>(getAllCompletedJobsQueryKey())
      ?.find((j) => j.id === jobId);

  if (!job) {
    return (
      <Card className="overflow-hidden" {...props}>
        <CardContent className="flex justify-center items-center p-32 text-muted-foreground">
          Job not found. Please refresh the page.
        </CardContent>
      </Card>
    );
  }

  let cronExpression = "";
  if (job.trigger.type === "cron") {
    const fields = job.trigger.fields as { [key: string]: string };
    cronExpression = `${fields.minute} ${fields.hour} ${fields.day} ${fields.month} ${fields.day_of_week}`;
  }

  return (
    <Card className="overflow-hidden" {...props}>
      <CardHeader className="flex flex-row items-start bg-muted/50">
        <div className="grid gap-0.5">
          <CardTitle className="flex items-center gap-2 text-lg">
            Job {job.id}
            <Button
              size="icon"
              variant="outline"
              className="h-6 w-6"
              onClick={() => navigator.clipboard.writeText(job.id ?? "")}
            >
              <Copy className="h-3 w-3" />
              <span className="sr-only">Copy Job ID</span>
            </Button>
          </CardTitle>
          <CardDescription>
            <JobStatusBadge status={job.status} />
          </CardDescription>
        </div>
        {!isCompleted(job) && (
          <div className="ml-auto flex items-center gap-1">
            <JobContextMenu job={job} />
          </div>
        )}
      </CardHeader>
      <CardContent className="p-6 text-sm">
        <div className="grid gap-3">
          <div className="font-semibold">Details</div>
          <ul className="grid gap-3">
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Type</span>
              <JobTypeBadge type={job.trigger.type} />
            </li>
            {job.trigger.type === "cron" && (
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Cron Expression</span>
                <code>{cronExpression}</code>
              </li>
            )}
            {!isCompleted(job) && (
              <li className="flex items-center justify-between">
                <span className="text-muted-foreground">Next Run Time</span>
                <div>
                  {job.next_run_time ? (
                    <>
                      <span>
                        {new Date(job.next_run_time).toLocaleString()}
                      </span>
                      <span className="text-muted-foreground block text-right">
                        in <Countdown targetTime={job.next_run_time!} />
                      </span>
                    </>
                  ) : (
                    <span className="text-muted-foreground">N/A</span>
                  )}
                </div>
              </li>
            )}
            {isCompleted(job) && (
              <>
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Completed At</span>
                  <div>
                    <span>
                      {new Date(job.result?.completed_at!).toLocaleString()}
                    </span>
                  </div>
                </li>

                {job.result?.error_message && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Error Message</span>
                    <div>
                      <span>{job.result?.error_message}</span>
                    </div>
                  </li>
                )}
              </>
            )}
          </ul>
          {isCompleted(job) && (
            <>
              <Separator className="my-2" />
              <div className="font-semibold">Response</div>
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status Code</span>
                  <span>{job.result?.response.status_code}</span>
                </li>
                <li className="flex flex-col  justify-between">
                  <span className="text-muted-foreground">Headers</span>
                  <pre className="block">
                    {JSON.stringify(job.result?.response.headers, null, 2)}
                  </pre>
                </li>
                <li className="flex flex-col  justify-between">
                  <span className="text-muted-foreground">Body</span>
                  <pre className="block">
                    {JSON.stringify(job.result?.response.body, null, 2)}
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
              <span>{job.request.url}</span>
            </li>
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Method</span>
              <span>{job.request.method}</span>
            </li>
            <li className="flex flex-col  justify-between">
              <span className="text-muted-foreground">Headers</span>
              <pre className="block">
                {JSON.stringify(job.request.headers, null, 2)}
              </pre>
            </li>
            <li className="flex flex-col  justify-between">
              <span className="text-muted-foreground">Body</span>
              <pre className="block">
                {JSON.stringify(job.request.body, null, 2)}
              </pre>
            </li>
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
        <div className="text-xs text-muted-foreground">
          Created{" "}
          <time dateTime={job.created_at}>
            {new Date(job.created_at).toLocaleString()}
          </time>
        </div>
        <Pagination className="ml-auto mr-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronLeft className="h-3.5 w-3.5" />
                <span className="sr-only">Previous Job</span>
              </Button>
            </PaginationItem>
            <PaginationItem>
              <Button size="icon" variant="outline" className="h-6 w-6">
                <ChevronRight className="h-3.5 w-3.5" />
                <span className="sr-only">Next Job</span>
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
