import React from 'react';
import { Link } from 'react-router-dom';
import { Fixture } from '../../../types/fixture';
import styles from './FixtureCard.module.scss';

interface FixtureCardProps {
  fixtureData: Fixture;
}

const FixtureCard: React.FC<FixtureCardProps> = ({ fixtureData }) => {
  const { fixture, league, teams, goals } = fixtureData;

  const date = new Date(fixture.date);
  
  const homeWinner = teams.home.winner === true || (goals.home !== undefined && goals.away !== undefined && goals.home > goals.away);
  const awayWinner = teams.away.winner === true || (goals.home !== undefined && goals.away !== undefined && goals.home < goals.away);

  return (
    <Link to={`/fixtures/${fixture.id}`} className={styles.fixtureCard}>
      <div className={styles.leagueInfo}>
        <img src={league.logo} alt={league.name} />
        <span>{league.name} - {league.round}</span>
      </div>
      
      <div className={styles.matchInfo}>
        <span className={styles.date}>
          {date.toLocaleDateString()} {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
        
        <div className={styles.teams}>
          <div className={`${styles.team} ${styles.home} ${homeWinner ? styles.winner : ''}`}>
            <span>{teams.home.name}</span>
            <img src={teams.home.logo} alt={teams.home.name} />
          </div>
          
          <div className={styles.scoreContainer}>
            <div className={styles.score}>
              <span className={homeWinner ? styles.winner : ''}>{goals.home ?? '-'}</span>
              {' : '}
              <span className={awayWinner ? styles.winner : ''}>{goals.away ?? '-'}</span>
            </div>
            <span className={styles.status}>{fixture.status.short}</span>
          </div>
          
          <div className={`${styles.team} ${styles.away} ${awayWinner ? styles.winner : ''}`}>
            <img src={teams.away.logo} alt={teams.away.name} />
            <span>{teams.away.name}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FixtureCard;
