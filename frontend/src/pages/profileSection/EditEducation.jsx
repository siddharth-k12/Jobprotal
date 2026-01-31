import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { candidateApi } from "../../api/api";
import "../../styles/EditAll.css";
import Navbar from "../../components/Nav";

const EditEducation = () => {
  const { educationId } = useParams(); // ✅ correct
  const navigate = useNavigate();

  const [form, setForm] = useState({
    degree: "",
    collogeName: "",
    startYear: "",
    endYear: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Load education from profile
  useEffect(() => {
    async function loadEducation() {
      try {
        const res = await candidateApi.get("/");
        const profile = res.data.candidate;

        const edu = profile.education.find(
          (e) => e._id === educationId
        );

        if (!edu) {
          navigate("/profile");
          return;
        }

        setForm({
          degree: edu.degree,
          collogeName: edu.collogeName,
          startYear: edu.startYear,
          endYear: edu.endYear
        });
      } catch (err) {
        console.error(err);
        navigate("/profile");
      } finally {
        setLoading(false);
      }
    }

    loadEducation();
  }, [educationId, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await candidateApi.patch(
        `/profile-edit-education/${educationId}`, // ✅ FIXED
        form
      );

      navigate("/profile");
    } catch (err) {
      console.error(err);
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
          <h2>Edit Education</h2>

          <input
            name="degree"
            value={form.degree}
            onChange={handleChange}
            required
          />

          <input
            name="collogeName"
            value={form.collogeName}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="startYear"
            value={form.startYear}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="endYear"
            value={form.endYear}
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

export default EditEducation;
