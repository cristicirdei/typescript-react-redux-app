import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLeagues } from "../leaguesSlice";
import { RootState, AppDispatch } from "../../../app/store";
import LeagueCard from "../components/LeagueCard";
import { League } from "../../../types/league";
import styles from "../styles/League.module.scss";

const LeaguesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedLeagues, setSearchedLeagues] = useState<League[]>([]);

  const { leagues, loading, error } = useSelector(
    (state: RootState) => state.leagues,
  );

  useEffect(() => {
    dispatch(fetchLeagues());
  }, [dispatch]);

  useEffect(() => {
    searchTerm.length > 0 &&
      setSearchedLeagues(
        leagues.filter((league) =>
          league.league.name.toLowerCase().includes(searchTerm.toLowerCase()),
        ),
      );
    searchTerm.length == 0 && setSearchedLeagues([]);
  }, [searchTerm, leagues]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.page}>
      <h1>Leagues</h1>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a league by name"
        />
      </div>

      <div className={styles.searchContainer} id="search-container">
        {searchedLeagues.map((league: League) => (
          <LeagueCard key={league.league.id} league={league} />
        ))}
      </div>

      <div className={styles.container}>
        {leagues
          .filter((league) =>
            [61, 39, 78, 135, 140, 2, 4].includes(league.league.id),
          )
          .map((league: League) => (
            <LeagueCard key={league.league.id} league={league} />
          ))}
      </div>
    </div>
  );
};

export default LeaguesPage;
