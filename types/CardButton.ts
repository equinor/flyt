import { Connection } from "reactflow";

export type CardButton = {
  active?: boolean;
  onClick(): void;
};

export type CardButtonMerge = {
  onConnect(e: Connection): void;
};
