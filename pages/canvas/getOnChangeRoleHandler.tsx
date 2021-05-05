import { debounce } from "../../utils/debounce";
import { vsmObject } from "../../interfaces/VsmObject";
import { Dispatch } from "easy-peasy";
import { ProjectModel } from "../../store/store";

export function getOnChangeRoleHandler(
  dispatch: Dispatch<ProjectModel>,
  selectedObject: vsmObject
) {
  return (event: { target: { value: never } }) => {
    const role = event.target.value;
    dispatch.setSelectedObject({ ...selectedObject, role });
    debounce(
      () => {
        dispatch.updateVSMObject({
          ...selectedObject,
          role,
        } as vsmObject);
      },
      1000,
      "Canvas-UpdateRole"
    )();
  };
}
