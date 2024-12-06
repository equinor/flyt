import { useRef } from "react";

export const useNodeRef = () => {
  const ref = useRef<HTMLDivElement>(null);
  return ref;
};
