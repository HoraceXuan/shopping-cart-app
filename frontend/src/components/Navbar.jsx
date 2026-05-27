import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCartCount } from "../utils/cartStorage";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();

  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  const userEmail = localStorage.getItem("userEmail");

  const updateCartCount = () => {
    setCartCount(getCartCount());
  };

  useEffect(() => {
    updateCartCount();

    const checkLoginStatus = () => {
      setIsLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    window.addEventListener("cartUpdated", updateCartCount);
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("cartUpdated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("shopping_cart_items");

    setIsLoggedIn(false);
    setCartCount(0);

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to={isLoggedIn ? "/home" : "/login"} className="navbar-logo">
        AI Shop
      </Link>

      {isLoggedIn ? (
        <>
          <div className="navbar-links">
            <Link to="/home">Home</Link>
            <Link to="/products">Products</Link>

            <Link to="/cart" className="cart-nav-link">
              Cart
              {cartCount > 0 && (
                <span className="cart-count-badge">{cartCount}</span>
              )}
            </Link>

            <Link to="/orders">Orders</Link>
            <Link to="/admin">Admin</Link>
          </div>

          <div className="navbar-auth">
            <span className="navbar-user">{userEmail}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="navbar-links">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </div>

          <div className="navbar-auth"></div>
        </>
      )}
    </nav>
  );
}