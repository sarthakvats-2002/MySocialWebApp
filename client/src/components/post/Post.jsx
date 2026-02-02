import "./post.css";
import { MoreVert, Delete, ChatBubbleOutline } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Comments from "../comments/Comments";
import api from "../../apiCalls";
import toast from "react-hot-toast";

export default function Post({ post, onDelete, index }) {
  const [like, setLike] = useState(post.likes ? post.likes.length : 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  // Check if this is a mock post (has username embedded)
  const isMockPost = post.username && post.userProfilePic;

  useEffect(() => {
    if (post.likes) {
      setIsLiked(post.likes.includes(currentUser._id));
    }
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    // If it's a mock post, use embedded data
    if (isMockPost) {
      setUser({
        username: post.username,
        profilePicture: post.userProfilePic,
      });
      return;
    }

    // Otherwise fetch user from API
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users?userId=${post.userId}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [post.userId, post.username, post.userProfilePic, isMockPost]);

  const likeHandler = async () => {
    // For mock posts, just toggle locally
    if (isMockPost) {
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
      return;
    }

    try {
      await api.put("/posts/" + post._id + "/like", { userId: currentUser._id });
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
    } catch (err) {
      toast.error("Failed to like post");
    }
  };

  const deleteHandler = async () => {
    // Mock posts can't be deleted
    if (isMockPost) {
      toast.error("Cannot delete sample posts");
      return;
    }

    try {
      await api.delete(`/posts/${post._id}`, { data: { userId: currentUser._id } });
      toast.success("Post deleted successfully!");
      if (onDelete) onDelete(post._id);
    } catch (err) {
      toast.error("Failed to delete post");
    }
  };

  const controlMenu = () => {
    setIsOpened((wasOpened) => !wasOpened);
  };

  return (
    <div 
      className="post"
      style={{ 
        animation: `fadeIn 0.6s ease-out ${index * 0.1}s both` 
      }}
    >
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  isMockPost
                    ? user.profilePicture
                    : user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "noAvatar.png"
                }
                alt=""
              />
            </Link>
            <div className="postUserInfo">
              <span className="postUsername">{user.username}</span>
              <span className="postDate">{format(post.createdAt)}</span>
            </div>
          </div>
          <div className="postTopRight" onClick={controlMenu}>
            <MoreVert />
            {isOpened && currentUser._id === post.userId && (
              <div className="deleteBox" onClick={deleteHandler}>
                Delete Post <Delete />
              </div>
            )}
          </div>
        </div>
        <div className="postCenter">
          <span className="postText">{post?.desc}</span>
          {post.img && (
            <img 
              className="postImg" 
              src={isMockPost ? post.img : PF + post.img} 
              alt="" 
            />
          )}
        </div>
        <div className="postBottom">
          <div className="postBottomLeft">
            <img
              className={`likeIcon ${isLiked ? "liked" : ""}`}
              src={`${PF}like.png`}
              onClick={likeHandler}
              alt=""
            />
            <span className="postLikeCounter">{like} likes</span>
          </div>
          <div className="postBottomRight">
            <span
              className="postCommentText"
              onClick={() => setShowComments(!showComments)}
            >
              <ChatBubbleOutline fontSize="small" /> {post.comments || 0} comments
            </span>
          </div>
        </div>
        {showComments && <Comments postId={post._id} />}
      </div>
    </div>
  );
}
