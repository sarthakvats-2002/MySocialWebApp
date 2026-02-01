import "./leftbar.css";
import {
  Home,
  Chat,
  People,
  Notifications,
  Settings,
  ExitToApp,
} from "@material-ui/icons";
import { Link, useHistory } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { logoutCall } from "../../apiCalls";

export default function Leftbar() {
  const { user, dispatch } = useContext(AuthContext);
  const history = useHistory();
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const handleLogout = async () => {
    await logoutCall(user._id, dispatch);
    history.push("/login");
  };

  const menuItems = [
    { icon: <Home />, text: "Home", link: "/" },
    { icon: <Chat />, text: "Messages", link: "/messenger" },
    { icon: <People />, text: "Friends", link: "/" },
    { icon: <Notifications />, text: "Notifications", link: "/" },
    { icon: <Settings />, text: "Settings", link: "/" },
  ];

  return (
    <div className="leftbar">
      <div className="leftbarWrapper">
        {/* User Profile Card */}
        <Link to={`/profile/${user.username}`} className="leftbarProfileCard">
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "noAvatar.png"
            }
            alt=""
            className="leftbarProfileImg"
          />
          <div className="leftbarProfileInfo">
            <span className="leftbarProfileName">{user.username}</span>
            <span className="leftbarProfileBio">View profile</span>
          </div>
        </Link>

        <hr className="leftbarDivider" />

        {/* Navigation Menu */}
        <nav className="leftbarNav">
          {menuItems.map((item, index) => (
            <Link
              to={item.link}
              key={index}
              className="leftbarNavItem"
            >
              <div className="leftbarNavIcon">{item.icon}</div>
              <span className="leftbarNavText">{item.text}</span>
            </Link>
          ))}
        </nav>

        <hr className="leftbarDivider" />

        {/* Logout Button */}
        <button className="leftbarLogoutBtn" onClick={handleLogout}>
          <ExitToApp className="leftbarNavIcon" />
          <span className="leftbarNavText">Logout</span>
        </button>
      </div>
    </div>
  );
}
