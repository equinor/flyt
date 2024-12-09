import { useRef } from "react";

export const useNodeRef = () => useRef<HTMLDivElement>(null);
