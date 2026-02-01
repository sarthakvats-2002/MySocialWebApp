import "./rightbar.css";
import Online from "../online/Online";
import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import { Add, Remove, PersonAdd } from "@material-ui/icons";
import api from "../../apiCalls";

export default function Rightbar({ user }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [friends, setFriends] = useState([]);
  const [onlineFriends, setOnlineFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const { onlineUsers } = useContext(SocketContext);
  const [followed, setFollowed] = useState(
    currentUser && user ? !currentUser.followings?.includes(user._id) : false
  );

  // Fetch user friends
  useEffect(() => {
    const getFriends = async () => {
      if (user?._id) {
        try {
          const friendList = await api.get("/users/friends/" + user._id);
          setFriends(friendList.data);
        } catch (err) {
          console.error("Error fetching friends:", err);
        }
      }
    };
    getFriends();
  }, [user]);

  // Fetch online friends for home rightbar
  useEffect(() => {
    const getOnlineFriends = async () => {
      if (!user && currentUser?._id) {
        try {
          setLoading(true);
          const friendList = await api.get("/users/friends/" + currentUser._id);
          
          // Filter friends who are online
          const onlineList = friendList.data.filter((friend) =>
            onlineUsers.some((onlineUser) => onlineUser.userId === friend._id)
          );
          
          setOnlineFriends(onlineList);
        } catch (err) {
          console.error("Error fetching online friends:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    getOnlineFriends();
  }, [user, currentUser, onlineUsers]);

  // Fetch friend suggestions
  useEffect(() => {
    const getSuggestions = async () => {
      if (!user && currentUser?._id) {
        try {
          // Get all users and filter out current user and already followed users
          const res = await api.get("/users/all");
          const filtered = res.data
            .filter(
              (u) =>
                u._id !== currentUser._id &&
                !currentUser.followings?.includes(u._id)
            )
            .slice(0, 5); // Show only 5 suggestions
          setSuggestions(filtered);
        } catch (err) {
          console.error("Error fetching suggestions:", err);
        }
      }
    };
    getSuggestions();
  }, [user, currentUser]);

  const handleClick = async () => {
    try {
      if (followed) {
        await api.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await api.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
    } catch (err) {
      console.error("Error following/unfollowing:", err);
    }
  };

  const handleFollowSuggestion = async (userId) => {
    try {
      await api.put(`/users/${userId}/follow`, {
        userId: currentUser._id,
      });
      dispatch({ type: "FOLLOW", payload: userId });
      // Remove from suggestions
      setSuggestions(suggestions.filter((s) => s._id !== userId));
    } catch (err) {
      console.error("Error following user:", err);
    }
  };

  const HomeRightbar = () => {
    return (
      <div className="rightbarHome">
        {/* Suggestions Section */}
        {suggestions.length > 0 && (
          <div className="rightbarSection">
            <div className="rightbarSectionHeader">
              <h4 className="rightbarTitle">Suggestions For You</h4>
              <Link to="/explore" className="rightbarSeeAll">
                See All
              </Link>
            </div>
            <div className="suggestionsList">
              {suggestions.map((suggestion) => (
                <div key={suggestion._id} className="suggestionItem">
                  <Link
                    to={`/profile/${suggestion.username}`}
                    className="suggestionUser"
                  >
                    <img
                      src={
                        suggestion.profilePicture
                          ? PF + suggestion.profilePicture
                          : PF + "noAvatar.png"
                      }
                      alt=""
                      className="suggestionAvatar"
                    />
                    <div className="suggestionInfo">
                      <span className="suggestionUsername">
                        {suggestion.username}
                      </span>
                      <span className="suggestionMutual">
                        {suggestion.followers?.length || 0} followers
                      </span>
                    </div>
                  </Link>
                  <button
                    className="suggestionFollow"
                    onClick={() => handleFollowSuggestion(suggestion._id)}
                  >
                    Follow
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Online Friends Section */}
        <div className="rightbarSection">
          <h4 className="rightbarTitle">
            Online Friends ({onlineFriends.length})
          </h4>
          {loading ? (
            <div className="rightbarLoading">
              <div className="spinner"></div>
            </div>
          ) : onlineFriends.length > 0 ? (
            <ul className="rightbarFriendList">
              {onlineFriends.map((friend) => (
                <Online key={friend._id} user={friend} />
              ))}
            </ul>
          ) : (
            <div className="noOnlineFriends">
              <p>No friends online right now</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ProfileRightbar = () => {
    return (
      <div className="rightbarProfile">
        {user && user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? (
              <>
                <Remove /> Unfollow
              </>
            ) : (
              <>
                <Add /> Follow
              </>
            )}
          </button>
        )}
        
        {user && (user.city || user.from || user.relationship) && (
          <>
            <h4 className="rightbarTitle">User Information</h4>
            <div className="rightbarInfo">
              {user.city && (
                <div className="rightbarInfoItem">
                  <span className="rightbarInfoKey">City:</span>
                  <span className="rightbarInfoValue">{user.city}</span>
                </div>
              )}
              {user.from && (
                <div className="rightbarInfoItem">
                  <span className="rightbarInfoKey">From:</span>
                  <span className="rightbarInfoValue">{user.from}</span>
                </div>
              )}
              {user.relationship && (
                <div className="rightbarInfoItem">
                  <span className="rightbarInfoKey">Relationship:</span>
                  <span className="rightbarInfoValue">
                    {user.relationship === 1
                      ? "Single"
                      : user.relationship === 2
                      ? "Married"
                      : "Complicated"}
                  </span>
                </div>
              )}
            </div>
          </>
        )}

        {friends.length > 0 && (
          <>
            <h4 className="rightbarTitle">Friends ({friends.length})</h4>
            <div className="rightbarFollowings">
              {friends.map((friend) => (
                <Link
                  key={friend._id}
                  to={"/profile/" + friend.username}
                  className="rightbarFollowing"
                >
                  <img
                    src={
                      friend.profilePicture
                        ? PF + friend.profilePicture
                        : PF + "noAvatar.png"
                    }
                    alt=""
                    className="rightbarFollowingImg"
                  />
                  <span className="rightbarFollowingName">
                    {friend.username}
                  </span>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
