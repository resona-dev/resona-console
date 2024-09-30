// This file is auto-generated by @hey-api/openapi-ts

import type { Options } from '@hey-api/client-fetch';
import { queryOptions, type UseMutationOptions } from '@tanstack/react-query';
import { client, getAllJobs, createJob, getJob, removeJob, pauseJob, resumeJob } from '../services.gen';
import type { CreateJobData, CreateJobError, CreateJobResponse, GetJobData, RemoveJobData, RemoveJobError, RemoveJobResponse, PauseJobData, PauseJobError, PauseJobResponse, ResumeJobData, ResumeJobError, ResumeJobResponse } from '../types.gen';

type QueryKey<TOptions extends Options> = [
    Pick<TOptions, 'baseUrl' | 'body' | 'headers' | 'path' | 'query'> & {
        _id: string;
        _infinite?: boolean;
    }
];

const createQueryKey = <TOptions extends Options>(id: string, options?: TOptions, infinite?: boolean): QueryKey<TOptions>[0] => {
    const params: QueryKey<TOptions>[0] = { _id: id, baseUrl: (options?.client ?? client).getConfig().baseUrl } as QueryKey<TOptions>[0];
    if (infinite) {
        params._infinite = infinite;
    }
    if (options?.body) {
        params.body = options.body;
    }
    if (options?.headers) {
        params.headers = options.headers;
    }
    if (options?.path) {
        params.path = options.path;
    }
    if (options?.query) {
        params.query = options.query;
    }
    return params;
};

export const getAllJobsQueryKey = (options?: Options) => [
    createQueryKey("getAllJobs", options)
];

export const getAllJobsOptions = (options?: Options) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await getAllJobs({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: getAllJobsQueryKey(options)
}); };

export const createJobQueryKey = (options: Options<CreateJobData>) => [
    createQueryKey("createJob", options)
];

export const createJobOptions = (options: Options<CreateJobData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await createJob({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: createJobQueryKey(options)
}); };

export const createJobMutation = () => { const mutationOptions: UseMutationOptions<CreateJobResponse, CreateJobError, Options<CreateJobData>> = {
    mutationFn: async (options) => {
        const { data } = await createJob({
            ...options,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const getJobQueryKey = (options: Options<GetJobData>) => [
    createQueryKey("getJob", options)
];

export const getJobOptions = (options: Options<GetJobData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await getJob({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: getJobQueryKey(options)
}); };

export const removeJobMutation = () => { const mutationOptions: UseMutationOptions<RemoveJobResponse, RemoveJobError, Options<RemoveJobData>> = {
    mutationFn: async (options) => {
        const { data } = await removeJob({
            ...options,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const pauseJobQueryKey = (options: Options<PauseJobData>) => [
    createQueryKey("pauseJob", options)
];

export const pauseJobOptions = (options: Options<PauseJobData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await pauseJob({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: pauseJobQueryKey(options)
}); };

export const pauseJobMutation = () => { const mutationOptions: UseMutationOptions<PauseJobResponse, PauseJobError, Options<PauseJobData>> = {
    mutationFn: async (options) => {
        const { data } = await pauseJob({
            ...options,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };

export const resumeJobQueryKey = (options: Options<ResumeJobData>) => [
    createQueryKey("resumeJob", options)
];

export const resumeJobOptions = (options: Options<ResumeJobData>) => { return queryOptions({
    queryFn: async ({ queryKey }) => {
        const { data } = await resumeJob({
            ...options,
            ...queryKey[0],
            throwOnError: true
        });
        return data;
    },
    queryKey: resumeJobQueryKey(options)
}); };

export const resumeJobMutation = () => { const mutationOptions: UseMutationOptions<ResumeJobResponse, ResumeJobError, Options<ResumeJobData>> = {
    mutationFn: async (options) => {
        const { data } = await resumeJob({
            ...options,
            throwOnError: true
        });
        return data;
    }
}; return mutationOptions; };