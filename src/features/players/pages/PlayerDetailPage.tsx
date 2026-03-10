import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../app/store";
import { fetchPlayerProfile, fetchPlayerStatistics } from "../playersSlice";
import styles from "../styles/Player.module.scss";

const PlayerDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const { profile, statistics, loading, error } = useSelector(
    (state: RootState) => state.players,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchPlayerProfile(parseInt(id)));
      dispatch(fetchPlayerStatistics({ playerId: parseInt(id) }));
    }
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className={styles.page}>
      {profile && (
        <>
          <h2>{profile.name}</h2>
          {profile.photo && <img src={profile.photo} alt={profile.name} />}
          {profile.birth && <p>Born: {profile.birth.date}</p>}
          {profile.nationality && <p>Nationality: {profile.nationality}</p>}
        </>
      )}

      {statistics && (
        <div className={styles.container}>
          {/* render basic stats entries - could be expanded */}
          {statistics.statistics.map((entry, idx) => (
            <div key={idx} className={styles.card}>
              <h3>{entry.league?.name}</h3>
              <p>Team: {entry.team?.name}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerDetailPage;
