import React, { ReactNode, useEffect } from "react";

export const MySnackBar = (props: {
  children: ReactNode;
  autoHideDuration: number;
  onClose: () => void;
}): JSX.Element => {
  useEffect(() => {
    setTimeout(() => {
      props.onClose();
    }, props.autoHideDuration);
  }, []);

  return (
    <div
      onClick={() => {
        props.onClose();
      }}
      style={{
        position: "absolute",
        bottom: 0,
        right: 0,
        margin: 20,
        backgroundColor: "rgb(46,46,46)",
        padding: 14,
        borderRadius: 4,
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        color: "white",
        zIndex: 1000,
      }}
    >
      {props.children}
    </div>
  );
};
