import React, { useState } from "react";
import PlayerCard from "../components/PlayerCard";
import { Player } from "../../../types/player";
import styles from "../styles/Player.module.scss";
import { useSearchPlayersQuery } from "../../../app/api";
import { useLogQuery } from "../../../app/debug";

const PlayersPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);
  React.useEffect(() => {
    const handle = setTimeout(() => setDebouncedTerm(searchTerm), 300);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  const searchResult = useSearchPlayersQuery(debouncedTerm, {
    skip: debouncedTerm.length === 0,
  });
  const { data: searchedPlayers, isLoading: loading, error } = searchResult;
  useLogQuery(searchResult, `searchPlayers(${debouncedTerm})`);

  // searchedPlayers is Player[]

  console.log("Searched Players:", searchedPlayers);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any).error || "unknown"}</div>;

  return (
    <div className={styles.page}>
      <div className={styles.title}>
        <h1>Players</h1>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a player"
          />
        </div>
      </div>

      <div className={styles.searchContainer} id="players">
        {searchTerm.length > 0 &&
          searchedPlayers?.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
      </div>
    </div>
  );
};

export default PlayersPage;
