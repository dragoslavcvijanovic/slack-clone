import React, { Component, useState, useEffect } from "react";
import "./Sidebar.css";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import CreateIcon from "@material-ui/icons/Create";
import SidebarOption from "./SidebarOption.js";
import AddIcon from "@material-ui/icons/Add";
import { useStateValue } from "./StateProvider";
import { socket } from "../SocketServer";
import { useImmer } from "use-immer";
import { useParams } from "react-router-dom";

function Sidebar() {
  const { roomId } = useParams();
  const [channels, setChannels] = useImmer([]);

  const [{ user }] = useStateValue();

  useEffect(() => {
    socket.emit("getRoomList", { roomId: roomId });
  }, [roomId]);

  //spisak room-ova
  useEffect(() => {
    if (!roomId) {
      socket.on("roomList", (roomList) => {
        console.log("room list");
        setChannels((draft) => {
          draft.splice(0, draft.length);
        });
        roomList.forEach((elem) =>
          setChannels((draft) => {
            console.log(elem);
            draft.push(elem);
          })
        );
      });
    }
  }, [roomId, setChannels]);

  return (
    <div className="Sidebar">
      <div className="sidebar_header">
        <div className="sidebar_info">
          <h3>
            <FiberManualRecordIcon />
            {user?.displayName}
          </h3>
        </div>
        <CreateIcon />
      </div>

      <SidebarOption Icon={AddIcon} addChannelOption title="Add Channel" />
      {channels.map(({ id, name }) => (
        <SidebarOption title={name} id={id} key={id} />
      ))}
    </div>
  );
}
export default Sidebar;
