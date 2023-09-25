import { Connection } from "reactflow";

export type CardButton = {
  active?: boolean;
  onClick?(): void;
  onConnect?(e: Connection): void;
};
