import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTeams, searchTeamByName } from "../teamsSlice";
import { RootState, AppDispatch } from "../../../app/store";
import TeamCard from "../components/TeamCard";
import { Team } from "../../../types/team";
import styles from "../styles/Team.module.scss";

const TeamsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");

  const { teams, searchedTeams, loading, error } = useSelector(
    (state: RootState) => state.teams,
  );

  useEffect(() => {
    dispatch(fetchTeams());
  }, [dispatch]);

  // perform remote search when term changes
  useEffect(() => {
    if (searchTerm.length > 0) {
      dispatch(searchTeamByName(searchTerm));
    }
  }, [searchTerm, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.page}>
      <h1>Teams</h1>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a team by name"
        />
      </div>

      <div className={styles.searchContainer} id="search-container">
        {searchTerm.length > 0
          ? searchedTeams.map((team: Team) => (
              <TeamCard key={team.team.id} team={team} />
            ))
          : null}
      </div>

      <div className={styles.container}>
        {teams.map((team: Team) => (
          <TeamCard key={team.team.id} team={team} />
        ))}
      </div>
    </div>
  );
};

export default TeamsPage;
