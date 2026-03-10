import React from "react";
import { Link } from "react-router-dom";
import styles from "./Menu.module.scss";

const Menu: React.FC = () => {
  return (
    <nav className={styles.sidebar}>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/leagues">Leagues</Link>
        </li>
        <li>
          <Link to="/teams">Teams</Link>
        </li>
        <li>
          <Link to="/players">Players</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
