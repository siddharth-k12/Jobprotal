import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { candidateApi, userApi } from "../../api/api";
import "../../styles/CandidateAll.css";

const Education = () => {
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  const [form, setForm] = useState({
    degree: "",
    collogeName: "",   // ✅ FIXED spelling
    startYear: "",
    endYear: ""
  });

  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // 🔹 Role check + recruiter auto-skip
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await userApi.get("/role");
        const role = res.data.currentUser.role;

        setUserRole(role);

        // ✅ IMPORTANT: recruiter skips education
        if (role === "recruiter") {
          navigate("/recruiter", { replace: true });
        }
      } catch (err) {
        console.error("Role fetch failed", err);
        navigate("/");
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setIsSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await candidateApi.post("/profile-education", form);
     
      alert("Education saved successfully");
       navigate("/experience");
    } catch (error) {
      console.error("Education save error:", error);
      alert("Failed to save education");
    } finally {
      setSaving(false);
    }
  };

  // const handleNext = () => {
  //   if (!isSaved) return;
  //   navigate("/user-job");
  // };

  // ⛔ While role is loading
  if (roleLoading) {
    return <p>Loading...</p>;
  }

  // ⛔ Extra safety: recruiter should never see this UI
  if (userRole === "recruiter") {
    return null;
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-card">

        <h2>Add Education</h2>

        <input
          type="text"
          name="degree"
          placeholder="Degree (e.g. B.Tech)"
          value={form.degree}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="collogeName"
          placeholder="College Name"
          value={form.collogeName}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="startYear"
          placeholder="Start Year"
          value={form.startYear}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="endYear"
          placeholder="End Year"
          value={form.endYear}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save Education"}
        </button>

        <button
          type="button"
  
        >
          Next
        </button>

      </form>
    </div>
  );
};

export default Education;