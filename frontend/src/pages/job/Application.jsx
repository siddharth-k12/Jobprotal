import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  applicationApi,
  jobApi,
  resumeApi
} from "../../api/api";

import "../../styles/Application.css";
import { toast } from "react-toastify";
import Navbar from "../../components/Nav";

const Application = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);

  // Existing resumes
  const [resumes, setResumes] = useState([]);

  // Selected existing resume
  const [selectedResume, setSelectedResume] = useState(null);

  // New resume
  const [newResume, setNewResume] = useState(null);

  const [loading, setLoading] = useState(false);
  const [resumeLoading, setResumeLoading] = useState(true);

  // =========================
  // FETCH JOB
  // =========================

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobApi.get(`/${jobId}`);

        setJob(res.data.job);
      } catch (error) {
        console.error(
          "Job fetch failed:",
          error
        );

        toast.error("Failed to load job");
      }
    };

    fetchJob();
  }, [jobId]);

  // =========================
  // FETCH USER RESUMES
  // =========================

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const res = await resumeApi.get("/");

        const userResumes =
          res.data.resumes || [];

        setResumes(userResumes);

        // Automatically select first resume
        if (userResumes.length > 0) {
          setSelectedResume(
            userResumes[0]._id
          );
        }

      } catch (error) {
        console.error(
          "Resume fetch failed:",
          error
        );

        toast.error(
          error.response?.data?.message ||
            "Failed to load resumes"
        );
      } finally {
        setResumeLoading(false);
      }
    };

    fetchResumes();
  }, []);

  // =========================
  // NEW RESUME
  // =========================

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const isPdf =
      file.type === "application/pdf" ||
      file.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPdf) {
      toast.error(
        "Only PDF resume files are allowed"
      );

      e.target.value = "";
      setNewResume(null);

      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Resume must be smaller than 5 MB"
      );

      e.target.value = "";
      setNewResume(null);

      return;
    }

    // User wants to upload a new resume
    // instead of using an existing one
    setSelectedResume(null);

    setNewResume(file);
  };

  // =========================
  // SELECT EXISTING RESUME
  // =========================

  const handleSelectResume = (resumeId) => {
    setSelectedResume(resumeId);

    // Remove newly selected file
    setNewResume(null);
  };

  // =========================
  // APPLY
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // User must select existing resume
    // OR upload new resume
    if (!selectedResume && !newResume) {
      toast.info(
        "Please select a resume or upload a new one"
      );

      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append(
        "jobId",
        jobId
      );

      // Existing resume
      if (selectedResume) {
        formData.append(
          "resumeId",
          selectedResume
        );
      }

      // New resume
      if (newResume) {
        formData.append(
          "resume",
          newResume
        );
      }

      await applicationApi.post(
        `/${jobId}`,
        formData
      );

      toast.success(
        "Application submitted successfully"
      );

      navigate("/my-jobs");

    } catch (error) {
      console.error(
        "Apply job error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to apply for job"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (!job || resumeLoading) {
    return (
      <>
        <Navbar />

        <p className="loading-text">
          Loading...
        </p>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="apply-container">

        <div className="apply-card">

          {/* =========================
              JOB INFO
          ========================= */}

          <div className="job-preview">

            <h2>
              {job.title}
            </h2>

            <p className="company">
              {job.companyId?.companyName ||
                job.companyName ||
                "Company"}
            </p>

            <p className="location">
              {job.location}
            </p>

          </div>

          {/* =========================
              RESUME
          ========================= */}

          <form
            onSubmit={handleSubmit}
            className="apply-form"
          >

            <h3>
              Select Resume
            </h3>

            <p className="resume-help-text">
              Select an existing resume or
              upload a new one for this job.
            </p>

            {/* =========================
                EXISTING RESUMES
            ========================= */}

            {resumes.length > 0 ? (
              <div className="application-resumes">

                {resumes.map((resume) => (
                  <label
                    key={resume._id}
                    className={`application-resume-card ${
                      selectedResume ===
                      resume._id
                        ? "selected"
                        : ""
                    }`}
                  >

                    <input
                      type="radio"
                      name="resume"
                      value={resume._id}
                      checked={
                        selectedResume ===
                        resume._id
                      }
                      onChange={() =>
                        handleSelectResume(
                          resume._id
                        )
                      }
                    />

                    <div className="application-resume-info">

                      <strong>
                        {resume.fileName}
                      </strong>

                      <span>
                        Uploaded{" "}
                        {resume.createdAt
                          ? new Date(
                              resume.createdAt
                            ).toLocaleDateString()
                          : ""}
                      </span>

                    </div>

                  </label>
                ))}

              </div>
            ) : (
              <p className="no-resume">
                You don't have any saved resumes.
              </p>
            )}

            {/* =========================
                OR
            ========================= */}

            <div className="resume-divider">
              <span>OR</span>
            </div>

            {/* =========================
                UPLOAD NEW
            ========================= */}

            <label className="file-label">

              Upload New Resume

              <input
                type="file"
                name="newResume"
                accept=".pdf,application/pdf"
                onChange={handleFileChange}
              />

            </label>

            {newResume && (
              <p className="file-name">

                Selected:{" "}

                <strong>
                  {newResume.name}
                </strong>

              </p>
            )}

            {/* =========================
                APPLY
            ========================= */}

            <button
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Submitting..."
                : "Apply Now"}
            </button>

          </form>

        </div>

      </div>
    </>
  );
};

export default Application;