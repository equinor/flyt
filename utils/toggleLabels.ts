/**
 * Returns updated empty array / single label ID / array of label IDs
 * @param selectedLabelId : labelID of the label to add / remove if already contained in current array of label IDs
 * @param activeLabelIdArray : current array of labels / undefined if no label has been added yet
 * @param isSelect : boolean value either to add / remove from the current array
 * @returns : Returns updated empty array / single label ID / array of label IDs
 */

export function toggleLabels(
  selectedLabelId: string,
  activeLabelIdArray: undefined | string | string[],
  isSelect: boolean
): string | string[] {
  if (activeLabelIdArray) {
    const labelArray = `${activeLabelIdArray}`.split(",");
    const index = labelArray.findIndex((element) => element == selectedLabelId);
    if (index == -1 && isSelect) {
      labelArray.push(selectedLabelId);
      return labelArray;
    }
    if (index !== -1 && !isSelect) {
      labelArray.splice(index, 1);
      return labelArray;
    }
  }
  return selectedLabelId;
}
