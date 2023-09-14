import CloseFriend from "../closeFriends/CloseFriend";
import "./leftbar.css"
import { RssFeed, Announcement, QuestionAnswer, Help, PeopleOutline, WorkOutline, Event, DateRange } from "@material-ui/icons";
import { Users } from "../../dummyData";
import { useHistory } from "react-router";
import { loginCall } from "../../apiCalls";
import { AuthContext } from "../../context/AuthContext";
import { useContext } from "react";

export default function Leftbar() {
    const { dispatch } = useContext(AuthContext);
    const history = useHistory();
    const handleClick = async (e) => {
        localStorage.clear();
        loginCall(
            { email: null, password: null },
            dispatch
          );
        history.push("/login");
    }
    return (
        <div className="leftbar">
            <div className="leftbarWrapper">
                <ul className="leftbarList">
                    <li className="leftbarListItem">
                        <RssFeed className="leftbarIcon" />
                        <span className="leftbarListItemText">Feed</span>
                    </li>
                    <li className="leftbarListItem">
                        <Announcement className="leftbarIcon" />
                        <span className="leftbarListItemText">Announcement</span>
                    </li>
                    <li className="leftbarListItem">
                        <QuestionAnswer className="leftbarIcon" />
                        <span className="leftbarListItemText">QnA</span>
                    </li>
                    <li className="leftbarListItem">
                        <Help className="leftbarIcon" />
                        <span className="leftbarListItemText">Help</span>
                    </li>
                    <li className="leftbarListItem">
                        <PeopleOutline className="leftbarIcon" />
                        <span className="leftbarListItemText">PeopleOutline</span>
                    </li>
                    <li className="leftbarListItem">
                        <WorkOutline className="leftbarIcon" />
                        <span className="leftbarListItemText">WorkOutline</span>
                    </li>
                    <li className="leftbarListItem">
                        <Event className="leftbarIcon" />
                        <span className="leftbarListItemText">Event</span>
                    </li>
                    <li className="leftbarListItem">
                        <DateRange className="leftbarIcon" />
                        <span className="leftbarListItemText">DateRange</span>
                    </li>
                </ul>
                <button className="leftbarButton" onClick={handleClick}>Log Out</button>
                <hr className="leftbarHr" />
                <ul className="leftbarFriendList">
                    {Users.map((u) => (
                        <CloseFriend key={u.id} user={u} />
                    ))}
                </ul>
            </div>
        </div>
    );
}
