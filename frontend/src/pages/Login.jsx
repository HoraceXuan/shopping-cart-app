import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import "./Auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/api/login", {
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
        setMessage(data.message || "Login failed.");
        setMessageType("error");
        return;
      }

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", data.user.email);

      setMessage("Login successful. Redirecting...");
      setMessageType("success");

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Cannot connect to backend server.");
      setMessageType("error");
    }
  };

  return (
    <Layout>
      <div className="auth-page">
        <div className="auth-card">
          <h1>Welcome Back</h1>

          <p className="auth-subtitle">
            Login to manage your cart and orders.
          </p>

          <form className="auth-form" onSubmit={handleLogin}>
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {message && (
              <div className={`auth-message ${messageType}`}>{message}</div>
            )}

            <button type="submit">Login</button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one</Link>
          </p>
        </div>

        <div className="auth-side">
          <h2>AI Shop Assistant</h2>

          <p>
            Your smart assistant helps you search products, manage your cart,
            and track orders in one place.
          </p>
        </div>
      </div>
    </Layout>
  );
}