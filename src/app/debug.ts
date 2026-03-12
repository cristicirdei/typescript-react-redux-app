import { useEffect } from 'react';

/* Helper hook that prints whether a query result is being fetched from
the network or being satisfied from the cache.  Pass in the object
your RTK Query hook returns (or a subset) along with a label that
identifies the endpoint */

export function useLogQuery<T>(
  result: { data?: T; isFetching: boolean },
  label: string,
) {
  useEffect(() => {
    if (result.isFetching) {
      console.log(`${label} → fetching from API`);
    } else if (result.data !== undefined) {
      console.log(`${label} → served from cache`);
    }
  }, [result.isFetching, result.data, label]);
}
