import { ColorDot } from "./ColorDot";
import colors from "../theme/colors";
import styles from "./LiveIndicator.module.scss";

export function LiveIndicator(props: {
  live: boolean;
  title: string;
}): JSX.Element {
  const { live } = props;
  return (
    <div className={styles.liveIndicatorContainer}>
      <div className={styles.textContainer} title={props.title}>
        <div className={styles.iconStyle}>
          <ColorDot color={live ? colors.SUCCESS : colors.ERROR} />
        </div>
        {live ? <p>Live</p> : <p>Disconnected</p>}
      </div>
    </div>
  );
}
