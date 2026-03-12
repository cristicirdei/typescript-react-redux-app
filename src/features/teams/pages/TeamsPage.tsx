import React, { useState } from "react";
import TeamCard from "../components/TeamCard";
import { Team } from "../../../types/team";
import styles from "../styles/Team.module.scss";
import { useGetTeamsQuery, useSearchTeamsQuery } from "../../../app/api";
import { useLogQuery } from "../../../app/debug";

const TeamsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  React.useEffect(() => {
    const handle = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  /*const teamsResult = useGetTeamsQuery();
  const { data: teams, isLoading: loading, error } = teamsResult;
  useLogQuery(teamsResult, "getTeams");*/

  const searchedResult = useSearchTeamsQuery(debouncedTerm, {
    skip: debouncedTerm.length === 0,
  });
  const { data: searchedTeams } = searchedResult;
  useLogQuery(searchedResult, `searchTeams(${debouncedTerm})`);

  {
    /*if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any).error || "unknown"}</div>;*/
  }

  return (
    <div className={styles.page}>
      <div className={styles.title}>
        <h1>Teams</h1>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a team"
          />
        </div>
      </div>

      <div className={styles.searchContainer} id="search-container">
        {searchTerm.length > 0 &&
          searchedTeams?.map((team: Team) => (
            <TeamCard key={team.team.id} team={team} />
          ))}
      </div>

      {/*<div className={styles.container}>
        {teams?.map((team: Team) => (
          <TeamCard key={team.team.id} team={team} />
        ))}
      </div>*/}
    </div>
  );
};

export default TeamsPage;
