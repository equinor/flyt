import { Actions } from "easy-peasy";
import { ProjectModel } from "../../../store/store";
import { debounce } from "../../../utils/debounce";
import { vsmObject } from "../../../interfaces/VsmObject";

export function getOnChangeTimeDefinition(
  dispatch: Actions<ProjectModel>,
  selectedObject
) {
  return (timeDefinition: string) => {
    dispatch.setSelectedObject({ ...selectedObject, timeDefinition });
    debounce(
      () => {
        dispatch.updateVSMObject({
          ...selectedObject,
          timeDefinition,
        } as vsmObject);
      },
      1000,
      "Canvas-UpdateTimeDefinition"
    )();
  };
}

export function getOnChangeName(
  dispatch: Actions<ProjectModel>,
  selectedObject
) {
  return (event: { target: { value: string } }) => {
    const name = event.target.value;
    dispatch.setSelectedObject({ ...selectedObject, name });
    debounce(
      () => {
        dispatch.updateVSMObject({
          ...selectedObject,
          name,
        } as vsmObject);
      },
      1000,
      "Canvas-UpdateName"
    )();
  };
}

export function getOnChangeRole(
  dispatch: Actions<ProjectModel>,
  selectedObject
) {
  return (event) => {
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

export function getOnChangeTime(
  dispatch: Actions<ProjectModel>,
  selectedObject
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
