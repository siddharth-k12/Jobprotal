import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/CreateCompany.css"; // ✅ separate CSS
import { companyApi } from "../../api/api";
import { toast } from "react-toastify";
import Navbar from "../../components/Nav";


const CreateCompany = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    companyName: "",
    website: "",
    industry: "",
    size: "",
    location: "",
    about: "",
  });

  function changeHandler(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function create(form){
    try {
         await companyApi.post('/',form)
        toast.success("company is create")
        
    } catch (error) {
        console.log(error);
        navigate('/')
    }
  }

  async function submitHandler(e) {
    e.preventDefault();

    if (!form.companyName || !form.industry || !form.location) {
      toast.error("Company name, industry and location are required");
      return;
    }

   create(form)
  }

  return (
    <>
    <Navbar/>
    <div className="company-page">
        
      <div className="company-card">
        <h1>Create Company</h1>
        <p className="company-subtext">
          Register your company details to start hiring
        </p>

        <form onSubmit={submitHandler}>
          <input
            name="companyName"
            placeholder="Company Name *"
            value={form.companyName}
            onChange={changeHandler}
          />

          <input
            name="website"
            placeholder="Website"
            value={form.website}
            onChange={changeHandler}
          />

          <input
            name="industry"
            placeholder="Industry *"
            value={form.industry}
            onChange={changeHandler}
          />

          <input
            name="size"
            placeholder="Company Size (10-50)"
            value={form.size}
            onChange={changeHandler}
          />

          <input
            name="location"
            placeholder="Location *"
            value={form.location}
            onChange={changeHandler}
          />

          <textarea
            name="about"
            placeholder="About Company"
            rows="4"
            value={form.about}
            onChange={changeHandler}
          />

          <button type="submit" className="company-btn">
            Create Company
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default CreateCompany;