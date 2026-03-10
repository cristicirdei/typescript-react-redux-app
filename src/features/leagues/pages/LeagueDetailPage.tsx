import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../app/store";
import { fetchLeagueById } from "../leaguesSlice";
import { fetchTeamsByLeagueSeason } from "../../teams/teamsSlice";
import TeamCard from "../../teams/components/TeamCard";
import { Team } from "../../../types/team";
import styles from "../styles/League.module.scss";
import { current } from "@reduxjs/toolkit";

const LeagueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch<AppDispatch>();
  const { selectedLeague, loading, error } = useSelector(
    (state: RootState) => state.leagues,
  );
  const { teams } = useSelector((state: RootState) => state.teams);

  useEffect(() => {
    if (id) {
      dispatch(fetchLeagueById(parseInt(id)));
    }
  }, [dispatch, id]);

  // when league loads, fetch teams for its current season
  useEffect(() => {
    if (selectedLeague) {
      console.log("leagueId:", selectedLeague.league.id);

      const currentSeason =
        selectedLeague.seasons.find((s) => s.current)?.year ||
        selectedLeague.seasons[0]?.year;

      console.log("current season:", currentSeason);
      if (currentSeason) {
        dispatch(
          fetchTeamsByLeagueSeason({
            leagueId: selectedLeague.league.id,
            season: currentSeason,
          }),
        );
      }
    }
  }, [dispatch, selectedLeague]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log("Selected League:", selectedLeague);
  console.log("Teams for League:", teams);

  return (
    <div className={`${styles.page} ${styles.leagueDetailPage}`}>
      {selectedLeague?.league.logo && (
        <img
          src={selectedLeague.league.logo}
          alt={selectedLeague.league.name}
        />
      )}

      <div className={styles.details}>
        <h2>
          {selectedLeague?.league.name}{" "}
          <span>
            {selectedLeague?.country.flag && (
              <img
                className={styles.country}
                src={selectedLeague.country.flag}
                alt={selectedLeague.country.name}
              />
            )}
          </span>
        </h2>
      </div>

      {/* list teams for the league */}
      <div className={styles.container}>
        {teams.map((team: Team) => (
          <TeamCard key={team.team.id} team={team} />
        ))}
      </div>
    </div>
  );
};

export default LeagueDetailPage;
