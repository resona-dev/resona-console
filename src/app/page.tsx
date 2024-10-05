"use client";

import {
  useQuery,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  getAllCompletedJobsOptions,
  getAllJobsOptions,
} from "../client/@tanstack/react-query.gen";
import { DataTable } from "../components/table/data-table";
import {
  columnsScheduled,
  scheduledJobsConfig,
} from "../components/table/columns-scheduled";
import * as React from "react";
import { PlusIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { JobCard } from "@/components/job-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  columnsCompleted,
  completedJobsConfig,
} from "@/components/table/columns-completed";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateJobDialog } from "@/components/create-job-dialog";


export interface SelectedJob {
  id: string;
  completedAt?: string;
}

export default function App() {
  const [open, setOpen] = React.useState(false);
  const {
    isLoading,
    error,
    data: jobs,
    refetch,
  } = useQuery({ ...getAllJobsOptions() });
  const {
    isLoading: isLoadingCompletedJobs,
    error: completedJobsError,
    data: completedJobs,
    refetch: refetchCompletedJobs,
  } = useQuery({ ...getAllCompletedJobsOptions() });
  const [selectedJob, setSelectedJob] = React.useState<SelectedJob>();

  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
      <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
        <div className="">
          <Card className="" x-chunk="dashboard-05-chunk-0">
            <CardHeader className="pb-3">
              <CardTitle>Your Jobs</CardTitle>
              <CardDescription className="text-balance max-w-lg leading-relaxed">
                Create and manage your jobs. Jobs can be scheduled to run at
                specific times or intervals.
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusIcon className="h-4 w-4 mr-2" /> Create new Job
                  </Button>
                </DialogTrigger>
                <CreateJobDialog setIsOpen={setOpen} />
              </Dialog>
            </CardFooter>
          </Card>
        </div>
        <Tabs defaultValue="scheduled">
          <TabsList>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>
          <TabsContent value="scheduled">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Scheduled Jobs</CardTitle>
                <CardDescription>
                  All currently registered jobs. They may have been scheduled by
                  calling the API or by using the dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={columnsScheduled}
                  data={jobs ?? []}
                  onRowClick={(job) =>
                    setSelectedJob(
                      selectedJob?.id === job.id &&
                        selectedJob.completedAt === job.result?.completed_at
                        ? undefined
                        : {
                            id: job.id,
                            completedAt: job.result?.completed_at,
                          }
                    )
                  }
                  isLoading={isLoading}
                  config={scheduledJobsConfig}
                  refetch={refetch}
                ></DataTable>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="completed">
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Completed Jobs</CardTitle>
                <CardDescription>
                  All jobs that have been completed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={columnsCompleted}
                  data={completedJobs ?? []}
                  onRowClick={(job) =>
                    setSelectedJob(
                      selectedJob?.id === job.id &&
                        selectedJob.completedAt === job.result?.completed_at
                        ? undefined
                        : {
                            id: job.id,
                            completedAt: job.result?.completed_at,
                          }
                    )
                  }
                  isLoading={isLoadingCompletedJobs}
                  config={completedJobsConfig}
                  refetch={refetchCompletedJobs}
                ></DataTable>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <JobCard job={selectedJob} x-chunk="dashboard-05-chunk-4" />
    </main>
  );
}
