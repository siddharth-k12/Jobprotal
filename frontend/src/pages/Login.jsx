import { Link, Links, useNavigate } from "react-router-dom";
import logo from "../assets/imagefor.png";
import "../styles/LoginRegister.css";
import { useState } from "react";
import { userApi } from "../api/api";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  //email and password useState
  const [Email, setEmail] = useState("");
  const [password, setpassword] = useState("");

  // login handler axios funciton
  async function loginHandler(data) {
    try {
      const res = await userApi.post("/login", data);
      console.log(res.data);
      toast.success("user is login")
      navigate('/home')
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  //button disable funciton
  const isDisable = Email.trim() === "" || password.trim() === "";

  //form handler
  function formHandler(e) {
    e.preventDefault();

    if (isDisable) return; //when this function is true lower function not work

    const data = {
      email: Email,
      password: password,
    };
    loginHandler(data);
  }
  return (
    // main container
    <div className="login-main-container ">
      {/* right side container */}
      <div className="right-side-main">
        <img src={logo} alt="" />
      </div>

      {/* left side container */}
      <div className="left-side-main">
        {/* left side form container */}
        <form className="left-form" onSubmit={(e) => formHandler(e)}>
          {/* top heading */}
          <div className="login-top-heading">
            <p className="first-font">Welcome to NextHire</p>
            <p className="p-login">Log in</p>
          </div>
          {/* form hadler */}
          <label htmlFor="email">Email</label>
          {/* email input */}
          <input
            type="text"
            id="email"
            value={Email}
            className="input-fleid"
            onChange={(e) => setEmail(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          {/* password input */}

          <input
            type="text"
            id="password"
            value={password}
            className="input-fleid"
            onChange={(e) => setpassword(e.target.value)}
          />

          <button
            type="submit"
            disabled={isDisable}
            style={{
              cursor: isDisable ? "not-allowed" : "pointer",
              opacity: isDisable ? 0.3 : 1,
            }}
          >
            Login
          </button>
          <hr />
          <div className="login-bottom">
            <p className="login-account">
              Don't have an account?
              <Link to={"/register"} className="left-link">
                Register
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
