import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "./Auth.css";

export default function Register() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Registration failed.");
        setMessageType("error");
        return;
      }

      setMessage("Registration successful. Redirecting to login...");
      setMessageType("success");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      console.error("Register error:", error);
      setMessage("Cannot connect to backend server.");
      setMessageType("error");
    }
  };

  return (
    <Layout>
      <div className="auth-page">
        <div className="auth-card">
          <h1>Create Account</h1>

          <p className="auth-subtitle">
            Register to start your smart shopping journey.
          </p>

          <form className="auth-form" onSubmit={handleRegister}>
            <label>Email Account</label>

            <input
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Letters + numbers, max 10 characters"
              value={password}
              maxLength={10}
              onChange={(event) => setPassword(event.target.value)}
            />

            <p className="auth-rule">
              Password must contain both letters and numbers, with no more than
              10 characters.
            </p>

            {message && (
              <div className={`auth-message ${messageType}`}>{message}</div>
            )}

            <button type="submit">Register</button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>

        <div className="auth-side">
          <h2>Smart Shopping Starts Here</h2>

          <p>
            Create an account to save your cart, view your order history, and
            enjoy a personalized shopping experience.
          </p>
        </div>
      </div>
    </Layout>
  );
}