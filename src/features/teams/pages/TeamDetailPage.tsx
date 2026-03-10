import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../app/store";
import { fetchTeamById } from "../teamsSlice";
import styles from "../styles/Team.module.scss";

const TeamDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedTeam, loading, error } = useSelector(
    (state: RootState) => state.teams,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchTeamById(parseInt(id)));
    }
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={`${styles.page} ${styles.teamDetailPage}`}>
      {selectedTeam?.team.logo && (
        <img src={selectedTeam.team.logo} alt={selectedTeam.team.name} />
      )}

      <div className={styles.details}>
        <h2>{selectedTeam?.team.name}</h2>
        {selectedTeam?.team.country && <p>{selectedTeam.team.country}</p>}
        {selectedTeam?.venue && (
          <>
            <h3>Venue</h3>
            <p>{selectedTeam.venue.name}</p>
            {selectedTeam.venue.city && <p>{selectedTeam.venue.city}</p>}
          </>
        )}
      </div>
    </div>
  );
};

export default TeamDetailPage;
