import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Nav";
import { savedApi } from "../../api/api";
import "../../styles/SavedJobs.css";

const Saved = () => {
  const navigate = useNavigate();

  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSavedJobs() {
      try {
        const res = await savedApi.get("/");
        setSavedJobs(res.data.savedJob || []);
      } catch (err) {
        console.error("Failed to load saved jobs", err);
        setSavedJobs([]);
      } finally {
        setLoading(false);
      }
    }

    fetchSavedJobs();
  }, []);

  async function unSave(jobId) {
    try {
      await savedApi.delete(`/delete/${jobId}`);

      // ✅ instant UI update
      setSavedJobs((prev) =>
        prev.filter((item) => item.jobId._id !== jobId)
      );
    } catch (err) {
      console.error("Unsave failed", err);
    }
  }

  return (
    <>
      <Navbar />

      <div className="saved-page">
        <h2>Saved Jobs</h2>

        {loading && <p className="loading-text">Loading saved jobs...</p>}

        {!loading && savedJobs.length === 0 && (
          <p className="empty-text">You have not saved any jobs yet.</p>
        )}

        <div className="saved-list">
          {savedJobs.map((saved) => {
            const job = saved.jobId;
            if (!job) return null;

            return (
              <div key={saved._id} className="saved-card">
                <div className="saved-info">
                  <h3>{job.title}</h3>

                  <p className="saved-meta">
                    📍 {job.location} • 💼 {job.jobType}
                  </p>

                  <p className="saved-desc">
                    {job.description?.slice(0, 120)}...
                  </p>
                </div>

                <div className="saved-actions">
                  <span className="saved-badge">Saved</span>

                  <button
                    className="view-btn"
                    onClick={() => navigate(`/job/${job._id}`)}
                  >
                    View Job
                  </button>

                  <button
                    className="unsave"
                    onClick={() => unSave(job._id)}
                  >
                    Unsave
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Saved;
