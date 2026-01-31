import { useEffect, useState } from "react";
import { jobApi } from "../../api/api";
import "../../styles/Job.css";
import Navbar from "../../components/Nav";
import { useNavigate, useLocation } from "react-router-dom";

const Jobs = () => {
  const navigate = useNavigate();
  const locationObj = useLocation();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Read query params
  const params = new URLSearchParams(locationObj.search);
  const keyword = params.get("keyword");
  const city = params.get("location");

  useEffect(() => {
    async function loadJobs() {
      try {
        setLoading(true);

        let res;

        // Search jobs
        if (keyword || city) {
          res = await jobApi.get(
            `/search?keyword=${keyword || ""}&location=${city || ""}`
          );
        } else {
          // Load all jobs
          res = await jobApi.get("/");
        }

        setJobs(res.data.jobs || []);
      } catch (err) {
        console.error("Job loading failed:", err);
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, [keyword, city]);

  // Client-side filter
  const filteredJobs = jobs.filter((job) =>
    `${job.title} ${job.companyId?.companyName || ""} ${job.location}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />

      <div className="jobs-page">
        {/* Search bar */}
        <div className="jobs-search">
          <input
            type="text"
            placeholder="Search jobs by title, company or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Job List */}
        {loading ? (
          <p className="loading-text">Loading jobs...</p>
        ) : filteredJobs.length === 0 ? (
          <p className="loading-text">No jobs found</p>
        ) : (
          <div className="jobs-list">
            {filteredJobs.map((job) => (
              <div key={job._id} className="job-card">
                <div className="job-header">
                  <h3>{job.title}</h3>
                  <span className="job-type">{job.jobType}</span>
                </div>

                <p className="job-company">
                  {job.companyId?.companyName}
                </p>

                <p className="job-location">{job.location}</p>

                <p className="job-desc">
                  {job.description?.slice(0, 120)}...
                </p>

                <div className="job-footer">
                  <span className="job-salary">
                    ₹ {job.salaryRange || "Not disclosed"}
                  </span>

                  <button
                    className="apply-btn"
                    onClick={() => navigate(`/job/${job._id}`)}
                  >
                    Apply
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

export default Jobs;
