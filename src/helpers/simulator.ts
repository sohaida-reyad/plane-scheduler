export function generateData(numOfTeams: number, timeHorizon: number, numberOfBells: number) : Map<number, number[]> {
    const planeServiceTimes = new Map<number, number[]>();
    for (let teamIndex = 0; teamIndex < numOfTeams; teamIndex++) {
        const serviceTimes = getServiceTimesForTeam(timeHorizon, numberOfBells); 
        planeServiceTimes.set(teamIndex, serviceTimes);
    }
    return planeServiceTimes;
}

function getServiceTimesForTeam(timeHorizon: number, numberOfBells: number): number[] {
    const timeLimit = timeHorizon / (numberOfBells + 1);
    const serviceTimes = [];
    let sumOfTeamServiceTimes = 0;
    let missedTime = 0;
    for (let i=0; i <= numberOfBells; i++) {
        // Bound the service time duration by half the time horizon to avoid generating schedules 
        // with single values that take up a large portion of the time horizon.
        // Generate a random service time between 0 and the timeLimit.
        let serviceTime = getRandomServiceTime(timeLimit);
        // Truncate the the randomly generated service time to fit within the remaining schedule time if needed.
        if (serviceTime > 0) {
            if (sumOfTeamServiceTimes + serviceTime < timeHorizon) {
                // Add the service time to the team schedule.
                serviceTimes.push(serviceTime);
                // Accumulate the total service time of the team.
                sumOfTeamServiceTimes += serviceTime;
                missedTime += (timeLimit - serviceTime);
            } else if (sumOfTeamServiceTimes + serviceTime > timeHorizon ) {
                i--;
            }
        }
        // Adding a 1000ms delay between iterations to increase variances in the random number generation.
        setTimeout(null, 1000);   
    }

    if (sumOfTeamServiceTimes > timeHorizon) {
        serviceTimes[0] -= (sumOfTeamServiceTimes - timeHorizon);
        if (serviceTimes[0] === 0 || serviceTimes[0] < 0) {
            serviceTimes.splice(-1);
        }
    }

    return serviceTimes;
}

// function getServiceTimesForBells(numberOfBells: number, serviceTimeLimit: number): number[] {
//     const serviceTimes = [];
//     for (let bellIndex = 0; bellIndex < numberOfBells; bellIndex++) {
//         serviceTimes.push(getRandomServiceTime(serviceTimeLimit));
//     }
//     return serviceTimes;
// }

function getRandomServiceTime(limit: number) {
    return Math.floor(Math.random() * (limit+1));
}