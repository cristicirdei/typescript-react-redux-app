import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import {
  useGetLeagueByIdQuery,
  useGetTeamsByLeagueSeasonQuery,
} from "../../../app/api";
import { useLogQuery } from "../../../app/debug";
import { Team } from "../../../types/team";
import styles from "../styles/League.module.scss";
import TeamLogoLink from "../../teams/components/TeamLogoLink";

const LeagueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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

  if (loading || teamsLoading) return <div>Loading...</div>;
  if (error || teamsError)
    return (
      <div>Error: {((error || teamsError) as any).error || "unknown"}</div>
    );

  console.log("Selected League:", selectedLeague);
  console.log("Teams for League:", teams);

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
      </div>
    </div>
  );
};

export default LeagueDetailPage;
