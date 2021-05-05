import { Dispatch } from "easy-peasy";
import { ProjectModel } from "../../store/store";
import { vsmObject } from "../../interfaces/VsmObject";
import { debounce } from "../../utils/debounce";

export const getOnChangeNameHandler = (
  dispatch: Dispatch<ProjectModel>,
  selectedObject: vsmObject
) => (event: { target: { value: string } }) => {
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
