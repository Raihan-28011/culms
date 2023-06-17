import React, { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

import "./css/signup.css";
import axios from "../axios";

function Signup() {
  const { notify, setNotify } = useOutletContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSignup = () => {
    axios.post("/auth/signup", { name, email, password }).then((res) => {
      if (res.data !== "Signup successful") {
        setError(res.data);
        return;
      }
      setNotify((prev) => {
        return {
          ...prev,
          type: "info",
          header: "Signup",
          body: [
            <span>You are successfully signedup</span>,
            <span>
              Now you can <a href="/login">Login</a>
            </span>,
          ],
          interval: undefined,
        };
      });
      navigate("/login");
    });
  };

  return (
    <div className="signup-container flex-row">
      <div className="signup flex-row">
        <div className="signup-left flex-column">
          <h1 style={{ fontSize: "1.75rem" }}>Get Started Now</h1>
          <h3 style={{ fontSize: "0.9rem" }}>
            Explore online learning platform with CULMS
          </h3>
        </div>
        <div className="signup-right flex-column">
          <div className="signup-right-top flex-column">
            <Link to={"/"}>
              <img src="/culms_logo.png" alt="culms logo" />
            </Link>
          </div>
          <div className="signup-right-middle flex-column">
            <div className="form flex-column">
              <div className="form-head flex-column">
                <span>SIGNUP</span>
                <span style={{ fontSize: "0.8rem", fontWeight: "300" }}>
                  Signup today for free
                </span>
              </div>
              <div className="form-body flex-column">
                <div className="form-body-row flex-column">
                  <label>Name*</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                      setName((prev) => {
                        setError("");
                        return e.target.value;
                      })
                    }
                  />
                </div>
                <div className="form-body-row flex-column">
                  <label>Email address*</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) =>
                      setEmail((prev) => {
                        setError("");
                        return e.target.value;
                      })
                    }
                  />
                </div>
                <div className="form-body-row flex-column">
                  <label>Password*</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) =>
                      setPassword((prev) => {
                        setError("");
                        return e.target.value;
                      })
                    }
                  />
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
                  onClick={handleSignup}
                >
                  SIGNUP
                </button>
              </div>{" "}
              <div className="form-tail flex-row">
                <span>Already have an account? </span>
                <Link to="/login">
                  <span
                    style={{ color: "var(--color3-100)", fontWeight: "bold" }}
                  >
                    LOG IN
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

export default Signup;
