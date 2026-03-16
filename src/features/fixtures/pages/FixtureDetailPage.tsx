import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetFixtureByIdQuery, useGetLineupsQuery } from '../../../app/api';
import styles from './FixtureDetailPage.module.scss';
import { useLogQuery } from '../../../app/debug';

const FixtureDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const fixtureId = id ? parseInt(id) : undefined;

  const fixtureResult = useGetFixtureByIdQuery(fixtureId!, {
    skip: fixtureId === undefined,
  });
  const { data: fixture, isLoading: fixtureLoading, error: fixtureError } = fixtureResult;
  useLogQuery(fixtureResult, `getFixtureById(${fixtureId})`);

  const lineupsResult = useGetLineupsQuery(fixtureId!, {
    skip: fixtureId === undefined,
  });
  const { data: lineups, isLoading: lineupsLoading, error: lineupsError } = lineupsResult;
  useLogQuery(lineupsResult, `getLineups(${fixtureId})`);

  if (fixtureLoading || lineupsLoading) return <div>Loading Match Details...</div>;
  if (fixtureError || lineupsError) return <div>Error loading match details</div>;

  return (
    <div className={styles.page}>
      {fixture && (
        <div className={styles.fixtureDetails}>
          <div className={styles.leagueHeader}>
            <img src={fixture.league.logo} alt={fixture.league.name} />
            <h2>{fixture.league.name} - {fixture.league.round}</h2>
          </div>

          <div className={styles.scoreboard}>
            <div className={styles.team}>
              <img src={fixture.teams.home.logo} alt={fixture.teams.home.name} />
              <h3>{fixture.teams.home.name}</h3>
            </div>

            <div className={styles.score}>
              <h1 className={styles.scoreText}>
                <span className={fixture.teams.home.winner ? styles.winner : ''}>
                  {fixture.goals.home ?? '-'}
                </span>
                {' : '}
                <span className={fixture.teams.away.winner ? styles.winner : ''}>
                  {fixture.goals.away ?? '-'}
                </span>
              </h1>
              <span className={styles.status}>{fixture.fixture.status.long}</span>
            </div>

            <div className={styles.team}>
              <img src={fixture.teams.away.logo} alt={fixture.teams.away.name} />
              <h3>{fixture.teams.away.name}</h3>
            </div>
          </div>
          
          <div className={styles.matchInfo}>
            <p><strong>Date:</strong> {new Date(fixture.fixture.date).toLocaleString()}</p>
            {fixture.fixture.venue && (
              <p><strong>Venue:</strong> {fixture.fixture.venue.name}, {fixture.fixture.venue.city}</p>
            )}
            {fixture.fixture.referee && (
              <p><strong>Referee:</strong> {fixture.fixture.referee}</p>
            )}
          </div>

          {/* Match Events */}
          {fixture.events && fixture.events.length > 0 && (
            <div className={styles.eventsSection}>
              <h3>Match Events</h3>
              <div className={styles.eventsList}>
                {fixture.events.map((event, idx) => (
                  <div key={idx} className={`${styles.eventItem} ${event.team.id === fixture.teams.home.id ? styles.homeEvent : styles.awayEvent}`}>
                    <div className={styles.eventTime}>{event.time.elapsed}'</div>
                    <div className={styles.eventDetails}>
                      <span className={styles.eventType}>{event.type}</span>
                      <span className={styles.eventPlayer}>{event.player.name}</span>
                      {event.assist?.name && <span className={styles.eventAssist}>({event.assist.name})</span>}
                      {event.detail && <span className={styles.eventDetailInfo}>- {event.detail}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Match Statistics */}
          {fixture.statistics && fixture.statistics.length === 2 && (
            <div className={styles.statisticsSection}>
              <h3>Match Statistics</h3>
              {fixture.statistics[0].statistics.map((stat, idx) => (
                <div key={idx} className={styles.statRow}>
                  <span className={styles.statHome}>{stat.value ?? 0}</span>
                  <span className={styles.statType}>{stat.type}</span>
                  <span className={styles.statAway}>{fixture.statistics![1].statistics[idx].value ?? 0}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {lineups && lineups.length > 0 && (
        <div className={styles.lineupsContainer}>
          <h2>Lineups</h2>
          <div className={styles.lineups}>
            {lineups.map((lineup) => (
              <div key={lineup.team.id} className={styles.teamLineup}>
                <div className={styles.teamHeader}>
                  <img src={lineup.team.logo} alt={lineup.team.name} />
                  <h3>{lineup.team.name}</h3>
                  <span className={styles.formation}>{lineup.formation}</span>
                  {lineup.coach && (
                    <div className={styles.coach}>
                      Coach: {lineup.coach.name}
                    </div>
                  )}
                </div>
                
                <div className={styles.players}>
                  <h4>Starting XI</h4>
                  <div className={styles.pitch}>
                    {lineup.startXI.map((entry) => {
                      const gridParts = entry.player.grid ? entry.player.grid.split(':') : ['1', '1'];
                      const row = parseInt(gridParts[0]);
                      const col = parseInt(gridParts[1]);
                      // Max rows usually 4-5. Let's map dynamically: row gives Y, col gives X
                      const maxRow = 5; 
                      const maxCol = 5;
                      
                      const topPercent = `${(row / (maxRow + 1)) * 100}%`;
                      const leftPercent = `${(col / (maxCol + 1)) * 100}%`;

                      return (
                        <div 
                          key={entry.player.id} 
                          className={styles.pitchPlayer}
                          style={{ top: topPercent, left: leftPercent }}
                        >
                          <span className={styles.number}>{entry.player.number}</span>
                          <span className={styles.name}>{entry.player.name}</span>
                        </div>
                      );
                    })}
                  </div>

                  <h4>Substitutes</h4>
                  <ul className={styles.substitutes}>
                    {lineup.substitutes.map((entry) => (
                      <li key={entry.player.id}>
                        <span className={styles.number}>{entry.player.number}</span>
                        <span className={styles.name}>{entry.player.name}</span>
                        <span className={styles.pos}>{entry.player.pos}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FixtureDetailPage;
