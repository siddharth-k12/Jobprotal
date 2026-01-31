import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { candidateApi, userApi } from "../../api/api";
import "../../styles/CandidateAll.css";
import { toast } from "react-toastify";

const UserJobDetail = () => {
  const navigate = useNavigate();

  // ================= ROLE STATE =================
  const [userRole, setUserRole] = useState(null);
  const [roleLoading, setRoleLoading] = useState(true);

  // ================= FORM STATE =================
  const [form, setForm] = useState({
    headline: "",
    skills: "",
    location: ""
  });

  const [saving, setSaving] = useState(false);

  // ================= ROLE CHECK =================
  useEffect(() => {
    const fetchRole = async () => {
      try {
        const res = await userApi.get("/role");
        const role = res.data.currentUser.role;

        setUserRole(role);

        // 🚫 Recruiter should never see this page
        if (role === "recruiter") {
          navigate("/recruiter", { replace: true });
        }
      } catch (err) {
        console.error("Role fetch failed:", err);
        navigate("/");
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, [navigate]);

  // ================= HANDLERS =================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // ✅ SAVE + AUTO NAVIGATE (KEY FIX)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await candidateApi.post("/profile", {
        headline: form.headline,
        skills: form.skills.split(",").map(s => s.trim()),
        location: form.location
      });
      toast.success("job deatil created")
      // ✅ DIRECT NAVIGATION AFTER SAVE
      navigate("/education");
    } catch (error) {
      console.error(
        "Job detail save error:",
        error.response?.data || error.message
      );
      alert("Failed to save job details");
    } finally {
      setSaving(false);
    }
  };

  // ================= GUARDS =================
  if (roleLoading) {
    return <p>Loading...</p>;
  }

  // Extra safety (should never hit due to redirect)
  if (userRole === "recruiter") {
    return null;
  }

  // ================= UI =================
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="form-card">

        <h2>Job Details</h2>

        <input
          type="text"
          name="headline"
          placeholder="Headline (e.g. MERN Stack Developer)"
          value={form.headline}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills (comma separated: React, Node, MongoDB)"
          value={form.skills}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location (e.g. Bengaluru, Remote)"
          value={form.location}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Save & Continue"}
        </button>

      </form>
    </div>
  );
};

export default UserJobDetail;