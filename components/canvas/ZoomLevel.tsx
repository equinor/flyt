import { useReactFlow, useStore } from "reactflow";
import { Typography } from "@equinor/eds-core-react";
import colors from "../../theme/colors";
import styles from "./Canvas.module.scss";

export function ZoomLevel() {
  useStore((store) => store.transform[2]);
  const otherZoomLevel = useReactFlow().getZoom();

  return (
    <div className={styles.zoomLevel}>
      <Typography
        group={"heading"}
        variant={"h4"}
        color={colors.EQUINOR_PROMINENT}
      >{`${Math.round(otherZoomLevel * 100)}%`}</Typography>
    </div>
  );
}
