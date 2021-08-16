import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Layouts } from "../layouts/LayoutWrapper";

function getUserString(e) {
  if (e.user) return <> by User {e.user}</>;
  return <></>;
}

function LiveEventPage() {
  const [events, setEvents] = useState([]);
  const [socket] = useState(io({ path: "/api/socket" }));
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected!");
    });

    socket.on("disconnect", (reason) => {
      console.log("Socket disconnect", reason);
    });

    socket.onAny((eventName, ...args) => {
      console.log(eventName, ...args);
      setEvents((prevState) => [
        { ...args[0], date: new Date().toLocaleTimeString() },
        ...prevState,
      ]);
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [socket]);

  return (
    <div>
      <h1>Live events</h1>
      {events.map((e) => {
        return (
          <p key={`${e.date}${e.user}`} title={JSON.stringify(e)}>
            {e.date} | {e.msg} {getUserString(e)} in project {e.roomId}
          </p>
        );
      })}
    </div>
  );
}

export default LiveEventPage;

LiveEventPage.layout = Layouts.Default;
LiveEventPage.auth = true;
