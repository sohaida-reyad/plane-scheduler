export interface IApproximateSchedule {
    bellSchedule: number[];
    totalUtilizationTime: number;
    minWin: number;
    avgWin: number;
    maxWin: number;
}

const allowedMinAvgDiff = 1;

export function approximateBellSchedule(numberOfBells: number, timeHorizon: number, teams: number[][]): IApproximateSchedule {
    const bellSchedule: number[] = [];
    let totalUtilizationTime = 0;
    let lastBusyTimestamp = 0;
    let minWin = 0;
    let avgWin = 0;
    let maxWin = 0;
    while (numberOfBells !== 0 && lastBusyTimestamp < timeHorizon) {
        // Calculate average service time of the planes ready to be served by all teams
        const averageServiceTime = Math.floor(teams.reduce((sum, current) => sum + (current[0] ?? 0), 0) / teams.length);
        // Get the lowest and highest service times of all teams
        const lowestServiceTime = Math.min(...teams.map((t) => (t[0] ?? 0)));
        const highestServiceTime = Math.max(...teams.map((t) => (t[0] ?? 0)));
        // Calculate total utilization loss time based on the lowestServiceTime
        const lowestServiceTime_utilizationLossTime = teams
            .map((t) => t[0] ?? 0)
            .reduce((accumulatedutilizationLossTime, teamXServiceTime) => accumulatedutilizationLossTime + Math.abs(teamXServiceTime - lowestServiceTime), 0);
        // Calculate total utilization loss time based on the highestServiceTime
        const highestServiceTime_utilizationLossTime = teams
            .map((t) => t[0] ?? 0)
            .reduce((accumulatedutilizationLossTime, teamXServiceTime) => accumulatedutilizationLossTime + Math.abs(teamXServiceTime - highestServiceTime), 0);
        // Calculate total utilization loss time based on the averageServiceTime
        const avgServiceTime_utilizationLossTime = teams
            .map((t) => t[0] ?? 0)
            .reduce((accumulatedutilizationLossTime, teamXServiceTime) => accumulatedutilizationLossTime + Math.abs(teamXServiceTime - averageServiceTime), 0);
        // Find the time that would give the lowest accumulated utilization loss time 
        const bestMinUtilizationLossTime = Math.min(lowestServiceTime_utilizationLossTime, highestServiceTime_utilizationLossTime, avgServiceTime_utilizationLossTime);
        let bellTime = 0;
        switch(bestMinUtilizationLossTime) {
            case lowestServiceTime_utilizationLossTime:
                bellTime = lowestServiceTime;
                minWin++;
                break;
            case avgServiceTime_utilizationLossTime:
                if (lowestServiceTime == averageServiceTime - allowedMinAvgDiff) {
                    bellTime = lowestServiceTime;
                    minWin++;
                } else {
                    bellTime = averageServiceTime;
                    avgWin++;
                }
                break;
            case highestServiceTime_utilizationLossTime:
                bellTime = highestServiceTime;
                maxWin++;
                break;
            default:
        }
        // Serve planes who abide by the bell time (service time <= bell time)
        for (const team of teams) {
            if (!!team[0]) {
                if (team[0] <= bellTime) {
                    const teamServedTime = team.shift();
                    totalUtilizationTime += teamServedTime;
                } else {
                    team[0] -= bellTime;
                    totalUtilizationTime += bellTime;
                }
            }
        }
        // Accumulate bell time to account for time progression
        lastBusyTimestamp += bellTime;
        // Append the bell time to the result array
        bellSchedule.push(lastBusyTimestamp);
        // Decrease the number of available bells to use
        numberOfBells--;
    }

    // If the last bell ring is beyond the time horizon, truncate the bell time to meet the time horizon
    if (bellSchedule[bellSchedule.length - 1] > timeHorizon) {
        bellSchedule[bellSchedule.length - 1] = timeHorizon;
    }

    // Return the totalServiceTime to be used for comparison with the brute force result
    return {
        bellSchedule,
        totalUtilizationTime,
        minWin,
        avgWin,
        maxWin
    };
}