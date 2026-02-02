import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#020617",
          color: "#fff",
          padding: "2rem",
          textAlign: "center"
        }}>
          <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️ Oops!</h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "2rem" }}>
            Something went wrong. Please refresh the page.
          </p>
          <pre style={{
            background: "rgba(255,255,255,0.1)",
            padding: "1rem",
            borderRadius: "8px",
            maxWidth: "600px",
            overflow: "auto",
            fontSize: "0.9rem",
            textAlign: "left"
          }}>
            {this.state.error?.toString()}
          </pre>
          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "2rem",
              padding: "0.75rem 2rem",
              background: "linear-gradient(to right, #1877f2, #a855f7)",
              border: "none",
              borderRadius: "8px",
              color: "white",
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

