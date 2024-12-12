import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import ListPage from "./pages/ListPage";
import DetailPage from "./pages/DetailPage"; // We'll create this

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/list" element={<ListPage />} />
        <Route path="/albums/:id" element={<DetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;