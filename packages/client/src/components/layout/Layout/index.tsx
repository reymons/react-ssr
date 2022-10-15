import { ComponentType, ReactNode } from "react";
import cn from "classnames";
import styles from "./index.module.scss";

type Props<
  P extends Record<string, any>,
  T extends keyof JSX.IntrinsicElements | ComponentType<P>
> = {
  children: ReactNode;
  as?: T extends keyof JSX.IntrinsicElements ? T : ComponentType<P>;
} & (T extends keyof JSX.IntrinsicElements ? JSX.IntrinsicElements[T] : P);

export const Layout = <
  P extends Record<string, any>,
  T extends keyof JSX.IntrinsicElements | ComponentType<P>
>({
  children,
  as: As = "div" as any,
  ...rest
}: Props<P, T>) => {
  let className = styles.wrapper;

  if ("className" in rest) {
    className = cn(styles.wrapper, rest.className);
  }

  return (
    // @ts-ignore
    <As {...rest} className={className}>
      {children}
    </As>
  );
};
