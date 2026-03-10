import React from "react";
import { Link } from "react-router-dom";
import { Team } from "../../../types/team";
import styles from "../styles/Team.module.scss";

interface Props {
  team: Team;
}

const TeamCard: React.FC<Props> = ({ team }) => (
  <Link
    to={`/teams/${team.team.id}`}
    style={{ textDecoration: "none", color: "inherit" }}>
    <div className={styles.card}>
      {team.team.logo && <img src={team.team.logo} alt={team.team.name} />}
      <div>
        <h2>{team.team.name}</h2>
        {team.team.country && <p>{team.team.country}</p>}
      </div>
    </div>
  </Link>
);

export default TeamCard;
