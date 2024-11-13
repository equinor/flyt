import { Button, Typography } from "@equinor/eds-core-react";
import { useState } from "react";

type TextCircleProps = {
  color: string;
  text: string;
  outlined?: boolean;
  onClick?: () => void;
};

export const TextCircle = ({
  color,
  text,
  outlined,
  onClick,
}: TextCircleProps) => {
  const [hovering, setHovering] = useState(false);

  const active = !outlined || hovering;

  const textColor = active ? "white" : color;
  const backgroundColor = active ? color : "transparent";
  const border = active ? "none" : `2px dotted ${color}`;

  return (
    <Button
      style={{
        backgroundColor,
        border,
        height: "30px",
        width: "30px",
      }}
      variant="contained_icon"
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <Typography variant="body_short" color={textColor}>
        {text}
      </Typography>
    </Button>
  );
};
