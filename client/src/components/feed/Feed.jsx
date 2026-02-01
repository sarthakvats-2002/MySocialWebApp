import { useContext, useEffect, useState, useCallback } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import Stories from "../stories/Stories";
import "./feed.css";
import { AuthContext } from "../../context/AuthContext";
import api from "../../apiCalls";

export default function Feed({ username }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = username
        ? await api.get("/posts/profile/" + username)
        : await api.get("/posts/timeline/" + user._id);
      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  }, [username, user._id]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleNewPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter((p) => p._id !== postId));
  };

  return (
    <div className="feed">
      <div className="feedWrapper">
        {!username && <Stories />}
        {(!username || username === user.username) && (
          <Share onNewPost={handleNewPost} />
        )}
        {loading ? (
          <div className="loadingSpinner">Loading posts...</div>
        ) : posts.length === 0 ? (
          <div className="noPosts">No posts yet. Start sharing!</div>
        ) : (
          posts.map((p) => (
            <Post key={p._id} post={p} onDelete={handleDeletePost} />
          ))
        )}
      </div>
    </div>
  );
}
