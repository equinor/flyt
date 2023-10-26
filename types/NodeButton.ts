import { Connection } from "reactflow";

export type NodeButton = {
  active?: boolean;
  onClick(): void;
};

export type NodeButtonMerge = {
  onConnect(e: Connection): void;
};
