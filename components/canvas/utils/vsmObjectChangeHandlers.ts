// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { Actions } from "easy-peasy";
import { ProjectModel } from "../../../store/store";
import { debounce } from "../../../utils/debounce";
import { vsmObject } from "../../../interfaces/VsmObject";

export function getOnChangeUnit(
  dispatch: Actions<ProjectModel>,
  selectedObject
) {
  return (unit: string) => {
    dispatch.setSelectedObject({ ...selectedObject, unit });
    debounce(
      () => {
        dispatch.updateVSMObject({
          ...selectedObject,
          unit,
        } as vsmObject);
      },
      1000,
      "Canvas-UpdateTimeDefinition"
    );
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
    );
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
    );
  };
}

export function getOnChangeDuration(
  dispatch: Actions<ProjectModel>,
  selectedObject
) {
  return (event) => {
    let duration = parseInt(event.target.value);
    if (duration < 0) duration = 0;
    dispatch.setSelectedObject({ ...selectedObject, duration });
    debounce(
      () => {
        dispatch.updateVSMObject({
          ...selectedObject,
          duration,
        } as vsmObject);
      },
      1000,
      "Canvas-UpdateTime"
    );
  };
}
