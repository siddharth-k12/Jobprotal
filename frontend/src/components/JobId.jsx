import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Nav";
import {
  jobApi,
  savedApi,
  applicationApi,
} from "../api/api";
import { toast } from "react-toastify";
import "../styles/JobId.css";

const JobId = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const [applied, setApplied] = useState(false);
  const [saved, setSaved] = useState(false);

  const [saving, setSaving] = useState(false);

  /*
   * =========================
   * FETCH JOB + STATUS
   * =========================
   */
  useEffect(() => {
    const fetchJobData = async () => {
      try {
        setLoading(true);

        const [
          jobResponse,
          appliedResponse,
          savedResponse,
        ] = await Promise.all([
          jobApi.get(`/${jobId}`),
          applicationApi.get(`/check/${jobId}`),
          savedApi.get(`/check/${jobId}`),
        ]);

        setJob(jobResponse.data.job);

        setApplied(
          appliedResponse.data.applied === true
        );

        setSaved(
          savedResponse.data.saved === true
        );
      } catch (error) {
  console.error("Failed to load job:", error);
  console.error("Status:", error.response?.status);
  console.error("Response:", error.response?.data);

  toast.error(
    error.response?.data?.message ||
      "Failed to load job"
  );
}finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobData();
    }
  }, [jobId, navigate]);

  /*
   * =========================
   * SAVE JOB
   * =========================
   */
  const handleSaveJob = async () => {
    if (saved || saving) {
      return;
    }

    try {
      setSaving(true);

      await savedApi.post(
        `/create/${jobId}`
      );

      setSaved(true);

      toast.success("Job saved successfully");
    } catch (error) {
      console.error(
        "Save job error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to save job"
      );
    } finally {
      setSaving(false);
    }
  };

  /*
   * =========================
   * APPLY
   * =========================
   */
  const handleApply = () => {
    if (applied) {
      return;
    }

    if (job.statusNow === "closed") {
      return;
    }

    navigate(`/application/${job._id}`);
  };

  /*
   * =========================
   * UI STATES
   * =========================
   */

  if (loading) {
    return (
      <p className="job-loading">
        Loading job...
      </p>
    );
  }

  if (!job) {
    return (
      <p className="job-loading">
        Job not found
      </p>
    );
  }

  const isClosed =
    job.statusNow === "closed";

  return (
    <>
      <Navbar />

      <div className="job-page">

        {/* HEADER */}
        <div className="job-header">
          <h1>{job.title}</h1>

          <span
            className={`job-status ${job.statusNow}`}
          >
            {job.statusNow}
          </span>
        </div>

        {/* META */}
        <div className="job-meta">
          <span>
            📍 {job.location}
          </span>

          <span>
            💼 {job.jobType}
          </span>

          <span>
            🏢 {job.workMode}
          </span>

          <span>
            🎯 {job.exprienceLevel}
          </span>

          <span>
            💰 {job.salaryRange}
          </span>
        </div>

        {/* DESCRIPTION */}
        <section>
          <h3>Job Description</h3>

          <p>
            {job.description}
          </p>
        </section>

        {/* REQUIREMENTS */}
        <section>
          <h3>Requirements</h3>

          {job.requirement?.length > 0 ? (
            <ul>
              {job.requirement.map(
                (requirement, index) => (
                  <li key={index}>
                    {requirement}
                  </li>
                )
              )}
            </ul>
          ) : (
            <p>
              No specific requirements
              provided.
            </p>
          )}
        </section>

        {/* ACTIONS */}
        <div className="job-actions">

          {/* APPLY */}
          <button
            className={`apply-btn ${
              applied || isClosed
                ? "disabled"
                : ""
            }`}
            disabled={
              applied || isClosed
            }
            onClick={handleApply}
          >
            {applied
              ? "Already Applied"
              : isClosed
              ? "Applications Closed"
              : "Apply Now "}
          </button>

          {/* SAVE */}
          <button
            className={`save-btn ${
              saved ? "saved" : ""
            }`}
            disabled={
              saved || saving
            }
            onClick={handleSaveJob}
          >
            {saved
              ? "Saved"
              : saving
              ? "Saving..."
              : "Save Job"}
          </button>

        </div>
      </div>
    </>
  );
};

export default JobId;