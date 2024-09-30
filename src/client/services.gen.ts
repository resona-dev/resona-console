// This file is auto-generated by @hey-api/openapi-ts

import { createClient, createConfig, type Options } from '@hey-api/client-fetch';
import type { GetAllJobsError, GetAllJobsResponse, CreateJobData, CreateJobError, CreateJobResponse, GetJobData, GetJobError, GetJobResponse, RemoveJobData, RemoveJobError, RemoveJobResponse, PauseJobData, PauseJobError, PauseJobResponse, ResumeJobData, ResumeJobError, ResumeJobResponse } from './types.gen';

export const client = createClient(createConfig());

/**
 * Get All Jobs
 */
export const getAllJobs = <ThrowOnError extends boolean = false>(options?: Options<unknown, ThrowOnError>) => { return (options?.client ?? client).get<GetAllJobsResponse, GetAllJobsError, ThrowOnError>({
    ...options,
    url: '/jobs'
}); };

/**
 * Create Job
 */
export const createJob = <ThrowOnError extends boolean = false>(options: Options<CreateJobData, ThrowOnError>) => { return (options?.client ?? client).post<CreateJobResponse, CreateJobError, ThrowOnError>({
    ...options,
    url: '/jobs'
}); };

/**
 * Get Job
 */
export const getJob = <ThrowOnError extends boolean = false>(options: Options<GetJobData, ThrowOnError>) => { return (options?.client ?? client).get<GetJobResponse, GetJobError, ThrowOnError>({
    ...options,
    url: '/jobs/{job_id}'
}); };

/**
 * Remove Job
 */
export const removeJob = <ThrowOnError extends boolean = false>(options: Options<RemoveJobData, ThrowOnError>) => { return (options?.client ?? client).delete<RemoveJobResponse, RemoveJobError, ThrowOnError>({
    ...options,
    url: '/jobs/{job_id}'
}); };

/**
 * Pause Job
 */
export const pauseJob = <ThrowOnError extends boolean = false>(options: Options<PauseJobData, ThrowOnError>) => { return (options?.client ?? client).post<PauseJobResponse, PauseJobError, ThrowOnError>({
    ...options,
    url: '/jobs/{job_id}/pause'
}); };

/**
 * Resume Job
 */
export const resumeJob = <ThrowOnError extends boolean = false>(options: Options<ResumeJobData, ThrowOnError>) => { return (options?.client ?? client).post<ResumeJobResponse, ResumeJobError, ThrowOnError>({
    ...options,
    url: '/jobs/{job_id}/resume'
}); };