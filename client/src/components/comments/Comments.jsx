import { useContext, useEffect, useState } from "react";
import "./comments.css";
import api from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { format } from "timeago.js";
import { Send, Delete } from "@material-ui/icons";
import toast from "react-hot-toast";

export default function Comments({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [users, setUsers] = useState({});
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await api.get(`/comments/${postId}`);
        setComments(res.data);

        // Fetch user data for each comment
        const userIds = [...new Set(res.data.map((c) => c.userId))];
        const userPromises = userIds.map((id) => api.get(`/users?userId=${id}`));
        const userResponses = await Promise.all(userPromises);

        const usersData = {};
        userResponses.forEach((response) => {
          usersData[response.data._id] = response.data;
        });
        setUsers(usersData);
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
    };
    fetchComments();
  }, [postId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await api.post("/comments", {
        postId,
        userId: user._id,
        text: newComment,
      });

      setComments([res.data, ...comments]);
      setUsers({ ...users, [user._id]: user });
      setNewComment("");
      toast.success("Comment added!");
    } catch (err) {
      toast.error("Failed to add comment");
      console.error(err);
    }
  };

  const handleDelete = async (commentId) => {
    try {
      await api.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success("Comment deleted!");
    } catch (err) {
      toast.error("Failed to delete comment");
      console.error(err);
    }
  };

  return (
    <div className="comments">
      <div className="commentInputWrapper">
        <img
          src={
            user.profilePicture ? PF + user.profilePicture : PF + "noAvatar.png"
          }
          alt=""
          className="commentInputImg"
        />
        <form onSubmit={handleSubmit} className="commentForm">
          <input
            type="text"
            placeholder="Write a comment..."
            className="commentInput"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className="commentSubmitButton">
            <Send fontSize="small" />
          </button>
        </form>
      </div>

      <div className="commentList">
        {comments.map((comment) => (
          <div key={comment._id} className="commentItem">
            <img
              src={
                users[comment.userId]?.profilePicture
                  ? PF + users[comment.userId].profilePicture
                  : PF + "noAvatar.png"
              }
              alt=""
              className="commentImg"
            />
            <div className="commentContent">
              <div className="commentBubble">
                <span className="commentUsername">
                  {users[comment.userId]?.username || "Unknown"}
                </span>
                <p className="commentText">{comment.text}</p>
              </div>
              <div className="commentBottom">
                <span className="commentTime">{format(comment.createdAt)}</span>
                {comment.userId === user._id && (
                  <span
                    className="commentDelete"
                    onClick={() => handleDelete(comment._id)}
                  >
                    <Delete fontSize="small" /> Delete
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

