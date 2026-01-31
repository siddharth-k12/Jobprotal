import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { candidateApi } from "../../api/api";
import "../../styles/EditAll.css";
import Navbar from "../../components/Nav";
import { toast } from "react-toastify";


const EditProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    headline: "",
    skills: "",
    location: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Load existing profile
  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await candidateApi.get("/");
        const profile = res.data.candidate || res.data;

        setForm({
          headline: profile.headline || "",
          skills: profile.skills?.join(", ") || "",
          location: profile.location || ""
        });
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await candidateApi.patch("/profile-edit", {
        headline: form.headline,
        skills: form.skills.split(",").map(s => s.trim()),
        location: form.location
      });

      toast.success("Profile updated successfully");
      navigate("/profile");
    } catch (err) {
      console.error("Profile update failed", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p className="loading-text">Loading...</p>;
  }

  return (
    <>
      <Navbar />

      <div className="edit-container">
        <form className="edit-card" onSubmit={handleSubmit}>
          <h2>Edit Profile</h2>

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
            placeholder="Skills (comma separated)"
            value={form.skills}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditProfile;
