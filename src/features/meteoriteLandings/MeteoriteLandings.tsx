import React, {useEffect, useMemo, useState} from "react";
import {toast, ToastContainer} from "react-toastify";
import {useGetMeteorites} from "../../hooks/meteoriteLandings";
import {useDebouncedCallback} from "use-debounce";
import {NasaService} from "../../services/NasaService";
import styled from "styled-components";
import Filters from "./Filters";
import MeteoriteLandingsDisplay from "./MeteoriteLandingsDisplay";
import {eFetchingState} from "../../enums/fetching";



const MeteoriteLandingsContainer = styled.div`
  display: grid;
  background-color:  #36393f;
  color: mediumpurple;
  width: 100vw;
  height: 100vh;
  grid-template-rows: auto 1fr;
  grid-template-columns: auto 1fr;
  grid-template-areas:
        "header  header"
        "data-filters data-display"
`

const StyledFilters = styled(Filters)`
  grid-area: data-filters;
`;

const Header = styled.h1`
  grid-area: header;
  text-align: center;
  font-weight: bold;
  background-color: #202225 ;
  margin: 0;
  border-bottom: 1px solid;
  padding: 10px;
`;

const StyledMeteoriteLandingsDisplay = styled(MeteoriteLandingsDisplay)`
  grid-area: data-display;
`;


const MeteoriteLandings: React.FC = () => {

    const [massFilter, setMassFilter] = useState<string>();
    const [yearFilter, setYearFilter] = useState<string>();
    const filters = useMemo (() => ({mass: massFilter, year: yearFilter}), [massFilter, yearFilter])

    const {meteoriteLandings, loadMore, hasMore, loadingState} = useGetMeteorites(filters);
    const debounceLoadMeteoriteLandings = useDebouncedCallback(loadMore, 500);

    const modifyFiltersToGetResults = async () => {
        if (meteoriteLandings.length === 0 && !hasMore) {
            const {year, ...filtersWithoutYear} = filters;
            const firstYearWithResults = await NasaService.getFirstYearWithResults(filtersWithoutYear);
            if (firstYearWithResults) {
                toast(`The mass was not found, jumping to first year where there is a mass that fits the criteria - ${firstYearWithResults}`);
                setYearFilter(firstYearWithResults);
            } else {
                toast('Could not find a year with meteorite landings fitting the given mass, cleaning mass');
                setMassFilter('')
            }
        }
    }

    useEffect(() => {
        if (meteoriteLandings.length === 0 && loadingState === eFetchingState.SUCCESSFUL && !hasMore) {
            modifyFiltersToGetResults();
        }
    }, [loadingState]);

    return (
        <>
            <MeteoriteLandingsContainer>
                <Header> Meteorite Landings</Header>
                <StyledFilters filters={filters} onMassChange={setMassFilter} onYearChange={setYearFilter}/>
                <StyledMeteoriteLandingsDisplay meteoriteLandings={meteoriteLandings} loadMeteoriteLandings={debounceLoadMeteoriteLandings} hasMore={hasMore} loadingMeteoriteLandingsStatus={loadingState}/>
            </MeteoriteLandingsContainer>
            <ToastContainer position="top-center" theme="dark" />
        </>
    )
}

export default MeteoriteLandings;
