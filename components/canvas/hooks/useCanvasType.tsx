import { createContext, PropsWithChildren, useContext } from "react";

export type CanvasType = "main" | "select_process_card";

const CanvasTypeContext = createContext<CanvasType>("main");

export const useCanvasType = () => useContext(CanvasTypeContext);

export const CanvasTypeProvider = ({
  type,
  children,
}: PropsWithChildren<{ type: CanvasType }>) => {
  return (
    <CanvasTypeContext.Provider value={type}>
      {children}
    </CanvasTypeContext.Provider>
  );
};
