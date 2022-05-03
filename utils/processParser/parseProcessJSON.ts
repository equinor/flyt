import { ParsedProcess } from "./processParser.test";
import { vsmProject } from "../../interfaces/VsmProject";
import { GraphEdge, GraphNode } from "../layoutEngine";
import { createEdges } from "./helpers/createEdges";
import { createNodes } from "./helpers/createNodes";

/**
 * Parse a process JSON object
 *
 * ## Background:
 * The api exposes a lot of the database structure in JSON format... which can be hard to work with.
 * This function parses the JSON and returns a more usable format.
 *
 * The main improvement is that the process is generalized as a graph, with nodes and edges.
 * > graph = { nodes: [], edges: [], ...metadata }
 */
export function parseProcessJSON(process: vsmProject): ParsedProcess {
  const nodes: GraphNode[] = createNodes(process.objects);
  const edges: GraphEdge[] = createEdges(process.objects);

  return {
    nodes,
    edges,
    created: process.created,
    currentProcessId: process.currentProcessId,
    duplicateOf: process.duplicateOf,
    id: process.vsmProjectID,
    isFavorite: process.isFavorite,
    labels: process.labels,
    name: process.name,
    toBeProcessID: process.toBeProcessID,
    updated: process.updated,
    updatedBy: process.updatedBy,
    userAccesses: process.userAccesses,
  };
}
