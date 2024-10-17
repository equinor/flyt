import { Button, Icon } from "@equinor/eds-core-react";
import { favorite_filled, favorite_outlined } from "@equinor/eds-icons";
import styles from "./Heart.module.scss";
import { colors } from "@/theme/colors";

type HeartProps = {
  isFavourite: boolean;
  isLoading?: boolean;
  fave?: () => void;
  unfave?: () => void;
  disabled?: boolean;
};

export function Heart({
  isFavourite,
  isLoading,
  fave,
  unfave,
  disabled,
}: HeartProps) {
  const handleClick = (e: any) => {
    e.preventDefault();
    e.stopPropagation();
    isFavourite && unfave ? unfave() : fave && fave();
  };

  if (isLoading) {
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
  if (isFavourite) {
    return (
      <Button
        className={styles.favedHeart}
        onClick={handleClick}
        variant="ghost_icon"
        disabled={disabled}
      >
        <Icon
          color={colors.infographic_primary__energy_red_100}
          data={favorite_filled}
        />
      </Button>
    );
  }
  return (
    <Button
      className={styles.heart}
      disabled={disabled}
      onClick={handleClick}
      variant="ghost_icon"
    >
      <Icon data={favorite_outlined} />
    </Button>
  );
}
