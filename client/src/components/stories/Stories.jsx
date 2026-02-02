import { useContext, useEffect, useState } from "react";
import "./stories.css";
import { AuthContext } from "../../context/AuthContext";
import { Add } from "@material-ui/icons";
import api from "../../apiCalls";
import toast from "react-hot-toast";
import { mockStories } from "../../mockData";

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [showAddStory, setShowAddStory] = useState(false);
  const [file, setFile] = useState(null);
  const [storyText, setStoryText] = useState("");
  const { user } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const res = await api.get(`/stories/timeline/${user._id}`);
        
        // Group real stories by user
        const groupedStories = res.data.reduce((acc, story) => {
          if (!acc[story.userId]) {
            acc[story.userId] = [];
          }
          acc[story.userId].push(story);
          return acc;
        }, {});

        // Add mock stories (each story in its own group)
        const mockStoryGroups = mockStories.map(story => [story]);
        
        // Combine real and mock stories
        const allStories = [...Object.values(groupedStories), ...mockStoryGroups];
        setStories(allStories);
      } catch (err) {
        console.error("Error fetching stories:", err);
        // If API fails, just show mock stories
        setStories(mockStories.map(story => [story]));
      }
    };
    fetchStories();
  }, [user._id]);

  const handleAddStory = async () => {
    if (!file) {
      toast.error("Please select an image for your story");
      return;
    }

    try {
      const data = new FormData();
      data.append("name", Date.now() + file.name);
      data.append("file", file);

      const uploadRes = await api.post("/upload", data);

      const newStory = {
        userId: user._id,
        img: uploadRes.data.filename,
        text: storyText,
      };

      await api.post("/stories", newStory);
      toast.success("Story added!");
      setFile(null);
      setStoryText("");
      setShowAddStory(false);
      
      // Refresh stories
      const res = await api.get(`/stories/timeline/${user._id}`);
      const groupedStories = res.data.reduce((acc, story) => {
        if (!acc[story.userId]) {
          acc[story.userId] = [];
        }
        acc[story.userId].push(story);
        return acc;
      }, {});
      setStories(Object.values(groupedStories));
    } catch (err) {
      toast.error("Failed to add story");
      console.error(err);
    }
  };

  return (
    <div className="stories">
      {/* Add Story Card */}
      <div className="storyCard addStory" onClick={() => setShowAddStory(true)}>
        <img
          src={
            user.profilePicture ? PF + user.profilePicture : PF + "noAvatar.png"
          }
          alt=""
          className="storyImg"
        />
        <div className="storyAddIcon">
          <Add />
        </div>
        <span className="storyUsername">Add Story</span>
      </div>

      {/* User Stories */}
      {stories.map((userStories, index) => (
        <StoryCard key={index} stories={userStories} />
      ))}

      {/* Add Story Modal */}
      {showAddStory && (
        <div className="storyModal" onClick={() => setShowAddStory(false)}>
          <div className="storyModalContent" onClick={(e) => e.stopPropagation()}>
            <h3>Create a Story</h3>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="storyFileInput"
            />
            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt=""
                className="storyPreview"
              />
            )}
            <input
              type="text"
              placeholder="Add text to your story (optional)"
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              className="storyTextInput"
            />
            <div className="storyModalButtons">
              <button onClick={() => setShowAddStory(false)} className="storyCancelBtn">
                Cancel
              </button>
              <button onClick={handleAddStory} className="storyShareBtn">
                Share Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StoryCard({ stories }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showStory, setShowStory] = useState(false);
  const [user, setUser] = useState(null);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;

  const isMockStory = stories[0]._id && stories[0]._id.startsWith("story");

  useEffect(() => {
    // If it's a mock story, use embedded user data
    if (isMockStory) {
      setUser({
        username: stories[0].username,
        profilePicture: stories[0].userProfilePic,
      });
      return;
    }

    // Otherwise fetch user from API
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users?userId=${stories[0].userId}`);
        setUser(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [stories, isMockStory]);

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setShowStory(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  if (!user) return null;

  return (
    <>
      <div className="storyCard" onClick={() => setShowStory(true)}>
        <img
          src={isMockStory ? stories[0].img : PF + stories[0].img}
          alt=""
          className="storyImg"
        />
        <img
          src={
            isMockStory
              ? user.profilePicture
              : user.profilePicture
              ? PF + user.profilePicture
              : PF + "noAvatar.png"
          }
          alt=""
          className="storyProfileImg"
        />
        <span className="storyUsername">{user.username}</span>
      </div>

      {showStory && (
        <div className="storyViewer" onClick={() => setShowStory(false)}>
          <div className="storyViewerContent" onClick={(e) => e.stopPropagation()}>
            <div className="storyHeader">
              <img
                src={
                  isMockStory
                    ? user.profilePicture
                    : user.profilePicture
                    ? PF + user.profilePicture
                    : PF + "noAvatar.png"
                }
                alt=""
                className="storyViewerProfileImg"
              />
              <span>{user.username}</span>
            </div>
            <img
              src={isMockStory ? stories[currentIndex].img : PF + stories[currentIndex].img}
              alt=""
              className="storyViewerImg"
            />
            {stories[currentIndex].text && (
              <div className="storyViewerText">{stories[currentIndex].text}</div>
            )}
            <div className="storyNavigation">
              {currentIndex > 0 && (
                <button onClick={handlePrev} className="storyPrev">
                  ←
                </button>
              )}
              <span className="storyCounter">
                {currentIndex + 1} / {stories.length}
              </span>
              <button onClick={handleNext} className="storyNext">
                →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

