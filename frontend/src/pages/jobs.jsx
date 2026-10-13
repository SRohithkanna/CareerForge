
import { useEffect, useState } from "react";
import {
  getJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../api/jobs";

const emptyForm = {
  title: "",
  company: "",
  description: "",
};

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function loadJobs() {
    try {
      setError("");
      const data = await getJobs();
      setJobs(data);
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to load your jobs."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      if (editingId !== null) {
        await updateJob(editingId, form);
        setMessage("Job description updated successfully.");
      } else {
        await createJob(form);
        setMessage("Job description saved successfully.");
      }

      resetForm();
      await loadJobs();
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to save the job description."
      );
    } finally {
      setSaving(false);
    }
  }

  function startEditing(job) {
    setEditingId(job.id);
    setForm({
      title: job.title,
      company: job.company,
      description: job.description,
    });
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(jobId) {
    if (!window.confirm("Delete this job description?")) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await deleteJob(jobId);
      setJobs((previous) =>
        previous.filter((job) => job.id !== jobId)
      );

      if (editingId === jobId) {
        resetForm();
      }

      setMessage("Job description deleted successfully.");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Unable to delete this job."
      );
    }
  }

  return (
    <div className="page-content">
      <header className="page-header">
        <p className="eyebrow">CAREER OPPORTUNITIES</p>
        <h1>Job Descriptions</h1>
        <p className="muted">
          Save roles you're interested in and compare them with your resumes.
        </p>
      </header>

      <section className="job-form-card">
        <h2>{editingId !== null ? "Edit job" : "Add a job"}</h2>
        <p className="muted">
          Enter the role details and the full job description.
        </p>

        <form onSubmit={handleSubmit} className="job-form">
          <div className="job-form-row">
            <div className="job-field">
              <label htmlFor="title">Job title</label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Python Backend Developer"
                maxLength={255}
                required
              />
            </div>

            <div className="job-field">
              <label htmlFor="company">Company</label>
              <input
                id="company"
                name="company"
                value={form.company}
                onChange={handleChange}
                placeholder="e.g. Example Technologies"
                maxLength={255}
                required
              />
            </div>
          </div>

          <div className="job-field">
            <label htmlFor="description">Job description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Paste the job responsibilities, requirements, and skills..."
              rows={7}
              required
            />
          </div>

          <div className="job-form-actions">
            <button type="submit" disabled={saving}>
              {saving
                ? "Saving..."
                : editingId !== null
                  ? "Update job"
                  : "Save job"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                className="secondary-button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {error && <p className="feedback-error">{error}</p>}
      {message && <p className="feedback-success">{message}</p>}

      <section className="job-list-section">
        <div className="resume-list-heading">
          <h2>Saved jobs</h2>
          <span className="resume-count">{jobs.length}</span>
        </div>

        {loading ? (
          <p className="muted">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <h3>No saved jobs yet</h3>
            <p className="muted">
              Add a job description above to get started.
            </p>
          </div>
        ) : (
          <div className="job-list">
            {jobs.map((job) => (
              <article className="job-card" key={job.id}>
                <div className="job-card-header">
                  <div>
                    <h3>{job.title}</h3>
                    <p className="job-company">{job.company}</p>
                  </div>
                  <span className="job-id">Job #{job.id}</span>
                </div>

                <p className="job-description-preview">
                  {job.description.length > 260
                    ? `${job.description.slice(0, 260)}...`
                    : job.description}
                </p>

                <div className="job-card-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() => startEditing(job)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => handleDelete(job.id)}
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Jobs;
