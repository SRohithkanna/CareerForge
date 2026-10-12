
import "./App.css";

function App() {
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2 className="brand">CareerForge</h2>

        <nav>
          <a className="nav-link active" href="#dashboard">
            Dashboard
          </a>
          <a className="nav-link" href="#resumes">
            My Resumes
          </a>
          <a className="nav-link" href="#jobs">
            Job Descriptions
          </a>
          <a className="nav-link" href="#analyses">
            Analysis History
          </a>
        </nav>

        <div className="sidebar-footer">
          AI-powered career intelligence
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">CAREER INTELLIGENCE</p>
            <h1>Your career dashboard</h1>
            <p className="muted">
              Understand your skills. Find your gaps. Prepare for your next role.
            </p>
          </div>
          <span className="status-pill">MVP</span>
        </header>

        <section className="welcome-card">
          <div>
            <p className="eyebrow">YOUR NEXT OPPORTUNITY</p>
            <h2>Make every application count.</h2>
            <p>
              Compare your resume with a job description to discover
              matching skills and areas to improve.
            </p>
          </div>
        </section>

        <section className="section">
          <h2>Workspace</h2>
          <p className="muted">
            Manage your career documents and AI-powered assessments.
          </p>

          <div className="feature-grid">
            <article className="feature-card" id="resumes">
              <span className="feature-icon">01</span>
              <h3>My Resumes</h3>
              <p>Upload and manage your PDF resumes.</p>
              <span className="card-label">Resume management</span>
            </article>

            <article className="feature-card" id="jobs">
              <span className="feature-icon">02</span>
              <h3>Job Descriptions</h3>
              <p>Save roles you want to evaluate your fit for.</p>
              <span className="card-label">Job tracking</span>
            </article>

            <article className="feature-card" id="analyses">
              <span className="feature-icon">03</span>
              <h3>AI Analysis</h3>
              <p>Explore semantic scores, missing skills, and recommendations.</p>
              <span className="card-label">AI career insights</span>
            </article>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
