import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ShowList from "./components/Pages/ShowList";
import AddPage from "./components/Pages/AddPage";
import EditPage from "./components/Pages/EditPage";
import DetailPage from "./components/Pages/DetailPage";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<ShowList />} />
      <Route path="/add" element={<AddPage />} />
      <Route path="/update/:id" element={<EditPage />} />
      <Route path="/detail/:id" element={<DetailPage />} />
    </Routes>
  </Router>
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
