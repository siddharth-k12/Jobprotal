import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { userApi } from "../api/api";
import "../styles/Nav.css";
import { toast } from "react-toastify";

const Navbar = () => {
  const navigate = useNavigate();

  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRole = async () => {
      try {
        const res = await userApi.get("/role");

        setRole(res.data.currentUser.role);
      } catch (error) {
        console.error("Role fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    getRole();
  }, []);

  const go = (path) => {
    navigate(path);
  };

  const logoutUser = async () => {
    try {
      await userApi.post("/logout");

      toast.success("User logged out");

      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);

      toast.error(
        error.response?.data?.message ||
        "Logout failed"
      );
    }
  };

  return (
    <nav className="nav">

      {/* ================= LOGO ================= */}

      <div
        className="logo"
        onClick={() => go("/home")}
      >
        <svg
          width="160"
          height="44"
          viewBox="0 0 160 44"
        >
          <rect
            x="2"
            y="2"
            width="40"
            height="40"
            rx="12"
            fill="#C9F33C"
          />

          <path
            d="M14 30V14L30 30V14"
            stroke="#0D2B3E"
            strokeWidth="3.2"
          />

          <text
            x="52"
            y="29"
            fontSize="22"
            fontWeight="800"
            fill="#0D2B3E"
          >
            Next{" "}
            <tspan fill="#7A8A95">
              Hire
            </tspan>
          </text>
        </svg>
      </div>


      {/* ================= CENTER ================= */}

      <ul className="nav-center desktop-only">

        <li onClick={() => go("/home")}>
          Home
        </li>

        <li onClick={() => go("/job")}>
          Jobs
        </li>

      </ul>


      {/* ================= RIGHT ================= */}

      <div className="nav-actions desktop-only">

        {/* My Jobs */}

        <button
          className="btn-secondary"
          onClick={() => go("/my-jobs")}
        >
          My Jobs
        </button>


        {/* ATS Analyzer */}

        <button
          className="btn-secondary"
          onClick={() => go("/ai/ats")}
        >
          ATS Analyzer
        </button>


        {/* Profile */}

        <button
          className="btn-primary"
          onClick={() => go("/profile")}
        >
          Profile
        </button>

      </div>


      {/* ================= MOBILE ================= */}

      <ul className="nav-links">

        <li onClick={() => go("/home")}>
          Home
        </li>

        <li onClick={() => go("/job")}>
          Jobs
        </li>

        <li onClick={() => go("/my-jobs")}>
          My Jobs
        </li>

        <li onClick={() => go("/ai/ats")}>
          ATS Analyzer
        </li>

        <li onClick={() => go("/profile")}>
          Profile
        </li>

      </ul>

    </nav>
  );
};

export default Navbar;