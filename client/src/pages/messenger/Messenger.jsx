import { useContext, useEffect, useRef, useState } from "react";
import "./messenger.css";
import Topbar from "../../components/topbar/Topbar";
import Conversation from "../../components/conversations/Conversation";
import Message from "../../components/message/Message";
import PageTransition from "../../components/animations/PageTransition";
import { AuthContext } from "../../context/AuthContext";
import { SocketContext } from "../../context/SocketContext";
import api from "../../apiCalls";
import { Send } from "@material-ui/icons";
import toast from "react-hot-toast";

export default function Messenger() {
  const [conversations, setConversations] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [arrivalMessage, setArrivalMessage] = useState(null);
  const [typing, setTyping] = useState(false);
  const { user } = useContext(AuthContext);
  const { socket, onlineUsers } = useContext(SocketContext);
  const scrollRef = useRef();

  // Listen for incoming messages
  useEffect(() => {
    if (socket) {
      socket.on("getMessage", (data) => {
        setArrivalMessage({
          sender: data.senderId,
          text: data.text,
          createdAt: Date.now(),
        });
      });

      socket.on("userTyping", ({ senderId }) => {
        if (currentChat?.members.includes(senderId)) {
          setTyping(true);
          setTimeout(() => setTyping(false), 3000);
        }
      });

      socket.on("userStopTyping", () => {
        setTyping(false);
      });
    }
  }, [socket, currentChat]);

  useEffect(() => {
    if (
      arrivalMessage &&
      currentChat?.members.includes(arrivalMessage.sender)
    ) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage, currentChat]);

  // Fetch conversations
  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await api.get("/conversations/" + user._id);
        setConversations(res.data);
      } catch (err) {
        console.error("Error fetching conversations:", err);
      }
    };
    getConversations();
  }, [user._id]);

  // Fetch messages when conversation changes
  useEffect(() => {
    const getMessages = async () => {
      if (currentChat) {
        try {
          const res = await api.get("/messages/" + currentChat._id);
          setMessages(res.data);
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      }
    };
    getMessages();
  }, [currentChat]);

  // Handle send message
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = {
      sender: user._id,
      text: newMessage,
      conversationId: currentChat._id,
    };

    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );

    // Send via socket
    if (socket) {
      socket.emit("sendMessage", {
        senderId: user._id,
        receiverId,
        text: newMessage,
        conversationId: currentChat._id,
      });
    }

    try {
      const res = await api.post("/messages", message);
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      toast.error("Failed to send message");
      console.error(err);
    }
  };

  // Handle typing
  const handleTyping = () => {
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );
    if (socket && receiverId) {
      socket.emit("typing", { senderId: user._id, receiverId });
    }
  };

  const handleStopTyping = () => {
    const receiverId = currentChat.members.find(
      (member) => member !== user._id
    );
    if (socket && receiverId) {
      socket.emit("stopTyping", { senderId: user._id, receiverId });
    }
  };

  // Auto scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Topbar />
      <PageTransition>
        <div className="messenger">
        <div className="chatMenu">
          <div className="chatMenuWrapper">
            <h3 className="chatMenuTitle">Conversations</h3>
            {conversations.map((c) => (
              <div onClick={() => setCurrentChat(c)} key={c._id}>
                <Conversation
                  conversation={c}
                  currentUser={user}
                  isOnline={onlineUsers.some(
                    (u) => c.members.includes(u.userId) && u.userId !== user._id
                  )}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="chatBox">
          <div className="chatBoxWrapper">
            {currentChat ? (
              <>
                <div className="chatBoxTop">
                  {messages.map((m) => (
                    <div ref={scrollRef} key={m._id}>
                      <Message message={m} own={m.sender === user._id} />
                    </div>
                  ))}
                  {typing && (
                    <div className="typingIndicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  )}
                </div>
                <div className="chatBoxBottom">
                  <textarea
                    className="chatMessageInput"
                    placeholder="Type a message..."
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      handleTyping();
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e);
                      }
                    }}
                    onBlur={handleStopTyping}
                    value={newMessage}
                  ></textarea>
                  <button className="chatSubmitButton" onClick={handleSubmit}>
                    <Send />
                  </button>
                </div>
              </>
            ) : (
              <span className="noConversationText">
                Select a conversation to start chatting
              </span>
            )}
          </div>
        </div>
      </div>
      </PageTransition>
    </>
  );
}

