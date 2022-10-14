import { Routes, Route } from "react-router-dom";
import { load } from "@react-ssr/load";
import { withHmr } from "./hoc/withHmr";
import { Header } from "@components/layout/Header";

const Home = load(() => import("./components/screens/Home"));

export const App = withHmr(module)(() => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
});
