import { NodeTypes } from "@/types/NodeTypes";
import { Node } from "reactflow";
import { timeDefinitions } from "@/utils/unitDefinitions";

const getMainActivityDurationSum = (subtreeNodes: Node[]) => {
  const time = timeDefinitions.map((timeUnit) => ({ ...timeUnit }));

  subtreeNodes.forEach((node) => {
    if (node.data.duration && node.data.unit) {
      const unitIndex = time.findIndex(
        (timeUnit) => timeUnit.value === node.data.unit
      );
      time[unitIndex].duration += node.data.duration;
    }
  });

  return time;
};

const roundDurations = (sumDurations: typeof timeDefinitions) => {
  const minutes = sumDurations.find((d) => d.value === "Minute")?.duration;
  if (minutes) {
    const hoursToAdd = Math.floor(minutes / 60);
    return sumDurations.map((dur) => {
      switch (dur.value) {
        case "Minute":
          dur.duration -= hoursToAdd * 60;
          break;
        case "Hour":
          dur.duration += hoursToAdd;
          break;
        default:
          break;
      }
      return dur;
    });
  }
};

export const setMainActivitiesDurationSum = (nodes: Node[]) => {
  return nodes.map((node) => {
    if (node.type === NodeTypes.mainActivity) {
      const subtreeNodes = nodes.filter(
        (n) => n.data.columnId === node.data.columnId
      );
      const sumDuration = getMainActivityDurationSum(subtreeNodes);
      const roundedDuration = roundDurations(sumDuration);
      node.data.sumDuration = roundedDuration;
    }
    return node;
  });
};
