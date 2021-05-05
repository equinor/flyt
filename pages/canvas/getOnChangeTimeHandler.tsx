import { debounce } from "../../utils/debounce";
import { vsmObject } from "../../interfaces/VsmObject";
import { Dispatch } from "easy-peasy";
import { ProjectModel } from "../../store/store";

export function getOnChangeTimeHandler(
  dispatch: Dispatch<ProjectModel>,
  selectedObject: vsmObject
) {
  return (event) => {
    let time = parseInt(event.target.value);
    if (time < 0) time = 0;
    dispatch.setSelectedObject({ ...selectedObject, time });
    debounce(
      () => {
        dispatch.updateVSMObject({
          ...selectedObject,
          time,
        } as vsmObject);
      },
      1000,
      "Canvas-UpdateTime"
    )();
  };
}
