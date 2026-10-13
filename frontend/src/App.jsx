
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Resumes from "./pages/Resumes";
import Jobs from "./pages/Jobs";
import Analyses from "./pages/Analyses";
import { useEffect, useState } from "react";
import { getResumes } from "./api/resumes";
import { getJobs } from "./api/jobs";
import { getAnalyses } from "./api/matching";

function Dashboard() {
  const [stats, setStats] = useState({
    resumes: 0,
    jobs: 0,
    analyses: 0,
    completed: 0,
  });

  const [latestAnalysis, setLatestAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [resumes, jobs, analyses] = await Promise.all([
          getResumes(),
          getJobs(),
          getAnalyses(),
        ]);

        const history = Array.isArray(analyses) ? analyses : [];

        history.sort(
          (a, b) =>
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
        );

        setStats({
          resumes: resumes.length,
          jobs: jobs.length,
          analyses: history.length,
          completed: history.filter(
            (item) => item.status === "completed"
          ).length,
        });

        setLatestAnalysis(history[0] || null);
      } catch (err) {
        setError(
          err.response?.data?.detail ||
            "Unable to load dashboard information."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2 className="brand">CareerForge</h2>
        <nav>
          <a className="nav-link active" href="/">Dashboard</a>
          <a className="nav-link" href="/resumes">My Resumes</a>
          <a className="nav-link" href="/jobs">Job Descriptions</a>
          <a className="nav-link" href="/analyses">Analysis History</a>
        </nav>
        <div className="sidebar-footer">
          AI-powered career intelligence
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="eyebrow">CAREER INTELLIGENCE</p>
            <h1>Your career dashboard</h1>
            <p className="muted">
              Understand your skills. Find your gaps. Prepare for your next role.
            </p>
          </div>

          <button
            className="logout-button"
            onClick={() => {
              sessionStorage.removeItem("access_token");
              window.location.href = "/login";
            }}
          >
            Log out
          </button>
        </header>

        <section className="welcome-card">
          <p className="eyebrow">YOUR NEXT OPPORTUNITY</p>
          <h2>Make every application count.</h2>
          <p>
            Compare your resume with a job description to discover matching
            skills and areas to improve.
          </p>
        </section>

        <section className="section">
          <h2>Workspace overview</h2>
          <p className="muted">
            Your career documents and AI assessment activity.
          </p>

          {loading ? (
            <p className="muted">Loading your dashboard...</p>
          ) : (
            <div className="feature-grid">
              <div className="feature-card">
                <span className="feature-icon">01</span>
                <h3>Saved Resumes</h3>
                <p className="dashboard-stat">{stats.resumes}</p>
                <a href="/resumes" className="card-label">
                  Manage resumes →
                </a>
              </div>

              <div className="feature-card">
                <span className="feature-icon">02</span>
                <h3>Saved Jobs</h3>
                <p className="dashboard-stat">{stats.jobs}</p>
                <a href="/jobs" className="card-label">
                  Manage job descriptions →
                </a>
              </div>

              <div className="feature-card">
                <span className="feature-icon">03</span>
                <h3>Completed Analyses</h3>
                <p className="dashboard-stat">{stats.completed}</p>
                <p className="muted">
                  {stats.analyses} total analyses
                </p>
                <a href="/analyses" className="card-label">
                  View analysis history →
                </a>
              </div>
            </div>
          )}

          {error && <p className="feedback-error">{error}</p>}
        </section>

        <section className="section">
          <h2>Latest analysis</h2>

          {loading ? (
            <p className="muted">Loading latest analysis...</p>
          ) : latestAnalysis ? (
            <div className="analysis-result-card">
              <div className="analysis-result-header">
                <div>
                  <p className="eyebrow">
                    ANALYSIS #{latestAnalysis.id}
                  </p>
                  <h3>Most recent resume comparison</h3>
                </div>
                <span
                  className={`analysis-status ${latestAnalysis.status}`}
                >
                  {latestAnalysis.status}
                </span>
              </div>

              {latestAnalysis.status === "completed" &&
                latestAnalysis.semantic_score != null && (
                  <p>
                    Semantic similarity:{" "}
                    <strong>
                      {Number(latestAnalysis.semantic_score).toFixed(2)}%
                    </strong>
                  </p>
                )}

              <a href="/analyses" className="card-label">
                View analysis details →
              </a>
            </div>
          ) : (
            <div className="analysis-result-card">
              <p>No analyses yet. Run your first resume comparison.</p>
              <a href="/analyses" className="card-label">
                Start an analysis →
              </a>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/resumes"
  element={
    <ProtectedRoute>
      <div className="app-layout">
        <aside className="sidebar">
          <h2 className="brand">CareerForge</h2>
          <nav>
            <a className="nav-link" href="/">Dashboard</a>
            <a className="nav-link active" href="/resumes">My Resumes</a>
            <a className="nav-link" href="/jobs">Job Descriptions</a>
            <a className="nav-link" href="/analyses">Analysis History</a>
          </nav>
          <div className="sidebar-footer">AI-powered career intelligence</div>
        </aside>
        <main className="main-content">
          <Resumes />
        </main>
      </div>
    </ProtectedRoute>
  }
/>
<Route
  path="/jobs"
  element={
    <ProtectedRoute>
      <div className="app-layout">
        <aside className="sidebar">
          <h2 className="brand">CareerForge</h2>
          <nav>
            <a className="nav-link" href="/">Dashboard</a>
            <a className="nav-link" href="/resumes">My Resumes</a>
            <a className="nav-link active" href="/jobs">Job Descriptions</a>
            <a className="nav-link" href="/analyses">Analysis History</a>
          </nav>
          <div className="sidebar-footer">AI-powered career intelligence</div>
        </aside>

        <main className="main-content">
          <Jobs />
        </main>
      </div>
    </ProtectedRoute>
  }
/>
<Route
  path="/analyses"
  element={
    <ProtectedRoute>
      <div className="app-layout">
        <aside className="sidebar">
          <h2 className="brand">CareerForge</h2>
          <nav>
            <a className="nav-link" href="/">Dashboard</a>
            <a className="nav-link" href="/resumes">My Resumes</a>
            <a className="nav-link" href="/jobs">Job Descriptions</a>
            <a className="nav-link active" href="/analyses">Analysis History</a>
          </nav>
          <div className="sidebar-footer">
            AI-powered career intelligence
          </div>
        </aside>

        <main className="main-content">
          <Analyses />
        </main>
      </div>
    </ProtectedRoute>
  }
/>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
