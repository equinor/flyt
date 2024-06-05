export type TaskCategory = {
  name: string;
  id: number;
  fkProject?: number | string | string[];
  checked: boolean;
};
