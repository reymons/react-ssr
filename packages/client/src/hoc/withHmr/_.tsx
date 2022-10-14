import React from "react";
import { ws, WSEventCallback } from "../../store/ws";
import { BeforeNewMountCb, HmrComponent, State } from "./types";

let shouldCreateHmrComponent = true;
let beforeNewMountCallbacks: Array<BeforeNewMountCb> = [];

function notifyBeforeNewMount(module: NodeModule, Component: HmrComponent) {
  beforeNewMountCallbacks.forEach((cb) => cb(module, Component));
  beforeNewMountCallbacks = [];
}

function beforeNewMount(callback: BeforeNewMountCb) {
  beforeNewMountCallbacks.push(callback);
}

function createHmrComponent<P extends object>(
  module: NodeModule,
  Component: HmrComponent<P>
) {
  return class ExportedComponent extends React.Component<P, State<P>> {
    state = {
      module,
      Component,
    };

    handleMessage: WSEventCallback["message"] = () => {
      const { module } = this.state;
      if (!module.hot) return;

      module.hot.accept();

      const handleStatus = (status: string) => {
        if (status === "ready") {
          beforeNewMount((module, Component) => {
            this.setState({ module, Component });
          });
        } else if (status === "apply" && module.hot) {
          module.hot.apply();
        }
      };

      module.hot.addStatusHandler(handleStatus);
      module.hot.check();
    };

    componentDidUpdate() {
      ws.off("message", this.handleMessage);
      ws.on("message", this.handleMessage);
      shouldCreateHmrComponent = false;
    }

    componentWillUnmount() {
      ws.off("message", this.handleMessage);
      shouldCreateHmrComponent = true;
    }

    render() {
      return <this.state.Component {...this.props} />;
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
