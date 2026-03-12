import React from "react";
import { Link } from "react-router-dom";
import { Team } from "../../../types/team";
import styles from "../styles/Team.module.scss";

interface Props {
  team: Team;
}

const TeamLogoLink: React.FC<Props> = ({ team }) => (
  <Link
    to={`/teams/${team.team.id}`}
    style={{ textDecoration: "none", color: "inherit" }}>
    {team.team.logo && (
      <div className={styles.logoOnly}>
        <img src={team.team.logo} alt={team.team.name} />
      </div>
    )}
  </Link>
);

export default TeamLogoLink;
