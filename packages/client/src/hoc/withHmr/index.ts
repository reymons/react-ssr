import { withHmr as withHmrDev } from "./withHmr.dev";
import { withHmr as withHmrProd } from "./withHmr.prod";
import { HmrComponent } from "./types";

export function withHmr<P extends object>(sourceModule: NodeModule) {
  return (Component: HmrComponent<P>) => {
    const fn =
      process.env.NODE_ENV === "development" ? withHmrDev : withHmrProd;
    return fn<P>(sourceModule)(Component);
  };
}
