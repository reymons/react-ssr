import React, { ComponentType, ContextType } from "react";
import { LoadContext } from "./context";

type Options = {
  request?: string;
  loading?: JSX.Element;
};

type Loader<P> = () => Promise<{ default: ComponentType<P> }>;

type State<P> = {
  loadedComponent: ComponentType<P> | null;
};

function load<P extends object>(loader: Loader<P>, opts: Options = {}) {
  let loadedComponent: ComponentType<P> | null = null;
  let loading = false;

  const result = loader().then((module) => {
    loadedComponent = module.default;
    loading = false;
  });

  return class LoadComponent extends React.Component<P, State<P>> {
    static contextType: typeof LoadContext = LoadContext;
    context!: ContextType<typeof LoadContext>;

    state = {
      loadedComponent,
    };

    componentDidMount() {
      if (!this.state.loadedComponent && !loading) {
        loading = true;

        result.then(() => {
          loading = false;
          this.setState({ loadedComponent });
        });
      }
    }

    render() {
      this.context.onRequest(opts.request || "");

      if (this.state.loadedComponent) {
        return <this.state.loadedComponent {...this.props} />;
      } else {
        return <></>;
      }
    }
  };
}

export { load };
