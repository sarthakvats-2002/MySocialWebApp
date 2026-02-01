import "./topbar.css";
import {
  Search,
  Chat,
  Notifications,
  ExitToApp,
  Brightness4,
  Brightness7,
} from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import { SocketContext } from "../../context/SocketContext";
import { logoutCall } from "../../apiCalls";
import api from "../../apiCalls";
import toast from "react-hot-toast";

export default function Topbar() {
  const { user, dispatch } = useContext(AuthContext);
  const { darkMode, toggle } = useContext(ThemeContext);
  const { onlineUsers, socket } = useContext(SocketContext);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
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
        toast.success(`New ${notification.type} notification`);
      });
    }
  }, [socket]);

  // Handle search
  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim()) {
      setShowSearch(true);
      try {
        const res = await api.get(`/users/search?q=${query}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Search error:", err);
      }
    } else {
      setShowSearch(false);
      setSearchResults([]);
    }
  };

  const handleLogout = async () => {
    await logoutCall(user._id, dispatch);
    history.push("/login");
    toast.success("Logged out successfully");
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">🔥 EchoConnect</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Search for friends..."
            className="searchInput"
            value={searchQuery}
            onChange={handleSearch}
          />
          {showSearch && searchResults.length > 0 && (
            <div className="searchResults">
              {searchResults.map((result) => (
                <Link
                  key={result._id}
                  to={`/profile/${result.username}`}
                  className="searchResultItem"
                  onClick={() => {
                    setShowSearch(false);
                    setSearchQuery("");
                  }}
                >
                  <img
                    src={
                      result.profilePicture
                        ? PF + result.profilePicture
                        : PF + "noAvatar.png"
                    }
                    alt=""
                    className="searchResultImg"
                  />
                  <span>{result.username}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarIcons">
          <div className="topbarIconItem" onClick={toggle}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
          </div>
          <Link to="/messenger">
            <div className="topbarIconItem">
              <Chat />
              {onlineUsers.length > 1 && (
                <span className="topbarIconBadge">{onlineUsers.length - 1}</span>
              )}
            </div>
          </Link>
          <div className="topbarIconItem">
            <Notifications />
            {unreadCount > 0 && (
              <span className="topbarIconBadge">{unreadCount}</span>
            )}
          </div>
          <div className="topbarIconItem" onClick={handleLogout}>
            <ExitToApp />
          </div>
        </div>
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
      </div>
    </div>
  );
}
