import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Leftbar from "../../components/leftbar/Leftbar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState, useContext } from "react";
import { useParams, useHistory } from "react-router";
import { AuthContext } from "../../context/AuthContext";
import { Chat, PersonAdd, PersonRemove } from "@material-ui/icons";
import api from "../../apiCalls";
import toast from "react-hot-toast";
import { mockUsers, mockPosts } from "../../mockData";

export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const [followed, setFollowed] = useState(false);
  const [isMockUser, setIsMockUser] = useState(false);
  const username = useParams().username;
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const history = useHistory();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users?username=${username}`);
        setUser(res.data);
        setFollowed(currentUser.followings.includes(res.data._id));
        setIsMockUser(false);
      } catch (err) {
        console.error("Error fetching user:", err);
        // Check if it's a mock user
        const mockUser = mockUsers.find((u) => u.username === username);
        if (mockUser) {
          setUser(mockUser);
          setIsMockUser(true);
          setFollowed(false);
          toast.info("This is a demo profile");
        } else {
          toast.error("User not found");
        }
      }
    };
    fetchUser();
  }, [username, currentUser.followings]);

  const handleFollow = async () => {
    if (isMockUser) {
      toast.info("This is a demo profile. Follow real users to connect!");
      return;
    }

    try {
      if (followed) {
        await api.put(`/users/${user._id}/unfollow`, { userId: currentUser._id });
        dispatch({ type: "UNFOLLOW", payload: user._id });
        setFollowed(false);
        toast.success(`Unfollowed ${user.username}`);
      } else {
        await api.put(`/users/${user._id}/follow`, { userId: currentUser._id });
        dispatch({ type: "FOLLOW", payload: user._id });
        setFollowed(true);
        toast.success(`Following ${user.username}`);
      }
    } catch (err) {
      toast.error("Action failed");
      console.error(err);
    }
  };

  const handleMessage = async () => {
    if (isMockUser) {
      toast.info("This is a demo profile. Message real users to chat!");
      return;
    }

    try {
      // Check if conversation exists
      const res = await api.get(`/conversations/${currentUser._id}`);
      const conversation = res.data.find((c) =>
        c.members.includes(user._id)
      );

      if (conversation) {
        history.push(`/messenger?conversationId=${conversation._id}`);
      } else {
        // Create new conversation
        const newConv = await api.post("/conversations", {
          senderId: currentUser._id,
          receiverId: user._id,
        });
        history.push(`/messenger?conversationId=${newConv.data._id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to start conversation");
    }
  };

  const isOwnProfile = currentUser.username === username;

  return (
    <>
      <Topbar />
      <div className="profile">
        <Leftbar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <img
                className="profileCoverImg"
                src={
                  isMockUser
                    ? user.coverPicture
                    : user.coverPicture
                    ? PF + user.coverPicture
                    : "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop"
                }
                alt=""
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&h=400&fit=crop";
                }}
              />
              <img
                className="profileUserImg"
                src={
                  isMockUser
                    ? user.profilePicture
                    : user.profilePicture
                    ? PF + user.profilePicture
                    : "https://i.pravatar.cc/150?img=69"
                }
                alt=""
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://i.pravatar.cc/150?img=69";
                }}
              />
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc || "Hey there! I'm using EchoConnect 🎉"}</span>
              
              {!isOwnProfile && (
                <div className="profileActions">
                  <button
                    className={`profileActionBtn ${followed ? "unfollowBtn" : "followBtn"}`}
                    onClick={handleFollow}
                  >
                    {followed ? (
                      <>
                        <PersonRemove /> Unfollow
                      </>
                    ) : (
                      <>
                        <PersonAdd /> Follow
                      </>
                    )}
                  </button>
                  <button className="profileActionBtn messageBtn" onClick={handleMessage}>
                    <Chat /> Message
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}