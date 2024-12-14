import * as React from 'react';
import { useCallback, useState } from 'react';
import { approximateBellSchedule, IApproximateSchedule } from '../helpers/approx-scheduler';
import '../css/App.css';

export const ApproxScheduler = () => {
  const [teamServiceTimes, setTeamServiceTimes] = useState<string>();
  const [maxNumberOfBells, setMaxNumberOfBells] = useState<number>(0);
  const [timeWindow, setTimeWindow] = useState<number>(0);
  const [bellsTimeTable, setBellTimeTable] = useState<IApproximateSchedule>();

  const onTeamServiceTimeChange = useCallback((e) => setTeamServiceTimes(e.target.value ?? ""), []);
  const onMaxBellsChange = useCallback((e) => setMaxNumberOfBells((e.target.value ? parseInt(e.target.value, 10) : 0)), []);
  const onTimeWindowChange = useCallback((e) => setTimeWindow((e.target.value ? parseInt(e.target.value, 10) : 0)), []);

  const onScheduleButtonClick = useCallback(
    () => {
      const teams = teamServiceTimes.split(/\r?\n/).map((line) => line.split(",").map((time) => parseInt(time.trim(), 10)));
      const approximatedBellSchedule = approximateBellSchedule(maxNumberOfBells,timeWindow, teams);
      setBellTimeTable(approximatedBellSchedule);
    },
    [teamServiceTimes, maxNumberOfBells, timeWindow]
  );

  return (
    <div className='scheduler-container'>
      <span className='scheduler-header'>Approximation Airplane Scheduler</span>
      <div className='scheduler-row'>
        <span className='scheduler-row-command'>Insert the service time for all teams: </span>
        <textarea className='scheduler-row-input' value={teamServiceTimes} onChange={onTeamServiceTimeChange}/>
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
        bellsTimeTable && bellsTimeTable?.bellSchedule?.length !== 0 && (
          <div className='scheduler-result'>
            <span className='scheduler-text-header'>Suggested approximatation-based schedule:</span>
            <div>{bellsTimeTable.bellSchedule.join(" -> ")}</div>
            <span className='scheduler-text-header'>Corresponding total utilization time:</span>
            <div>{bellsTimeTable.totalUtilizationTime}</div>
            <span className='scheduler-text-header'>Statistics:</span>
            <div>{`Number of times the lowest service time was optimal: ${bellsTimeTable.minWin}.`}</div>
            <div>{`Number of times the average service time was optimal: ${bellsTimeTable.avgWin}.`}</div>
            <div>{`Number of times the highest service time was optimal: ${bellsTimeTable.maxWin}.`}</div>
          </div>
        )
      }
    </div>
  );
}
