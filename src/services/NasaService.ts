import axios from "axios";
import {iMeteoriteLanding, iMeteoriteLandingsFilters} from "../types/meteoriteLandings";
import NasaQueryParser from "./NasaQueryParser";

export interface iPagination {
    offset: number;
    limit: number;
}

interface iNasaService {
    getYearSuggestions: (partialYear: string) => Promise<string[]>;
    getMeteoriteLandings: (filters: Partial<iMeteoriteLandingsFilters>, pagination: iPagination) => Promise<iMeteoriteLanding[]>;
    getFirstYearWithResults: (filters: Partial<Omit<iMeteoriteLandingsFilters, 'year'>>) => Promise<string>;
}



export const NasaService: iNasaService = (() => {
    const BASE_URL = 'https://data.nasa.gov/';
    const METEORITE_LANDING_PATH = '/resource/y77d-th95.json';

    async function getMeteoriteLandings(filters: Partial<iMeteoriteLandingsFilters>, pagination: iPagination) {
        const query = NasaQueryParser.formatQuery(filters, pagination);
        return (await axios.get(`${BASE_URL}${METEORITE_LANDING_PATH}?${query}`)).data;
    }

    async function getYearSuggestions(partialYear: string) {
        partialYear = partialYear.padEnd(4, '0');
        var yearSuggestionsResult = (await axios.get(`${BASE_URL}${METEORITE_LANDING_PATH}?$select=date_extract_y(year) as year_number&$group=year_number&$where=(year_number >= ${partialYear})&$order=year_number`)).data;
        return yearSuggestionsResult.map((yearSuggestionResult: { year_number: string }) => yearSuggestionResult.year_number);
    }

    async function getFirstYearWithResults(filters: Partial<Omit<iMeteoriteLandingsFilters, 'year'>>) {
        const query = NasaQueryParser.formatQuery(filters, { offset: 0, limit: 1});
        return (await axios.get(`${BASE_URL}${METEORITE_LANDING_PATH}?${query}&$order=year_number`)).data[0]?.year_number;
    }

    return {
        getMeteoriteLandings,
        getYearSuggestions,
        getFirstYearWithResults
    }
})()