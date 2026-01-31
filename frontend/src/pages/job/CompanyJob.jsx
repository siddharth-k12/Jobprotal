import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Nav";
import { jobApi } from "../../api/api";
import "../../styles/CompanyJobs.css";

const CompanyJobs = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await jobApi.get(`/company-job/${companyId}`);
        setCompany(res.data.company);
        setJobs(res.data.companyJob || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, [companyId]);

  async function handleDelete(jobId) {
    const ok = window.confirm("Delete this job?");
    if (!ok) return;

    try {
      await jobApi.delete(`/delete/${companyId}/${jobId}`);
      setJobs(prev => prev.filter(job => job._id !== jobId));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  }

  return (
    <>
      <Navbar />

      <div className="company-jobs-page">
        {/* COMPANY INFO */}
        {company && (
          <div className="company-info">
            <h1>{company.companyName}</h1>
            <p className="company-meta">
              🏢 {company.industry} • 📍 {company.location}
            </p>
          </div>
        )}

        {/* HEADER */}
        <div className="company-jobs-header">
          <h2>Jobs</h2>
          <button
            className="create-job-link"
            onClick={() =>
              navigate(`/recruiter/job?company=${companyId}`)
            }
          >
            + Create Job
          </button>
        </div>

        {/* JOB LIST */}
        {loading ? (
          <p className="loading-text">Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p className="empty-text">No jobs created yet.</p>
        ) : (
          <div className="company-jobs-grid">
            {jobs.map(job => (
              <div key={job._id} className="company-job-card">
                <h3>{job.title}</h3>

                <p className="job-meta">
                  📍 {job.location} • 💼 {job.jobType}
                </p>

                <p className="job-level">
                  Experience: {job.exprienceLevel}
                </p>

                <span
                  className={`job-status ${
                    job.statusNow === "OPEN" ? "open" : "closed"
                  }`}
                >
                  {job.statusNow}
                </span>

                {/* ACTIONS */}
                <div className="job-actions">
                  <button
                    className="job-btn view"
                    onClick={() => navigate(`/job/${job._id}`)}
                  >
                    View
                  </button>

                  <button
                    className="job-btn edit"
                    onClick={() =>
                      navigate(`/recruiter/edit-job/${companyId}/${job._id}`)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="job-btn delete"
                    onClick={() => handleDelete(job._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CompanyJobs;