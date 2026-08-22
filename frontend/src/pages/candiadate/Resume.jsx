import { useEffect, useState } from "react";
import { resumeApi } from "../../api/api";
import { toast } from "react-toastify";
import "../../styles/CandidateAll.css";
import Navbar from "../../components/Nav";

const Resume = () => {
  const [resumes, setResumes] = useState([]);
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // =========================
  // FETCH RESUMES
  // =========================
  const fetchResumes = async () => {
    try {
      const response = await resumeApi.get("/");

      setResumes(response.data.resumes || []);
    } catch (error) {
      console.error("Resume fetch error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to load resumes"
      );
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  // =========================
  // FILE CHANGE
  // =========================
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPdf) {
      toast.error("Only PDF files are allowed");

      e.target.value = "";
      setFile(null);

      return;
    }

    // Maximum 5 MB
    if (selectedFile.size > 5 * 1024 * 1024) {
      toast.error(
        "Resume must be smaller than 5 MB"
      );

      e.target.value = "";
      setFile(null);

      return;
    }

    setFile(selectedFile);
  };

  // =========================
  // UPLOAD RESUME
  // =========================
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.info("Please select a resume");
      return;
    }

    const formData = new FormData();

    formData.append("resume", file);

    try {
      setLoading(true);

      await resumeApi.post(
        "/upload",
        formData
      );

      toast.success(
        "Resume uploaded successfully"
      );

      setFile(null);

      e.target.reset();

      await fetchResumes();

    } catch (error) {
      console.error(
        "Resume upload error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Resume upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // DELETE RESUME
  // =========================
  const handleDelete = async (resumeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resume?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await resumeApi.delete(
        `/${resumeId}`
      );

      toast.success(
        "Resume deleted successfully"
      );

      setResumes((previous) =>
        previous.filter(
          (resume) =>
            resume._id !== resumeId
        )
      );

    } catch (error) {
      console.error(
        "Resume delete error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to delete resume"
      );
    }
  };

  // =========================
  // LOADING
  // =========================
  if (fetching) {
    return (
      <>
        <Navbar />

        <div className="form-container">
          <div className="form-card">
            <p>Loading resumes...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* =========================
          NAVBAR
      ========================= */}
      <Navbar />

      <div className="form-container">

        <div className="form-card">

          {/* =========================
              HEADER
          ========================= */}

          <h2>My Resume</h2>

          <p>
            Upload your resume once and use it
            automatically when applying for jobs.
          </p>

          {/* =========================
              NO RESUME
          ========================= */}

          {resumes.length === 0 && (
            <div className="resume-empty">

              <h3>
                No Resume Uploaded
              </h3>

              <p>
                Upload your PDF resume to make
                applying for jobs faster.
              </p>

              <form
                onSubmit={handleUpload}
                className="resume-upload-form"
              >

                <input
                  type="file"
                  name="resume"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                />

                {file && (
                  <p className="selected-file">
                    Selected:{" "}
                    <strong>
                      {file.name}
                    </strong>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={
                    loading || !file
                  }
                >
                  {loading
                    ? "Uploading..."
                    : "Upload Resume"}
                </button>

              </form>

            </div>
          )}

          {/* =========================
              RESUME EXISTS
          ========================= */}

          {resumes.length > 0 && (
            <div className="resume-section">

              <h3>
                Your Resumes
              </h3>

              {resumes.map((resume) => (
                <div
                  className="resume-card"
                  key={resume._id}
                >

                  <div className="resume-info">

                    <h4>
                      {resume.fileName}
                    </h4>

                    <p>
                      Uploaded:{" "}
                      {resume.createdAt
                        ? new Date(
                            resume.createdAt
                          ).toLocaleDateString()
                        : "Unknown"}
                    </p>

                    {resume.status && (
                      <p>
                        Status:{" "}
                        <strong>
                          {resume.status}
                        </strong>
                      </p>
                    )}

                  </div>

                  {/* ACTIONS */}

                  <div className="resume-actions">

                    <a
                      href={resume.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="resume-view-btn"
                    >
                      View / Download
                    </a>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          resume._id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>
              ))}

              {/* =========================
                  UPLOAD ANOTHER
              ========================= */}

              <div className="upload-another">

                <h3>
                  Upload Another Resume
                </h3>

                <p>
                  You can keep multiple resumes
                  and select one as your default
                  later.
                </p>

                <form
                  onSubmit={handleUpload}
                  className="resume-upload-form"
                >

                  <input
                    type="file"
                    name="resume"
                    accept=".pdf,application/pdf"
                    onChange={handleFileChange}
                  />

                  {file && (
                    <p className="selected-file">
                      Selected:{" "}
                      <strong>
                        {file.name}
                      </strong>
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={
                      loading || !file
                    }
                  >
                    {loading
                      ? "Uploading..."
                      : "Upload New Resume"}
                  </button>

                </form>

              </div>

            </div>
          )}

        </div>

      </div>
    </>
  );
};

export default Resume;