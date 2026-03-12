import React from "react";
import { useParams } from "react-router-dom";
import styles from "../styles/Team.module.scss";
import {
  useGetPlayersByTeamQuery,
  useGetTeamByIdQuery,
} from "../../../app/api";
import { useLogQuery } from "../../../app/debug";
import PlayerCard from "../../players/components/PlayerCard";
import PlayerCardTeam from "../../players/components/PlayerCardTeam";

const TeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const teamId = id ? parseInt(id) : undefined;
  const teamResult = useGetTeamByIdQuery(teamId!, {
    skip: teamId === undefined,
  });
  const { data: selectedTeam, isLoading: loading, error } = teamResult;

  const playersResult = useGetPlayersByTeamQuery(
    { teamId: teamId! },
    { skip: teamId === undefined },
  );
  const {
    data: players,
    isLoading: playersLoading,
    error: playersError,
  } = playersResult;
  useLogQuery(playersResult, `getPlayersByTeam(${teamId})`);

  useLogQuery(teamResult, `getTeamById(${teamId})`);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as any).error || "unknown"}</div>;

  return (
    <div className={`${styles.page} ${styles.teamDetailPage}`}>
      <div className={styles.teamLogo}>
        {selectedTeam?.team?.logo && (
          <img src={selectedTeam.team.logo} alt={selectedTeam.team.name} />
        )}
      </div>

      <div className={styles.details}>
        <div className={styles.header}>
          <div>
            <h2>{selectedTeam?.team?.name}</h2>
            {selectedTeam?.venue && (
              <h4>
                {`${selectedTeam.venue.city && selectedTeam.venue.city}, ${selectedTeam.team.country}`}
              </h4>
            )}
            {selectedTeam?.venue && (
              <h4>
                {`Venue: ${selectedTeam.venue.name}, ${selectedTeam.venue.capacity} seats`}
              </h4>
            )}
          </div>
        </div>

        <div className={styles.team}>
          {playersResult.isLoading && <p>Loading players...</p>}
          {playersResult.error && (
            <p>
              Error loading players:{" "}
              {(playersResult.error as any).error || "unknown"}
            </p>
          )}
          {playersResult.data && (
            <>
              <h3>Squad</h3>
              {["Attacker", "Midfielder", "Defender", "Goalkeeper"].map(
                (position) => (
                  <div key={position}>
                    <h4>{`${position}s`}</h4>
                    <div className={styles.teamTable}>
                      {playersResult.data &&
                        playersResult.data
                          .filter((player: any) => player.position === position)
                          .map((player: any) => (
                            <PlayerCardTeam key={player.id} player={player} />
                          ))}
                    </div>
                  </div>
                ),
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetailPage;
