import "./share.css";
import {
  PermMedia,
  Cancel,
} from "@material-ui/icons";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../../apiCalls";
import toast from "react-hot-toast";

export default function Share({ onNewPost }) {
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (!desc.trim() && !file) {
      toast.error("Please write something or add an image");
      return;
    }

    setLoading(true);
    const newPost = {
      userId: user._id,
      desc: desc,
    };

    try {
      if (file) {
        const data = new FormData();
        data.append("name", Date.now() + file.name);
        data.append("file", file);
        
        const uploadRes = await api.post("/upload", data);
        newPost.img = uploadRes.data.filename;
      }

      const res = await api.post("/posts", newPost);
      
      if (onNewPost) {
        onNewPost(res.data);
      }

      setDesc("");
      setFile(null);
      toast.success("Post shared successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to share post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="share">
      <div className="shareWrapper">
        <div className="shareTop">
          <img
            className="shareProfileImg"
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "noAvatar.png"
            }
            alt=""
          />
          <input
            placeholder={"What's on your mind, " + user.username + "?"}
            className="shareInput"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <hr className="shareHr" />
        {file && (
          <div className="shareImgContainer">
            <img className="shareImg" src={URL.createObjectURL(file)} alt="" />
            <Cancel className="shareCancelImg" onClick={() => setFile(null)} />
          </div>
        )}
        <form className="shareBottom" onSubmit={submitHandler}>
          <div className="shareOptions">
            <label htmlFor="file" className="shareOption">
              <PermMedia htmlColor="tomato" className="shareIcon" />
              <span className="shareOptionText">Photo/Video</span>
              <input
                style={{ display: "none" }}
                type="file"
                id="file"
                accept=".png,.jpeg,.jpg,.gif,.webp"
                onChange={(e) => setFile(e.target.files[0])}
              />
            </label>
          </div>
          <button 
            className="shareButton" 
            type="submit"
            disabled={loading}
          >
            {loading ? "Sharing..." : "Share"}
          </button>
        </form>
      </div>
    </div>
  );
}
