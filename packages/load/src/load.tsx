import { useContext, useRef, ComponentType } from "react";
import { LoadContext } from "./context";

type Options = {
  request?: string;
  loading?: JSX.Element;
};

type Loader<P> = () => Promise<{ default: ComponentType<P> }>;

function load<P extends object>(loader: Loader<P>, opts: Options = {}) {
  const { request } = opts;

  const state: {
    loaded: boolean;
    module: ComponentType<P> | null;
  } = {
    loaded: false,
    module: null,
  };

  loader().then((module) => {
    state.loaded = true;
    state.module = module.default;
    return module;
  });

  return (props: P) => {
    const ctx = useContext(LoadContext);
    const component = useRef<ComponentType<P> | null>(null);

    ctx.onRequest(request as string);

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
