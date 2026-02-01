import { useContext, useRef, useState } from "react";
import "./login.css";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Email, Lock, Visibility, VisibilityOff, ExitToApp } from "@material-ui/icons";
import toast, { Toaster } from "react-hot-toast";

export default function Login() {
  const email = useRef();
  const password = useRef();
  const { isFetching, dispatch, error } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    
    try {
      await loginCall(
        { email: email.current.value, password: password.current.value },
        dispatch
      );
    } catch (err) {
      toast.error(err?.response?.data?.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="login-container">
      <Toaster position="top-center" />
      <div className="login-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="login-content">
        <div className="login-left">
          <div className="brand-section">
            <h1 className="brand-logo">
              <span className="gradient-text">Echo</span>Connect
            </h1>
            <p className="brand-tagline">
              Welcome back! Connect with friends and share your moments.
            </p>
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <div className="feature-text">
                  <h4>Lightning Fast</h4>
                  <p>Real-time updates and notifications</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔒</div>
                <div className="feature-text">
                  <h4>Secure & Private</h4>
                  <p>Your data is safe with us</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🌍</div>
                <div className="feature-text">
                  <h4>Global Community</h4>
                  <p>Connect with people worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
          <div className="login-card">
            <div className="card-header">
              <ExitToApp className="header-icon" />
              <h2>Welcome Back</h2>
              <p>Login to your account</p>
            </div>

            <form className="login-form" onSubmit={handleClick}>
              <div className="input-group">
                <div className="input-wrapper">
                  <Email className="input-icon" />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    ref={email}
                    className="modern-input"
                  />
                </div>
              </div>

              <div className="input-group">
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    ref={password}
                    className="modern-input"
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </div>

              <div className="forgot-password">
                <a href="#" onClick={(e) => {
                  e.preventDefault();
                  toast.info("Password reset feature coming soon!");
                }}>
                  Forgot Password?
                </a>
              </div>

              <button 
                className="submit-button" 
                type="submit"
                disabled={isFetching}
              >
                {isFetching ? (
                  <span className="loader"></span>
                ) : (
                  <>
                    <ExitToApp />
                    <span>Log In</span>
                  </>
                )}
              </button>

              {error && (
                <div className="error-message">
                  Invalid credentials. Please try again.
                </div>
              )}

              <div className="divider">
                <span>Don't have an account?</span>
              </div>

              <Link to="/register" className="link-button">
                <button className="secondary-button" type="button">
                  Create New Account
                </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
