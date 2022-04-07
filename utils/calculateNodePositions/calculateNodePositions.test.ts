import {
  defaultProcess,
  defaultProcessWithTasks,
} from "../processParser/testData";
import { calculateNodePositions } from "./calculateNodePositions";
import { parseProcessJSON } from "../processParser/parseProcessJSON";
import { vsmObjectTypes } from "../../types/vsmObjectTypes";
import { ParsedProcess } from "../processParser/processParser.test";
import { GraphNode } from "../layoutEngine";

describe("Position cards on the canvas", function () {
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

  it("should handle a parent with two children that joins back together after the split", function () {
    const process: ParsedProcess = {
      edges: [
        { from: 1, to: 2 },
        { from: 1, to: 3 },
        { from: 2, to: 4 },
        { from: 3, to: 4 },
      ],
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
        {
          id: 4,
          name: "drain",
          type: vsmObjectTypes.mainActivity,
        },
      ],
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
    expect(result).toStrictEqual([
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
      {
        name: "drain",
        id: 4,
        position: { x: 71, y: 304 },
        type: vsmObjectTypes.mainActivity,
        width: 126,
        height: 136,
      },
    ]);
  });
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
        tasks: [],
      },
      {
        id: 3894,
        name: null,
        type: 3,
        width: 126,
        height: 136,
        position: { x: 142, y: 152 },
        tasks: [],
      },
      {
        id: 3895,
        name: null,
        type: 4,
        width: 126,
        height: 136,
        position: { x: 284, y: 152 },
        tasks: [],
      },
      {
        id: 3896,
        name: null,
        type: 8,
        width: 126,
        height: 136,
        position: { x: 426, y: 152 },
        tasks: [],
      },
      {
        id: 3897,
        name: null,
        type: 9,
        width: 126,
        height: 136,
        position: { x: 568, y: 152 },
        tasks: [],
      },
      {
        id: 3892,
        name: null,
        type: 1,
        width: 126,
        height: 136,
        position: { x: 284, y: 0 },
        tasks: [],
      },
    ]);
  });
  it("should position the default process correctly after adding tasks to the MainActivity", function () {
    const parsedProcess = parseProcessJSON(defaultProcessWithTasks);
    expect(calculateNodePositions(parsedProcess)).toStrictEqual([
      {
        id: 7944,
        name: null,
        type: vsmObjectTypes.supplier,
        width: 126,
        height: 136,
        position: { x: 0, y: 152 },
        tasks: [],
      },
      {
        id: 7945,
        name: null,
        type: vsmObjectTypes.input,
        width: 126,
        height: 136,
        position: { x: 142, y: 152 },
        tasks: [],
      },
      {
        id: 7946,
        name: null,
        type: vsmObjectTypes.mainActivity,
        width: 168,
        height: 136,
        position: { x: 284, y: 152 },
        tasks: defaultProcessWithTasks.objects[0].childObjects[2].tasks,
      },
      {
        id: 7947,
        name: null,
        type: vsmObjectTypes.output,
        width: 126,
        height: 136,
        position: { x: 468, y: 152 },
        tasks: [],
      },
      {
        id: 7948,
        name: null,
        type: vsmObjectTypes.customer,
        width: 126,
        height: 136,
        position: { x: 610, y: 152 },
        tasks: [],
      },
      {
        id: 7943,
        name: null,
        type: vsmObjectTypes.process,
        width: 126,
        height: 136,
        position: { x: 305, y: 0 },
        tasks: [],
      },
    ] as GraphNode[]);
  });
  it("should handle a default process with an added choice", () => {
    const process: ParsedProcess = {
      created: "",
      currentProcessId: 0,
      duplicateOf: 0,
      id: 0,
      isFavorite: false,
      labels: [],
      name: "",
      toBeProcessID: 0,
      updated: "",
      updatedBy: "",
      userAccesses: [],
      nodes: [
        { id: 0, type: vsmObjectTypes.process },
        { id: 1, type: vsmObjectTypes.supplier },
        { id: 2, type: vsmObjectTypes.input },
        { id: 3, type: vsmObjectTypes.mainActivity },
        { id: 4, type: vsmObjectTypes.output },
        { id: 5, type: vsmObjectTypes.customer },
        { id: 6, type: vsmObjectTypes.choice },
        { id: 7, type: vsmObjectTypes.subActivity },
        { id: 8, type: vsmObjectTypes.subActivity },
        { id: 9, type: vsmObjectTypes.subActivity },
      ],
      edges: [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 0, to: 3 },
        { from: 0, to: 4 },
        { from: 0, to: 5 },
        { from: 3, to: 6 },
        { from: 6, to: 7 },
        { from: 6, to: 8 },
        { from: 7, to: 9 },
        { from: 8, to: 9 },
      ],
    };
    expect(calculateNodePositions(process)).toStrictEqual([
      {
        id: 0,
        type: vsmObjectTypes.process,
        width: 126,
        height: 136,
        position: { x: 339, y: 0 },
      },
      {
        id: 1,
        type: vsmObjectTypes.supplier,
        width: 126,
        height: 136,
        position: { x: 0, y: 152 },
      },
      {
        id: 2,
        type: vsmObjectTypes.input,
        width: 126,
        height: 136,
        position: { x: 142, y: 152 },
      },
      {
        id: 3,
        type: vsmObjectTypes.mainActivity,
        width: 126,
        height: 136,
        position: { x: 339, y: 152 },
      },
      {
        id: 4,
        type: vsmObjectTypes.output,
        width: 126,
        height: 136,
        position: { x: 536, y: 152 },
      },
      {
        id: 5,
        type: vsmObjectTypes.customer,
        width: 126,
        height: 136,
        position: { x: 678, y: 152 },
      },
      {
        id: 6,
        type: vsmObjectTypes.choice,
        width: 126,
        height: 136,
        position: { x: 339, y: 304 },
      },
      {
        id: 7,
        type: vsmObjectTypes.subActivity,
        width: 126,
        height: 136,
        position: { x: 268, y: 456 },
      },
      {
        id: 8,
        type: vsmObjectTypes.subActivity,
        width: 126,
        height: 136,
        position: { x: 410, y: 456 },
      },
      {
        id: 9,
        type: vsmObjectTypes.subActivity,
        width: 126,
        height: 136,
        position: { x: 339, y: 608 },
      },
    ]);
  });
  it("should handle a choice inside a choice", () => {
    const process: ParsedProcess = {
      created: "",
      currentProcessId: 0,
      duplicateOf: 0,
      edges: [
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 2, to: 4 },
        { from: 3, to: 5 },
        { from: 4, to: 6 },
        { from: 5, to: 7 },
        { from: 6, to: 8 },
        { from: 6, to: 9 },
        { from: 7, to: 10 },
        { from: 8, to: 10 },
        { from: 9, to: 10 },
      ],
      id: 0,
      isFavorite: false,
      labels: [],
      name: "",
      toBeProcessID: 0,
      updated: "",
      updatedBy: "",
      userAccesses: [],
      nodes: [
        //10 nodes
        {
          name: "Root",
          type: vsmObjectTypes.process,
          id: 1,
        },
        { type: vsmObjectTypes.choice, id: 2, name: "Choice 1" },
        {
          type: vsmObjectTypes.subActivity,
          id: 3,
          name: "1. step Left alternative Choice 1",
        },
        {
          type: vsmObjectTypes.subActivity,
          id: 4,
          name: "1. step Right alternative Choice 1",
        },
        {
          type: vsmObjectTypes.subActivity,
          id: 5,
          name: "2. step Left alternative Choice 1",
        },
        { type: vsmObjectTypes.choice, id: 6, name: "Choice 2" },
        {
          type: vsmObjectTypes.subActivity,
          id: 7,
          name: "3. step Left alternative Choice 1",
        },
        {
          type: vsmObjectTypes.subActivity,
          id: 8,
          name: "1. step Left alternative Choice 2",
        },
        {
          type: vsmObjectTypes.subActivity,
          id: 9,
          name: "1. step Right alternative Choice 2",
        },
        { type: vsmObjectTypes.subActivity, id: 10, name: "drain" },
      ],
    };
    expect(calculateNodePositions(process)).toStrictEqual([
      {
        id: 1,
        name: "Root",
        type: vsmObjectTypes.process,
        width: 126,
        height: 136,
        position: { x: 107, y: 0 },
      },
      {
        id: 2,
        name: "Choice 1",
        type: vsmObjectTypes.choice,
        width: 126,
        height: 136,
        position: { x: 107, y: 142 },
      },
      {
        id: 3,
        name: "1. step Left alternative Choice 1",
        type: vsmObjectTypes.subActivity,
        width: 126,
        height: 136,
        position: { x: 0, y: 284 },
      },
      {
        id: 4,
        name: "1. step Right alternative Choice 1",
        type: vsmObjectTypes.subActivity,
        width: 126,
        height: 136,
        position: { x: 213, y: 284 },
      },
      {
        id: 5,
        name: "2. step Left alternative Choice 1",
        type: vsmObjectTypes.subActivity,
        width: 126,
        height: 136,
        position: { x: 0, y: 436 },
      },
      {
        id: 6,
        name: "Choice 2",
        type: vsmObjectTypes.choice,
        width: 126,
        height: 136,
        position: { x: 213, y: 436 },
      },
      {
        id: 7,
        name: "3. step Left alternative Choice 1",
        type: vsmObjectTypes.subActivity,
        width: 126,
        height: 136,
        position: { x: 0, y: 588 },
      },
      {
        id: 8,
        name: "1. step Left alternative Choice 2",
        type: vsmObjectTypes.subActivity,
        width: 126,
        height: 136,
        position: { x: 142, y: 588 },
      },
      {
        id: 9,
        name: "1. step Right alternative Choice 2",
        type: vsmObjectTypes.subActivity,
        width: 126,
        height: 136,
        position: { x: 284, y: 588 },
      },
      {
        id: 10,
        name: "drain",
        type: vsmObjectTypes.subActivity,
        width: 126,
        height: 136,
        position: { x: 107, y: 740 },
      },
    ]);
  });
});
