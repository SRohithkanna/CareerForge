
import api from "./client";

export async function uploadResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/api/resumes/upload", formData);
  return response.data;
}

export async function getResumes() {
  const response = await api.get("/api/resumes/");
  return response.data;
}

export async function getResume(resumeId) {
  const response = await api.get(`/api/resumes/${resumeId}`);
  return response.data;
}

export async function deleteResume(resumeId) {
  const response = await api.delete(`/api/resumes/${resumeId}`);
  return response.data;
}
