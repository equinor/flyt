import { vsmObjectTypes } from "../../types/vsmObjectTypes";

export function calculateCardWidth(
  numberOfTasks,
  type: vsmObjectTypes
): number {
  const baseWidth = 42;
  const defaultCardWidth = 126;
  if (!numberOfTasks) return defaultCardWidth;

  // Tasks are only supported for MainActivity, SubActivity and Waiting-cards
  switch (type) {
    case vsmObjectTypes.mainActivity:
    case vsmObjectTypes.subActivity:
      //  1-4 task => 126 + 42 = 168
      return defaultCardWidth + baseWidth * Math.ceil(numberOfTasks / 4);
    case vsmObjectTypes.waiting:
      return defaultCardWidth + baseWidth * Math.ceil(numberOfTasks / 2);
    case vsmObjectTypes.process:
    case vsmObjectTypes.supplier:
    case vsmObjectTypes.input:
    case vsmObjectTypes.text:
    case vsmObjectTypes.output:
    case vsmObjectTypes.customer:
    case vsmObjectTypes.choice:
    case vsmObjectTypes.error:
      return defaultCardWidth; // default width since tasks are not supported for this type
  }
}
