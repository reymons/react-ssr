import React from "react";
import { ws } from "../../store/ws";
import { BeforeNewMountCb, HmrComponent, State } from "./types";

let shouldCreateHmrComponent = true;
let beforeNewMountCallbacks: BeforeNewMountCb[] = [];

function beforeNewMount(callback: BeforeNewMountCb) {
  beforeNewMountCallbacks.push(callback);
}

function notifyBeforeNewMount(module: NodeModule, Component: HmrComponent) {
  beforeNewMountCallbacks.forEach((cb) => cb(module, Component));
  beforeNewMountCallbacks = [];
}

function createHmrComponent<P extends object>(
  sourceModule: NodeModule,
  Component: HmrComponent<P>
) {
  return class ExportedComponent extends React.Component<P, State<P>> {
    state = {
      Component,
      module: sourceModule,
    };

    handleMessage = (message: { type: string }) => {
      const { module } = this.state;

      if (message.type !== "hmr" || !module.hot) {
        return;
      }

      module.hot.accept();

      const handleStatus = (status: string) => {
        if (status === "ready") {
          module.hot?.apply();
        } else if (status === "apply") {
          beforeNewMount((newModule, Component) => {
            this.setState({ module: newModule, Component });
            module.hot?.removeStatusHandler(handleStatus);
          });
        }
      };

      module.hot.addStatusHandler(handleStatus);
      module.hot.check();
    };

    componentDidMount() {
      ws.on("message", this.handleMessage);
      shouldCreateHmrComponent = false;
    }

    componentWillUnmount() {
      ws.off("message", this.handleMessage);
      shouldCreateHmrComponent = true;
    }

    render() {
      if (this.state.Component) {
        return <this.state.Component {...this.props} />;
      } else {
        return <></>;
      }
    }
  };
}

export function withHmr<P extends object>(sourceModule: NodeModule) {
  return (Component: HmrComponent<P>) => {
    let component;

    if (shouldCreateHmrComponent) {
      component = createHmrComponent<P>(sourceModule, Component);
    } else {
      component = () => <></>;
    }

    notifyBeforeNewMount(sourceModule, Component);

    return component;
  };
}
