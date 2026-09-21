import { api } from './client';
import { Job, Application } from '@/types';

export interface JobFilters {
  category?: string;
  search?: string;
  urgentOnly?: boolean;
}

export const fetchJobs = async (filters: JobFilters = {}): Promise<Job[]> => {
  const { data } = await api.get<Job[]>('/jobs', { params: filters });
  return data;
};

export const fetchJobDetail = async (jobId: number): Promise<Job> => {
  const { data } = await api.get<Job>(`/jobs/${jobId}`);
  return data;
};

export interface CreateJobPayload {
  title: string;
  category: string;
  description: string;
  pay: number;
  payType: string;
  location: string;
  date: string;
  startTime: string;
  isUrgent: boolean;
}

export const createJob = async (payload: CreateJobPayload): Promise<Job> => {
  const { data } = await api.post<Job>('/jobs', payload);
  return data;
};

export const applyToJob = async (jobId: number): Promise<Application> => {
  const { data } = await api.post<Application>(`/jobs/${jobId}/apply`);
  return data;
};

export const fetchMyApplications = async (): Promise<Application[]> => {
  const { data } = await api.get<Application[]>('/applications/me');
  return data;
};
