let currentRound = null;
let shotStarted = false;

function initializeRound() {
currentRound = {
    roundID: generateRoundID(),
    holes: {}
};

// Initialize all 18 holes
for (let i = 0; i < 18; i++) {
    currentRound.holes[i] = {
    hole: i + 1,
    shots: [],
    putts: []
    };
}

console.log('Round initialized:', currentRound);
    return currentRound;
}



function generateRoundID() {
    const storedCourseName = localStorage.getItem('courseName');
    const ts = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true});
    return `round_${storedCourseName}_${ts}`;
}

function addPutt() {
    const holesData = currentRound.holes[hn];
    holesData.putts.push({
        type: 'putt',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true})
    });
    console.log(`Added putt to hole ${hn + 1}:`);
    // console.log("stored course name: " + courseName);
    updatePutts();
}

function removePutt() {
    const holesData = currentRound.holes[hn];
    holesData.putts.pop(); //removes last element
    updatePutts();
}

function updatePutts() {
    const holesData = currentRound.holes[hn];
    let putts = holesData.putts.length;
    document.getElementById('putts').textContent = putts;
    // console.log(currentRound);
    updateTotalShots();
}

function getShotStatus() {
    if (shotStarted) {
        return true;
    } else {
        return false;
    }
}

function startShot(shotType = "shot") {
    shotStarted = true;
    Slat = watchPositionLat;
    Slon = watchPositionLon;

    localStorage.setItem("startShot_lat", Slat);
    localStorage.setItem("startShot_lon", Slon);
    localStorage.setItem("startShot_type", shotType);
    
}

function endShot() {
    Elat = watchPositionLat;
    Elon = watchPositionLon;

    const Slat = localStorage.getItem("startShot_lat");
    const Slon = localStorage.getItem("startShot_lon");
    const shotType = localStorage.getItem("startShot_type");
    distance = getDistanceFromLastShot(Slat, Slon, Elat, Elon);

    const holesData = currentRound.holes[hn];
    holesData.shots.push({
        type: `${shotType}`, //club
        start: {lat: Slat, lon: Slon},
        end: {lat: Elat, lon: Elon},
        distance: distance,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true})
    })

    localStorage.removeItem("startShot_lat");
    localStorage.removeItem("startShot_lon");
    localStorage.removeItem("startShot_type");

    console.log(`Added shot to hole ${hn + 1}:`, holesData.shots[holesData.shots.length - 1]);
    updateTotalShots();
    shotStarted = false;
}

function updateTotalShots() {
    const holesData = currentRound.holes[hn];
    let putts = holesData.putts.length;
    let shots = holesData.shots.length;
    let total = shots + putts;
    document.getElementById('total-shots').textContent = total;
}
