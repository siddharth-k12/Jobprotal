import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../../components/Nav";
import { jobApi, companyApi } from "../../api/api"; // ✅ companyApi needed
import "../../styles/CreateJob.css";

const CreateJob = () => {
  const [searchParams] = useSearchParams();
  const companyId = searchParams.get("company");
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    requirement: "",
    jobType: "Full-time",
    workMode: "Onsite",
    location: "",
    exprienceLevel: "Junior",
    salaryRange: "",
    statusNow: "active",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submitHandler(e) {
    e.preventDefault();

    if (!companyId) {
      alert("Company not selected");
      return;
    }

    try {
      await jobApi.post(`/create/${companyId}`, {
        ...form,
        requirement: form.requirement.split(",").map(r => r.trim()),
      });

      navigate(`/company-job/${companyId}`);
    } catch (error) {
      console.error(error.response?.data || error);
      alert("Failed to create job");
    }
  }

  // ✅ Edit company
  const handleEditCompany = () => {
    navigate(`/company-edit/${companyId}`);
  };

  // ✅ Delete company
  const handleDeleteCompany = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this company? This action cannot be undone."
    );

    if (!confirmDelete) return;

    try {
      await companyApi.delete(`/delete/${companyId}`);
      alert("Company deleted successfully");
      navigate("/recruiter"); // or companies list page
    } catch (err) {
      console.error(err);
      alert("Failed to delete company");
    }
  };

  return (
    <>
      <Navbar />

      <div className="create-job-page">

        {/* 🔥 TOP ACTION BAR */}
        <div className="create-job-top">
          <button
            className="back-btn"
            onClick={() => navigate(`/company-job/${companyId}`)}
          >
            ← Back to Company Jobs
          </button>

          {/* ✅ RIGHT SIDE BUTTONS */}
          <div className="company-actions">
            <button
              className="edit-company-btn"
              onClick={handleEditCompany}
            >
              Edit Company
            </button>

            <button
              className="delete-company-btn"
              onClick={handleDeleteCompany}
            >
              Delete Company
            </button>
          </div>
        </div>

        <div className="create-job-header">
          <h1>Create Job</h1>
          <p>Post a new job for your company</p>
        </div>

        <form className="create-job-form" onSubmit={submitHandler}>
          <input
            name="title"
            placeholder="Job Title"
            onChange={handleChange}
            required
          />

          <textarea
            name="description"
            placeholder="Job Description"
            rows="4"
            onChange={handleChange}
            required
          />

          <input
            name="requirement"
            placeholder="Requirements (comma separated)"
            onChange={handleChange}
            required
          />

          <select name="jobType" onChange={handleChange}>
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Internship</option>
          </select>

          <select name="workMode" onChange={handleChange}>
            <option>Onsite</option>
            <option>Remote</option>
            <option>Hybrid</option>
          </select>

          <input
            name="location"
            placeholder="Location"
            onChange={handleChange}
            required
          />

          <select name="exprienceLevel" onChange={handleChange}>
            <option>Junior</option>
            <option>Mid</option>
            <option>Senior</option>
          </select>

          <input
            name="salaryRange"
            placeholder="Salary Range (₹)"
            onChange={handleChange}
          />

          <button className="create-job-btn">Create Job</button>
        </form>
      </div>
    </>
  );
};

export default CreateJob;
