
import { useEffect, useState } from "react";
import { getResumes } from "../api/resumes";
import { getJobs } from "../api/jobs";
import {
  startAnalysis,
  getAnalysis,
  getAnalyses,
} from "../api/matching";

function Analyses() {
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [resumeId, setResumeId] = useState("");
  const [jobId, setJobId] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analysisHistory, setAnalysisHistory] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  // Load resumes, jobs, and saved analysis history.
  async function loadPageData() {
    setLoadingOptions(true);
    setLoadingHistory(true);
    setError("");

    try {
      const [resumeData, jobData, analysisData] =
        await Promise.all([
          getResumes(),
          getJobs(),
          getAnalyses(),
        ]);

      setResumes(resumeData);
      setJobs(jobData);

      const history = Array.isArray(analysisData)
        ? analysisData
        : [];

      // Show newest analyses first.
      history.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );

      setAnalysisHistory(history);

      // Restore the latest saved analysis after refresh.
      if (history.length > 0) {
        setAnalysis((current) => current || history[0]);
      }
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load your saved data."
      );
    } finally {
      setLoadingOptions(false);
      setLoadingHistory(false);
    }
  }

  useEffect(() => {
    loadPageData();
  }, []);

  // Poll while the selected analysis is processing.
  useEffect(() => {
    if (!analysis?.id || analysis.status !== "processing") {
      return;
    }

    let cancelled = false;
    let timeoutId;

    async function checkStatus() {
      try {
        const result = await getAnalysis(analysis.id);

        if (cancelled) return;

        setAnalysis(result);

        setAnalysisHistory((previous) =>
          previous.map((item) =>
            item.id === result.id ? result : item
          )
        );

        if (result.status === "processing") {
          timeoutId = setTimeout(checkStatus, 3000);
        }
      } catch (err) {
        if (cancelled) return;

        setError(
          err.response?.data?.detail ||
            "Unable to retrieve the analysis status."
        );
      }
    }

    timeoutId = setTimeout(checkStatus, 2000);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, [analysis?.id, analysis?.status]);

  async function handleAnalyze(event) {
    event.preventDefault();
    setError("");
    setStarting(true);

    try {
      const result = await startAnalysis(
        Number(resumeId),
        Number(jobId)
      );

      setAnalysis(result);

      // Refresh history so new analyses appear in the list.
      const historyData = await getAnalyses();
      const history = Array.isArray(historyData)
        ? historyData
        : [];

      history.sort(
        (a, b) =>
          new Date(b.created_at || 0).getTime() -
          new Date(a.created_at || 0).getTime()
      );

      setAnalysisHistory(history);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to start or retrieve the analysis."
      );
    } finally {
      setStarting(false);
    }
  }

  async function handleViewAnalysis(analysisId) {
    setError("");

    try {
      const result = await getAnalysis(analysisId);
      setAnalysis(result);

      // Bring the results panel into view.
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load this analysis."
      );
    }
  }

  function getResumeName(id) {
    const resume = resumes.find(
      (item) => item.id === id
    );

    return resume?.file_name || `Resume #${id}`;
  }

  function getJobName(id) {
    const job = jobs.find(
      (item) => item.id === id
    );

    return job
      ? `${job.title} — ${job.company}`
      : `Job #${id}`;
  }

  function formatDate(value) {
    if (!value) return "Date unavailable";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleString();
  }

  return (
    <div className="page-content">
      <header className="page-header">
        <p className="eyebrow">AI CAREER INTELLIGENCE</p>
        <h1>Resume–Job Analysis</h1>
        <p className="muted">
          Discover how your experience aligns with your target role.
        </p>
      </header>

      {/* Analysis form */}
      <section className="analysis-form-card">
        <h2>Choose your documents</h2>
        <p className="muted">
          Select a resume and a saved job description to begin.
        </p>

        {loadingOptions ? (
          <p className="muted">Loading your documents...</p>
        ) : (
          <form
            className="analysis-form"
            onSubmit={handleAnalyze}
          >
            <div className="job-field">
              <label htmlFor="resume-select">Resume</label>
              <select
                id="resume-select"
                value={resumeId}
                onChange={(event) =>
                  setResumeId(event.target.value)
                }
                required
              >
                <option value="">Select a resume</option>

                {resumes.map((resume) => (
                  <option key={resume.id} value={resume.id}>
                    {resume.file_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="job-field">
              <label htmlFor="job-select">
                Job description
              </label>
              <select
                id="job-select"
                value={jobId}
                onChange={(event) =>
                  setJobId(event.target.value)
                }
                required
              >
                <option value="">Select a job</option>

                {jobs.map((job) => (
                  <option key={job.id} value={job.id}>
                    {job.title} — {job.company}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={
                starting ||
                resumes.length === 0 ||
                jobs.length === 0
              }
            >
              {starting
                ? "Starting analysis..."
                : "Analyze compatibility"}
            </button>

            {resumes.length === 0 && (
              <p className="muted">
                Upload a resume before starting an analysis.
              </p>
            )}

            {jobs.length === 0 && (
              <p className="muted">
                Save a job description before starting an analysis.
              </p>
            )}
          </form>
        )}
      </section>

      {error && (
        <p className="feedback-error">{error}</p>
      )}

      {/* Selected analysis results */}
      {analysis && (
        <section className="analysis-result-card">
          <div className="analysis-result-header">
            <div>
              <p className="eyebrow">
                ANALYSIS #{analysis.id}
              </p>
              <h2>Compatibility results</h2>
            </div>

            <span
              className={`analysis-status ${analysis.status}`}
            >
              {analysis.status}
            </span>
          </div>

          {analysis.status === "processing" && (
            <div className="analysis-processing">
              <div className="loading-spinner" />
              <h3>Analyzing your resume...</h3>
              <p className="muted">
                We're comparing your documents and identifying
                skill gaps. This may take several seconds.
              </p>
            </div>
          )}

          {analysis.status === "failed" && (
            <div className="analysis-processing">
              <h3>Analysis failed</h3>
              <p className="muted">
                This analysis could not be completed.
                You can start an analysis again using the form above.
              </p>
            </div>
          )}

          {analysis.status === "completed" && (
            <>
              <div className="score-panel">
                <p className="muted">
                  Semantic similarity score
                </p>

                <div className="score-value">
                  {Number(analysis.semantic_score).toFixed(2)}%
                </div>

                <div className="score-track">
                  <div
                    className="score-fill"
                    style={{
                      width: `${Math.max(
                        0,
                        Math.min(
                          100,
                          Number(analysis.semantic_score) || 0
                        )
                      )}%`,
                    }}
                  />
                </div>

                <p className="score-note">
                  This score reflects document similarity,
                  not a hiring probability.
                </p>
              </div>

              <div className="skills-grid">
                <SkillList
                  title="Matched skills"
                  items={analysis.matched_skills}
                  type="matched"
                />

                <SkillList
                  title="Missing skills"
                  items={analysis.missing_skills}
                  type="missing"
                />
              </div>

              <div className="analysis-detail">
                <h3>Required skills</h3>
                <SkillTags
                  items={analysis.required_skills}
                />
              </div>

              <div className="analysis-detail">
                <h3>Skill-gap explanation</h3>
                <p>
                  {analysis.explanation ||
                    "No explanation available."}
                </p>
              </div>

              <div className="analysis-detail">
                <h3>Recommendations</h3>

                {analysis.recommendations?.length ? (
                  <ul className="recommendation-list">
                    {analysis.recommendations.map(
                      (recommendation, index) => (
                        <li
                          key={`${index}-${recommendation}`}
                        >
                          {recommendation}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="muted">
                    No recommendations available.
                  </p>
                )}
              </div>
            </>
          )}
        </section>
      )}

      {/* Saved analysis history */}
      <section className="analysis-result-card">
        <div className="analysis-result-header">
          <div>
            <p className="eyebrow">YOUR ACTIVITY</p>
            <h2>Analysis History</h2>
            <p className="muted">
              Revisit your previous resume and job comparisons.
            </p>
          </div>

          <button
            type="button"
            onClick={loadPageData}
            disabled={loadingHistory}
          >
            {loadingHistory ? "Refreshing..." : "Refresh history"}
          </button>
        </div>

        {loadingHistory ? (
          <p className="muted">
            Loading analysis history...
          </p>
        ) : analysisHistory.length === 0 ? (
          <p className="muted">
            No previous analyses found. Start an analysis above
            to see it here.
          </p>
        ) : (
          <div className="resume-list">
            {analysisHistory.map((item) => (
              <div className="resume-item" key={item.id}>
                <div className="resume-item-info">
                  <h3>Analysis #{item.id}</h3>

                  <p className="muted">
                    {getResumeName(item.resume_id)}
                  </p>

                  <p className="muted">
                    {getJobName(item.job_id)}
                  </p>

                  <p className="muted">
                    {formatDate(item.created_at)}
                  </p>

                  {item.status === "completed" &&
                    item.semantic_score != null && (
                      <p>
                        Similarity score:{" "}
                        {Number(item.semantic_score).toFixed(2)}%
                      </p>
                    )}

                  <span
                    className={`analysis-status ${item.status}`}
                  >
                    {item.status}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleViewAnalysis(item.id)
                  }
                >
                  View results
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function SkillList({ title, items, type }) {
  return (
    <div className="skills-panel">
      <h3>{title}</h3>

      {items?.length ? (
        <ul className={`skill-list ${type}`}>
          {items.map((skill, index) => (
            <li key={`${index}-${skill}`}>
              {skill}
            </li>
          ))}
        </ul>
      ) : (
        <p className="muted">No skills to display.</p>
      )}
    </div>
  );
}

function SkillTags({ items }) {
  if (!items?.length) {
    return (
      <p className="muted">
        No required skills were identified.
      </p>
    );
  }

  return (
    <div className="skill-tags">
      {items.map((skill, index) => (
        <span key={`${index}-${skill}`}>
          {skill}
        </span>
      ))}
    </div>
  );
}

export default Analyses;
