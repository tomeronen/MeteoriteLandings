import { iPagination} from "./NasaService";
import {iMeteoriteLandingsFilters} from "../types/meteoriteLandings";

interface iNasaQueryParser {
    formatQuery: (filters: Partial<iMeteoriteLandingsFilters>, pagination: iPagination) => string;
}

const NasaQueryParser: iNasaQueryParser = (() => {

    const formatQuery = (filters: Partial<iMeteoriteLandingsFilters>, pagination: iPagination) : string => {

        let query = '$select=date_extract_y(year) as year_number, year, name, id, mass';
        if(!filters || Object.keys(filters).length === 0){
            return query;
        }

        query += '&$where=';
        let filtersString = [];
        if (filters.year){
            filtersString.push(`(year_number=${filters.year})`)
        }
        if (filters.mass){
            filtersString.push(`(mass>${filters.mass})`);
        }
        query += filtersString.join('AND');


        if(pagination && Object.keys(pagination).length > 0){
            if (pagination.limit) {
                query += `&$limit=${pagination.limit}`
            }
            if (pagination.offset){
                query += `&$offset=${pagination.offset}`
            }
        }
        return query;
    }

    return {
        formatQuery
    }
})()


export default NasaQueryParser;