import React from "react";
import { Link } from "react-router-dom";
import { Player } from "../../../types/player";
import styles from "../styles/Player.module.scss";

interface Props {
  statistic: any;
}

const PlayerStatistic: React.FC<Props> = ({ statistic }) => (
  <div className={styles.statisticCard}>
    <div className={styles.statisticHeader}>
      <h3>
        {statistic.league?.name} - {statistic.team?.name}
      </h3>
      <div>
        <img src={statistic.league?.logo} alt={statistic.league?.name}></img>
        <img src={statistic.team?.logo} alt={statistic.team?.name}></img>
      </div>
    </div>
    <div className={styles.statisticContent}>
      <div className={styles.games}>
        <p>{statistic.games.appearences + " games"}</p>
        <p>{statistic.games.lineups + " starting"}</p>
        <p>{statistic.games.minutes + " minutes"}</p>
        <p>{statistic.games.position + ""}</p>
        <p>
          {statistic.games.number ? "Number " + statistic.games.number : ""}
        </p>
        <p>
          {statistic.games.rating
            ? "Rating: " +
              (Math.round(statistic.games.rating * 100) / 100).toFixed(2)
            : ""}
        </p>
      </div>

      <h4>Cards</h4>
      <div className={styles.row}>
        <p>Yellow</p>
        <p>{statistic.cards.yellow ? statistic.cards.yellow : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>Yellow-red</p>
        <p>{statistic.cards.yellowred ? statistic.cards.yellowred : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>Red</p>
        <p>{statistic.cards.red ? statistic.cards.red : "-"}</p>
      </div>

      <h4>Dribbles</h4>
      <div className={styles.row}>
        <p>Attempts</p>
        <p>{statistic.dribbles.attempts ? statistic.dribbles.attempts : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>Success</p>
        <p>{statistic.dribbles.success ? statistic.dribbles.success : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>Past</p>
        <p>{statistic.dribbles.past ? statistic.dribbles.past : "-"}</p>
      </div>

      <h4>Duels</h4>
      <div className={styles.row}>
        <p>Total</p>
        <p>{statistic.duels.total ? statistic.duels.total : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>Won</p>
        <p>{statistic.duels.won ? statistic.duels.won : "-"}</p>
      </div>

      <h4>Fouls</h4>
      <div className={styles.row}>
        <p>Drawn</p>
        <p>{statistic.fouls.drawn ? statistic.fouls.drawn : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>Committed</p>
        <p>{statistic.fouls.committed ? statistic.fouls.committed : "-"}</p>
      </div>

      <h4>Goals</h4>
      <div className={styles.row}>
        <p>Total</p>
        <p>{statistic.goals.total ? statistic.goals.total : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>Conceded</p>
        <p>{statistic.goals.conceded ? statistic.goals.conceded : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>Assist</p>
        <p>{statistic.goals.assists ? statistic.goals.assists : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>Saves</p>
        <p>{statistic.goals.saves ? statistic.goals.saves : "-"}</p>
      </div>

      <h4>Passes</h4>
      <div className={styles.row}>
        <p>Total</p>
        <p>{statistic.passes.total ? statistic.passes.total : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>Key</p>
        <p>{statistic.passes.key ? statistic.passes.key : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>Accuracy</p>
        <p>
          {statistic.passes.accuracy ? statistic.passes.accuracy + "%" : "-"}
        </p>
      </div>

      <h4>Penalty</h4>
      <div className={styles.row}>
        <p>Won</p>
        <p>{statistic.penalty.won ? statistic.penalty.won : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>Commited</p>
        <p>{statistic.penalty.commited ? statistic.penalty.commited : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>Scored</p>
        <p>{statistic.penalty.scored ? statistic.penalty.scored : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>Missed</p>
        <p>{statistic.penalty.missed ? statistic.penalty.missed : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>Saved</p>
        <p>{statistic.penalty.saved ? statistic.penalty.saved : "-"}</p>
      </div>

      <h4>Shots</h4>
      <div className={styles.row}>
        <p>Total</p>
        <p>{statistic.shots.total ? statistic.shots.total : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>On</p>
        <p>{statistic.shots.on ? statistic.shots.on : "-"}</p>
      </div>

      <h4>Tackles</h4>
      <div className={styles.row}>
        <p>Total</p>
        <p>{statistic.tackles.total ? statistic.tackles.total : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>Blocks</p>
        <p>{statistic.tackles.blocks ? statistic.tackles.blocks : "-"}</p>
      </div>
      <div className={styles.row}>
        <p>Interceptions</p>
        <p>
          {statistic.tackles.interceptions
            ? statistic.tackles.interceptions
            : "-"}
        </p>
      </div>
    </div>
  </div>
);

export default PlayerStatistic;
