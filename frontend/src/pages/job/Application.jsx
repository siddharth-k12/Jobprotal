import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { applicationApi, candidateApi, jobApi } from "../../api/api";
import "../../styles/Application.css";
import { toast } from "react-toastify";
import Navbar from "../../components/Nav";

const Application = () => {
  const { jobId } = useParams(); // 👈 jobId from URL
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch job details (for display only)
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await jobApi.get(`/${jobId}`);
        setJob(res.data.job);        
      } catch (err) {
        console.error("Job fetch failed", err);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleFileChange = (e) => {
    setResume(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      toast.info("Please upload your resume");
      return;
    }

    const formData = new FormData();
    formData.append("jobId", jobId);
    formData.append("resume", resume); // 🔥 field name MUST be "resume"

    setLoading(true);

    try {
     await applicationApi.post(`/${jobId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      // alert("Application submitted successfully");
      toast.success("Application submitted successfully")
      navigate("/my-jobs");
    } catch (error) {
      console.error("Apply job error:", error);
      // alert("Failed to apply for job");
      toast.error(error.response.data.message)
    } finally {
      setLoading(false);
    }
  };

  if (!job) {
    return <p className="loading-text">Loading job...</p>;
  }

  return (
  <>
  <Navbar/>
    <div className="apply-container">
      <div className="apply-card">

        {/* Job Info */}
        <div className="job-preview">
          <h2>{job.title}</h2>
          <p className="company">{job.companyName}</p>
          <p className="location">{job.location}</p>
        </div>

        {/* Apply Form */}
        <form onSubmit={handleSubmit} className="apply-form">

          <label className="file-label">
            Upload Resume (PDF / DOC)
            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
            />
          </label>

          {resume && (
            <p className="file-name">
              Selected: <strong>{resume.name}</strong>
            </p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Apply Now"}
          </button>

        </form>
      </div>
    </div>
  </>
  );
};

export default Application;
