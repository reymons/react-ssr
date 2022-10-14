export type HmrComponent<P extends object = any> = (props: P) => JSX.Element;

export type BeforeNewMountCb<P extends object = any> = (
  module: NodeModule,
  Component: HmrComponent<P>
) => void;

export type State<P extends object> = {
  module: NodeModule;
  Component: HmrComponent<P>;
};
