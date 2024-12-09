import { Button, Typography } from "@equinor/eds-core-react";
import { useState } from "react";

type TextCircleProps = {
  color: string;
  text: string;
  outlined?: boolean;
  onClick?: () => void;
  title?: string;
};

export const TextCircle = ({
  color,
  text,
  outlined,
  onClick,
  title,
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
        flexShrink: "0",
      }}
      variant="contained_icon"
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      title={title}
    >
      <Typography variant="body_short" color={textColor}>
        {text}
      </Typography>
    </Button>
  );
};
