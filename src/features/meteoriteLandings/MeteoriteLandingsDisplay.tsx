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
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-around;
`;

const StyledDisplaySelector = styled(DisplaySelector)`
  position: absolute;
  top: 0;
  left: 0;
  margin: 20px;
`;


const MeteoriteLandingsDisplay: React.FC<iMeteoriteLandingsDisplayProps> = (props) => {

    const [displayState, setDisplayState] = useState<eDisplayState>(eDisplayState.TABLE)


    return (
        <MeteoriteLandingsDisplayContainer>
            <ErrorBoundary>
                <StyledDisplaySelector displayState={displayState} onDisplayChange={setDisplayState}/>
                { displayState === eDisplayState.TABLE &&
                    <MeteoriteLandingsTable {...props} />
                }
                { displayState === eDisplayState.ANIMATION &&
                    <MeteoriteLandingsAnimation {...props} />
                }
            </ErrorBoundary>
        </MeteoriteLandingsDisplayContainer>
    );
}


export default MeteoriteLandingsDisplay;