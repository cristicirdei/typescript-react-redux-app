import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchPlayersByName } from "../playersSlice";
import { RootState, AppDispatch } from "../../../app/store";
import PlayerCard from "../components/PlayerCard";
import { Player } from "../../../types/player";
import styles from "../styles/Player.module.scss";

const PlayersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState("");

  const { searchedPlayers, loading, error } = useSelector(
    (state: RootState) => state.players,
  );

  useEffect(() => {
    if (searchTerm.length > 0) {
      dispatch(searchPlayersByName(searchTerm));
    }
  }, [searchTerm, dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.page}>
      <h1>Players</h1>
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search for a player by name"
        />
      </div>

      <div className={styles.searchContainer} id="search-container">
        {searchTerm.length > 0 &&
          searchedPlayers.map((item) => (
            <PlayerCard key={item.player.id} player={item.player} />
          ))}
      </div>
    </div>
  );
};

export default PlayersPage;
