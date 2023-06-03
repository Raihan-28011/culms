import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import "./css/login.css";
import axios from "../axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    axios.post("/auth/login", { email, password }).then((res) => {
      localStorage.setItem("user", JSON.stringify(res.data));
      navigate(`/users/${res.data.u_id}`);
    });
  };

  return (
    <div className="login-container flex-row">
      <div className="login flex-row">
        <div className="login-left flex-column">
          <h1 style={{ fontSize: "1.75rem" }}>Welcome Back</h1>
          <h3 style={{ fontSize: "0.9rem" }}>
            Explore online learning platform with CULMS
          </h3>
        </div>
        <div className="login-right flex-column">
          <div className="login-right-top flex-column">
            <Link to={"/"}>
              <img src="/culmsLogo.svg" alt="culms logo" />
            </Link>
          </div>
          <div className="login-right-middle flex-column">
            <div className="form flex-column">
              <div className="form-head flex-column">
                <span>LOGIN</span>
                <span style={{ fontSize: "0.8rem", fontWeight: "300" }}>
                  Login and explore
                </span>
              </div>
              <div className="form-body flex-column">
                <div className="form-body-row flex-column">
                  <label>Email address*</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => {
                      setError("");
                      setEmail(e.target.value);
                    }}
                  />
                </div>
                <div className="form-body-row flex-column">
                  <label>Password*</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => {
                      setError("");
                      setPassword(e.target.value);
                    }}
                  />
                  <span
                    style={{
                      color: "var(--color2-100)",
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    Forgot Password?
                  </span>
                  <span
                    className={error.length === 0 ? "hidden" : ""}
                    style={{
                      color: "var(--color1-100)",
                      backgroundColor: "var(--color1-20)",
                      borderRadius: "var(--b-radius2)",
                      marginTop: "0.5rem",
                      height: "2rem",
                      fontWeight: "500",
                      display: error.length !== 0 ? "flex" : "none",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {error}
                  </span>
                </div>
                <button
                  className="button1"
                  style={{ marginTop: "0.5rem" }}
                  onClick={handleLogin}
                >
                  LOGIN
                </button>
              </div>{" "}
              <div className="form-tail flex-row">
                <span>Don't have an account? </span>
                <Link to="/signup">
                  <span
                    style={{ color: "var(--color3-100)", fontWeight: "bold" }}
                  >
                    SIGNUP
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
