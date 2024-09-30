import { ScheduledJob } from "@/client/types.gen";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Edit2Icon,
  MoreVertical,
  PauseIcon,
  PlayIcon,
  TrashIcon,
} from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  pauseJobMutation,
  getAllJobsQueryKey,
  resumeJobMutation,
  removeJobMutation,
} from "@/client/@tanstack/react-query.gen";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export interface JobContextMenuProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof buttonVariants> {
  job: ScheduledJob;
}

export function JobContextMenu({
  className,
  job,
  variant,
}: JobContextMenuProps) {
  const queryClient = useQueryClient();

  const onPause = async () => {
    onPauseJobMutation.mutate({ path: { job_id: job.id } });
  };

  const onPauseJobMutation = useMutation({
    ...pauseJobMutation(),
    onMutate: (newJob) => {},
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          variant={variant ?? "outline"}
          className={cn("h-8 w-8 cursor-pointer", className)}
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
  );
}
