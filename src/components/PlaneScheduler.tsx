import * as React from 'react';
import { useCallback, useState } from 'react';
import { BellActivity, BellSchedule, schedule, Team } from '../helpers/scheduler';
import '../css/App.css';

export const PlaneScheduler = () => {
  const [teamAServiceTime, setTeamAServiceTime] = useState<number>(0);
  const [teamBServiceTime, setTeamBServiceTime] = useState<number>(0);
  const [maxNumberOfBells, setMaxNumberOfBells] = useState<number>(0);
  const [timeWindow, setTimeWindow] = useState<number>(0);
  const [airplanesTimeTable, setAirplanesTimeTable] = useState<BellSchedule>(null);

  const onTeamAServiceTimeChange = useCallback((e) => setTeamAServiceTime(e.target.value ? parseInt(e.target.value, 10) : 0), []);
  const onTeamBServiceTimeChange = useCallback((e) => setTeamBServiceTime((e.target.value ? parseInt(e.target.value, 10) : 0)), []);
  const onMaxBellsChange = useCallback((e) => setMaxNumberOfBells((e.target.value ? parseInt(e.target.value, 10) : 0)), []);
  const onTimeWindowChange = useCallback((e) => setTimeWindow((e.target.value ? parseInt(e.target.value, 10) : 0)), []);

  const onScheduleButtonClick = useCallback(
    () => {
      const teams: Team[] = [
        {name: "Team A", serviceTime: teamAServiceTime, serviceCount: 0, totalWaitTime: 0, coreServiceTime: 0},
        {name: "Team B", serviceTime: teamBServiceTime, serviceCount: 0, totalWaitTime: 0, coreServiceTime: 0},
      ];
      const airplanesSchedule = schedule(teams, maxNumberOfBells,timeWindow);
      setAirplanesTimeTable(airplanesSchedule);
    },
    [teamAServiceTime, teamBServiceTime, maxNumberOfBells, timeWindow]
  );

  return (
    <div className='scheduler-container'>
      <span className='scheduler-header'>Souhaida's Airplane Scheduler</span>
      <div className='scheduler-row'>
        <span className='scheduler-row-command'>Insert the service time for team A: </span>
        <input className='scheduler-row-input' value={teamAServiceTime} onChange={onTeamAServiceTimeChange}/>
      </div>
      <div className='scheduler-row'>
        <span className='scheduler-row-command'>Insert the service time for team B: </span>
        <input className='scheduler-row-input' value={teamBServiceTime} onChange={onTeamBServiceTimeChange}/>
      </div>
      <div className='scheduler-row'>
        <span className='scheduler-row-command'>Insert the time window: </span>
        <input className='scheduler-row-input' value={timeWindow} onChange={onTimeWindowChange}/>
      </div>
      <div className='scheduler-row'>
        <span className='scheduler-row-command'>Insert the maximum number of bells: </span>
        <input className='scheduler-row-input' value={maxNumberOfBells} onChange={onMaxBellsChange}/>
      </div>
      <button className='scheduler-button' onClick={onScheduleButtonClick}>Schedule</button>
      { 
        airplanesTimeTable && airplanesTimeTable?.bellActivity?.length !== 0 && (
          <div className='scheduler-result'>
            <span className='scheduler-text-header'>Suggested optimal schedule:</span>
            {airplanesTimeTable?.bellActivity.map((bellActivity: BellActivity) =>(<div>Timestamp: {bellActivity.time} {'=>'} {bellActivity.airplanesToServe.length === 0 ? "No airplanes are ready to serve" : bellActivity.airplanesToServe.join(" + ")}</div>))}
            <span className='scheduler-text-header'>Statistics:</span>
            {/* <span>{`The driver of the schedule is: ${airplanesTimeTable.statistics.driver.name}`}</span> */}
            <span>{`Number of bells in action: ${airplanesTimeTable.statistics.numberOfBells}`}</span>
            <span>{`Time interval of between each bell ring: ${airplanesTimeTable.statistics.intervalTime}`}</span>
            {
              airplanesTimeTable.statistics.teams?.map((team) => (
                <>
                  <span>{`Core service time for ${team.name} is: ${team.coreServiceTime}`}</span>
                  <span>{`Total wait time for ${team.name} is: ${team.totalWaitTime}`}</span>
                </>
              ))
            }
          </div>
        )
      }
    </div>
  );
}
