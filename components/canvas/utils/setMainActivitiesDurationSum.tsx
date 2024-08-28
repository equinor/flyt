import { NodeTypes } from "@/types/NodeTypes";
import { Node } from "reactflow";
import { timeDefinitions, getDurationInSeconds } from "@/utils/unitDefinitions";
import { NodeData } from "@/types/NodeData";

let possibleTotalDurations: (typeof timeDefinitions)[] = [];

const isNoDurations = (nodes: Node<NodeData>[]) =>
  nodes.every((node) => node.data.duration === null);

const addToCurrentDuration = (
  currentDuration: typeof timeDefinitions,
  node: Node<NodeData>
) => {
  if (node.data.unit && node.data.duration) {
    return currentDuration.map((td) => {
      if (td.value === node.data.unit && node.data.duration) {
        return { ...td, duration: td.duration + node.data.duration };
      } else {
        return td;
      }
    });
  } else {
    return currentDuration;
  }
};

const setPossibleTotalDurations = (
  node: Node<NodeData>,
  subtreeNodes: Node<NodeData>[],
  currentDuration: typeof timeDefinitions = timeDefinitions
) => {
  currentDuration = addToCurrentDuration(currentDuration, node);

  if (node.data.children.length === 0) {
    possibleTotalDurations.push(currentDuration);
  }

  node.data.children.forEach((childId) => {
    const childNode = subtreeNodes.find((node) => node.id === childId);
    childNode &&
      setPossibleTotalDurations(childNode, subtreeNodes, currentDuration);
  });
};

const getMinMaxTotalDurations = () => {
  const possibleTotalDurationsInSeconds = possibleTotalDurations.map(
    (tdDuration) =>
      tdDuration.reduce((acc, item) => {
        return acc + getDurationInSeconds(item.value, item.duration);
      }, 0)
  );

  const minDurationInSeconds = Math.min(...possibleTotalDurationsInSeconds);
  const minDurationIndex =
    possibleTotalDurationsInSeconds.indexOf(minDurationInSeconds);

  const maxDurationInSeconds = Math.max(...possibleTotalDurationsInSeconds);
  const maxDurationIndex =
    possibleTotalDurationsInSeconds.indexOf(maxDurationInSeconds);

  return {
    minTotalDuration: possibleTotalDurations[minDurationIndex],
    maxTotalDuration: possibleTotalDurations[maxDurationIndex],
  };
};

export const setMainActivitiesDurationSum = (nodes: Node<NodeData>[]) => {
  return nodes.map((node) => {
    if (node.type === NodeTypes.mainActivity) {
      possibleTotalDurations = [];
      const subtreeNodes = nodes.filter(
        (n) => n.data.columnId === node.data.columnId
      );
      if (!isNoDurations(subtreeNodes)) {
        setPossibleTotalDurations(node, subtreeNodes);
        const minMaxTotalDurations = getMinMaxTotalDurations();
        node.data.totalDurations = minMaxTotalDurations;
      }
    }
    return node;
  });
};
