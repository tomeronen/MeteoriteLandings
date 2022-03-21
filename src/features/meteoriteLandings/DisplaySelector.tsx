import React from "react";
import styled from "styled-components";
import {eDisplayState} from "../../enums/meteoriteLandings";

interface iDisplaySelectorProps {
    displayState: eDisplayState;
    onDisplayChange: (displayState: eDisplayState) => void;
    className?: string;
}

const ToggleDisplayButton = styled.button`
    border: 1px solid purple;
    background-color: mediumpurple;
    color: black;
    border-radius: 50%;
    width: 100px;
    height: 100px;
`;

const DisplaySelector: React.FC<iDisplaySelectorProps> = ({displayState, onDisplayChange, className=''}) => {
    const toggleDisplayState = () => onDisplayChange(displayState === eDisplayState.TABLE ? eDisplayState.ANIMATION: eDisplayState.TABLE)
    return (
        <ToggleDisplayButton className={className} onClick={toggleDisplayState}>
            {displayState === eDisplayState.TABLE && ' SHOW ANIMATION'}
            {displayState === eDisplayState.ANIMATION && ' SHOW TABLE'}
        </ToggleDisplayButton>
    )
}

export default DisplaySelector;