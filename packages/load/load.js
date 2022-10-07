import { useContext, useRef } from "react";
import { LoadContext } from "./context";

function load(loader, opts = {}) {
  const { request } = opts;

  const state = {
    loaded: false,
    module: null,
  };

  loader().then((module) => {
    state.loaded = true;
    state.module = module.default;
    return module;
  });

  return (props) => {
    const ctx = useContext(LoadContext);
    const component = useRef(null);

    ctx.onRequest(request);

    if (state.loaded && !component.current) {
      component.current = state.module;
    }

    if (component.current) {
      return <component.current {...props} />;
    } else {
      return <></>;
    }
  };
}

export { load };
