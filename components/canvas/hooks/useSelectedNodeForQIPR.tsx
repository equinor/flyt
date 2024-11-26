import { NodeDataCommon } from "@/types/NodeData";
import { createContext, PropsWithChildren, useContext, useState } from "react";

type ContextType = {
  selectedNodeForQIPR: NodeDataCommon | undefined;
  setSelectedNodeForQIPR: (data: NodeDataCommon | undefined) => void;
};

const contextNotProvidedErrorFn = () => {
  throw new Error("SelectedNodeForQIPR context not provided");
};

const SelectedNodeForQIPRContext = createContext<ContextType>({
  selectedNodeForQIPR: undefined,
  setSelectedNodeForQIPR: contextNotProvidedErrorFn,
});

export const SelectedNodeForQIPRProvider = ({
  children,
}: PropsWithChildren) => {
  const [selectedNodeForQIPR, setSelectedNodeForQIPR] = useState<
    NodeDataCommon | undefined
  >(undefined);

  return (
    <SelectedNodeForQIPRContext.Provider
      value={{ selectedNodeForQIPR, setSelectedNodeForQIPR }}
    >
      {children}
    </SelectedNodeForQIPRContext.Provider>
  );
};

export const useSelectedNodeForQIPR = () =>
  useContext(SelectedNodeForQIPRContext);
