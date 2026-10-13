
import api from "./client";

export async function getJobs() {
  const response = await api.get("/api/jobs/");
  return response.data;
}

export async function createJob(jobData) {
  const response = await api.post("/api/jobs/", jobData);
  return response.data;
}

export async function updateJob(jobId, jobData) {
  const response = await api.put(`/api/jobs/${jobId}`, jobData);
  return response.data;
}

export async function deleteJob(jobId) {
  const response = await api.delete(`/api/jobs/${jobId}`);
  return response.data;
}
