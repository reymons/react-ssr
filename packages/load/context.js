import { createContext } from "react";

const LoadContext = createContext({
  onRequest: () => {},
});

const LoadProvider = ({ onRequest, children }) => {
  return (
    <LoadContext.Provider value={{ onRequest }}>
      {children}
    </LoadContext.Provider>
  );
};

export { LoadProvider, LoadContext };
