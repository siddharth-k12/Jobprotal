import "../styles/Home.css";

import bg from "../assets/background-doted.png";

import Navbar from "../components/Nav";

import { useNavigate } from "react-router-dom";

import { jobApi } from "../api/api";

import { toast } from "react-toastify";

import { useEffect, useState } from "react";


const Home = () => {

  const navigate = useNavigate();


  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);


  // =====================================================
  // LOAD ALL JOBS
  // =====================================================

  const alljobs = async () => {

    try {

      const res = await jobApi.get("/");

      setJobs(
        res.data.jobs || []
      );

    } catch (error) {

      console.error(
        "Failed to load jobs:",
        error
      );

      toast.error(
        "Failed to load jobs"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    alljobs();

  }, []);


  // =====================================================
  // SEARCH JOBS
  // =====================================================

  const handleSearch = () => {

    const params = new URLSearchParams();

    if (keyword.trim()) {

      params.append(
        "keyword",
        keyword.trim()
      );

    }

    if (location.trim()) {

      params.append(
        "location",
        location.trim()
      );

    }


    navigate(
      `/job?${params.toString()}`
    );

  };


  // =====================================================
  // JOB MATCH
  // =====================================================

  const handleJobMatch = (jobId) => {

    navigate(
      `/ai/job-match?jobId=${jobId}`
    );

  };


  return (

    <div
      className="home"
      style={{
        backgroundImage: `url(${bg})`
      }}
    >

      <Navbar />


      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">

        <h1>
          Get The Right Job <br />
          You Deserve
        </h1>


        <p className="subtext">
          Find jobs that match your skills and location.
        </p>


        {/* =================================================
            SEARCH
        ================================================= */}

        <div className="search-box">

          <input
            type="text"
            placeholder="Job title or keyword"
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {
                handleSearch();
              }

            }}
          />


          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) =>
              setLocation(e.target.value)
            }
            onKeyDown={(e) => {

              if (e.key === "Enter") {
                handleSearch();
              }

            }}
          />


          <button
            className="btn-search"
            onClick={handleSearch}
          >
            Search
          </button>

        </div>

      </section>


      {/* =================================================
          TRENDING JOBS
      ================================================= */}

      <section className="trending">

        <div className="section-top">

          <h2>
            Trending Jobs
          </h2>


          <p
            className="see-all"
            onClick={() =>
              navigate("/job")
            }
          >
            See All Jobs
          </p>

        </div>


        <div className="job-cards">

          {loading ? (

            <p>
              Loading jobs...
            </p>

          ) : jobs.length === 0 ? (

            <p>
              No jobs available
            </p>

          ) : (

            jobs
              .slice(0, 3)
              .map((job, index) => (

                <div
                  key={job._id}
                  className={`job-card ${
                    index % 2 === 0
                      ? "green"
                      : "blue"
                  }`}
                >

                  <h3>
                    {job.title}
                  </h3>


                  <p className="company">

                    {
                      job.companyId?.companyName ||
                      "Company"
                    }

                  </p>


                  <p className="desc">

                    {
                      job.description?.slice(
                        0,
                        90
                      )
                    }

                    {job.description?.length > 90
                      ? "..."
                      : ""}

                  </p>


                  <p className="meta">

                    📍 {job.location}

                    {" • "}

                    {
                      job.jobType ||
                      "Full-time"
                    }

                  </p>


                  {/* =====================================
                      JOB FOOTER
                  ===================================== */}

                  <div className="job-footer">

                    <p className="salary">

                      {
                        job.salaryRange ||
                        "Not disclosed"
                      }

                      {" ₹"}

                      <span>
                        /Monthly
                      </span>

                    </p>


                    <div className="job-actions">


                      {/* =================================
                          APPLY
                      ================================= */}

                      <button
                        className="btn-apply"
                        onClick={() =>
                          navigate(
                            `/job/${job._id}`
                          )
                        }
                      >
                        Apply Now
                      </button>


                      {/* =================================
                          AI JOB MATCH
                      ================================= */}

                      <button
                        type="button"
                        className="btn-ai-match"
                        onClick={() =>
                          handleJobMatch(
                            job._id
                          )
                        }
                      >
                        AI Match
                      </button>


                    </div>

                  </div>

                </div>

              ))

          )}

        </div>

      </section>

    </div>

  );

};

export default Home;