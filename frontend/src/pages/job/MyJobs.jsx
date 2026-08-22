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

  // =====================================================
  // FETCH DATA WHEN TAB CHANGES
  // =====================================================

  useEffect(() => {
    if (activeTab === "applications") {
      fetchApplications();
    } else {
      fetchSavedJobs();
    }
  }, [activeTab]);

  // =====================================================
  // FETCH APPLICATIONS
  // =====================================================

  async function fetchApplications() {
    try {
      setLoading(true);

      const res = await applicationApi.get("/");

      console.log("Applications response:", res.data);

      // IMPORTANT:
      // Backend now returns:
      // res.data.applications
      setApplications(res.data.applications || []);
    } catch (err) {
      console.error(
        "Applications load failed:",
        err.response?.data || err
      );

      setApplications([]);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // FETCH SAVED JOBS
  // =====================================================

  async function fetchSavedJobs() {
    try {
      setLoading(true);

      const res = await savedApi.get("/");

      console.log("Saved jobs response:", res.data);

      setSavedJobs(res.data.savedJob || []);
    } catch (err) {
      console.error(
        "Saved jobs load failed:",
        err.response?.data || err
      );

      setSavedJobs([]);
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      <Navbar />

      <div className="myjobs-page">

        <h2>My Jobs Dashboard</h2>

        {/* =================================================
            TABS
        ================================================= */}

        <div className="job-tabs">

          <button
            className={
              activeTab === "applications"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("applications")
            }
          >
            My Jobs
          </button>

          <button
            className={
              activeTab === "saved"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("saved")
            }
          >
            Saved Jobs
          </button>

        </div>

        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <p className="loading-text">
            Loading...
          </p>
        )}

        {/* =================================================
            APPLICATIONS EMPTY
        ================================================= */}

        {!loading &&
          activeTab === "applications" &&
          applications.length === 0 && (
            <p className="empty-text">
              You have not applied to any jobs yet.
            </p>
          )}

        {/* =================================================
            APPLICATIONS LIST
        ================================================= */}

        {!loading &&
          activeTab === "applications" &&
          applications.length > 0 && (

            <div className="myjobs-list">

              {applications.map((app) => (

                <div
                  key={app._id}
                  className="myjob-card"
                >

                  {/* ===============================
                      JOB INFORMATION
                  =============================== */}

                  <div className="job-info">

                    <h3>
                      {app.jobId?.title || "Job"}
                    </h3>

                    <p className="job-type">
                      {app.jobId?.jobType || "N/A"}
                    </p>

                    <p className="job-desc">
                      {app.jobId?.description
                        ? `${app.jobId.description.slice(
                            0,
                            120
                          )}...`
                        : "No description available"}
                    </p>

                    {/* ===============================
                        LOCATION
                    =============================== */}

                    {app.jobId?.location && (
                      <p className="job-location">
                        📍 {app.jobId.location}
                      </p>
                    )}

                    {/* ===============================
                        RESUME
                    =============================== */}

                    {app.resumeId && (
                      <a
                        href={app.resumeId.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="resume-link"
                      >
                        📄 {app.resumeId.fileName}
                      </a>
                    )}

                  </div>

                  {/* ===============================
                      APPLICATION STATUS
                  =============================== */}

                  <div className="job-status">

                    <span
                      className={`status ${
                        app.statusNow || ""
                      }`}
                    >
                      {app.statusNow || "applied"}
                    </span>

                    <p className="applied-date">
                      Applied on{" "}
                      {app.appliedAt
                        ? new Date(
                            app.appliedAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>

                  </div>

                </div>

              ))}

            </div>
          )}

        {/* =================================================
            SAVED JOBS EMPTY
        ================================================= */}

        {!loading &&
          activeTab === "saved" &&
          savedJobs.length === 0 && (

            <p className="empty-text">
              No saved jobs yet.
            </p>

          )}

        {/* =================================================
            SAVED JOBS LIST
        ================================================= */}

        {!loading &&
          activeTab === "saved" &&
          savedJobs.length > 0 && (

            <div className="myjobs-list">

              {savedJobs.map((item) => (

                <div
                  key={item._id}
                  className="myjob-card"
                >

                  <div className="job-info">

                    <h3>
                      {item.jobId?.title ||
                        "Job"}
                    </h3>

                    <p className="job-type">
                      {item.jobId?.jobType ||
                        "N/A"}
                    </p>

                    <p className="job-desc">
                      {item.jobId?.description
                        ? `${item.jobId.description.slice(
                            0,
                            120
                          )}...`
                        : "No description available"}
                    </p>

                    {item.jobId?.location && (
                      <p className="job-location">
                        📍 {item.jobId.location}
                      </p>
                    )}

                  </div>

                  {/* ===============================
                      VIEW JOB
                  =============================== */}

                  {item.jobId?._id && (
                    <button
                      className="view-btn"
                      onClick={() =>
                        navigate(
                          `/job/${item.jobId._id}`
                        )
                      }
                    >
                      View Job
                    </button>
                  )}

                </div>

              ))}

            </div>

          )}

      </div>
    </>
  );
};

export default MyJobs;