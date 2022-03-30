import {
  allCardTypesProcess,
  bigProcess,
  defaultProcess,
  defaultProcessWithText,
  tProcess,
} from "./testData";
import { GraphEdge, GraphNode } from "../layoutEngine";
import { parseProcessJSON } from "./parseProcessJSON";
import { userAccess } from "../../interfaces/UserAccess";
import { processLabel } from "../../interfaces/processLabel";
import { vsmObjectTypes } from "../../types/vsmObjectTypes";

export interface ParsedProcess {
  id: number;
  name: string;
  isFavorite: boolean;
  duplicateOf: number;
  toBeProcessID: number;
  currentProcessId: number;
  // objects;
  nodes: GraphNode[];
  edges: GraphEdge[];
  //
  created: string;
  updated: string;
  updatedBy: string;
  userAccesses: userAccess[];
  labels: processLabel[]; // Unsure if this is the correct type
}
describe("ProcessParser misc tests", () => {
  it("should retain all the metadata", () => {
    const process = parseProcessJSON(defaultProcess);
    expect(process.id).toBe(defaultProcess.vsmProjectID);
    expect(process.name).toBe(defaultProcess.name);
    expect(process.isFavorite).toBe(defaultProcess.isFavorite);
    expect(process.duplicateOf).toBe(defaultProcess.duplicateOf);
    expect(process.toBeProcessID).toBe(defaultProcess.toBeProcessID);
    expect(process.currentProcessId).toBe(defaultProcess.currentProcessId);
    expect(process.created).toBe(defaultProcess.created);
    expect(process.updated).toBe(defaultProcess.updated);
    expect(process.updatedBy).toBe(defaultProcess.updatedBy);
    expect(process.userAccesses).toBe(defaultProcess.userAccesses);
    expect(process.labels).toBe(defaultProcess.labels);
  });

  it("should create the correct number of nodes for a simple process", () => {
    const parsedProcess = parseProcessJSON(defaultProcess);
    // default process has 6 nodes (Including the hidden from node)
    expect(parsedProcess.nodes.length).toBe(6);
  });

  it("should create the correct number of nodes for a big process", () => {
    const parsedBigProcess = parseProcessJSON(bigProcess);
    // big process has 54 nodes (Including the hidden from node)
    expect(parsedBigProcess.nodes.length).toBe(54);
  });

  it("should create the correct number of edges for a simple process", () => {
    const parsedProcess = parseProcessJSON(defaultProcess);
    // default process has 6 nodes (Including the hidden from node)
    //  The root node is parent to the 5 nodes, which gives us 5 edges for this simple process
    expect(parsedProcess.edges.length).toBe(5);
  });

  it("should create the correct number of edges for a big process", () => {
    const parsedProcess = parseProcessJSON(bigProcess);
    // TODO: Figure out how many edges there should be...
    expect(parsedProcess.edges.length).toBe(53);
  });

  it("should retain the name and type of the nodes", () => {
    const parsedProcess = parseProcessJSON(defaultProcessWithText);
    // default process has 6 nodes (Including the hidden from node)
    expect(parsedProcess.nodes.length).toBe(6);

    const nodeIds = {
      root: 3913,
      supplier: 3914,
      input: 3915,
      mainActivity: 3916,
      output: 3917,
      customer: 3918,
    };

    // Root node, should not have name, and the type should be "process"
    let selectedNode = parsedProcess.nodes.find((n) => n.id === nodeIds.root);
    expect(selectedNode.name).toBe(null);
    expect(selectedNode.type).toBe(vsmObjectTypes.process);

    // Supplier node, should be named "Supplier", and the type should be "to"
    selectedNode = parsedProcess.nodes.find((n) => n.id === nodeIds.supplier);
    expect(selectedNode.name).toBe("Supplier");
    expect(selectedNode.type).toBe(vsmObjectTypes.supplier);

    // Input node, should be named "Input", and the type should be "input"
    selectedNode = parsedProcess.nodes.find((n) => n.id === nodeIds.input);
    expect(selectedNode.name).toBe("Input");
    expect(selectedNode.type).toBe(vsmObjectTypes.input);

    // Main activity node, should be named "Main Activity", and the type should be "mainActivity"
    selectedNode = parsedProcess.nodes.find(
      (n) => n.id === nodeIds.mainActivity
    );
    expect(selectedNode.name).toBe("Main Activity");
    expect(selectedNode.type).toBe(vsmObjectTypes.mainActivity);

    // Output node, should be named "Output", and the type should be "output"
    selectedNode = parsedProcess.nodes.find((n) => n.id === nodeIds.output);
    expect(selectedNode.name).toBe("Output");
    expect(selectedNode.type).toBe(vsmObjectTypes.output);

    // Customer node, should be named "Customer", and the type should be "customer"
    selectedNode = parsedProcess.nodes.find((n) => n.id === nodeIds.customer);
    expect(selectedNode.name).toBe("Customer");
    expect(selectedNode.type).toBe(vsmObjectTypes.customer);
  });

  it("should create edges that makes sense", () => {
    const parsedTProcess = parseProcessJSON(tProcess);
    // "tProcess" has 10 nodes (Including the hidden from node)
    //  The root node is parent to the 5 nodes on level 1
    // The MainActivity node is parent to the rest. (But this is not how we want our edges)
    // MainActivity should be parent to the first SubActivity, not all of them. (as the api gives us)
    // But we still expect 9 edges (since it doesn't include any choices that come together again)
    expect(parsedTProcess.edges.length).toBe(9);

    // Expect edge from Root (3241) to first level nodes [3242, 3243, 3244,3244,3245,3246];
    [3242, 3243, 3244, 3245, 3246].forEach((id) => {
      const edge = parsedTProcess.edges.find(
        (e) => e.from === 3241 && e.to === id
      );
      expect(edge).toBeDefined();
    });

    // then 3244 -> 3247 -> 3248 -> 3249 -> 3250
    expect(
      parsedTProcess.edges.find((e) => e.from === 3244 && e.to === 3247)
    ).toBeDefined();
    expect(
      parsedTProcess.edges.find((e) => e.from === 3247 && e.to === 3248)
    ).toBeDefined();
    expect(
      parsedTProcess.edges.find((e) => e.from === 3248 && e.to === 3249)
    ).toBeDefined();
    expect(
      parsedTProcess.edges.find((e) => e.from === 3249 && e.to === 3250)
    ).toBeDefined();
  });
});

describe("Parse a simple process with all card-types", () => {
  const parsedProcess = parseProcessJSON(allCardTypesProcess);
  const root = 3925,
    supplier = 3926,
    input = 3927,
    mainActivity = 3928,
    choice = 3931,
    subActivityLeft = 3932,
    subActivityRight = 3933,
    waiting = 3934,
    customer = 3929,
    output = 3930;
  ////////////////////////////////////////////////////////////////////////////////
  //// Simple process with all card types ////////////////////////////////////////
  // root (3925)
  // ├── supplier (3926)
  // ├── input    (3927)
  // ├── mainActivity (3928)
  // │         └── choice (3931)
  // │             ├── subActivityLeft  (3932)  ┐
  // │             |                            ├── Waiting (3934)
  // │             └── subActivityRight (3933)  ┘
  // ├── customer (3929)
  // └── output   (3930)
  ////////////////////////////////////////////////////////////////////////////////
  [
    { from: root, to: supplier },
    { from: root, to: input },
    { from: root, to: mainActivity },
    { from: root, to: output },
    { from: root, to: customer },
    { from: mainActivity, to: choice },
    { from: choice, to: subActivityLeft },
    { from: choice, to: subActivityRight },
    { from: subActivityLeft, to: waiting },
    { from: subActivityRight, to: waiting },
  ].forEach((edge) => {
    const { from, to } = edge;
    const foundEdge = parsedProcess.edges.find(
      (e) => e.from === from && e.to === to
    );
    it(`should have an edge from ${from} to ${to}`, () => {
      expect(foundEdge).toBeDefined();
    });
  });
});
