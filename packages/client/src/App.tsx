import { Routes, Route } from "react-router-dom";
import { load } from "@react-ssr/load";

const Home = load(() => import("./screens/Home"));

export const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
};
