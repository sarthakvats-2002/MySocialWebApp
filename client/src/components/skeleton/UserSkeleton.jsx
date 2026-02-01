import React from "react";
import "./skeleton.css";

export default function UserSkeleton() {
  return (
    <div className="suggestionItem">
      <div className="suggestionUser">
        <div className="skeleton skeleton-avatar-sm"></div>
        <div style={{ flex: 1 }}>
          <div className="skeleton skeleton-text" style={{ width: "100px", marginBottom: "6px" }}></div>
          <div className="skeleton skeleton-text" style={{ width: "80px" }}></div>
        </div>
      </div>
      <div className="skeleton skeleton-button"></div>
    </div>
  );
}

