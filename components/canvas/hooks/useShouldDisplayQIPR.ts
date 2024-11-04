import { Task } from "@/types/Task";
import { useCanAddQIPR } from "./useCanAddQIPR";

export const useShouldDisplayQIPR = (tasks: Task[], hovering: boolean) => {
  const canAddQIPR = useCanAddQIPR();
  if (tasks.length > 0) return true;
  if (canAddQIPR && hovering) return true;
  return false;
};
