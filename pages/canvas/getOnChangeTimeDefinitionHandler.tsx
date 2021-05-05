import { debounce } from "../../utils/debounce";
import { vsmObject } from "../../interfaces/VsmObject";
import { Dispatch } from "easy-peasy";
import { ProjectModel } from "../../store/store";

export function getOnChangeTimeDefinitionHandler(
  dispatch: Dispatch<ProjectModel>,
  selectedObject: vsmObject
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
