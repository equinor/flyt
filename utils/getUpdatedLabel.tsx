/**
 * Returns updated empty array / single label ID / array of label IDs
 * @param labelID : labelID of the label to add / remove if already contained in current array of label IDs
 * @param rl : current array of labels / undefined if no label has been added yet
 * @returns : see descriptions
 */

export function getUpdatedLabel(
  labelID: string,
  rl: undefined | string | string[]
): string | string[] {
  if (rl) {
    const labelArray = `${rl}`.split(",");
    const index = labelArray.findIndex((element) => element == labelID);
    if (index == -1) {
      labelArray.push(labelID);
      return labelArray;
    } else {
      labelArray.splice(index, 1);
      return labelArray;
    }
  }
  return labelID;
}
