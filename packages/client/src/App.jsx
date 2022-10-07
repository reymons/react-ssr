import { Routes, Route, Link } from "react-router-dom";
import { load } from "@react-ssr/load";
import "./App.css";

const Home = load(() => import("./Home"), {
  loading: <div>Loading...</div>,
});
const Cars = load(() => import("./Cars"));

export const App = () => {
  return (
    <div>
      <nav>
        <Link className="link" to="/">
          Home
        </Link>
        <Link className="link" to="/cars">
          Cars
        </Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
      </Routes>
    </div>
  );
};
