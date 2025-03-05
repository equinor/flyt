import { labelsCategories } from "@/types/LabelsCategories";
import { ProcessLabel } from "@/types/ProcessLabel";

export function getCategorizedLabels(labels: ProcessLabel[]) {
  const { l1LevelOrganisation, functionalArea, assets } = labelsCategories;

  const filteredLabels = labels.reduce((acc: any, val: ProcessLabel) => {
    const { category } = val;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(val);
    return acc;
  }, {});

  const categorizedLabels = {
    [l1LevelOrganisation]: filteredLabels[l1LevelOrganisation] || [],
    [functionalArea]: filteredLabels[functionalArea] || [],
    [assets]: filteredLabels[assets] || [],
  };

  const noOfLabels =
    categorizedLabels[l1LevelOrganisation].length +
    categorizedLabels[functionalArea].length +
    categorizedLabels[assets].length;

  return [categorizedLabels, noOfLabels];
}
