import { createContext, FC, ReactNode } from "react";

type LoadContextValue = {
  onRequest(request: string): void;
};

type ProviderProps = Pick<LoadContextValue, "onRequest"> & {
  children: ReactNode;
};

const LoadContext = createContext<LoadContextValue>({
  onRequest: () => {},
});

const LoadProvider: FC<ProviderProps> = ({ onRequest, children }) => {
  return (
    <LoadContext.Provider value={{ onRequest }}>
      {children}
    </LoadContext.Provider>
  );
};

export { LoadProvider, LoadContext };
