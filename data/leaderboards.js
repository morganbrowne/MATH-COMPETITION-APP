// data/leaderboards.js

// In-memory storage for leaderboards
let leaderboards = [];

// Function to update the leaderboards with a new streak
function updateLeaderboards(streak) {
    if (streak === 0) return; // Do not record zero streaks

    const timestamp = new Date();

    // Create a new leaderboard entry
    const newEntry = { streak, timestamp };

    // Add the new entry to the leaderboards
    leaderboards.push(newEntry);

    // Sort the leaderboards in descending order based on streak
    leaderboards.sort((a, b) => b.streak - a.streak || a.timestamp - b.timestamp);

    // Keep only the top 10 streaks
    if (leaderboards.length > 10) {
        leaderboards.pop();
    }
}

// Function to retrieve the top 10 streaks
function getTopStreaks() {
    return leaderboards;
}

module.exports = {
    updateLeaderboards,
    getTopStreaks,
};
