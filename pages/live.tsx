import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Layouts } from "../layouts/LayoutWrapper";
import { getAccessToken } from "../auth/msalHelpers";

function getUserString(e) {
  if (e.fullName) return <> by User {e.fullName}</>;
  return <></>;
}

export default function LiveEventPage() {
  const [events, setEvents] = useState([]);
  const [socket, setSocket] = useState(null);

  // const [socket] = useState(io({ path: "/api/socket" }));
  useEffect((): any => {
    getAccessToken().then((accessToken) => {
      const opts = { path: "/api/socket", auth: { token: accessToken } };
      console.log(opts);
      const s = io(opts);
      // Handling token expiration
      s.on("connect_error", (error) => {
        // if (error.data.type === "UnauthorizedError") {
        console.log(error);
        // }
      });

      s.on("connect", () => {
        console.log("Socket connected!");
      });

      s.on("disconnect", (reason) => {
        console.log("Socket disconnect", reason);
      });

      s.onAny((eventName, ...args) => {
        console.log(eventName, ...args);
        setEvents((prevState) => [
          { ...args[0], date: new Date().toLocaleTimeString() },
          ...prevState,
        ]);
      });
      s.onAny((message) => console.log({ message }));
      s.emit(`room-0`, { message: "Hello!" });
      s.send("Hello!");

      setSocket(s);
      return () => s.disconnect();
    });
  }, []);

  return (
    <div>
      <h1>Live events</h1>
      <button onClick={() => socket.emit("update", "PING!")}>PING!</button>

      {events.map((e) => {
        return (
          <p key={`${e.date}${e.fullName}`} title={JSON.stringify(e)}>
            {e.date} | {e.msg} {getUserString(e)} in project {e.roomId}
          </p>
        );
      })}
    </div>
  );
}

LiveEventPage.layout = Layouts.Default;
LiveEventPage.auth = true;
