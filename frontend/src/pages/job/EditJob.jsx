import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Nav";
import { jobApi } from "../../api/api";
import "../../styles/EditJob.css";

const EditJob = () => {
  const { companyId, jobId } = useParams(); // ✅ FIXED
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    title: "",
    description: "",
    requirement: "",
    jobType: "Full-time",
    workMode: "Onsite",
    location: "",
    exprienceLevel: "Junior",
    salaryRange: "",
    statusNow: "OPEN",
  });

  // 🔹 FETCH JOB
  useEffect(() => {
    async function fetchJob() {
      try {
        // ⚠️ use YOUR real GET job endpoint
        const res = await jobApi.get(`/${jobId}`);
        const job = res.data.job;

        setForm({
          title: job.title,
          description: job.description,
          requirement: job.requirement.join(", "),
          jobType: job.jobType,
          workMode: job.workMode,
          location: job.location,
          exprienceLevel: job.exprienceLevel,
          salaryRange: job.salaryRange,
          statusNow: job.statusNow,
        });
      } catch (err) {
        console.error(err);
        alert("Failed to load job");
      } finally {
        setLoading(false);
      }
    }

    fetchJob();
  }, [jobId]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // 🔹 UPDATE JOB (PATCH)
  async function submitHandler(e) {
    e.preventDefault();

    try {
      await jobApi.patch(
        `/update/${companyId}/${jobId}`, // ✅ MATCH BACKEND
        {
          ...form,
          requirement: form.requirement
            .split(",")
            .map(r => r.trim()),
        }
      );

      alert("Job updated successfully");
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Failed to update job");
    }
  }

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="edit-job-page">
        <h1>Edit Job</h1>

        <form className="edit-job-form" onSubmit={submitHandler}>
          <input name="title" value={form.title} onChange={handleChange} />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
          />
          <input
            name="requirement"
            value={form.requirement}
            onChange={handleChange}
            placeholder="Comma separated"
          />

          <select name="jobType" value={form.jobType} onChange={handleChange}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
          </select>

          <select name="workMode" value={form.workMode} onChange={handleChange}>
            <option>Onsite</option>
            <option>Remote</option>
            <option>Hybrid</option>
          </select>

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
          />

          <select
            name="exprienceLevel"
            value={form.exprienceLevel}
            onChange={handleChange}
          >
            <option>Junior</option>
            <option>Mid</option>
            <option>Senior</option>
          </select>

          <input
            name="salaryRange"
            value={form.salaryRange}
            onChange={handleChange}
          />

          <select
            name="statusNow"
            value={form.statusNow}
            onChange={handleChange}
          >
            <option value="OPEN">active</option>
            <option value="CLOSED">closed</option>
          </select>

          <button className="update-btn">Update Job</button>
        </form>
      </div>
    </>
  );
};

export default EditJob;