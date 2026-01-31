import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Nav";
import { jobApi, savedApi, applicationApi } from "../api/api";
import "../styles/JobId.css";

const JobId = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  /* =========================
     FETCH JOB
  ========================= */
  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await jobApi.get(`/${jobId}`);
        setJob(res.data.job);
               
      } catch (err) {
        alert("Failed to load job");
      } finally {
        setLoading(false);
      }
    }
    fetchJob();
  }, [jobId]);

  /* =========================
     CHECK APPLIED
  ========================= */
  useEffect(() => {
    async function checkApplied() {
      try {
        const res = await applicationApi.get(`/check/${jobId}`);
        setApplied(res.data.applied === true);
      } catch (err) {
        console.error("Apply check failed");
      }
    }
    checkApplied();
  }, [jobId]);

  /* =========================
     CHECK SAVED
  ========================= */
  useEffect(() => {
    async function checkSaved() {
      try {
        const res = await savedApi.get(`/check/${jobId}`);
        setSaved(res.data.saved === true);
      } catch (err) {
        console.error("Save check failed");
      }
    }
    checkSaved();
  }, [jobId]);

  /* =========================
     SAVE JOB
  ========================= */
  async function handleSaveJob() {
    if (saved) return;

    try {
      setSaving(true);
      await savedApi.post(`/create/${jobId}`);
      setSaved(true); // 🔥 instant UI update
    } catch (err) {
      alert("Unable to save job");
    } finally {
      setSaving(false);
    }
  }

  /* =========================
     UI STATES
  ========================= */
  if (loading) return <p className="job-loading">Loading...</p>;
  if (!job) return <p className="job-loading">Job not found</p>;

  return (
    <>
      <Navbar />

      <div className="job-page">
        {/* HEADER */}
        <div className="job-header">
          <h1>{job.title}</h1>
          <span className={`job-status ${job.statusNow}`}>
            {job.statusNow}
          </span>
        </div>

        {/* META */}
        <div className="job-meta">
          <span>📍 {job.location}</span>
          <span>💼 {job.jobType}</span>
          <span>🏢 {job.workMode}</span>
          <span>🎯 {job.exprienceLevel}</span>
          <span>💰 {job.salaryRange}</span>
        </div>

        {/* DESCRIPTION */}
        <section>
          <h3>Job Description</h3>
          <p>{job.description}</p>
        </section>

        {/* REQUIREMENTS */}
        <section>
          <h3>Requirements</h3>
          <ul>
            {job.requirement?.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </section>

        {/* ACTIONS */}
        <div className="job-actions">
          {/* APPLY */}
          <button
            className={`apply-btn ${
              applied || job.statusNow === "CLOSED" ? "disabled" : ""
            }`}
            disabled={applied || job.statusNow === "CLOSED"}
            onClick={() => navigate(`/application/${job._id}`)}
          >
            {applied
              ? "Already Applied"
              : job.statusNow === "CLOSED"
              ? "Applications Closed"
              : "Apply Now"}
          </button>

          {/* SAVE */}
          <button
            className={`save-btn ${saved ? "saved" : ""}`}
            disabled={saved || saving}
            onClick={handleSaveJob}
          >
            {saved ? "Saved" : saving ? "Saving..." : "Save Job"}
          </button>
        </div>
      </div>
    </>
  );
};

export default JobId;
