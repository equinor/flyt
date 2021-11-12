import { GraphNode } from "./layoutEngine";

export function groupBy(nodes: GraphNode[], arg1: string) {
  //if no argument is given, throw error
  if (!arg1) {
    throw new Error("No argument given");
  }
  return nodes.reduce((r, a) => {
    r[a[arg1]] = [...(r[a[arg1]] || []), a];
    return r;
  }, []);
}
