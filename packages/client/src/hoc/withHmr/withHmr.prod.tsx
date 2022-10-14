export function withHmr<P extends object>(sourceModule: NodeModule) {
  return (Component: (props: P) => JSX.Element) => {
    return (props: P) => <Component {...props} />;
  };
}
