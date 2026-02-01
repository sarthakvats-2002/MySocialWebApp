import { useRef, useState } from "react";
import "./register.css";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import api from "../../apiCalls";
import { PersonAdd, Email, Lock, Visibility, VisibilityOff } from "@material-ui/icons";
import toast, { Toaster } from "react-hot-toast";

export default function Register() {
  const username = useRef();
  const email = useRef();
  const password = useRef();
  const confirmPassword = useRef();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleClick = async (e) => {
    e.preventDefault();
    
    // Clear previous custom validity
    confirmPassword.current.setCustomValidity("");
    
    if (confirmPassword.current.value !== password.current.value) {
      toast.error("❌ Passwords don't match!");
      confirmPassword.current.focus();
      return;
    }

    if (password.current.value.length < 6) {
      toast.error("❌ Password must be at least 6 characters!");
      password.current.focus();
      return;
    }

    const user = {
      username: username.current.value.trim(),
      email: email.current.value.trim(),
      password: password.current.value,
    };

    try {
      setLoading(true);
      const response = await api.post("/auth/register", user);
      toast.success("✅ Account created successfully! Redirecting...");
      
      // Store token
      localStorage.setItem("token", response.data.token);
      
      setTimeout(() => {
        history.push("/login");
      }, 1500);
    } catch (err) {
      console.error("Registration error:", err);
      
      // Handle validation errors
      if (err.response?.data?.errors && Array.isArray(err.response.data.errors)) {
        // Show first validation error
        const firstError = err.response.data.errors[0];
        toast.error(`❌ ${firstError.msg}`);
        
        // Focus on the problematic field
        if (firstError.param === 'username') username.current.focus();
        else if (firstError.param === 'email') email.current.focus();
        else if (firstError.param === 'password') password.current.focus();
      } 
      // Handle other errors
      else if (err.response?.data?.message) {
        toast.error(`❌ ${err.response.data.message}`);
      } 
      // Fallback
      else {
        toast.error("❌ Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <Toaster position="top-center" />
      <div className="register-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="register-content">
        <div className="register-left">
          <div className="brand-section">
            <h1 className="brand-logo">
              <span className="gradient-text">Echo</span>Connect
            </h1>
            <p className="brand-tagline">
              Connect with friends and the world around you
            </p>
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">💬</div>
                <div className="feature-text">
                  <h4>Real-time Chat</h4>
                  <p>Instant messaging with friends</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">📖</div>
                <div className="feature-text">
                  <h4>Stories</h4>
                  <p>Share moments that matter</p>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔔</div>
                <div className="feature-text">
                  <h4>Live Notifications</h4>
                  <p>Never miss an update</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="register-right">
          <div className="register-card">
            <div className="card-header">
              <PersonAdd className="header-icon" />
              <h2>Create Account</h2>
              <p>Join the community today</p>
            </div>

            <form className="register-form" onSubmit={handleClick}>
              <div className="input-group">
                <div className="input-wrapper">
                  <PersonAdd className="input-icon" />
                  <input
                    type="text"
                    placeholder="Username"
                    required
                    ref={username}
                    className="modern-input"
                    minLength="3"
                    maxLength="20"
                  />
                </div>
              </div>

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
                    placeholder="Password (min 6 characters)"
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

              <div className="input-group">
                <div className="input-wrapper">
                  <Lock className="input-icon" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    required
                    ref={confirmPassword}
                    className="modern-input"
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </button>
                </div>
              </div>

              <button 
                className="submit-button" 
                type="submit"
                disabled={loading}
              >
                {loading ? (
                  <span className="loader"></span>
                ) : (
                  <>
                    <PersonAdd />
                    <span>Create Account</span>
                  </>
                )}
              </button>

              <div className="divider">
                <span>Already have an account?</span>
              </div>

              <Link to="/login" className="link-button">
                <button className="secondary-button" type="button">
                  Log into Account
                </button>
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
