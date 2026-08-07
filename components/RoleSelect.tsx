import styles from "./RoleSelect.module.scss";

export const RoleSelect = (props: {
  onChange: (arg0: string) => void;
  defaultValue: string;
  disabled: boolean;
}) => {
  return (
    <select
      defaultValue={props.defaultValue}
      className={styles.roleSelect}
      id="AccessRoles"
      name="AccessRole"
      onChange={(event) => props.onChange(event.target.value)}
      disabled={props.disabled}
    >
      <option value="Contributor">Contributor</option>
      <option value="Remove">Remove</option>
    </select>
  );
};
