let currentRound = null;

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
        timestamp: new Date().toString()
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
    console.log(currentRound);
    updateTotalShots();
}

function updateTotalShots() {
    const holesData = currentRound.holes[hn];
    let putts = holesData.putts.length;
    let shots = holesData.shots.length;
    let total = shots + putts;
    document.getElementById('total-shots').textContent = total;
}
