import { useContext, useEffect, useState } from "react";
import "./comments.css";
import api from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { format } from "timeago.js";
import { Send, Delete } from "@material-ui/icons";
import toast from "react-hot-toast";

export default function Comments({ postId, mockComments = [] }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [users, setUsers] = useState({});
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        // If mock comments provided, use them
        if (mockComments && mockComments.length > 0) {
          setComments(mockComments);
          // Mock comments already have user data embedded
          const usersData = {};
          mockComments.forEach((comment) => {
            usersData[comment.userId] = {
              _id: comment.userId,
              username: comment.username,
              profilePicture: comment.userProfilePic,
            };
          });
          setUsers(usersData);
          return;
        }

        // Otherwise fetch from API
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
        // If API fails and we have mock comments, use them
        if (mockComments && mockComments.length > 0) {
          setComments(mockComments);
        }
      }
    };
    fetchComments();
  }, [postId, mockComments]);

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
        {comments.map((comment) => {
          const isMockComment = comment.userProfilePic !== undefined;
          const commentUser = isMockComment
            ? {
                username: comment.username,
                profilePicture: comment.userProfilePic,
              }
            : users[comment.userId];

          return (
            <div key={comment._id} className="commentItem">
              <img
                src={
                  isMockComment
                    ? comment.userProfilePic
                    : commentUser?.profilePicture
                    ? PF + commentUser.profilePicture
                    : "https://i.pravatar.cc/150?img=68"
                }
                alt=""
                className="commentImg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://i.pravatar.cc/150?img=68";
                }}
              />
              <div className="commentContent">
                <div className="commentBubble">
                  <span className="commentUsername">
                    {isMockComment ? comment.username : commentUser?.username || "Unknown"}
                  </span>
                  <p className="commentText">{comment.text}</p>
                </div>
                <div className="commentBottom">
                  <span className="commentTime">{format(comment.createdAt)}</span>
                  {!isMockComment && comment.userId === user._id && (
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
          );
        })}
      </div>
    </div>
  );
}

