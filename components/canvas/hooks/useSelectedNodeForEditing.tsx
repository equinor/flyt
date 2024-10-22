import { createContext, PropsWithChildren, useContext, useState } from "react";

type ContextType = {
  selectedNodeForEditing: string | null;
  setSelectedNodeForEditing: (id: string | null) => void;
};

const contextNotProvidedErrorFn = () => {
  throw new Error("SelectedNodeForEditing context not provided");
};

const SelectedNodeForEditingContext = createContext<ContextType>({
  selectedNodeForEditing: null,
  setSelectedNodeForEditing: contextNotProvidedErrorFn,
});

export const SelectedNodeForEditingProvider = ({
  children,
}: PropsWithChildren) => {
  const [selectedNodeForEditing, setSelectedNodeForEditing] = useState<
    string | null
  >(null);

  return (
    <SelectedNodeForEditingContext.Provider
      value={{ selectedNodeForEditing, setSelectedNodeForEditing }}
    >
      {children}
    </SelectedNodeForEditingContext.Provider>
  );
};

export const useSelectedNodeForEditing = () =>
  useContext(SelectedNodeForEditingContext);
