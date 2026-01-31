import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Nav.css";
import { userApi } from "../api/api";

const Navbar = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("");

  useEffect(() => {
    async function getRole() {
      try {
        const res = await userApi.get("/role");
        setRole(res.data.currentUser.role);
      } catch (err) {
        console.error("Role fetch failed", err);
      }
    }
    getRole();
  }, []);

  const go = (path) => {
    navigate(path);
  };

  return (
    <nav className="nav">
      {/* LOGO */}
      <div className="logo" onClick={() => go("/home")}>
        <svg width="160" height="44" viewBox="0 0 160 44">
          <rect x="2" y="2" width="40" height="40" rx="12" fill="#C9F33C" />
          <path d="M14 30V14L30 30V14" stroke="#0D2B3E" strokeWidth="3.2" />
          <text x="52" y="29" fontSize="22" fontWeight="800" fill="#0D2B3E">
            Next <tspan fill="#7A8A95">Hire</tspan>
          </text>
        </svg>
      </div>

      {/* DESKTOP LINKS */}
      <ul className="nav-center desktop-only">
        <li onClick={() => go("/home")}>Home</li>
        <li onClick={() => go("/job")}>Jobs</li>
      </ul>

      {/* DESKTOP ACTIONS */}
      <div className="nav-actions desktop-only">
        {role === "recruiter" && (
          <button className="btn-secondary" onClick={() => go("/recruiter")}>
            Recruiter
          </button>
        )}

        <button className="btn-secondary" onClick={() => go("/my-jobs")}>
          My Jobs
        </button>

        <button className="btn-primary" onClick={() => go("/profile")}>
          Profile
        </button>
      </div>

      {/* MOBILE BOTTOM NAV */}
      <ul className="nav-links">
        <li onClick={() => go("/home")}>Home</li>
        <li onClick={() => go("/job")}>Jobs</li>
        <li onClick={() => go("/my-jobs")}>My Jobs</li>

        {role === "recruiter" && (
          <li onClick={() => go("/recruiter")}>Recruiter</li>
        )}

        <li onClick={() => go("/profile")}>Profile</li>
      </ul>
    </nav>
  );
};

export default Navbar;
