import { Button, Icon } from "@equinor/eds-core-react";
import { favorite_filled, favorite_outlined } from "@equinor/eds-icons";
import styles from "./Heart.module.scss";
import { colors } from "@/theme/colors";

export function Heart(props: {
  isFavourite: boolean;
  isLoading: boolean;
  fave: () => void;
  unfave: () => void;
}): JSX.Element {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    props.isFavourite ? props.unfave() : props.fave();
  };

  if (props.isLoading) {
    return (
      <Button
        className={styles.heart}
        onClick={handleClick}
        variant="ghost_icon"
        disabled
      >
        <Icon data={favorite_filled} />
      </Button>
    );
  }
  if (props.isFavourite) {
    return (
      <Button
        className={styles.favedHeart}
        onClick={handleClick}
        variant="ghost_icon"
      >
        <Icon
          color={colors.infographic_primary__energy_red_100}
          data={favorite_filled}
        />
      </Button>
    );
  }
  return (
    <Button className={styles.heart} onClick={handleClick} variant="ghost_icon">
      <Icon data={favorite_outlined} />
    </Button>
  );
}
