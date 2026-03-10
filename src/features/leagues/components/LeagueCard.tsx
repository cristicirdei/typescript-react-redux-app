import React from "react";
import { Link } from "react-router-dom"; // ← add
import { League } from "../../../types/league"; // ← add
import styles from "../styles/League.module.scss"; // ← add

interface Props {
  league: League;
}

const LeagueCard: React.FC<Props> = ({ league }) => (
  <Link
    to={`/leagues/${league.league.id}`}
    style={{ textDecoration: "none", color: "inherit" }}>
    <div className={styles.card}>
      {league.league.logo && (
        <img src={league.league.logo} alt={league.league.name} />
      )}
      <div>
        <h2>{league.league.name}</h2>
        <p>{league.country.name}</p>
      </div>
    </div>
  </Link>
);

export default LeagueCard;
