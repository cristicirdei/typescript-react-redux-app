import React from "react";
import { Link } from "react-router-dom";
import { Player } from "../../../types/player";
import styles from "../styles/Player.module.scss";

interface Props {
  player: Player;
}

const PlayerCard: React.FC<Props> = ({ player }) => (
  <Link
    to={`/players/${player.id}`}
    style={{ textDecoration: "none", color: "inherit" }}>
    <div className={styles.card}>
      {player.photo && <img src={player.photo} alt={player.name} />}
      <div>
        <h2>{player.name}</h2>
        {player.nationality && <p>{player.nationality}</p>}
      </div>
    </div>
  </Link>
);

export default PlayerCard;
