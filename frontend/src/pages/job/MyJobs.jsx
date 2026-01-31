import { useEffect, useState } from "react";
import { applicationApi, savedApi } from "../../api/api";
import "../../styles/Myjob.css";
import Navbar from "../../components/Nav";
import { useNavigate } from "react-router-dom";

const MyJobs = () => {
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("applications");
const navigate = useNavigate();

  useEffect(() => {
    if (activeTab === "applications") {
      fetchApplications();
    } else {
      fetchSavedJobs();
    }
  }, [activeTab]);

  async function fetchApplications() {
    try {
      setLoading(true);
      const res = await applicationApi.get("/");
      setApplications(res.data.check || []);
      // console.log(res)
    } catch (err) {
      console.error("Applications load failed", err);
    } finally {
      setLoading(false);
    }
  }

 async function fetchSavedJobs() {
  try {
    setLoading(true);
    const res = await savedApi.get("/");
    setSavedJobs(res.data.savedJob || []);
    // console.log(res.data.savedJob);
  } catch (err) {
    console.error("Saved jobs load failed", err);
  } finally {
    setLoading(false);
  }
}


  return (
    <>
      <Navbar />

      <div className="myjobs-page">
        <h2>My Jobs Dashboard</h2>

        {/* Tabs */}
        <div className="job-tabs">
          <button
            className={activeTab === "applications" ? "active" : ""}
            onClick={() => setActiveTab("applications")}
          >
            My Jobs
          </button>

          <button
            className={activeTab === "saved" ? "active" : ""}
            onClick={() => setActiveTab("saved")}
          >
            Saved Jobs
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <p className="loading-text">Loading...</p>
        )}

        {/* Applications */}
        {!loading &&
          activeTab === "applications" &&
          applications.length === 0 && (
            <p className="empty-text">
              You have not applied to any jobs yet.
            </p>
          )}

        {!loading &&
          activeTab === "applications" &&
          applications.length > 0 && (
            <div className="myjobs-list">
              {applications.map((app) => (
                <div key={app._id} className="myjob-card">
                  <div className="job-info">
                    <h3>{app.jobId?.title}</h3>

                    <p className="job-type">
                      {app.jobId?.jobType}
                    </p>

                    <p className="job-desc">
                      {app.jobId?.description?.slice(0, 120)}...
                    </p>

                    <a
                      href={app.resume?.url}
                      target="_blank"
                      rel="noreferrer"
                      className="resume-link"
                    >
                      📄 {app.resume?.fileName}
                    </a>
                  </div>

                  <div className="job-status">
                    <span
                      className={`status ${app.statusNow}`}
                    >
                      {app.statusNow}
                    </span>

                    <p className="applied-date">
                      Applied on{" "}
                      {new Date(
                        app.appliedAt
                      ).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* Saved Jobs */}
        {!loading &&
          activeTab === "saved" &&
          savedJobs.length === 0 && (
            <p className="empty-text">
              No saved jobs yet.
            </p>
          )}

        {!loading &&
  activeTab === "saved" &&
  savedJobs.length > 0 && (
    <div className="myjobs-list">
      {savedJobs.map((item) => (
        <div key={item._id} className="myjob-card">
          <div className="job-info">
            <h3>{item.jobId?.title}</h3>

            <p className="job-type">
              {item.jobId?.jobType}
            </p>

            <p className="job-desc">
              {item.jobId?.description?.slice(0, 120)}...
            </p>
          </div> 
          <button
    className="view-btn"
    onClick={() => navigate(`/job/${item.jobId._id}`)}
  > View Job
  </button>
        </div>
       
      ))}
    </div>
  )}

      </div>
    </>
  );
};

export default MyJobs;
