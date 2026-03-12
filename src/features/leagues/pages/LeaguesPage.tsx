import React, { useState } from "react";
import LeagueCard from "../components/LeagueCard";
import { League } from "../../../types/league";
import styles from "../styles/League.module.scss";
import { useGetLeaguesQuery, useSearchLeaguesQuery } from "../../../app/api";
import { useLogQuery } from "../../../app/debug";

const LeaguesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  // debounce the term so that the API is only triggered after the user
  // stops typing for a short time (300ms). avoids spamming the backend.
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  React.useEffect(() => {
    const handle = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  const leaguesResult = useGetLeaguesQuery();
  const { data: leagues, isLoading: loading, error } = leaguesResult;
  useLogQuery(leaguesResult, "getLeagues");

  /*const searchedResult = useSearchLeaguesQuery(debouncedTerm, {
    skip: debouncedTerm.length === 0,
  });
  const { data: searchedLeagues } = searchedResult;
  useLogQuery(searchedResult, `searchLeagues(${debouncedTerm})`);*/

  const searchedLeagues = leagues?.filter((league) =>
    league.league.name.toLowerCase().includes(debouncedTerm.toLowerCase()),
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any).error || "unknown"}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.title}>
        <h1>Leagues</h1>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a league"
          />
        </div>
      </div>

      <div className={styles.searchContainer} id="search-container">
        {searchTerm.length > 0 &&
          searchedLeagues?.map((league: League) => (
            <LeagueCard key={league.league.id} league={league} />
          ))}
      </div>

      <div className={styles.container}>
        {leagues
          ?.filter((league) =>
            [61, 39, 78, 135, 140, 2, 4, 3, 525, 848, 1, 5].includes(
              league.league.id,
            ),
          )
          .map((league: League) => (
            <LeagueCard key={league.league.id} league={league} />
          ))}
      </div>
    </div>
  );
};

export default LeaguesPage;
