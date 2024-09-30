"use client";

import { client } from "../client/services.gen";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  createJobMutation,
  getAllJobsOptions,
  getAllJobsQueryKey,
} from "../client/@tanstack/react-query.gen";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { PanelLeft, Settings, Home, Monitor } from "lucide-react";

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

client.setConfig({ baseUrl: "http://127.0.0.1:8000/" });
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Dashboard />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function Dashboard() {
  const queryClient = useQueryClient();
  const { isLoading, error, data: jobs } = useQuery({ ...getAllJobsOptions() });
  const [selectedJobId, setSelectedJobId] = React.useState<string | null>();

  const onCreateCallback = async () => {
    addCallbackMutation.mutate({
      body: {
        request: {
          url: "http://localhost:3000/api/callback",
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: { message: "Hello World", timestamp: new Date().toISOString() },
        },
        trigger: {
          cron: "* * * * *",
        },
      },
    });
  };

  const addCallbackMutation = useMutation({
    ...createJobMutation(),
    onError: (error) => console.log(error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getAllJobsQueryKey() });
    },
  });

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
                  src=""
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
                  <Button onClick={onCreateCallback}>
                    Create New Callback
                  </Button>
                </CardFooter>
              </Card>
            </div>
            <Card x-chunk="dashboard-05-chunk-3">
              <CardHeader className="px-7">
                <CardTitle>Jobs</CardTitle>
                <CardDescription>
                  All currently registered jobs. They may have been scheduled by
                  calling the API or by using the dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable
                  columns={columns}
                  data={jobs ?? []}
                  onRowClick={(job) =>
                    setSelectedJobId(job.id == selectedJobId ? null : job.id)
                  }
                  isLoading={isLoading}
                ></DataTable>
              </CardContent>
            </Card>
          </div>
          <JobCard jobId={selectedJobId} x-chunk="dashboard-05-chunk-4" />
        </main>
      </div>
    </div>
  );
}
