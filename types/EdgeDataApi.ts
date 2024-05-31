export type EdgeDataApi = {
  id: string;
  projectId: string;
  source: string; // Source node ID
  target: string; // Target node ID
  edgeValue?: string;
};
