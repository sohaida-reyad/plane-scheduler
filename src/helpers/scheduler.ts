export interface Statistics {
    intervalTime: number;
    numberOfBells: number;
    totalWaitTime: number;
    teams?: Team[];
}

export interface BellActivity {
    time: number;
    airplanesToServe: string[];
}

export interface BellSchedule {
    bellActivity: BellActivity[];
    statistics: Statistics;
}

export interface Team {
    name: string;
    serviceTime: number;
    serviceCount: number;
    totalWaitTime?: number;
    coreServiceTime?: number;
}

export function schedule(teams: Team[], maxNumberOfBells: number, timeWindow: number) {
    // let scheduleDriver: Team = null;
    // let scheduleFollower: Team = null;
    // if (teamA.serviceTime < teamB.serviceTime) {
    //     scheduleDriver = teamA;
    //     scheduleFollower = teamB;
    // } else {
    //     scheduleDriver = teamB;
    //     scheduleFollower = teamA;
    // }
    
    const case1NumberOfBells = Math.floor(timeWindow / teams[0].serviceTime);
    const case1Schedule = case1NumberOfBells <= maxNumberOfBells ? scheduleScenario(teams, case1NumberOfBells, timeWindow) : null;

    const case2NumberOfBells = Math.floor(timeWindow / teams[1].serviceTime);
    const case2Schedule = case2NumberOfBells <= maxNumberOfBells ?  scheduleScenario(teams, case2NumberOfBells, timeWindow) : null;

    const case3Schedule = scheduleScenario(teams, maxNumberOfBells, timeWindow);

    const minWaitTime = Math.min(
        case1Schedule?.statistics.totalWaitTime ?? Number.MAX_SAFE_INTEGER,
        case2Schedule?.statistics.totalWaitTime ?? Number.MAX_SAFE_INTEGER,
        case3Schedule.statistics.totalWaitTime
    );

    console.log("case1", JSON.stringify(case1Schedule));
    console.log("case2", JSON.stringify(case2Schedule));
    console.log("case3", JSON.stringify(case3Schedule));

    switch (minWaitTime) {
        case case1Schedule?.statistics?.totalWaitTime:
            return case1Schedule;
        case case2Schedule?.statistics?.totalWaitTime:
            return case1Schedule;
        case case3Schedule?.statistics?.totalWaitTime:
            return case3Schedule;
        default:
            return null;
    }
}

function scheduleScenario(teams: Team[], numberOfBells: number, timeWindow: number) {
    const bellInterval = Math.floor(timeWindow / numberOfBells);
    // let driverServiceCount = 1;
    // let followerServiceCount = 1;
    // scheduleFollower.totalWaitTime = 0;
    // scheduleFollower.coreServiceTime = 0;
    const bellSchedule: BellSchedule = { bellActivity: [], statistics: { intervalTime: 0, numberOfBells: 0, totalWaitTime: 0 } };
    for (let i = 1; i <= numberOfBells; i++) {
        const currentTimestamp = bellInterval * i;
        const airplanesToServe: string[] = [];
        let willServeWithinInterval: boolean = false;
        for (const team of teams) {
            if (team.serviceTime * (team.serviceCount++) <= currentTimestamp) {
                airplanesToServe.push(`${team.name} - Airplane # ${team.serviceCount}`);
                team.totalWaitTime += (Math.abs(team.serviceTime % bellInterval) === 0 ? 0 : bellInterval - Math.abs(team.serviceTime % bellInterval));
                team.coreServiceTime += team.serviceTime;
                willServeWithinInterval = true;
                bellSchedule.statistics.totalWaitTime += team.totalWaitTime;
            }
            // if (scheduleFollower.serviceTime * followerServiceCount <= currentTimestamp) {
            //     airplanesToServe.push(`${scheduleFollower.name} - Airplane # ${followerServiceCount}`);
            //     scheduleFollower.totalWaitTime += bellInterval - scheduleFollower.serviceTime;
            //     scheduleFollower.coreServiceTime += scheduleFollower.serviceTime;
            //     followerServiceCount++;
            //     willServeWithinInterval = true;
            // }
        }
        if (willServeWithinInterval) {
            bellSchedule.bellActivity.push({ time: currentTimestamp, airplanesToServe });
        } else {
            bellSchedule.bellActivity.push({ time: currentTimestamp, airplanesToServe: [] });
        }
    }

    // scheduleDriver.coreServiceTime = scheduleDriver.serviceTime * possibleNumberOfBells;
    // scheduleDriver.totalWaitTime = 0;
    // bellSchedule.statistics.driver = scheduleDriver;
    // bellSchedule.statistics.follower = scheduleFollower;

    bellSchedule.statistics.intervalTime = bellInterval;
    bellSchedule.statistics.numberOfBells = numberOfBells;
    bellSchedule.statistics.teams = teams;

    return bellSchedule;
}
