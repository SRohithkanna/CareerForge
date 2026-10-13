
import api from "./client";

export async function startAnalysis(resumeId, jobId) {
  const response = await api.post(
    `/api/matching/${resumeId}/${jobId}`
  );

  return response.data;
}

export async function getAnalysis(analysisId) {
  const response = await api.get(
    `/api/analyses/${analysisId}`
  );

  return response.data;
}

export async function getAnalyses() {
  const response = await api.get("/api/analyses/");
  return response.data;
}
