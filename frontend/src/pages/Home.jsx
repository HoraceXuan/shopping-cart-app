import Layout from "../components/Layout";
import "./Home.css";

export default function Home() {
  return (
    <Layout>
      <section className="home-hero">
        <div className="hero-content">
          <p className="hero-badge">AI-powered shopping experience</p>

          <h1>
            Smart Shopping
            <br />
            Made Simple
          </h1>

          <p className="hero-description">
            Browse products, manage your cart, track orders, and enjoy a cleaner
            shopping experience with your AI shopping assistant.
          </p>

          <div className="hero-actions">
            <a href="/products" className="primary-btn">
              Start Shopping
            </a>
            <a href="/cart" className="secondary-btn">
              View Cart
            </a>
          </div>
        </div>

        <div className="hero-card">
          <div className="card-header">
            <span className="status-dot"></span>
            AI Assistant
          </div>

          <div className="assistant-preview">
            <div className="robot">
              <div className="robot-head">
                <span className="robot-eye"></span>
                <span className="robot-eye"></span>
              </div>
              <div className="robot-body">
                <div className="robot-screen"></div>
              </div>
              <div className="robot-arms">
                <span></span>
                <span></span>
              </div>
              <div className="robot-legs">
                <span></span>
                <span></span>
              </div>
            </div>

            <p>Hello! I can help you find products faster.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}