import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/Nav";
import { companyApi } from "../../api/api";
import "../../styles/EditAll.css";

const EditCompany = () => {
  const { companyId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    website: "",
    industry: "",
    size: "",
    location: "",
    about: ""
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // 🔹 Load company details
  useEffect(() => {
    async function loadCompany() {
      try {
        const res = await companyApi.get(`/${companyId}`);
        const company = res.data.company;

        setForm({
          companyName: company.companyName || "",
          website: company.website || "",
          industry: company.industry || "",
          size: company.size || "",
          location: company.location || "",
          about: company.about || ""
        });
      } catch (err) {
        console.error("Failed to load company", err);
        navigate("/home");
      } finally {
        setLoading(false);
      }
    }

    loadCompany();
  }, [companyId, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await companyApi.patch(`/update/${companyId}`, form);
      navigate(`/recruiter/mycompany`);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update company");
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
          <h2>Edit Company</h2>

          <input
            name="companyName"
            placeholder="Company Name"
            value={form.companyName}
            onChange={handleChange}
            required
          />

          <input
            name="website"
            placeholder="Website"
            value={form.website}
            onChange={handleChange}
          />

          <input
            name="industry"
            placeholder="Industry"
            value={form.industry}
            onChange={handleChange}
          />

          <input
            name="size"
            placeholder="Company Size (e.g. 50-100)"
            value={form.size}
            onChange={handleChange}
          />

          <input
            name="location"
            placeholder="Location"
            value={form.location}
            onChange={handleChange}
          />

          <textarea
            name="about"
            placeholder="About Company"
            rows="4"
            value={form.about}
            onChange={handleChange}
          />

          <button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </>
  );
};

export default EditCompany;
