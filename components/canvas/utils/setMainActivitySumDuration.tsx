import { NodeTypes } from "@/types/NodeTypes";
import { Node } from "reactflow";
import { timeDefinitions } from "@/types/unitDefinitions";

const getMainActivitySumDuration = (subtreeNodes: Node[]) => {
  const time = timeDefinitions.map((timeUnit) => ({ ...timeUnit }));

  subtreeNodes.forEach((node) => {
    if (node.data.duration && node.data.unit) {
      const unitIndex = time.findIndex(
        (timeUnit) => timeUnit.value === node.data.unit
      );
      if (unitIndex !== -1) {
        time[unitIndex].duration += node.data.duration;
      }
    }
  });

  return time;
};

const roundDurations = (sumDurations: typeof timeDefinitions) => {
  const minutes = sumDurations.find((d) => d.value === "Minute")?.duration;
  if (minutes) {
    const hoursToAdd = Math.floor(minutes / 60);
    return sumDurations.map((dur) => {
      if (dur.value === "Minute") {
        dur.duration -= hoursToAdd * 60;
      } else if (dur.value === "Hour") {
        dur.duration += hoursToAdd;
      }
      return dur;
    });
  }
};

export const setMainActivitiesSumDuration = (nodes: Node[]) => {
  return nodes.map((node) => {
    if (node.type === NodeTypes.mainActivity) {
      const subtreeNodes = nodes.filter(
        (n) => n.data.columnId === node.data.columnId
      );
      const sumDuration = getMainActivitySumDuration(subtreeNodes);
      node.data.sumDuration = roundDurations(sumDuration);
    }
    return node;
  });
};
