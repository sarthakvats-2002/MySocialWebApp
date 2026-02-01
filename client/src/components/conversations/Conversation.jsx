import { useEffect, useState } from "react";
import "./conversation.css";
import api from "../../apiCalls";

export default function Conversation({ conversation, currentUser, isOnline }) {
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const friendId = conversation.members.find((m) => m !== currentUser._id);

    const getUser = async () => {
      try {
        const res = await api.get("/users?userId=" + friendId);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    getUser();
  }, [currentUser, conversation]);

  return (
    <div className="conversation">
      <div className="conversationImgContainer">
        <img
          className="conversationImg"
          src={
            user?.profilePicture
              ? PF + user.profilePicture
              : PF + "noAvatar.png"
          }
          alt=""
        />
        {isOnline && <div className="conversationOnlineBadge"></div>}
      </div>
      <div className="conversationInfo">
        <span className="conversationName">{user?.username}</span>
        {conversation.lastMessage && (
          <span className="conversationLastMessage">
            {conversation.lastMessage.substring(0, 30)}
            {conversation.lastMessage.length > 30 && "..."}
          </span>
        )}
      </div>
    </div>
  );
}

