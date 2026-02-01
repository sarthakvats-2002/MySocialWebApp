import "./post.css";
import { MoreVert, Delete, ChatBubbleOutline } from "@material-ui/icons";
import { useContext, useEffect, useState } from "react";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Comments from "../comments/Comments";
import api from "../../apiCalls";
import toast from "react-hot-toast";

export default function Post({ post, onDelete }) {
  const [like, setLike] = useState(post.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [user, setUser] = useState({});
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    setIsLiked(post.likes.includes(currentUser._id));
  }, [currentUser._id, post.likes]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users?userId=${post.userId}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [post.userId]);

  const likeHandler = async () => {
    try {
      await api.put("/posts/" + post._id + "/like", { userId: currentUser._id });
      setLike(isLiked ? like - 1 : like + 1);
      setIsLiked(!isLiked);
    } catch (err) {
      toast.error("Failed to like post");
    }
  };

  const deleteHandler = async () => {
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
    <div className="post">
      <div className="postWrapper">
        <div className="postTop">
          <div className="postTopLeft">
            <Link to={`/profile/${user.username}`}>
              <img
                className="postProfileImg"
                src={
                  user.profilePicture
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
          {post.img && <img className="postImg" src={PF + post.img} alt="" />}
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
