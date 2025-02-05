import colors from "@/theme/colors";
import { Button, Chip, Icon, Typography } from "@equinor/eds-core-react";
import { add } from "@equinor/eds-icons";
import { RoleSelect } from "./RoleSelect";
import { UserDot } from "./UserDot";
import styles from "./UserItem.module.scss";

type userItem = {
  shortName: string;
  fullName: string | null;
  role?: string;
  onRoleChange?: (role: string) => void;
  onRemove?: () => void;
  onAdd?: () => void;
  disabled: boolean;
};

export const UserItem = ({
  shortName,
  fullName,
  role,
  onRoleChange,
  onRemove,
  onAdd,
  disabled,
}: userItem) => {
  function handleChange(role: string) {
    if (role === "Remove" && onRemove) {
      onRemove();
    } else {
      onRoleChange && onRoleChange(role);
    }
  }

  const renderRole = () => {
    if (!role) {
      return (
        <Button
          type={"submit"}
          variant={"contained_icon"}
          onClick={onAdd}
          disabled={disabled}
          className={styles.addButton}
        >
          <Icon data={add} size={16} />
        </Button>
      );
    } else {
      return (
        <RoleSelect
          onChange={(selectedRole) => handleChange(selectedRole)}
          defaultValue={role}
          disabled={disabled}
        />
      );
    }
  };

  return (
    <div className={styles.userItem}>
      <div className={styles.userDotAndName}>
        <UserDot name={shortName} />
        <Chip>{shortName}</Chip>
        <Typography color={colors.EQUINOR_PROMINENT}>
          {fullName || ""}
        </Typography>
      </div>
      {renderRole()}
    </div>
  );
};
