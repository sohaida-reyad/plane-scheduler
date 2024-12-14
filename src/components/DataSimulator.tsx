import * as React from 'react';
import { useCallback, useState } from "react";
import { generateData } from "../helpers/simulator";
import '../css/App.css';

export const Simulator = () => {
    const [numberOfTeams, setNumberOfTeams] = useState<number>(0);
    const [maxNumberOfBells, setMaxNumberOfBells] = useState<number>(0);
    const [timeWindow, setTimeWindow] = useState<number>(0);
    const [simulationData, setSimulationData] = useState<Map<number, number[]>>();
  
    const onNumberOfTeamsChange = useCallback((e) => setNumberOfTeams(e.target.value ? parseInt(e.target.value, 10) : 0), []);
    const onMaxBellsChange = useCallback((e) => setMaxNumberOfBells((e.target.value ? parseInt(e.target.value, 10) : 0)), []);
    const onTimeWindowChange = useCallback((e) => setTimeWindow((e.target.value ? parseInt(e.target.value, 10) : 0)), []);

    const onSimulateButtonClick = useCallback(
        () => {
          const airplanesSchedule = generateData(numberOfTeams, timeWindow, maxNumberOfBells);
          setSimulationData(airplanesSchedule);
        },
        [numberOfTeams, maxNumberOfBells, timeWindow]
    );

    return (
        <div className='scheduler-container'>
            <span className='scheduler-header'>Airplane Scheduler Simulator</span>
            <div className='scheduler-row'>
                <span className='scheduler-row-command'>Insert the number of teams: </span>
                <input className='scheduler-row-input' value={numberOfTeams} onChange={onNumberOfTeamsChange}/>
            </div>
            <div className='scheduler-row'>
                <span className='scheduler-row-command'>Insert the time window: </span>
                <input className='scheduler-row-input' value={timeWindow} onChange={onTimeWindowChange}/>
            </div>
            <div className='scheduler-row'>
                <span className='scheduler-row-command'>Insert the maximum number of bells: </span>
                <input className='scheduler-row-input' value={maxNumberOfBells} onChange={onMaxBellsChange}/>
            </div>
            <button className='scheduler-button' onClick={onSimulateButtonClick}>Generate simulation data</button>
            {
                simulationData && simulationData?.size !== 0 && (
                    <div className='scheduler-result'>
                    {
                        Array.from(simulationData).map(([key, value]) => {
                            return (<div key={key}>{`Team # ${key + 1}: [${value.join(", ")}]`}</div>)
                        })
                    }
                    </div>
                )
            }
        </div>
    );
}