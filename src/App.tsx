import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LeagueDetailPage from "./features/leagues/pages/LeagueDetailPage";
import LeaguesPage from "./features/leagues/pages/LeaguesPage";

import "./App.css";
import Layout from "./Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/leagues" replace />} />
          <Route path="/leagues" element={<LeaguesPage />} />
          <Route path="/leagues/:id" element={<LeagueDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
