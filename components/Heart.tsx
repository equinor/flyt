import { Icon } from "@equinor/eds-core-react";
import React, { useState } from "react";
import { favorite_outlined, favorite_filled } from "@equinor/eds-icons";

export default function Heart(props: {
  isFavourite: boolean;
  fave: () => void;
  unfave: () => void;
}): JSX.Element {
  const [isHighlighted, setIsHighlighted] = useState(false);

  return (
    <div
      style={{ alignSelf: "center", margin: "12px" }}
      onMouseEnter={(e) => {
        e.stopPropagation();
        setIsHighlighted(true);
      }}
      onMouseLeave={(e) => {
        e.stopPropagation();
        setIsHighlighted(false);
      }}
      onClick={(e) => {
        e.stopPropagation();
        props.isFavourite ? props.unfave() : props.fave();
      }}
    >
      {props.isFavourite ? (
        <Icon color="#ff1243" data={favorite_filled} />
      ) : isHighlighted ? (
        <Icon color="#DADADA" data={favorite_filled} />
      ) : (
        <Icon color="#DADADA" data={favorite_outlined} />
      )}
    </div>
  );
}
