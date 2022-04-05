import {
  defaultProcess,
  defaultProcessWithTasks,
} from "../processParser/testData";
import { calculateNodePositions } from "./calculateNodePositions";
import { parseProcessJSON } from "../processParser/parseProcessJSON";
import { vsmObjectTypes } from "../../types/vsmObjectTypes";
import { ParsedProcess } from "../processParser/processParser.test";
import { vsmTaskTypes } from "../../types/vsmTaskTypes";
import { GraphNode } from "../layoutEngine";

describe("Readjust position along the way", function () {
  it("should handle one card", function () {
    const process: ParsedProcess = {
      nodes: [
        {
          type: vsmObjectTypes.process,
          name: "process1",
          hidden: true,
          id: 1,
        },
      ],
      edges: [],
      id: 0,
      name: "",
      isFavorite: false,
      duplicateOf: 0,
      toBeProcessID: 0,
      currentProcessId: 0,
      created: "",
      updated: "",
      updatedBy: "",
      userAccesses: [],
      labels: [],
    };
    const result = calculateNodePositions(process);
    expect(result).toEqual([
      {
        name: "process1",
        id: 1,
        hidden: true,
        position: { x: 0, y: 0 },
        type: vsmObjectTypes.process,
        width: 126,
        height: 136,
      },
    ]);
  });
  it("should handle a parent and child", function () {
    const process: ParsedProcess = {
      nodes: [
        {
          type: vsmObjectTypes.process,
          name: "parent",
          id: 1,
        },
        {
          type: vsmObjectTypes.mainActivity,
          name: "child",
          id: 2,
        },
      ],
      edges: [{ from: 1, to: 2 }],
      id: 0,
      name: "",
      isFavorite: false,
      duplicateOf: 0,
      toBeProcessID: 0,
      currentProcessId: 0,
      created: "",
      updated: "",
      updatedBy: "",
      userAccesses: [],
      labels: [],
    };
    const result = calculateNodePositions(process);
    expect(result).toEqual([
      {
        name: "parent",
        id: 1,
        position: { x: 0, y: 0 },
        type: vsmObjectTypes.process,
        width: 126,
        height: 136,
      },
      {
        name: "child",
        id: 2,
        position: { x: 0, y: 152 },
        type: vsmObjectTypes.mainActivity,
        width: 126,
        height: 136,
      },
    ]);
  });
  it("should handle a parent with two children", function () {
    const process: ParsedProcess = {
      created: "",
      currentProcessId: 0,
      duplicateOf: 0,
      edges: [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
      ],
      id: 0,
      isFavorite: false,
      labels: [],
      name: "",
      nodes: [
        {
          id: 1,
          name: "parent",
          type: vsmObjectTypes.process,
        },
        {
          id: 2,
          name: "child1",
          type: vsmObjectTypes.mainActivity,
        },
        {
          id: 3,
          name: "child2",
          type: vsmObjectTypes.mainActivity,
        },
      ],
      toBeProcessID: 0,
      updated: "",
      updatedBy: "",
      userAccesses: [],
    };
    const result = calculateNodePositions(process);
    expect(result).toEqual([
      {
        name: "parent",
        id: 1,
        position: { x: 71, y: 0 },
        type: vsmObjectTypes.process,
        width: 126,
        height: 136,
      },
      {
        name: "child1",
        id: 2,
        position: { x: 0, y: 152 },
        type: vsmObjectTypes.mainActivity,
        width: 126,
        height: 136,
      },
      {
        name: "child2",
        id: 3,
        position: { x: 142, y: 152 },
        type: vsmObjectTypes.mainActivity,
        width: 126,
        height: 136,
      },
    ]);
  });
  it("should handle a parent with three children", function () {
    const process: ParsedProcess = {
      created: "",
      currentProcessId: 0,
      duplicateOf: 0,
      edges: [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 1, to: 4 },
      ],
      id: 0,
      isFavorite: false,
      labels: [],
      name: "",
      nodes: [
        {
          id: 1,
          name: "parent",
          type: vsmObjectTypes.process,
        },
        {
          id: 2,
          name: "child1",
          type: vsmObjectTypes.supplier,
        },
        {
          id: 3,
          name: "child2",
          type: vsmObjectTypes.input,
        },
        {
          id: 4,
          name: "child3",
          type: vsmObjectTypes.mainActivity,
        },
      ],
      toBeProcessID: 0,
      updated: "",
      updatedBy: "",
      userAccesses: [],
    };
    const result = calculateNodePositions(process);
    expect(result).toEqual([
      {
        name: "parent",
        id: 1,
        position: { x: 142, y: 0 },
        type: vsmObjectTypes.process,
        width: 126,
        height: 136,
      },
      {
        name: "child1",
        id: 2,
        position: { x: 0, y: 152 },
        type: vsmObjectTypes.supplier,
        width: 126,
        height: 136,
      },
      {
        name: "child2",
        id: 3,
        position: { x: 142, y: 152 },
        type: vsmObjectTypes.input,
        width: 126,
        height: 136,
      },
      {
        name: "child3",
        id: 4,
        position: { x: 284, y: 152 },
        type: vsmObjectTypes.mainActivity,
        width: 126,
        height: 136,
      },
    ]);
  });
});
describe("Position a simple process", function () {
  it("should position the default process correctly", function () {
    const parsedProcess = parseProcessJSON(defaultProcess);
    expect(calculateNodePositions(parsedProcess)).toStrictEqual([
      {
        id: 3893,
        name: null,
        type: 2,
        width: 126,
        height: 136,
        position: { x: 0, y: 152 },
      },
      {
        id: 3894,
        name: null,
        type: 3,
        width: 126,
        height: 136,
        position: { x: 142, y: 152 },
      },
      {
        id: 3895,
        name: null,
        type: 4,
        width: 126,
        height: 136,
        position: { x: 284, y: 152 },
      },
      {
        id: 3896,
        name: null,
        type: 8,
        width: 126,
        height: 136,
        position: { x: 426, y: 152 },
      },
      {
        id: 3897,
        name: null,
        type: 9,
        width: 126,
        height: 136,
        position: { x: 568, y: 152 },
      },
      {
        id: 3892,
        name: null,
        type: 1,
        width: 126,
        height: 136,
        position: { x: 284, y: 0 },
      },
    ]);
  });
  it("should position the default process correctly after adding tasks to the MainActivity", function () {
    const process = parseProcessJSON(defaultProcessWithTasks);
    expect(calculateNodePositions(process)).toStrictEqual([
      {
        id: 7944,
        name: null,
        type: vsmObjectTypes.supplier,
        width: 126,
        height: 136,
        position: { x: 0, y: 152 },
      },
      {
        id: 7945,
        name: null,
        type: vsmObjectTypes.input,
        width: 126,
        height: 136,
        position: { x: 142, y: 152 },
      },
      {
        id: 7946,
        name: null,
        type: vsmObjectTypes.mainActivity,
        width: 168,
        height: 136,
        position: { x: 284, y: 152 },
        tasks: [
          { vsmTaskID: 486, name: "Problem", taskType: vsmTaskTypes.problem },
          { vsmTaskID: 487, name: "Idea", taskType: vsmTaskTypes.idea },
          { vsmTaskID: 488, name: "Question", taskType: vsmTaskTypes.question },
          { vsmTaskID: 489, name: "Risk", taskType: vsmTaskTypes.risk },
        ],
      },
      {
        id: 7947,
        name: null,
        type: vsmObjectTypes.output,
        width: 126,
        height: 136,
        position: { x: 468, y: 152 },
      },
      {
        id: 7948,
        name: null,
        type: vsmObjectTypes.customer,
        width: 126,
        height: 136,
        position: { x: 610, y: 152 },
      },
      {
        id: 7943,
        name: null,
        type: vsmObjectTypes.process,
        width: 126,
        height: 136,
        position: { x: 305, y: 0 },
      },
    ] as GraphNode[]);
  });
});
