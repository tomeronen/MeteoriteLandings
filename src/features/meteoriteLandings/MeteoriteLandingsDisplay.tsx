import React from "react";
import 'react-virtualized/styles.css';
import MeteoriteLandingsTable from "./MeteoriteLandingsTable";
import MeteoriteLandingsAnimation from "./MeteoriteLandingsAnimation";
import { useState } from "react";
import styled from "styled-components";
import DisplaySelector from "./DisplaySelector";
import ErrorBoundary from "../../components/ErrorBoundary";
import {eFetchingState} from "../../enums/fetching";
import {eDisplayState} from "../../enums/meteoriteLandings";
import {iMeteoriteLanding} from "../../types/meteoriteLandings";


export interface iMeteoriteLandingsDisplayProps {
    meteoriteLandings: iMeteoriteLanding[];
    loadMeteoriteLandings: () => void;
    hasMore: boolean;
    loadingMeteoriteLandingsStatus: eFetchingState
}


const MeteoriteLandingsDisplayContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  flex: 1;
  align-items: center;
`;




const MeteoriteLandingsDisplay: React.FC<iMeteoriteLandingsDisplayProps> = (props) => {

    const [displayState, setDisplayState] = useState<eDisplayState>(eDisplayState.TABLE)


    return (
        <ErrorBoundary>
            <MeteoriteLandingsDisplayContainer>
                    <DisplaySelector displayState={displayState} onDisplayChange={setDisplayState}/>
                    { displayState === eDisplayState.TABLE &&
                        <MeteoriteLandingsTable {...props} />
                    }
                    { displayState === eDisplayState.ANIMATION &&
                        <MeteoriteLandingsAnimation {...props} />
                    }
            </MeteoriteLandingsDisplayContainer>
        </ErrorBoundary>
    );
}


export default MeteoriteLandingsDisplay;