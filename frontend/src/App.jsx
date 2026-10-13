
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import Resumes from "./pages/Resumes";
import Jobs from "./pages/Jobs";

function Dashboard() {
  return (
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
    <h2>Workspace</h2>
    <p className="muted">
      Manage your career documents and AI-powered assessments.
    </p>

    <div className="feature-grid">
      <a className="feature-card" href="/resumes">
        <span className="feature-icon">01</span>
        <h3>My Resumes</h3>
        <p>Upload and manage your PDF resumes.</p>
        <span className="card-label">Resume management</span>
      </a>

      <a className="feature-card" href="/jobs">
        <span className="feature-icon">02</span>
        <h3>Job Descriptions</h3>
        <p>Save roles you want to evaluate your fit for.</p>
        <span className="card-label">Job tracking</span>
      </a>

      <a className="feature-card" href="/analyses">
        <span className="feature-icon">03</span>
        <h3>AI Analysis</h3>
        <p>Explore semantic scores, missing skills, and recommendations.</p>
        <span className="card-label">AI career insights</span>
      </a>
    </div>
  </section>
</main>
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

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
