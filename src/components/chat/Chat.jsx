import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import { IoSend, IoCloseOutline } from "react-icons/io5"; // Import IoCloseOutline
import { IoChatbubblesSharp } from "react-icons/io5";
import { useChatContext } from "../../providers/ChatProvider";
import { useAuthContext } from "../../providers/AuthProvider";
import { timeFormater } from "../../../utils/helpers/TimeFormater";
import { Link } from "react-router-dom";

const Chat = ({ orderId, client, freelancer, isChatOpen, toggleChat }) => {
  const { loadedUserProfile } = useAuthContext();
  const iconSize = 25;
  const { loadingChats, chats, getChats, sendChat, socket, typingData } =
    useChatContext();

  const [typing, setTyping] = useState(false);
  const [msg, setMsg] = useState("");
  const messageRef = useRef();
  const chatBoxRef = useRef();

  const getReceiver = () => {
    return client.user.username;
  };

  const checkMsg = () => {
    setMsg(messageRef.current.value);

    const data = JSON.stringify({
      message: "typing",
      orderId: orderId,
      receiver: getReceiver(),
    });
    if (socket.OPEN) {
      socket.send(data);
    }
  };

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight * 2;
    }
  }, [chats.list]);

  const submitMessage = (e) => {
    e.preventDefault();

    if (msg) {
      sendChat(msg, orderId, getReceiver()).then(() => {
        setMsg("");
      });
    }
  };

  useEffect(() => {
    if (typingData?.order_id === orderId) {
      setTyping(typingData.typing);
    } else {
      setTyping(false);
    }
  }, [typingData, orderId]);

  useEffect(() => {
    orderId && getChats(orderId);
  }, [orderId, loadedUserProfile]);

  return (
    <div className={`chat ${isChatOpen ? "show" : ""}`}>
      <div className="chat-header">
        <Link to={`../client-profile/${getReceiver()}`}
              className="receiver-profile">
          <article className="img-chat">{`${
            getReceiver()?.charAt(0)?.toUpperCase() +
            getReceiver()?.slice(1).slice(0, 1)
          }`}</article>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <article>{getReceiver()}</article>
            {typing && <span>Typing...</span>}
          </div>
        </Link>
        <IoCloseOutline className="close-chat" onClick={toggleChat} size={24} />
      </div>
      {chats.list?.length > 0 ? (
        <div className="messages-box" id="msg" ref={chatBoxRef}>
          {chats.list?.map((msg, index) => {
            return (
              <div
                key={index}
                className={
                  msg.sender?.username === loadedUserProfile?.username
                    ? "send-message"
                    : "received-message"
                }
              >
                <article>{msg.message}</article>
                <div className="time">
                  <small className="sent-at">
                    {timeFormater(msg.timestamp)}
                  </small>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-inbox">
          <IoChatbubblesSharp color="#fff" size={50} />
          <article>Start chat</article>
        </div>
      )}
      <form className="message-reply-box" onSubmit={submitMessage}>
        <input
          required
          type="text"
          className="bg-gray-500 text-white"
          value={msg}
          ref={messageRef}
          onChange={checkMsg}
          placeholder="Type your message"
        />
        <IoSend
          title={!msg && "Type a message"}
          size={25}
          type="submit"
          className={msg ? "submit-message active" : "submit-message inactive"}
        />
      </form>
    </div>
  );
};

export default Chat;
