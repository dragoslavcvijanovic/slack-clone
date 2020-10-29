import React from "react";
import "./Message.css";
import ReactEmoji from "react-emoji";
// {timestamp?.toUTCString()}
function Message({ id, message, timestamp, user, userImage }) {
  if (message.startsWith("<a")) {
    let niz = message.split("|");
    niz[1] = "http://localhost:3001" + niz[1];
    return (
      <div id={id} className="message">
        <img src={userImage} alt="" />
        <div className="message_info">
          <h4>
            {user} <span className="message_timestamp"></span>
          </h4>
          <p>
            <a href={niz[1]}>{niz[2]}</a>
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div id={id} className="message">
        <img src={userImage} alt="" />
        <div className="message_info">
          <h4>
            {user} <span className="message_timestamp"></span>
          </h4>
          <p>{ReactEmoji.emojify(message)}</p>
        </div>
      </div>
    );
  }
}

export default Message;
