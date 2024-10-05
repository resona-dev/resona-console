"use client";

import { client } from "../client/services.gen";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  getAllCompletedJobsOptions,
  getAllJobsOptions,
} from "../client/@tanstack/react-query.gen";
import { DataTable } from "../components/table/data-table";
import {
  columns,
  scheduledJobsConfig,
} from "../components/table/columns-scheduled";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { PanelLeft, Settings, Home, Monitor, PlusIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { JobCard } from "@/components/job-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  columnsCompleted,
  completedJobsConfig,
} from "@/components/table/columns-completed";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { CreateJobDialog } from "@/components/create-job-dialog";

client.setConfig({ baseUrl: "http://127.0.0.1:8000/" });
const baseQueryClient = new QueryClient();

export interface SelectedJob {
  id: string;
  completedAt?: string;
}

export default function App() {
  return (
    <QueryClientProvider client={baseQueryClient}>
      <TooltipProvider>
        <Dashboard />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function Dashboard() {
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();
  const { isLoading, error, data: jobs, refetch } = useQuery({ ...getAllJobsOptions() });
  const {
    isLoading: isLoadingCompletedJobs,
    error: completedJobsError,
    data: completedJobs,
    refetch: refetchCompletedJobs,
  } = useQuery({ ...getAllCompletedJobsOptions() });
  const [selectedJob, setSelectedJob] = React.useState<SelectedJob>();

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <Link
            href="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Monitor className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Resona</span>
          </Link>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Home className="h-5 w-5" />
                <span className="sr-only">Dashboard</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Dashboard</TooltipContent>
          </Tooltip>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" className="sm:hidden">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <nav className="grid gap-6 text-lg font-medium">
                <Link
                  href="#"
                  className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                >
                  <Monitor className="h-5 w-5 transition-all group-hover:scale-110" />
                  <span className="sr-only">Resona</span>
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Dashboard
                </Link>
                <Link
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                >
                  <Settings className="h-5 w-5" />
                  Settings
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="overflow-hidden rounded-full ml-auto"
              >
                <Image
                  src="/user-avatar.png"
                  width={36}
                  height={36}
                  alt="Avatar"
                  className="overflow-hidden rounded-full"
                />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="">
              <Card className="" x-chunk="dashboard-05-chunk-0">
                <CardHeader className="pb-3">
                  <CardTitle>Your Scheduled Callbacks</CardTitle>
                  <CardDescription className="text-balance max-w-lg leading-relaxed">
                    Manage and Orchestrate your scheduled callbacks using this
                    interface.
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
                      All currently registered jobs. They may have been
                      scheduled by calling the API or by using the dashboard.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <DataTable
                      columns={columns}
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
      </div>
    </div>
  );
}
