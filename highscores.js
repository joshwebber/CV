// Import Firebase modules (for module-based setup)
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, orderBy, limit, getDocs, onSnapshot } from "firebase/firestore";

// Your Firebase configuration (Replace with your actual config from Firebase Console)
const firebaseConfig = {
    apiKey: "AIzaSyDl4TpwORMUI05K_BvEF9itzzY_Tn50fQg",
    authDomain: "dogrun-score-table.firebaseapp.com",
    projectId: "dogrun-score-table",
    storageBucket: "dogrun-score-table.firebasestorage.app",
    messagingSenderId: "772742120232",
    appId: "1:772742120232:web:a8b33f624b987a6a99c61d",
    measurementId: "G-V3GRS2X60P"
  };

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Reference to the "highScores" collection
const scoresRef = collection(db, "highScores");

async function saveHighScore(playerName, score) {
    try {
        await addDoc(scoresRef, { 
            name: playerName, 
            score: score, 
            timestamp: serverTimestamp() 
        });
        console.log("High score saved!");
        updateHighScores(); // Refresh leaderboard after saving
    } catch (error) {
        console.error("Error saving score: ", error);
    }
}

async function getHighScores() {
    const q = query(scoresRef, orderBy("score", "desc"), limit(5));
    const querySnapshot = await getDocs(q);
    
    let highScores = [];
    querySnapshot.forEach((doc) => {
        highScores.push(doc.data());
    });

    return highScores;
}

function displayHighScores(scores) {
    const tableBody = document.getElementById("highScoresBody");
    tableBody.innerHTML = ""; // Clear previous scores
    
    scores.forEach((score, index) => {
        let row = tableBody.insertRow();
        row.innerHTML = `<td>${index + 1}</td><td>${score.name}</td><td>${score.score}</td>`;
    });

    console.log("High scores displayed:", scores);
}


async function updateHighScores() {
    const scores = await getHighScores();
    displayHighScores(scores);
}

// Call updateHighScores() when the page loads to display scores
document.addEventListener("DOMContentLoaded", updateHighScores);

onSnapshot(query(scoresRef, orderBy("score", "desc"), limit(5)), (snapshot) => {
    let scores = [];
    snapshot.forEach((doc) => scores.push(doc.data()));
    displayHighScores(scores);
    console.log("Updated leaderboard:", scores);
});


function submitHighScore() {
    let playerName = document.getElementById("playerName").value.trim(); // Get and clean input
    let playerScore = getGameScore(); // Replace with your actual function
    // Replace with actual game score

    if (playerName === "") {
        alert("Please enter your name!"); // Prevent empty submissions
        return;
    }

    saveHighScore(playerName, playerScore); // Call the function to save score
    document.getElementById("playerName").value = ""; // Clear input after submission
}

