import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { candidateApi } from "../../api/api";
import Navbar from "../../components/Nav";
import "../../styles/EditAll.css";

const EditExperience = () => {
  const { experienceId } = useParams(); // ✅ param
  const navigate = useNavigate();

  const [form, setForm] = useState({
    jobRole: "",
    companyName: "",
    employeType: "full-time",
    startDate: "",
    endDate: "",
    isCurrent: false
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Load experience from profile
  useEffect(() => {
    async function loadExperience() {
      try {
        const res = await candidateApi.get("/");
        const profile = res.data.candidate;

        const exp = profile.experience.find(
          (e) => e._id === experienceId
        );

        if (!exp) {
          navigate("/profile");
          return;
        }

        setForm({
          jobRole: exp.jobRole || "",
          companyName: exp.companyName || "",
          employeType: exp.employeType || "full-time",
          startDate: exp.startDate
            ? exp.startDate.slice(0, 10)
            : "",
          endDate: exp.endDate
            ? exp.endDate.slice(0, 10)
            : "",
          isCurrent: exp.isCurrent || false
        });
      } catch (err) {
        console.error(err);
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    }

    loadExperience();
  }, [experienceId, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await candidateApi.patch(
        `/profile-edit-experience/${experienceId}`, // ✅ correct
        form
      );

      navigate("/profile");
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="edit-container">
        <form className="edit-card" onSubmit={handleSubmit}>
          <h2>Edit Experience</h2>

          <input
            type="text"
            name="jobRole"
            placeholder="Job Role"
            value={form.jobRole}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            required
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
            required
          />

          {!form.isCurrent && (
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
            />
          )}

          <label className="checkbox">
            <input
              type="checkbox"
              name="isCurrent"
              checked={form.isCurrent}
              onChange={handleChange}
            />
            Currently working here
          </label>

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditExperience;
