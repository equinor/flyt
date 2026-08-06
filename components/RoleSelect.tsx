import { Icon, Tooltip, Typography } from "@equinor/eds-core-react";
import styles from "./RoleSelect.module.scss";
import { minimize } from "@equinor/eds-icons";
import colors from "@/theme/colors";

export const RoleSelect = (props: {
  onChange: (arg0: string) => void;
  defaultValue: string;
  disabled: boolean;
}) => {
  return (
    <div
      className={[
        styles.container,
        props.disabled && styles.roleSelectDisable,
      ].join(" ")}
    >
      <Typography className={styles.roleText}>Contributor</Typography>
      <Tooltip title="Remove">
        <div
          className={styles.minimizeIcon}
          onClick={() => props.onChange("Remove")}
        >
          <Icon data={minimize} color={colors.EQUINOR_PROMINENT} />
        </div>
      </Tooltip>
    </div>
  );
};
