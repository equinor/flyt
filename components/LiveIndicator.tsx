import { ColorDot } from "./ColorDot";
import colors from "../theme/colors";
import React from "react";

export function LiveIndicator(props: { live: boolean; title: string }) {
  const { live } = props;
  return (
    <div style={{ position: "absolute", right: 0 }}>
      <div
        style={{
          paddingRight: 24,
          paddingBottom: 12,
          display: "flex",
          alignItems: "center",
        }}
        title={props.title}
      >
        <div style={{ padding: 5 }}>
          <ColorDot color={live ? colors.SUCCESS : colors.ERROR} />
        </div>
        {live ? <p>Live</p> : <p>Disconnected</p>}
      </div>
    </div>
  );
}