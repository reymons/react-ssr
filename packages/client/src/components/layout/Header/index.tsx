import { ReactNode } from "react";
import { Layout } from "../Layout";
import styles from "./index.module.scss";
import { Nav } from "./Nav";

export const Header = () => {
  return (
    <header className={styles.wrapper}>
      <Layout>
        <Nav />
      </Layout>
    </header>
  );
};
