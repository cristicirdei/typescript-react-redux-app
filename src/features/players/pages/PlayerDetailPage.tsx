import React from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/Player.module.scss";
import {
  useGetPlayerProfileQuery,
  useGetPlayerStatsQuery,
} from "../../../app/api";
import { useLogQuery } from "../../../app/debug";
import PlayerStatistic from "../components/PlayerStatistic";

const PlayerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const playerId = id ? parseInt(id) : undefined;

  const profileResult = useGetPlayerProfileQuery(playerId!, {
    skip: playerId === undefined,
  });
  const { data: profile, isLoading: loading, error } = profileResult;
  useLogQuery(profileResult, `getPlayerProfile(${playerId})`);

  const statsResult = useGetPlayerStatsQuery(
    { playerId: playerId!, season: 2024 },
    { skip: playerId === undefined },
  );
  const {
    data: statistics,
    isLoading: statsLoading,
    error: statsError,
  } = statsResult;
  useLogQuery(statsResult, `getPlayerStats(${playerId}, season:${2024})`);

  if (loading || statsLoading) return <div>Loading...</div>;
  if (error || statsError)
    return (
      <div>Error: {((error || statsError) as any).error || "unknown"}</div>
    );

  return (
    <div className={`${styles.page} ${styles.playerDetailPage}`}>
      {profile && (
        <>
          <div className={styles.photo}>
            {profile.photo && <img src={profile.photo} alt={profile.name} />}
          </div>

          <div className={styles.details}>
            <div className={styles.header}>
              <div>
                <h2>
                  {profile.name} {profile.lastname}
                </h2>
              </div>
              <div className={styles.info}>
                {profile.birth && (
                  <h4>
                    Age: {profile.age} ({profile.birth.date})
                  </h4>
                )}
                {profile.nationality && (
                  <h4>Nationality: {profile.nationality}</h4>
                )}
                {profile.height && <h4>Height: {profile.height} cm</h4>}
                {profile.weight && <h4>Weight: {profile.weight} kg</h4>}
              </div>
            </div>
            <h3>Statistics (2024 season)</h3>
            {statistics && (
              <div>
                {/* render one table per statistics entry */}

                {statistics.statistics
                  .filter((entry) => entry.games?.minutes > 0)
                  .map((statistic: any, idx: number) => (
                    <PlayerStatistic key={idx} statistic={statistic} />
                  ))}

                {/**statistics.statistics.map((entry, idx) => (
                  <table className={styles.statsTable} key={idx}>
                    <div className={styles.caption}>
                      <div>
                        {
                          <img
                            src={entry.league?.logo}
                            alt={entry.league?.name}
                          />
                        }
                        {<img src={entry.team?.logo} alt={entry.team?.name} />}
                      </div>
                      <p>
                        {entry.league?.name || ""} - {entry.team?.name || ""}
                      </p>
                    </div>

                    <tbody>
                      <th>{getKeyByValue(entry, entry.cards)}</th>
                      {objectToTable(entry.cards)}
                      <tr>
                        <th>Cards</th>

                        <td>
                          {entry.cards ? (entry.cards.total ?? "-") : "-"}
                        </td>
                      </tr>
                      <tr>
                        <th>Dribbles</th>
                        <td>
                          {entry.dribbles
                            ? (entry.dribbles.attempts ?? "-")
                            : "-"}
                        </td>
                      </tr>
                      <tr>
                        <th>Duels</th>
                        <td>
                          {entry.duels ? (entry.duels.total ?? "-") : "-"}
                        </td>
                      </tr>
                      <tr>
                        <th>Fouls</th>
                        <td>
                          {entry.fouls ? (entry.fouls.drawn ?? "-") : "-"}
                        </td>
                      </tr>
                      <tr>
                        <th>Games</th>
                        <td>
                          {entry.games ? (entry.games.appearences ?? "-") : "-"}
                        </td>
                      </tr>
                      <tr>
                        <th>Goals</th>
                        <td>
                          {entry.goals ? (entry.goals.total ?? "-") : "-"}
                        </td>
                      </tr>
                      <tr>
                        <th>Passes</th>
                        <td>
                          {entry.passes ? (entry.passes.total ?? "-") : "-"}
                        </td>
                      </tr>
                      <tr>
                        <th>Penalty</th>
                        <td>
                          {entry.penalty ? (entry.penalty.scored ?? "-") : "-"}
                        </td>
                      </tr>
                      <tr>
                        <th>Shots</th>
                        <td>
                          {entry.shots ? (entry.shots.total ?? "-") : "-"}
                        </td>
                      </tr>
                      <tr>
                        <th>Tackles</th>
                        <td>
                          {entry.tackles ? (entry.tackles.total ?? "-") : "-"}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ))*/}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PlayerDetailPage;
