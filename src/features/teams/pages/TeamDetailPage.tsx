import React from "react";
import { useParams, Link } from "react-router-dom";
import styles from "../styles/Team.module.scss";
import {
  useGetPlayersByTeamQuery,
  useGetTeamByIdQuery,
  useGetFixturesQuery,
  useGetTeamFixturesQuery,
} from "../../../app/api";
import { useLogQuery } from "../../../app/debug";
import PlayerCard from "../../players/components/PlayerCard";
import PlayerCardTeam from "../../players/components/PlayerCardTeam";
import FixtureCard from "../../fixtures/components/FixtureCard";

const FIXTURES_PER_PAGE = 10;

const TeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentPage, setCurrentPage] = React.useState(1);
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

  const fixturesResult = useGetTeamFixturesQuery(
    { teamId: teamId!, season: 2024 } as any, // Using the backend's team parameter via api-sports
    { skip: teamId === undefined },
  );
  const { data: fixtures, isLoading: fixturesLoading, error: fixturesError } = fixturesResult;
  useLogQuery(fixturesResult, `getFixtures(${teamId}, 2024)`);

  useLogQuery(teamResult, `getTeamById(${teamId})`);

  if (loading || playersLoading || fixturesLoading) return <div>Loading...</div>;
  if (error || playersError || fixturesError) return <div>Error: {((error || playersError || fixturesError) as any).error || "unknown"}</div>;

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
<div className={styles.content}>
 

  {fixtures && fixtures.length > 0 && (
          <div className={styles.fixturesSection}>
            <h3>Fixtures (2024)</h3>
            <div className={styles.fixturesList}>
              {fixtures
                .slice((currentPage - 1) * FIXTURES_PER_PAGE, currentPage * FIXTURES_PER_PAGE)
                .map((fixture: any) => (
                  <FixtureCard key={fixture.fixture.id} fixtureData={fixture} />
                ))}
            </div>
            
            {fixtures.length > FIXTURES_PER_PAGE && (
              <div className={styles.pagination}>
                <button 
                  disabled={currentPage === 1} 
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {Math.ceil(fixtures.length / FIXTURES_PER_PAGE)}</span>
                <button 
                  disabled={currentPage >= Math.ceil(fixtures.length / FIXTURES_PER_PAGE)} 
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  Next
                </button>
              </div>
            )}
          </div>
  )}
   <div className={styles.team}>
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
    </div>
  );
};

export default TeamDetailPage;
