import {iPagination, NasaService} from "../services/NasaService";
import {useCallback, useEffect, useState} from "react";
import {eFetchingState} from "../enums/fetching";
import {iMeteoriteLanding, iMeteoriteLandingsFilters} from "../types/meteoriteLandings";

const DEFAULT_PAGINATION_STEP = 40;

interface useGetMeteoritesResponse {
    meteoriteLandings: iMeteoriteLanding[];
    loadMore: () => Promise<void>;
    hasMore: boolean;
    loadingState: eFetchingState
}

export const useGetMeteorites = (filters: Partial<iMeteoriteLandingsFilters>): useGetMeteoritesResponse => {
    const [meteoriteLandings, setMeteoriteLandings] = useState<iMeteoriteLanding[]>([]);
    const [loadingState, setLoadingState] = useState(eFetchingState.UNINITIALIZED);
    const [pagination, setPagination] = useState<iPagination>({offset: 0, limit:DEFAULT_PAGINATION_STEP})
    const [hasMore, setHasMore] = useState(true)

    useEffect(() => {
        setMeteoriteLandings([]);
        setPagination({offset: 0, limit:DEFAULT_PAGINATION_STEP});
        setHasMore(true);
        setLoadingState(eFetchingState.UNINITIALIZED)
    }, [filters])

    const loadMore = useCallback( async () => {
        if(!hasMore){
            return;
        }

        try {
            setLoadingState(eFetchingState.FETCHING);
            const meteoriteLandingsResult =  await NasaService.getMeteoriteLandings(filters, pagination);
            if (meteoriteLandingsResult.length === 0){
                setHasMore(false)
            }
            setMeteoriteLandings((meteoriteLandings) => [...meteoriteLandings, ...meteoriteLandingsResult]);
            setPagination((curPagination) => ({offset: curPagination.offset + DEFAULT_PAGINATION_STEP, limit: curPagination.limit}))
            setLoadingState(eFetchingState.SUCCESSFUL);
        } catch (e) {
            setLoadingState(eFetchingState.ERROR);
        }
    },[filters, hasMore, pagination]);

    return {meteoriteLandings, loadMore, hasMore, loadingState};
};