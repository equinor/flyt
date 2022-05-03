import React from "react";
import { Icon } from "@equinor/eds-core-react";
import { hourglass_empty } from "@equinor/eds-icons";

export function Loading({ isLoading = true }: { isLoading?: boolean }) {
  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <Icon data={hourglass_empty} size={48} />
        <div style={{ fontSize: "1.2rem", marginTop: "0.5rem" }}>
          Loading...
        </div>
      </div>
    );
  }
  return null;
}
