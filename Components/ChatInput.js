import React, { useState } from "react";
import "./ChatInput.css";
import { socket } from "../SocketServer";
import { useStateValue } from "./StateProvider";
import Emoji from "./Emoji";
function ChatInput({ channelName, channelId, addMessage }) {
  const [input, setInput] = useState("");
  const [{ user }] = useStateValue();

  const sendMessage = (e) => {
    e.preventDefault();

    if (channelId) {
      addMessage({ input });
    }

    setInput("");
  };

  const openFileDialogClicked = (e) => {
    openFileDialog(".txt,text/plain", true, fileDialogChanged);
  };
  function openFileDialog(accept, multy = false, callback) {
    var inputElement = document.createElement("input");
    inputElement.type = "file";
    inputElement.accept = accept; // Note Edge does not support this attribute
    if (multy) {
      inputElement.multiple = multy;
    }
    if (typeof callback === "function") {
      inputElement.addEventListener("change", callback);
    }
    inputElement.dispatchEvent(new MouseEvent("click"));
  }

  function fileDialogChanged(event) {
    [...this.files].forEach((file) => {
      console.log(file);

      var reader = new FileReader();
      reader.readAsText(file, "UTF-8");

      // here we tell the reader what to do when it's done reading...
      reader.onload = (readerEvent) => {
        var content = readerEvent.target.result; // this is the content!
        socket.emit("saljemFajl", {
          type: file.type,
          user: user.displayName,
          photoURL: user.photoURL,
          ime: file.name,
          channelId: channelId,
          content: content,
        });
      };
    });
  }

  return (
    <div className="chatInput">
      <form>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message #${channelName?.toLowerCase()}`}
        />
        <button className="button2" type="submit" onClick={sendMessage}>
          SEND
        </button>
        {/*<a id="userButton" onClick={openFileDialogClicked}>
          Open file dialog
  </a>*/}
      </form>

      <button
        className="button"
        id="userButton"
        onClick={openFileDialogClicked}
      >
        File
      </button>
      <Emoji />
    </div>
  );
}
export default ChatInput;
