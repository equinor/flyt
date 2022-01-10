/**
 * Returns updated empty array / single label ID / array of label IDs
 * @param selectedLabelId : labelID of the label to add / remove if already contained in current array of label IDs
 * @param activeLabelIdArray : current array of labels / undefined if no label has been added yet
 * @returns : see descriptions
 */

export function getUpdatedLabel(
  selectedLabelId: string,
  activeLabelIdArray: undefined | string | string[]
): string | string[] {
  if (activeLabelIdArray) {
    const labelArray = `${activeLabelIdArray}`.split(",");
    const index = labelArray.findIndex((element) => element == selectedLabelId);
    if (index == -1) {
      labelArray.push(selectedLabelId);
      return labelArray;
    } else {
      labelArray.splice(index, 1);
      return labelArray;
    }
  }
  return selectedLabelId;
}
