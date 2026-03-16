import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useGetLeagueByIdQuery,
  useGetTeamsByLeagueSeasonQuery,
  useGetStandingsQuery,
  useGetRoundsQuery,
  useGetFixturesQuery
} from "../../../app/api";
import { useLogQuery } from "../../../app/debug";
import { Team } from "../../../types/team";
import styles from "../styles/League.module.scss";
import TeamLogoLink from "../../teams/components/TeamLogoLink";
import FixtureCard from "../../fixtures/components/FixtureCard";

const FIXTURES_PER_PAGE = 5;

const LeagueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [currentPage, setCurrentPage] = React.useState(1);
  const leagueId = id ? parseInt(id) : undefined;

  const leagueResult = useGetLeagueByIdQuery(leagueId!, {
    skip: leagueId === undefined,
  });
  const { data: selectedLeague, isLoading: loading, error } = leagueResult;
  useLogQuery(leagueResult, `getLeagueById(${leagueId})`);

  const currentSeason = useMemo(() => {
    if (!selectedLeague) return undefined;
    console.log(
      "Selected League Season:",
      selectedLeague.seasons[selectedLeague.seasons.length - 2]?.year,
    );
    return (
      //selectedLeague.seasons.find((s) => s.current)?.year ||
      selectedLeague.seasons[selectedLeague.seasons.length - 2]?.year
    );
  }, [selectedLeague]);

  const teamsResult = useGetTeamsByLeagueSeasonQuery(
    { leagueId: leagueId!, season: currentSeason! },
    { skip: leagueId === undefined || currentSeason === undefined },
  );
  const {
    data: teams,
    isLoading: teamsLoading,
    error: teamsError,
  } = teamsResult;
  useLogQuery(
    teamsResult,
    `getTeamsByLeagueSeason(${leagueId},${currentSeason})`,
  );

  const standingsResult = useGetStandingsQuery(
    { leagueId: leagueId!, season: currentSeason! },
    { skip: leagueId === undefined || currentSeason === undefined },
  );
  const { data: standings } = standingsResult;
  useLogQuery(standingsResult, `getStandings(${leagueId},${currentSeason})`);

  const roundsResult = useGetRoundsQuery(
    { leagueId: leagueId!, season: currentSeason! },
    { skip: leagueId === undefined || currentSeason === undefined },
  );
  const { data: rounds } = roundsResult;
  useLogQuery(roundsResult, `getRounds(${leagueId},${currentSeason})`);

  const fixturesResult = useGetFixturesQuery(
    { leagueId: leagueId!, season: currentSeason! },
    { skip: leagueId === undefined || currentSeason === undefined },
  );
  const { data: fixtures, isLoading: fixturesLoading, error: fixturesError } = fixturesResult;
  useLogQuery(fixturesResult, `getFixtures(${leagueId},${currentSeason})`);


  if (loading || teamsLoading || fixturesLoading) return <div>Loading...</div>;
  if (error || teamsError || fixturesError)
    return (
      <div>Error: {((error || teamsError || fixturesError) as any).error || "unknown"}</div>
    );

  console.log("Selected League:", selectedLeague);
  console.log("Teams for League:", teams);
  console.log("Standings for League:", standings);
  console.log("Rounds for League:", rounds);

  // component
  return (
    <div className={`${styles.page} ${styles.leagueDetailPage}`}>
      {selectedLeague?.league.logo && (
        <div className={styles.leagueLogo}>
          <img
            src={selectedLeague.league.logo}
            alt={selectedLeague.league.name}
          />
        </div>
      )}

      <div className={styles.details}>
        <div className={styles.header}>
          <h2>
            {selectedLeague?.league.name}{" "}
            <span>
              {selectedLeague?.country.flag && (
                <img
                  className={styles.country}
                  src={selectedLeague.country.flag}
                  alt={selectedLeague.country.name}
                />
              )}
            </span>
          </h2>

          <div className={styles.seasons}>
            {selectedLeague?.seasons.map((season: any) => (
              <div>{season.year}</div>
            ))}
          </div>
        </div>

        {/* list teams for the league */}
        <div className={styles.container}>
          {teams?.map((team: Team) => (
            <TeamLogoLink key={team.team.id} team={team} />
          ))}
        </div>
<div className={styles.content}>
   {/* standings table */}
   <div className={styles.standings}>
    {standings && standings.length > 0 && (
          <div className={styles.standingsSection}>
            <h3>Standings</h3>
            <table className={styles.standingsTable}>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Team</th>
                  <th>Played</th>
                  <th>Won</th>
                  <th>Drawn</th>
                  <th>Lost</th>
                  <th>GF</th>
                  <th>GA</th>
                  <th>GD</th>
                  <th>Points</th>
                  <th>Form</th>
                </tr>
              </thead>
              <tbody>
                {standings.map((standing) => (
                  <tr key={standing.team.id}>
                    <td>{standing.rank}</td>
                    <td className={styles.teamCol}>
                      <img src={standing.team.logo} alt={standing.team.name} width={24} height={24} />
                      {standing.team.name}
                    </td>
                    <td>{standing.all.played}</td>
                    <td>{standing.all.win}</td>
                    <td>{standing.all.draw}</td>
                    <td>{standing.all.lose}</td>
                    <td>{standing.all.goals.for}</td>
                    <td>{standing.all.goals.against}</td>
                    <td>{standing.goalsDiff}</td>
                    <td><strong>{standing.points}</strong></td>
                    <td>{standing.form.split('').map((form: string, idx: number) => (
                      form === 'W' ? <span key={idx} className={styles.formItemW}>{form}</span> :
                      form === 'D' ? <span key={idx} className={styles.formItemD}>{form}</span> :
                      <span key={idx} className={styles.formItemL}>{form}</span>
                    ))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}</div>
        

       
        {/* list fixtures */}
        {fixtures && fixtures.length > 0 && (
          <div className={styles.fixturesSection}>
            <h3>Fixtures ({currentSeason})</h3>
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
</div>
 

       {/* list rounds */}
        {rounds && rounds.length > 0 && (
          <div className={styles.roundsSection}>
            <h3>Rounds</h3>
            <div className={styles.roundsList}>
              {rounds.map((round, idx) => (
                <span key={idx} className={styles.roundItem}>{round}</span>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default LeagueDetailPage;
