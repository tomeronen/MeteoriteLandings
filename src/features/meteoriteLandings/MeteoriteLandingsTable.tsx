import React, {useEffect} from "react";
import {Column, ColumnProps, Table} from 'react-virtualized';
import 'react-virtualized/styles.css';
import {iMeteoriteLandingsDisplayProps} from "./MeteoriteLandingsDisplay";
import styled from "styled-components";

const MeteoriteLandingsTableContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;

  .ReactVirtualized__Table {
    background-color: #303339;
    border: 1px solid mediumpurple;
    border-radius: 15px;
  }

  .ReactVirtualized__Table__headerColumnn {

  }

  .ReactVirtualized__Table__headerRow {
    border: 1px solid mediumpurple;

  }

  .ReactVirtualized__Table__row {
    border: 1px solid mediumpurple;

    &:hover {
      background-color: rgb(147, 112, 219, 0.1);
    }
  }
`

const MeteoriteLandingsTable: React.FC<iMeteoriteLandingsDisplayProps> = ({ meteoriteLandings, loadMeteoriteLandings, hasMore }) => {

    const TABLE_HEIGHT= 800
    const ROW_HEIGHT = 40
    const TABLE_WIDTH = 1400
    const HEADER_HEIGHT= 50
    const columnsConfig: ColumnProps[] = [
        { label: 'id', dataKey: 'id', width: 350 },
        { label: 'Name', dataKey: 'name', width: 350 },
        { label: 'Year', dataKey: 'year', width: 350 },
        { label: 'Mass', dataKey: 'mass', width: 350 }
    ];

    useEffect(() => {
        if(hasMore && meteoriteLandings.length === 0) {
            loadMeteoriteLandings();
        }
    }, [hasMore, loadMeteoriteLandings, meteoriteLandings])

    return (
        <MeteoriteLandingsTableContainer>
            <Table
                height={TABLE_HEIGHT}
                rowHeight={ROW_HEIGHT}
                width={TABLE_WIDTH}
                headerHeight={HEADER_HEIGHT}
                rowCount={meteoriteLandings.length}
                onScroll={(props) => {
                    const gotToBottom = props.scrollHeight - props.scrollTop === props.clientHeight;
                    if(gotToBottom){
                        loadMeteoriteLandings();
                    }
                } }
                rowGetter={({ index }) => meteoriteLandings[index]}>
                {columnsConfig.map((columnConfig) => (
                    <Column
                        key={columnConfig.dataKey}
                        {...columnConfig}
                    />
                ))}
            </Table>
        </MeteoriteLandingsTableContainer>
    );
}


export default MeteoriteLandingsTable;