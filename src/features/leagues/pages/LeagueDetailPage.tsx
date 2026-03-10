import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../app/store";
import { fetchLeagueById } from "../leaguesSlice";
import styles from "../styles/League.module.scss";

const LeagueDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const dispatch = useDispatch<AppDispatch>();
  const { selectedLeague, loading, error } = useSelector(
    (state: RootState) => state.leagues,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchLeagueById(parseInt(id)));
    }
  }, [dispatch, id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  console.log("Selected League:", selectedLeague);

  return (
    <div className={`${styles.page} ${styles.leagueDetailPage}`}>
      {selectedLeague?.league.logo && (
        <img
          src={selectedLeague.league.logo}
          alt={selectedLeague.league.name}
        />
      )}

      <div className={styles.details}>
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
      </div>

      {/* Add your league detail logic here */}
    </div>
  );
};

export default LeagueDetailPage;
