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
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Edit,
  Edit2Icon,
  PauseIcon,
  TrashIcon,
  PlayIcon,
} from "lucide-react";
import { Countdown } from "./countdown";
import { JobStatusBadge } from "./job-status-badge";
import { Pagination, PaginationContent, PaginationItem } from "./ui/pagination";
import { JobTypeBadge } from "./job-type-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Separator } from "./ui/separator";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllJobsQueryKey,
  pauseJobMutation,
  removeJobMutation,
  resumeJobMutation,
} from "@/client/@tanstack/react-query.gen";

export interface JobCardProps extends React.HTMLAttributes<HTMLDivElement> {
  job: ScheduledJob;
}

export function JobCard({ className, job, ...props }: JobCardProps) {
  const queryClient = useQueryClient();

  const onPause = async () => {
    onPauseJobMutation.mutate({ path: { job_id: job.id } });
  };

  const onPauseJobMutation = useMutation({
    ...pauseJobMutation(),
    onError: (error) => console.log(error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getAllJobsQueryKey() });
    },
  });

  const onResume = async () => {
    onResumeJobMutation.mutate({ path: { job_id: job.id } });
  };

  const onResumeJobMutation = useMutation({
    ...resumeJobMutation(),
    onError: (error) => console.log(error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getAllJobsQueryKey() });
    },
  });

  const onRemove = async () => {
    onRemoveJobMutation.mutate({ path: { job_id: job.id } });
  };

  const onRemoveJobMutation = useMutation({
    ...removeJobMutation(),
    onError: (error) => console.log(error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getAllJobsQueryKey() });
    },
  });

  let cronExpression = "";
  if (job.trigger.type === "cron") {
    const fields = job.trigger.fields as { [key: string]: string };
    cronExpression = `${fields.minute} ${fields.hour} ${fields.day} ${fields.month} ${fields.day_of_week}`;
  }

  return (
    <Card className="overflow-hidden" x-chunk="dashboard-05-chunk-4" {...props}>
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
        <div className="ml-auto flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8 cursor-pointer"
              >
                <MoreVertical className="h-3.5 w-3.5" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Edit2Icon className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={job.status === "paused" ? onResume : onPause}
              >
                {job.status === "paused" ? (
                  <>
                    <PlayIcon className="h-4 w-4 mr-2" />
                    Resume
                  </>
                ) : (
                  <>
                    <PauseIcon className="h-4 w-4 mr-2" />
                    Pause
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer focus:bg-destructive focus:text-destructive-foreground"
                onClick={onRemove}
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
            <li className="flex items-center justify-between">
              <span className="text-muted-foreground">Next Run Time</span>
              <div>
                <span>{job.next_run_time}</span>
                <span className="text-muted-foreground block text-right">
                  in <Countdown targetTime={job.next_run_time!} />
                </span>
              </div>
            </li>
          </ul>
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
          Updated <time dateTime="2023-11-23">November 23, 2023</time>
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
