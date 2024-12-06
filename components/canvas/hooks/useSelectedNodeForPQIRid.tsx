import { createContext, PropsWithChildren, useContext, useState } from "react";

type ContextType = {
  selectedNodeForPQIRid: string | undefined;
  setSelectedNodeForPQIRid: (id: string | undefined) => void;
};

const contextNotProvidedErrorFn = () => {
  throw new Error("SelectedNodeForPQIRid context not provided");
};

const SelectedNodeForPQIRidContext = createContext<ContextType>({
  selectedNodeForPQIRid: undefined,
  setSelectedNodeForPQIRid: contextNotProvidedErrorFn,
});

export const SelectedNodeForPQIRidProvider = ({
  children,
}: PropsWithChildren) => {
  const [selectedNodeForPQIRid, setSelectedNodeForPQIRid] = useState<
    string | undefined
  >(undefined);

  return (
    <SelectedNodeForPQIRidContext.Provider
      value={{ selectedNodeForPQIRid, setSelectedNodeForPQIRid }}
    >
      {children}
    </SelectedNodeForPQIRidContext.Provider>
  );
};

export const useSelectedNodeForPQIRid = () =>
  useContext(SelectedNodeForPQIRidContext);
