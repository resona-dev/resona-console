// This file is auto-generated by @hey-api/openapi-ts

import { createClient, createConfig, type Options } from '@hey-api/client-fetch';
import type { CreateOneTimeJobData, CreateOneTimeJobError, CreateOneTimeJobResponse, CreateCronJobJobsCronPostData, CreateCronJobJobsCronPostError, CreateCronJobJobsCronPostResponse, GetJobJobsJobIdGetData, GetJobJobsJobIdGetError, GetJobJobsJobIdGetResponse, RemoveJobJobsJobIdDeleteData, RemoveJobJobsJobIdDeleteError, RemoveJobJobsJobIdDeleteResponse, GetAllJobsError, GetAllJobsResponse } from './types.gen';

export const client = createClient(createConfig());

/**
 * Create One Time Job
 */
export const createOneTimeJob = <ThrowOnError extends boolean = false>(options: Options<CreateOneTimeJobData, ThrowOnError>) => { return (options?.client ?? client).post<CreateOneTimeJobResponse, CreateOneTimeJobError, ThrowOnError>({
    ...options,
    url: '/jobs/one-time'
}); };

/**
 * Create Cron Job
 */
export const createCronJobJobsCronPost = <ThrowOnError extends boolean = false>(options: Options<CreateCronJobJobsCronPostData, ThrowOnError>) => { return (options?.client ?? client).post<CreateCronJobJobsCronPostResponse, CreateCronJobJobsCronPostError, ThrowOnError>({
    ...options,
    url: '/jobs/cron'
}); };

/**
 * Get Job
 */
export const getJobJobsJobIdGet = <ThrowOnError extends boolean = false>(options: Options<GetJobJobsJobIdGetData, ThrowOnError>) => { return (options?.client ?? client).get<GetJobJobsJobIdGetResponse, GetJobJobsJobIdGetError, ThrowOnError>({
    ...options,
    url: '/jobs/{job_id}'
}); };

/**
 * Remove Job
 */
export const removeJobJobsJobIdDelete = <ThrowOnError extends boolean = false>(options: Options<RemoveJobJobsJobIdDeleteData, ThrowOnError>) => { return (options?.client ?? client).delete<RemoveJobJobsJobIdDeleteResponse, RemoveJobJobsJobIdDeleteError, ThrowOnError>({
    ...options,
    url: '/jobs/{job_id}'
}); };

/**
 * Get All Jobs
 */
export const getAllJobs = <ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) => { return (options?.client ?? client).get<GetAllJobsResponse, GetAllJobsError, ThrowOnError>({
    ...options,
    url: '/jobs/'
}); };