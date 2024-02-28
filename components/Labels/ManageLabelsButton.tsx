import { tag } from "@equinor/eds-icons";
import { ButtonWrapper } from "../ButtonWrapper";

/**
 * NB. Currently only adjusted for use in the canvas. path: "baseURL/process/{id}"
 * @constructor
 */
export const ManageLabelsButton = (props: {
  handleClickLabel: () => void;
}): JSX.Element => {
  return (
    <ButtonWrapper
      icon={tag}
      onClick={props.handleClickLabel}
      title={"Manage process labels"}
    />
  );
};
