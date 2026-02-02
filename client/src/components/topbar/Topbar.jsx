import "./topbar.css";
import { Search, Chat, Notifications, Home, Settings, ExitToApp } from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import { logoutCall } from "../../apiCalls";
import api from "../../apiCalls";

export default function Topbar() {
  const { user, dispatch } = useContext(AuthContext);
  const { onlineUsers, socket } = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const history = useHistory();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await api.get(`/notifications/${user._id}`);
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n) => !n.read).length);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifications();
  }, [user._id]);

  // Listen for new notifications
  useEffect(() => {
    if (socket) {
      socket.on("getNotification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        setUnreadCount((prev) => prev + 1);
      });
    }
  }, [socket]);

  // Search functionality
  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length > 0) {
        try {
          const res = await api.get(`/users/search?q=${searchQuery}`);
          setSearchResults(res.data);
          setShowSearch(true);
        } catch (err) {
          console.error("Error searching users:", err);
        }
      } else {
        setSearchResults([]);
        setShowSearch(false);
      }
    };

    const debounce = setTimeout(() => {
      searchUsers();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const handleLogout = async () => {
    await logoutCall(user._id, dispatch);
    history.push("/login");
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        {/* Logo */}
        <Link to="/" className="topbarLeft">
          <div className="logoContainer">
            <div className="logoGlow"></div>
            <span className="logo">🔥</span>
          </div>
          <span className="logoText">EchoConnect</span>
        </Link>

        {/* Search */}
        <div className="topbarCenter">
          <div className="searchbar">
            <Search className="searchIcon" />
            <input
              placeholder="Search for friends..."
              className="searchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {showSearch && searchResults.length > 0 && (
            <div className="searchDropdown">
              {searchResults.map((user) => (
                <Link
                  key={user._id}
                  to={`/profile/${user.username}`}
                  className="searchResult"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                >
                  <img
                    src={
                      user.profilePicture
                        ? PF + user.profilePicture
                        : PF + "noAvatar.png"
                    }
                    alt=""
                    className="searchResultImg"
                  />
                  <span className="searchResultName">{user.username}</span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Icons */}
        <div className="topbarRight">
          <Link to="/" className="topbarIconContainer">
            <Home className="topbarIcon" />
          </Link>

          <Link to="/messenger" className="topbarIconContainer">
            <Chat className="topbarIcon" />
            {onlineUsers.length > 0 && (
              <span className="topbarIconBadge">{onlineUsers.length}</span>
            )}
          </Link>

          <div
            className="topbarIconContainer"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Notifications className="topbarIcon" />
            {unreadCount > 0 && (
              <span className="topbarIconBadge">{unreadCount}</span>
            )}
          </div>

          <div className="topbarDivider"></div>

          <Link to={`/profile/${user.username}`} className="topbarProfile">
            <img
              src={
                user.profilePicture
                  ? PF + user.profilePicture
                  : PF + "noAvatar.png"
              }
              alt=""
              className="topbarProfileImg"
            />
            <span className="topbarUsername">{user.username}</span>
          </Link>

          <button className="topbarLogout" onClick={handleLogout}>
            <ExitToApp className="topbarIcon" />
          </button>
        </div>
      </div>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="notificationsDropdown">
          <h3 className="notificationsTitle">Notifications</h3>
          {notifications.length === 0 ? (
            <p className="noNotifications">No notifications yet</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif._id} className="notificationItem">
                <div className="notificationContent">
                  <span className="notificationText">
                    New {notif.type} notification
                  </span>
                  <span className="notificationTime">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
