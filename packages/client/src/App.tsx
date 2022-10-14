import { Routes, Route } from "react-router-dom";
import { load } from "@react-ssr/load";
import { withHmr } from "./hoc/withHmr";
import "./App.css";

const Home = load(() => import("./components/screens/Home"));

export const App = withHmr(module)(() => {
  return (
    <div className="page">
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
});
