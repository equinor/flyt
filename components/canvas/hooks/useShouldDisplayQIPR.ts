import { Task } from "@/types/Task";
import { useCanAddQIPR } from "./useCanAddQIPR";

export const useShouldDisplayQIPR = (
  tasks: Task[],
  hovering: boolean,
  selected: boolean
) => {
  const canAddQIPR = useCanAddQIPR();
  if (tasks.length > 0) return true;
  if (canAddQIPR && (hovering || selected)) return true;
  return false;
};
