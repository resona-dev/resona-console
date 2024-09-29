"use client";

import { client } from "./client/services.gen";
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  createOneTimeJobMutation,
  getAllJobsOptions,
} from "./client/@tanstack/react-query.gen";
import { DataTable } from "./data-table";
import { columns } from "./columns";

client.setConfig({ baseUrl: "http://127.0.0.1:8000/" });
const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Home />
    </QueryClientProvider>
  );
}

function Home() {
  const queryClient = useQueryClient();
  const { isLoading, error, data: jobs } = useQuery({ ...getAllJobsOptions() });

  const onCreateCallback = async () => {
    addCallbackMutation.mutate({
      body: {
        request: {
          url: "http://localhost:3000/api/callback",
          method: "POST",
        },
        delay: 500,
      },
    });
  };

  const addCallbackMutation = useMutation({
    ...createOneTimeJobMutation(),
    onError: (error) => console.log(error),
  });

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <Button onClick={onCreateCallback}>+ Create new Callback</Button>
        <div className="container mx-auto py-4">
          <DataTable columns={columns} data={jobs!} />
        </div>
      </main>
    </div>
  );
}
