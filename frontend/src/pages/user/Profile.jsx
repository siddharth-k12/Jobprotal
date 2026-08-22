import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { userApi, candidateApi } from "../../api/api";

import Navbar from "../../components/Nav";

import "../../styles/Profile.css";

import { toast } from "react-toastify";


const Profile = () => {

  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);


  // =====================================================
  // LOAD PROFILE DATA
  // =====================================================

  useEffect(() => {

    const loadData = async () => {

      try {

        const [userRes, profileRes] =
          await Promise.all([
            userApi.get("/"),
            candidateApi.get("/")
          ]);


        setUser(
          userRes.data.currentuser
        );


        setProfile(
          profileRes.data.candidate
        );


      } catch (error) {

        console.error(
          "Profile loading failed:",
          error
        );

        navigate("/");

      } finally {

        setLoading(false);

      }

    };


    loadData();

  }, [navigate]);


  // =====================================================
  // LOGOUT
  // =====================================================

  const logoutUser = async () => {

    try {

      await userApi.post("/logout");

      toast.success("User logged out");

      navigate("/");

    } catch (error) {

      console.error(
        "Logout failed:",
        error
      );

      toast.error(
        error.response?.data?.message ||
        "Logout failed"
      );

    }

  };


  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {

    return (
      <>
        <Navbar />

        <div className="profile-loading">
          Loading profile...
        </div>
      </>
    );

  }


  // =====================================================
  // PROFILE
  // =====================================================

  return (

    <>

      <Navbar />


      <main className="profile-page">


        {/* =================================================
            PROFILE HEADER
        ================================================= */}

        <div className="profile-header">

          <div>

            <span className="profile-label">
              ACCOUNT
            </span>

            <h1>
              My Profile
            </h1>

            <p>
              Manage your personal information,
              skills, education and experience.
            </p>

          </div>


          <button
            className="profile-logout-btn"
            onClick={logoutUser}
          >
            Logout
          </button>

        </div>


        {/* =================================================
            PROFILE GRID
        ================================================= */}

        <div className="profile-container">


          {/* =================================================
              USER INFORMATION
          ================================================= */}

          {user && (

            <section className="profile-card user-card">

              <div className="card-heading">

                <div className="card-icon">
                  👤
                </div>

                <div>
                  <h2>
                    Personal Information
                  </h2>

                  <p>
                    Your account details
                  </p>
                </div>

              </div>


              <div className="user-info">

                <div className="info-item">

                  <span>
                    Name
                  </span>

                  <strong>
                    {user.username || "User"}
                  </strong>

                </div>


                <div className="info-item">

                  <span>
                    Email
                  </span>

                  <strong>
                    {user.email || "No email"}
                  </strong>

                </div>


                <div className="info-item">

                  <span>
                    Phone
                  </span>

                  <strong>
                    {user.phoneNumber ||
                      "No phone number"}
                  </strong>

                </div>

              </div>


              <button
                className="outline-btn"
                onClick={() =>
                  navigate("/edit-user")
                }
              >
                Edit User
              </button>

            </section>

          )}


          {/* =================================================
              CANDIDATE PROFILE
          ================================================= */}

          <section className="profile-card candidate-card">

            <div className="card-heading">

              <div className="card-icon">
                💼
              </div>

              <div>

                <h2>
                  Professional Profile
                </h2>

                <p>
                  Your career information
                </p>

              </div>

            </div>


            <div className="professional-info">

              <h3>
                {profile?.headline ||
                  "No headline added"}
              </h3>

              <p>
                📍{" "}
                {profile?.location ||
                  "No location added"}
              </p>

            </div>


            <div className="skills-section">

              <span className="section-label">
                Skills
              </span>


              <div className="skills">

                {profile?.skills?.length > 0 ? (

                  profile.skills.map(
                    (skill, index) => (

                      <span
                        key={index}
                        className="skill-chip"
                      >
                        {skill}
                      </span>

                    )
                  )

                ) : (

                  <span className="empty-text">
                    No skills added
                  </span>

                )}

              </div>

            </div>


            <button
              className="outline-btn"
              onClick={() =>
                profile
                  ? navigate("/edit-profile")
                  : navigate("/user-job")
              }
            >
              {profile
                ? "Edit Profile"
                : "Add Profile"}
            </button>

          </section>


          {/* =================================================
              EDUCATION
          ================================================= */}

          <section className="profile-card">

            <div className="card-heading">

              <div className="card-icon">
                🎓
              </div>

              <div>

                <h2>
                  Education
                </h2>

                <p>
                  Academic background
                </p>

              </div>

            </div>


            {profile?.education?.length > 0 ? (

              <div className="timeline-list">

                {profile.education.map(
                  (education) => (

                    <div
                      key={education._id}
                      className="timeline-item"
                    >

                      <div className="timeline-dot" />

                      <div className="timeline-content">

                        <strong>
                          {education.degree}
                        </strong>

                        <span>
                          {education.collogeName}
                        </span>

                        <small>
                          {education.startYear}
                          {" - "}
                          {education.endYear}
                        </small>


                        <button
                          className="small-btn"
                          onClick={() =>
                            navigate(
                              `/edit-education/${education._id}`
                            )
                          }
                        >
                          Edit
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <p className="empty-state">
                No education added yet.
              </p>

            )}


            {profile && (

              <button
                className="outline-btn"
                onClick={() =>
                  navigate("/education")
                }
              >
                + Add Education
              </button>

            )}

          </section>


          {/* =================================================
              EXPERIENCE
          ================================================= */}

          <section className="profile-card">

            <div className="card-heading">

              <div className="card-icon">
                🧑‍💻
              </div>

              <div>

                <h2>
                  Experience
                </h2>

                <p>
                  Professional experience
                </p>

              </div>

            </div>


            {profile?.experience?.length > 0 ? (

              <div className="timeline-list">

                {profile.experience.map(
                  (experience) => (

                    <div
                      key={experience._id}
                      className="timeline-item"
                    >

                      <div className="timeline-dot" />

                      <div className="timeline-content">

                        <strong>
                          {experience.jobRole}
                        </strong>

                        <span>
                          {experience.companyName}
                        </span>


                        <button
                          className="small-btn"
                          onClick={() =>
                            navigate(
                              `/edit-experience/${experience._id}`
                            )
                          }
                        >
                          Edit
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <p className="empty-state">
                No experience added yet.
              </p>

            )}


            {profile && (

              <button
                className="outline-btn"
                onClick={() =>
                  navigate("/experience")
                }
              >
                + Add Experience
              </button>

            )}

          </section>


          {/* =================================================
              RESUME & ATS
          ================================================= */}

          <section className="profile-card resume-card">

            <div className="card-heading">

              <div className="card-icon">
                📄
              </div>

              <div>

                <h2>
                  Resume & ATS
                </h2>

                <p>
                  Manage resumes and check ATS compatibility
                </p>

              </div>

            </div>


            <div className="profile-actions">


              <button
                className="action-card"
                onClick={() =>
                  navigate("/resumes")
                }
              >

                <strong>
                  My Resumes
                </strong>

                <span>
                  Manage your resumes
                </span>

              </button>


              <button
                className="action-card"
                onClick={() =>
                  navigate("/ai/ats")
                }
              >

                <strong>
                  ATS Analyzer
                </strong>

                <span>
                  Check resume ATS score
                </span>

              </button>


              <button
                className="action-card"
                onClick={() =>
                  navigate("/ai/ats/history")
                }
              >

                <strong>
                  ATS History
                </strong>

                <span>
                  View previous analyses
                </span>

              </button>


            </div>

          </section>


        </div>

      </main>

    </>

  );

};


export default Profile;