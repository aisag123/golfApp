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
    return `round_${searchCourseName}_${Date.now()}`;
}

function addPutt() {
    const holesData = currentRound.holes[hn];
    holesData.putts.push({
        type: 'putt',
        timestamp: new Date().toISOString()
    });
    console.log(`Added putt to hole ${hn + 1}:`, currentRound);
    updatePutts();
}

function updatePutts() {
    const holesData = currentRound.holes[hn];
    let putts = holesData.putts.length;
    document.getElementById('putts').textContent = putts;
}