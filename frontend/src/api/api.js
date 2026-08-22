import axios from "axios";

export const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_API,
  withCredentials: true,
});

export const jobApi = axios.create({
  baseURL: import.meta.env.VITE_JOB_API,
  withCredentials: true,
});

export const candidateApi = axios.create({
  baseURL: import.meta.env.VITE_CANDIDATE_API,
  withCredentials: true,
});

export const companyApi = axios.create({
  baseURL: import.meta.env.VITE_COMPANY_API,
  withCredentials: true,
});

export const applicationApi = axios.create({
  baseURL: import.meta.env.VITE_APPLICATION_API,
  withCredentials: true,
});

export const savedApi = axios.create({
  baseURL: import.meta.env.VITE_SAVED_API,
  withCredentials: true,
});

export const resumeApi = axios.create({
  baseURL: import.meta.env.VITE_RESUME_API,
  withCredentials: true,
});

export const atsApi = axios.create({
    baseURL: import.meta.env.VITE_ATS_API,
    withCredentials: true,
});