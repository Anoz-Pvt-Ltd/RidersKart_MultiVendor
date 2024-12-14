import Hero from "./pages/Hero/Hero";
import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <div className="text-black whiteSoftBG">
      <Header />
      <Routes>
        <Route path="/" element={<Hero />} />
        {/* <Route path="/login" element={<Login />} /> */}
      </Routes>
    </div>
  );
}

export default App;
