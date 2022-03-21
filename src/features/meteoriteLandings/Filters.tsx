import React from "react";
import styled from "styled-components";
import {NasaService} from "../../services/NasaService";
import { useThrottledCallback } from 'use-debounce';
import AsyncSelect from "react-select/async";
import {iMeteoriteLandingsFilters} from "../../types/meteoriteLandings";

interface iFiltersProps {
    filters: Partial<iMeteoriteLandingsFilters>;
    onMassChange: (mass: string) => void;
    onYearChange: (year: string) => void;
}

const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 50px;
  min-width: 300px;
  border: 1px solid;
  background-color: #2f3237;
  input {
    height: 30px;
    border: 2px solid mediumpurple;
    border-radius: 8px;
  }
`;


const Filters: React.FC<iFiltersProps> = ({ filters, onMassChange, onYearChange}) => {
    const { year, mass } = filters;


    const getYearSuggestions = useThrottledCallback(async (yearInput = '') => {
        const suggestionsResults = await NasaService.getYearSuggestions(yearInput ?? '');
        return suggestionsResults.map((suggestionsResult) =>({ value: suggestionsResult, label: suggestionsResult}));
    }, 50);

    return (
        <FiltersContainer>
            <h1> Filters </h1>
            <h2> Year </h2>
            <AsyncSelect
                cacheOptions
                defaultOptions
                loadOptions={getYearSuggestions}
                placeholder={'Year to filter by'} value={{value: year, label: year}} onChange={(a) => {
                if(a) {
                    onYearChange(a.value ?? '')
                }
            }} />
            { filters.year &&
                <>
                    <h2> Mass </h2>
                    <input value={mass} onChange={(e) => {
                        onMassChange( e.target.value)
                    }} />
                </>
            }
        </FiltersContainer>
    );
}


export default Filters;