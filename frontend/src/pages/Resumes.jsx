
import { useEffect, useState } from "react";
import {
  uploadResume,
  getResumes,
  deleteResume,
} from "../api/resumes";

function Resumes() {
  const [resumes, setResumes] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadResumes() {
    try {
      setError("");
      const data = await getResumes();
      setResumes(data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to load your resumes."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadResumes();
  }, []);

  async function handleUpload(event) {
    event.preventDefault();

    if (!selectedFile) {
      setError("Please select a PDF file.");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      await uploadResume(selectedFile);
      setSelectedFile(null);
      event.target.reset();
      setMessage("Resume uploaded successfully.");
      await loadResumes();
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to upload the resume."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(resumeId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");
      await deleteResume(resumeId);
      setResumes((previous) =>
        previous.filter((resume) => resume.id !== resumeId)
      );
      setMessage("Resume deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to delete the resume."
      );
    }
  }

  return (
    <main className="page-content">
      <header className="page-header">
        <p className="eyebrow">CAREER DOCUMENTS</p>
        <h1>My Resumes</h1>
        <p className="muted">
          Upload and manage the resumes you'll use for AI career analysis.
        </p>
      </header>

      <section className="resume-upload-card">
        <h2>Upload a resume</h2>
        <p className="muted">
          Select a PDF. CareerForge will extract its text for analysis.
        </p>

        <form onSubmit={handleUpload}>
          <label className="file-picker">
            <span>{selectedFile ? selectedFile.name : "Choose a PDF file"}</span>
            <input
              type="file"
              accept=".pdf,application/pdf"
              onChange={(event) => {
                setSelectedFile(event.target.files?.[0] || null);
                setError("");
                setMessage("");
              }}
            />
          </label>

          <button type="submit" disabled={uploading || !selectedFile}>
            {uploading ? "Uploading..." : "Upload resume"}
          </button>
        </form>
      </section>

      {error && <p className="feedback-error">{error}</p>}
      {message && <p className="feedback-success">{message}</p>}

      <section className="resume-list-section">
        <div className="resume-list-heading">
          <h2>Saved resumes</h2>
          <span className="resume-count">{resumes.length}</span>
        </div>

        {loading ? (
          <p className="muted">Loading resumes...</p>
        ) : resumes.length === 0 ? (
          <div className="empty-state">
            <h3>No resumes yet</h3>
            <p className="muted">
              Upload your first PDF to get started.
            </p>
          </div>
        ) : (
          <div className="resume-list">
            {resumes.map((resume) => (
              <article className="resume-item" key={resume.id}>
                <div className="resume-file-icon">
                  <span>PDF</span>
                </div>

                <div className="resume-file-info">
                  <h3>{resume.file_name}</h3>
                  <p className="muted">
                    Resume ID: {resume.id}
                    {resume.created_at
                      ? ` · ${new Date(resume.created_at).toLocaleDateString()}`
                      : ""}
                  </p>
                </div>

                <button
                  type="button"
                  className="delete-button"
                  onClick={() => handleDelete(resume.id)}
                >
                  Delete
                </button>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Resumes;
