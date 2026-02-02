import { useContext, useEffect, useState, useCallback } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import Stories from "../stories/Stories";
import PostSkeleton from "../skeleton/PostSkeleton";
import "./feed.css";
import { AuthContext } from "../../context/AuthContext";
import api from "../../apiCalls";
import { mockPosts } from "../../mockData";

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
      
      const realPosts = res.data || [];
      
      // Combine real posts with mock posts (real posts first)
      const combinedPosts = [...realPosts, ...mockPosts].sort((p1, p2) => {
        return new Date(p2.createdAt) - new Date(p1.createdAt);
      });
      
      setPosts(combinedPosts);
    } catch (err) {
      console.error("Error fetching posts:", err);
      // If API fails, just show mock posts
      setPosts(mockPosts);
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
          <>
            <PostSkeleton />
            <PostSkeleton />
            <PostSkeleton />
          </>
        ) : (
          posts.map((p, index) => (
            <Post key={p._id} post={p} onDelete={handleDeletePost} index={index} />
          ))
        )}
      </div>
    </div>
  );
}
