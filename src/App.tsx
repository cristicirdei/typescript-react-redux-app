import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LeagueDetailPage from "./features/leagues/pages/LeagueDetailPage";
import LeaguesPage from "./features/leagues/pages/LeaguesPage";
import TeamsPage from "./features/teams/pages/TeamsPage";
import TeamDetailPage from "./features/teams/pages/TeamDetailPage";
import PlayersPage from "./features/players/pages/PlayersPage";
import PlayerDetailPage from "./features/players/pages/PlayerDetailPage";
import FixtureDetailPage from "./features/fixtures/pages/FixtureDetailPage";

import "./App.css";
import Layout from "./Layout";
import Header from "./components/Menu/Header";

function App() {
  return (
    <BrowserRouter>
      <Header></Header>
      <Routes>
        <Route path="/" element={<Navigate to="/leagues" replace />} />
        <Route path="/leagues" element={<LeaguesPage />} />
        <Route path="/leagues/:id" element={<LeagueDetailPage />} />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/teams/:id" element={<TeamDetailPage />} />
        <Route path="/players" element={<PlayersPage />} />
        <Route path="/players/:id" element={<PlayerDetailPage />} />
        <Route path="/fixtures/:id" element={<FixtureDetailPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
