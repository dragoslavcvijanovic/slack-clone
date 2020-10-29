import React from "react";
import "./Chat.css";
import { useParams } from "react-router-dom";
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { useEffect, useState, useRef } from "react";
import Message from "./Message.js";
import ChatInput from "./ChatInput";
import { useStateValue } from "./StateProvider";
import { useImmer } from "use-immer";
import { socket } from "../SocketServer";

function Chat() {
  const { roomId } = useParams();
  const [roomDetails, setRoomDetails] = useState(null);
  const [roomMessages, setRoomMessages] = useImmer([]);

  const [{ user }] = useStateValue();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (roomId) {
      socket.emit("userLogin", { roomId: roomId });
    }
  }, [roomId]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connect");
    });

    socket.on("userLoged", (data) => {
      console.log("userLoged:");
      setRoomMessages((draft) => {
        draft.splice(0, draft.length);
      });
      data.forEach((elem) =>
        setRoomMessages((draft) => {
          draft.push(elem);
        })
      );
      scrollToBottom();
    });

    socket.on("roomDetails", (data) => {
      console.log("roomDetails: " + data);
      setRoomDetails(data);
    });

    socket.on("addMessageFromServer", (data) => {
      if (data.roomId === roomId) {
        console.log("addMessageFromServer");
        setRoomMessages((draft) => {
          draft.push(data);
        });
        scrollToBottom();
      }
    });

    socket.on("reconnect", (attemptNumber) => {
      console.log("reconnect: " + attemptNumber);
    });

    socket.on("disconnect", () => {
      console.log("disconnect");
      socket.removeAllListeners();
    });

    socket.on("serverSaljeFajl", (poruka) => {
      console.log("serverSaljeFajl");
      console.log(poruka);
    });

    return () => {
      socket.removeAllListeners();
    };
  }, [roomMessages, setRoomMessages]);

  function scrollToBottom() {
    messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
  }

  function addMessage(message) {
    socket.emit("sendMessage", {
      input: message.input,
      channelId: roomId,
      timestamp: Date.now(),
      user: user.displayName,
      photoURL: user.photoURL,
      roomId: roomId,
    });
    console.log("AddMessage in chat.js:" + message.input);
  }
  // console.log(roomDetails);
  // console.log("messsages", roomMessages);

  return (
    <div className="Chat">
      <div className="chat_header">
        <div className="chat_headerLeft">
          <h4 className="chat_channelName">
            <strong> # {roomDetails?.name} </strong>
            <StarBorderOutlinedIcon />
          </h4>
        </div>
        <div className="chat_headerRight">
          <p>
            <InfoOutlinedIcon /> Details
          </p>
        </div>
      </div>
      <div className="chat__messages">
        {roomMessages.map(({ id, message, timestamp, user, userImage }) => (
          <Message
            key={id}
            message={message}
            timestamp={timestamp}
            user={user}
            userImage={userImage}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput
        channelName={roomDetails?.name}
        channelId={roomId}
        addMessage={addMessage}
      />
    </div>
  );
}
export default Chat;

