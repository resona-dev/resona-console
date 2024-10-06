"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { TimePicker } from "./date-time-picker/time-picker";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createJobMutation,
  getAllJobsQueryKey,
  updateJobMutation,
} from "@/client/@tanstack/react-query.gen";
import { ScheduledJob } from "@/client";
import { toast } from "sonner";
import { AsyncButton } from "./async-button";

const METHODS = ["GET", "POST", "PUT", "DELETE", "UPDATE"] as const;

const formSchema = z
  .object({
    id: z.string().optional(),
    name: z.string().optional(),
    url: z.string().url(),
    method: z.enum(METHODS).default("GET"),
    headers: z.string().optional(),
    body: z.string().optional(),
    triggerType: z.enum(["one-time", "cron"]),
    cronExpression: z.string().optional(),
    delay: z
      .string()
      .refine((value) => value === "" || !isNaN(Number(value)), {
        message: "Invalid Number",
      })
      .refine((value) => value === "" || Number(value) > 0, {
        message: "Number must be greater than 0",
      })
      .optional(),
    runDate: z.date().optional(),
  })
  .refine(
    (data) => {
      if (data.triggerType === "one-time") {
        return (data.delay !== "") !== (data.runDate !== undefined);
      }
      return true;
    },
    {
      message: "You must provide either a delay or a run date.",
      path: ["delay"],
    }
  )
  .refine(
    (data) => {
      if (data.triggerType === "cron") {
        if (data.cronExpression && data.cronExpression.length > 0) {
          return data.cronExpression.split(" ").length === 5;
        }
        return false;
      }
      return true;
    },
    {
      message:
        "Invalid cron expression. You can check https://crontab.guru/ for help",
      path: ["cronExpression"],
    }
  );

export function CreateJobDialog({
  job,
  setIsOpen,
}: {
  job?: ScheduledJob;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const queryClient = useQueryClient();

  const createCallbackMutation = useMutation({
    ...createJobMutation(),
    onError: (error) => console.log(error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getAllJobsQueryKey() });
    },
    onSuccess: (newJob) => {
      toast("Job created successfully", {
        description: newJob.next_run_time
          ? "Next run: " + new Date(newJob.next_run_time).toLocaleString()
          : null,
        action: {
          label: "Open",
          onClick: () => console.log("Undo"),
        },
      });
    },
  });

  const updateCallbackMutation = useMutation({
    ...updateJobMutation(),
    onError: (error) => console.log(error),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: getAllJobsQueryKey() });
    },
    onSuccess: () => {
      toast("Job updated successfully");
    },
  });

  let cronExpression = "";
  if (job?.trigger.type === "cron") {
    const fields = job.trigger.fields;
    cronExpression = `${fields.minute} ${fields.hour} ${fields.day} ${fields.month} ${fields.day_of_week}`;
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: job?.id ?? "",
      name: job?.name ?? "",
      url: job?.request.url ?? "",
      headers: job?.request.headers ? JSON.stringify(job.request.headers) : "",
      body: job?.request.body ? JSON.stringify(job.request.body) : "",
      triggerType: job?.trigger.type ?? "one-time",
      delay: "",
      runDate: job?.trigger.fields.date
        ? new Date(job?.trigger.fields.date)
        : undefined,
      cronExpression: cronExpression,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true);
      let date: string | undefined;
      if (values.runDate) {
        date = new Date(
          values.runDate.getTime() +
            values.runDate.getTimezoneOffset() * 60 * 1000
        ).toISOString();
      }

      const args = {
        id: values.id === "" ? undefined : values.id,
        name: values.name === "" ? undefined : values.name,
        request: {
          url: values.url,
          method: values.method,
          headers: values.headers ? JSON.parse(values.headers) : null,
          body: values.body ? JSON.parse(values.body) : null,
        },
        trigger:
          values.triggerType === "one-time"
            ? {
                delay: values.delay === "" ? undefined : Number(values.delay),
                date: date,
              }
            : {
                cron: values.cronExpression!,
              },
      };

      if (job) {
        await updateCallbackMutation.mutateAsync({
          path: { job_id: job.id },
          body: args,
        });
      } else {
        await createCallbackMutation.mutateAsync({
          body: args,
        });
      }
      setIsOpen?.(false);
      console.log(values);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <DialogContent
      className="sm:max-w-[725px]"
      onClick={(event) => {
        event.stopPropagation();
      }}
    >
      <DialogHeader>
        <DialogTitle>
          {job ? `Update Job ${job.id}` : "Schedule a new Job"}
        </DialogTitle>
        <DialogDescription>
          After {job ? "the update" : "creation"}, this job will be scheduled to
          run at the specified time.
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4 md:grid-cols-2">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Job ID{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="771b2c2d-288b-4bb6-8ab5-f505601375c4"
                        {...field}
                        disabled={!!job}
                      />
                    </FormControl>
                    <FormDescription>
                      The unique identifier for the job. If you don&apos;t provide
                      one, a random ID will be generated.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Job Name{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Daily Reminder" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name that might help you identify the job
                      later.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                <FormLabel>Trigger</FormLabel>
                <Tabs
                  defaultValue={job?.trigger.type ?? "one-time"}
                  onValueChange={(value) => {
                    form.setValue("triggerType", value as "one-time" | "cron");
                  }}
                >
                  <TabsList>
                    <TabsTrigger value="one-time">One Time</TabsTrigger>
                    <TabsTrigger value="cron">Cron</TabsTrigger>
                  </TabsList>
                  <TabsContent value="one-time">
                    <FormField
                      control={form.control}
                      name="delay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Delay</FormLabel>
                          <FormControl>
                            <Input placeholder="3" {...field} />
                          </FormControl>
                          <FormDescription>
                            The delay in seconds before the job runs.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">
                          OR
                        </span>
                      </div>
                    </div>
                    <FormField
                      control={form.control}
                      name="runDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="text-left">Run Date</FormLabel>
                          <Popover modal>
                            <FormControl>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "justify-start text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    <span>
                                      {field.value.toLocaleString()}{" "}
                                      <span className="text-muted-foreground">
                                        (local time)
                                      </span>
                                    </span>
                                  ) : (
                                    <span>Pick a date and time</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                            </FormControl>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                              <div className="p-3 border-t border-border">
                                <TimePicker
                                  setDate={field.onChange}
                                  date={field.value}
                                />
                              </div>
                            </PopoverContent>
                          </Popover>
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                  <TabsContent value="cron">
                    <FormField
                      control={form.control}
                      name="cronExpression"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cron Expression</FormLabel>
                          <FormControl>
                            <Input placeholder="* * * * *" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination URL</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." {...field} />
                    </FormControl>
                    <FormDescription>
                      The URL where the request will be sent.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>HTTP Method</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue="GET">
                      <FormControl>
                        <SelectTrigger {...field}>
                          <SelectValue placeholder="Select the HTTP Method to use" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {METHODS.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="headers"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Headers{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full font-mono text-sm"
                        placeholder="Enter your headers as a JSON here..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The headers to send with the request.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="body"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Body{" "}
                      <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="w-full font-mono text-sm"
                        placeholder="Enter your JSON data here..."
                        rows={5}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      The JSON data to send in the request body.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <DialogFooter className="justify-between">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <AsyncButton type="submit" isLoading={isLoading}>
              {job ? "Update" : "Create"}
            </AsyncButton>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
