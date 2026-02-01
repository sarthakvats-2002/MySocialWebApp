import React from "react";
import "./skeleton.css";

export default function StorySkeleton() {
  return (
    <div className="story">
      <div className="skeleton skeleton-story"></div>
      <div className="skeleton skeleton-text" style={{ width: "60px", margin: "8px auto 0" }}></div>
    </div>
  );
}

