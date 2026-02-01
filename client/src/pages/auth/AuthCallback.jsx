import { useEffect, useContext } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function AuthCallback() {
  const history = useHistory();
  const location = useLocation();
  const { dispatch } = useContext(AuthContext);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userStr = params.get("user");
    const error = params.get("error");

    if (error) {
      alert("Google authentication failed. Please try again.");
      history.push("/login");
      return;
    }

    if (token && userStr) {
      try {
        const user = JSON.parse(decodeURIComponent(userStr));
        
        // Store token and user data
        const userData = {
          ...user,
          token: token,
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
        
        // Redirect to home
        history.push("/");
      } catch (err) {
        console.error("Auth callback error:", err);
        history.push("/login");
      }
    } else {
      history.push("/login");
    }
  }, [location, history, dispatch]);

  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      height: "100vh",
      fontSize: "18px",
      color: "#666"
    }}>
      Completing sign in...
    </div>
  );
}

