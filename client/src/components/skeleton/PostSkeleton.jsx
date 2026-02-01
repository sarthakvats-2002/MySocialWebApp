import React from "react";
import "./skeleton.css";

export default function PostSkeleton() {
  return (
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <div className="skeleton skeleton-avatar"></div>
            <div>
              <div className="skeleton skeleton-text" style={{ width: "120px", marginBottom: "8px" }}></div>
              <div className="skeleton skeleton-text" style={{ width: "80px" }}></div>
            </div>
          </div>
        </div>
        <div className="postCenter">
          <div className="skeleton skeleton-text" style={{ width: "100%", marginBottom: "8px" }}></div>
          <div className="skeleton skeleton-text" style={{ width: "80%", marginBottom: "16px" }}></div>
          <div className="skeleton skeleton-image"></div>
        </div>
        <div className="postBottom">
          <div className="skeleton skeleton-text" style={{ width: "60px" }}></div>
          <div className="skeleton skeleton-text" style={{ width: "80px" }}></div>
        </div>
      </div>
    </div>
  );
}

