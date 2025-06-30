import { useContext } from "react";
import { LoaderContextInternal } from "./LoaderProvider.component";

// useLoader.ts
export interface LoaderContext {
  start: () => void;
  done: () => void;
  setProgress: (value: number) => void;
}

export const useLoader = (): LoaderContext => {
  const context = useContext(LoaderContextInternal);
  if (!context) throw new Error("useLoader must be used within a LoaderProvider");
  return context;
};
