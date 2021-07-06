import React, { ReactNode, useEffect } from "react";

export const MySnackBar = (props: {
  children: ReactNode;
  autoHideDuration: number;
  handleClose: () => void;
}): JSX.Element => {
  useEffect(() => {
    setTimeout(() => {
      props.handleClose();
    }, props.autoHideDuration);
  }, []);

  return (
    <div
      onClick={() => props.handleClose()}
      style={{
        position: "absolute", // or fixed? https://css-tricks.com/absolute-relative-fixed-positioining-how-do-they-differ/
        bottom: 0,
        right: 0,
        margin: 20,
        backgroundColor: "rgb(46,46,46)",
        padding: 14,
        borderRadius: 4,
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        color: "white",
      }}
    >
      {props.children}
    </div>
  );
};
