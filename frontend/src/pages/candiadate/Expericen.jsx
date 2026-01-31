import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { candidateApi } from "../../api/api";
import "../../styles/CandidateAll.css";


const Experience = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    jobRole: "",
    companyName: "",
    employeType: "full-time",
    startDate: "",
    endDate: "",
    isCurrent: false
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await candidateApi.post("/profile-expreience", form);
      navigate("/home"); // final destination
    } catch (error) {
      console.error("Experience save error:", error);
      alert("Failed to save experience");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate("/home");
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-card">

        <h2>Experience (Optional)</h2>

        <input
          type="text"
          name="jobRole"
          placeholder="Job Role (e.g. Frontend Developer)"
          value={form.jobRole}
          onChange={handleChange}
        />

        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          value={form.companyName}
          onChange={handleChange}
        />

        <select
          name="employeType"
          value={form.employeType}
          onChange={handleChange}
        >
          <option value="full-time">Full Time</option>
          <option value="intern">Intern</option>
          <option value="part-time">Part Time</option>
        </select>

        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
        />

        {!form.isCurrent && (
          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
          />
        )}

        <label style={{ fontSize: "14px" }}>
          <input
            type="checkbox"
            name="isCurrent"
            checked={form.isCurrent}
            onChange={handleChange}
          />{" "}
          Currently working here
        </label>

        {/* Submit */}
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Experience"}
        </button>

        {/* Skip */}
        <button type="button" onClick={handleSkip}>
          Skip
        </button>

      </form>
    </div>
  );
};

export default Experience;