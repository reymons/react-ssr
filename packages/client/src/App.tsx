import { Routes, Route } from "react-router-dom";
import { load } from "@react-ssr/load";
import { withHmr } from "./hoc/withHmr";
import { Header } from "@components/layout/Header";
import { HOME_ROUTE, IMAGE_GALLERY_ROUTE } from "@dictionaries/screens";
import styles from "./App.module.scss";

const Home = load(() => import("./components/screens/Home"));
const ImageGallery = load(() => import("./components/screens/ImageGallery"));

export const App = withHmr(module)(() => {
  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.main}>
        <Routes>
          <Route path={HOME_ROUTE} element={<Home />} />
          <Route path={IMAGE_GALLERY_ROUTE} element={<ImageGallery />} />
        </Routes>
      </main>
    </div>
  );
});
