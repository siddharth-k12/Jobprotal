import { useEffect, useState } from "react";
import { companyApi } from "../../api/api";
import { useNavigate } from "react-router-dom";
import "../../styles/Home.css";
import Navbar from "../../components/Nav";

const Mycompany = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await companyApi.get("/all-company");
        setCompanies(res.data.company);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchCompanies();
  }, []);

  if (loading) return <p>Loading companies...</p>;

  return (
   <>
   <Navbar/>
    <div className="home">
      <section className="hero">
        <h1>My Companies</h1>
        <p className="subtext">Companies you manage</p>
      </section>

      <section className="trending">
        <div className="job-cards">
          {companies.length === 0 ? (
            <p>No company created yet</p>
          ) : (
            companies.map((company) => (
              <div
                key={company._id}
                className="job-card green"
                style={{ cursor: "pointer" }}
                onClick={() =>
                  navigate(`/recruiter/job?company=${company._id}`)
                }
              >
                <h3>{company.companyName}</h3>
                <p className="desc">{company.industry}</p>
                <p className="meta">📍 {company.location}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
   </>
  );
};

export default Mycompany;