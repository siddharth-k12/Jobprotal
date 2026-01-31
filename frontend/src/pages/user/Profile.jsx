import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi, candidateApi } from "../../api/api";
import Navbar from "../../components/Nav";
import "../../styles/Profile.css";
import {toast} from "react-toastify"

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, profileRes] = await Promise.all([
          userApi.get("/"),
          candidateApi.get("/")
                   
        ]);

        setUser(userRes.data.currentuser);
       setProfile(profileRes.data.candidate);
       console.log(profileRes);
                
        console.log(profileRes);
        
      } catch (err) {
        console.error(err);
        navigate("/");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [navigate]);

  async function logoutUser(){
    await userApi.post('/logout')
    navigate('/')
    toast.success("user is logout")
  }

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Navbar />

      <div className="profile-container">

        {/* USER */}
        {user && (
          <section className="profile-card">
            <h2>{user.username}</h2>
            <p>{user.email}</p>
            <p>{user.phoneNumber}</p>

            <button onClick={() => navigate("/edit-user")}>
              Edit User
            </button>
             <button className="logout-btn" onClick={() =>logoutUser()}>
              Logout
            </button>
          </section>
        )}

        {/* PROFILE */}
       {/* PROFILE */}
<section className="profile-card">
  <h3>{profile?.headline || "No headline added"}</h3>
  <p>{profile?.location || "No location added"}</p>

  <div className="skills">
    {profile?.skills?.length ? (
      profile.skills.map((s, i) => (
        <span key={i} className="skill-chip">
          {s}
        </span>
      ))
    ) : (
      <p>No skills</p>
    )}
  </div>

  <button
    onClick={() =>
      profile
        ? navigate(`/edit-profile`)
        : navigate("/user-job")
    }
  >
    {profile ? "Edit Profile" : "Add Profile"}
  </button>
</section>


        {/* EDUCATION */}
  <section className="profile-card">
  <h3>Education</h3>

  {profile?.education?.length > 0 ? (
    profile.education.map((edu) => (
      <div key={edu._id} className="edu-item">
        <p><strong>{edu.degree}</strong></p>
        <p>{edu.collogeName}</p>
        <p>{edu.startYear} - {edu.endYear}</p>

        <button
          onClick={() => navigate(`/edit-education/${edu._id}`)}
        >
          Edit Education
        </button>
      </div>
    ))
  ) : (
    <p>No education added</p>
  )}

  {profile?.education > 0 ?<button onClick={() => navigate("/education")}>
    Add Education
  </button> : null}
</section>



        {/* EXPERIENCE */}
      <section className="profile-card">
  <h3>Experience</h3>

  {profile?.experience?.length > 0 ? (
    profile.experience.map((exp) => (
      <div key={exp._id} className="exp-item">
        <p><strong>{exp.jobRole}</strong></p>
        <p>{exp.companyName}</p>

        <button
          onClick={() =>
            navigate(`/edit-experience/${exp._id}`)
          }
        >
          Edit Experience
        </button>
      </div>
    ))
  ) : (
    <p>No experience added</p>
  )}

 {profile?.experience?.length === 0 && (
  <button onClick={() => navigate("/experience")}>
    Add Experience
  </button>
)}

</section>



      </div>
    </>
  );
};

export default Profile;
