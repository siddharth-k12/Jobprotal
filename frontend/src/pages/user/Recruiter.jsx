import { useNavigate } from "react-router-dom";
import "../../styles/Home.css"; // reuse same spacing + colors
import {  userApi } from "../../api/api";
import { useEffect, useState } from "react";
import Navbar from "../../components/Nav";

const RecruiterDashboard = () => {
  const navigate = useNavigate();
  const [role, setrole] = useState("")

  async function adminSection() {
    try {
        const res =  await userApi.get("/role");
        const userRole = res.data.currentUser.role
         setrole(userRole)   
         
         if(role === "candidate"){
          navigate('/home')          
         }
             
    } catch (error) {
        console.log(error);
        navigate('/')
    }
    
  }
  useEffect(() => {
    adminSection();
  }, []);
  return (
   <>
   <Navbar/>
    <div className="home">
      <section className="hero">
        <h1>Recruiter Dashboard</h1>
        <p className="subtext">Manage your company and job postings</p>
      </section>

      <section className="trending">
        <div className="job-cards">
          <div
            className="job-card green"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/recruiter/company")}
          >
            <h3>Create Company</h3>
            <p className="desc">Register your company to start hiring</p>
          </div>

          {/* <div
            className="job-card blue"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/recruiter/job")}
          >
            <h3>Create Job</h3>
            <p className="desc">Post new job openings</p>
          </div> */}

          {/* <div
            className="job-card green"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/recruiter/my-jobs")}
          >
            <h3>My Jobs</h3>
            <p className="desc">View and manage your job listings</p>
          </div> */}

           <div
            className="job-card blue"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/recruiter/mycompany")}
          >
            <h3>My Company</h3>
            <p className="desc">all companys</p>
          </div>
        </div>
      </section>
    </div>
   </>
  );
};

export default RecruiterDashboard;
