// Jua Quiz Game Script

let gameState = {
    isHost: false,
    gamePin: null,
    players: [],
    currentPlayerIndex: 0,
    currentQuestionIndex: 0,
    currentSetIndex: 0,
    questions: [],
    timer: null,
    timeLeft: 5,
    totalSets: 4, // 4 levels/sets
    questionsPerSet: 5, // 5 questions per set
    currentLevel: 1
};

// Generate random game PIN
function generatePin() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Shuffle array utility
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize questions (20 questions in 4 sets of 5)
async function initializeQuestions() {
    console.log('Initializing questions from API...');

    try {
        const response = await fetch('/api/questions');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const questionSets = await response.json();

        // Select 4 random sets and shuffle questions within each
        const selectedSets = shuffleArray([...questionSets]).slice(0, gameState.totalSets);
        gameState.questions = selectedSets.map(set => shuffleArray([...set]));

        console.log('Questions initialized successfully from API!');
        console.log(`Total sets loaded: ${questionSets.length}, Selected random sets: ${gameState.questions.length}`);
        console.log(`Questions per set: ${gameState.questions[0]?.length || 0}`);
        console.log('Sample question from set 1:', gameState.questions[0]?.[0]);
    } catch (error) {
        console.error('Error initializing questions:', error);
        // Fallback to hardcoded if API fails (optional, but for robustness)
        alert('Failed to load questions from database. Using fallback data.');
        // Hardcoded fallback: 4 sets of 5 questions each
        let fallbackQuestions = [
            // Set 1: Science
            [
                { question: "What is the chemical symbol for water?", options: ["H2O", "CO2", "O2", "NaCl"], correct: 0 },
                { question: "How many bones are in the human body?", options: ["206", "208", "210", "212"], correct: 0 },
                { question: "What planet is known as the 'Red Planet'?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
                { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi"], correct: 1 },
                { question: "Which gas do plants absorb from the air?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 1 }
            ],
            // Set 2: History
            [
                { question: "In which year did World War II end?", options: ["1944", "1945", "1946", "1947"], correct: 1 },
                { question: "Who was the first President of the United States?", options: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"], correct: 2 },
                { question: "Which ancient wonder was located in Alexandria?", options: ["Hanging Gardens", "Lighthouse", "Colossus", "Pyramids"], correct: 1 },
                { question: "Who painted the Sistine Chapel ceiling?", options: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Donatello"], correct: 1 },
                { question: "In which year did the Titanic sink?", options: ["1910", "1912", "1914", "1916"], correct: 1 }
            ],
            // Set 3: Geography
            [
                { question: "What is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], correct: 1 },
                { question: "Which country has the most natural lakes?", options: ["Canada", "Russia", "Finland", "Sweden"], correct: 0 },
                { question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: 2 },
                { question: "Which is the smallest continent?", options: ["Europe", "Australia", "Africa", "Asia"], correct: 1 },
                { question: "What is the highest mountain in the world?", options: ["K2", "Kangchenjunga", "Everest", "Lhotse"], correct: 2 }
            ],
            // Set 4: Sports & Entertainment
            [
                { question: "How many players are on a basketball team?", options: ["5", "6", "7", "8"], correct: 0 },
                { question: "Who directed the movie 'Inception'?", options: ["Steven Spielberg", "Christopher Nolan", "Martin Scorsese", "Quentin Tarantino"], correct: 1 },
                { question: "In which sport is the term 'home run' used?", options: ["Baseball", "Cricket", "Soccer", "Tennis"], correct: 0 },
                { question: "What is the highest-grossing film of all time?", options: ["Titanic", "Avatar", "Avengers: Endgame", "Star Wars"], correct: 1 },
                { question: "How many rings are on the Olympic symbol?", options: ["4", "5", "6", "7"], correct: 1 }
            ]
        ];
        // Shuffle fallback sets for variety
        gameState.questions = shuffleArray([...fallbackQuestions]).map(set => shuffleArray([...set]));
        console.log('Fallback questions loaded successfully!');
        console.log(`Total fallback sets: ${gameState.questions.length}`);
    }
}


// Event listeners
document.getElementById('single-player-btn').addEventListener('click', startSinglePlayer);
document.getElementById('host-btn').addEventListener('click', startHosting);
document.getElementById('join-btn').addEventListener('click', showJoinScreen);
document.getElementById('join-game-btn').addEventListener('click', joinGame);
document.getElementById('submit-name-btn').addEventListener('click', submitName);
document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);

document.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', selectAnswer);
});

async function startSinglePlayer() {
    gameState.isHost = false;
    gameState.players = [{ name: "Player", score: 0, answers: [], setsScores: [0, 0, 0, 0] }];
    await initializeQuestions();
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('question-area').classList.remove('hidden');
    showQuestion();
}

async function startHosting() {
    gameState.isHost = true;
    gameState.gamePin = generatePin();
    await initializeQuestions();
    gameState.players = [{ name: "Host", score: 0, answers: [], setsScores: [0, 0, 0, 0] }];
    // Add dummy players for simulation
    gameState.players.push({ name: "Player 2", score: 0, answers: [], setsScores: [0, 0, 0, 0] });
    gameState.players.push({ name: "Player 3", score: 0, answers: [], setsScores: [0, 0, 0, 0] });
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('host-screen').classList.remove('hidden');
    document.getElementById('game-pin').textContent = gameState.gamePin;
    updatePlayerList();
}

function showJoinScreen() {
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('player-screen').classList.remove('hidden');
}

function joinGame() {
    const pin = document.getElementById('pin-input').value;
    if (pin === gameState.gamePin) {
        document.getElementById('pin-input').parentElement.classList.add('hidden');
        document.getElementById('player-name-input').classList.remove('hidden');
    } else {
        alert('Invalid PIN');
    }
}

function submitName() {
    const name = document.getElementById('player-name').value;
    if (name) {
        gameState.players.push({ name, score: 0, answers: [], setsScores: [0, 0, 0, 0] });
        document.getElementById('player-name-input').classList.add('hidden');
        document.getElementById('waiting-screen').classList.remove('hidden');
        updatePlayerList();
    }
}

function showQuestionArea() {
    document.getElementById('question-area').classList.remove('hidden');
}

function updatePlayerList() {
    const playerList = document.getElementById('players-ul');
    playerList.innerHTML = '';
    gameState.players.forEach(player => {
        const li = document.createElement('li');
        li.textContent = `${player.name} - Score: ${player.score}`;
        playerList.appendChild(li);
    });
}

function startQuiz() {
    if (gameState.questions.length > 0) {
        showQuestion();
    }
}

function showQuestion() {
    console.log('showQuestion called with index:', gameState.currentQuestionIndex);

    // Hide waiting screen if visible
    const ws = document.getElementById('waiting-screen');
    if (ws) {
        ws.classList.add('hidden');
        console.log('Waiting screen hidden');
    }

    // Show question area
    document.getElementById('question-area').classList.remove('hidden');

    // Check if we've completed all questions (20 total)
    if (gameState.currentQuestionIndex >= gameState.totalSets * gameState.questionsPerSet) {
        console.log('All questions completed, showing results');
        showResults();
        return;
    }

    // Calculate which set and question to show
    const currentSetIndex = Math.floor(gameState.currentQuestionIndex / gameState.questionsPerSet);
    const questionInSet = gameState.currentQuestionIndex % gameState.questionsPerSet;

    console.log(`Showing question ${gameState.currentQuestionIndex + 1}: Set ${currentSetIndex + 1}, Question ${questionInSet + 1} in set. Total sets available: ${gameState.questions.length}`);

    // Safety check to ensure we don't go out of bounds
    if (currentSetIndex >= gameState.questions.length || questionInSet >= gameState.questions[currentSetIndex].length) {
        console.error('Question index out of bounds:', {
            currentQuestionIndex: gameState.currentQuestionIndex,
            currentSetIndex,
            questionInSet,
            totalSets: gameState.questions.length,
            questionsInSet: gameState.questions[currentSetIndex]?.length
        });
        showResults();
        return;
    }

    const question = gameState.questions[currentSetIndex][questionInSet];

    // Update level display
    document.getElementById('question-text').textContent = `Set ${currentSetIndex + 1} - ${question.question}`;
    const answerBtns = document.querySelectorAll('.answer-btn');
    const shuffledOptions = shuffleArray([...question.options]);

    answerBtns.forEach((btn, index) => {
        btn.textContent = shuffledOptions[index];
        btn.dataset.correct = (shuffledOptions[index] === question.options[question.correct]) ? 'true' : 'false';
        btn.classList.remove('correct', 'incorrect');
        btn.style.pointerEvents = 'auto';
    });

    // Only hide waiting screen if it exists (for multi-player mode)
    const waitingScreen = document.getElementById('waiting-screen');
    if (waitingScreen) {
        waitingScreen.classList.add('hidden');
    }

    startTimer();
}

function startTimer() {
    gameState.timeLeft = 5;
    document.getElementById('timer').textContent = gameState.timeLeft;
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        document.getElementById('timer').textContent = gameState.timeLeft;
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            handleTimeout();
        }
    }, 1000);
}

function handleTimeout() {
    // Deduct points for timeout
    const penalty = -10;
    const currentSet = Math.floor(gameState.currentQuestionIndex / gameState.questionsPerSet);
    gameState.players[gameState.currentPlayerIndex].setsScores[currentSet] += penalty;
    gameState.players[gameState.currentPlayerIndex].score += penalty;
    
    // Visual feedback: show time's up message? For now, just proceed
    console.log(`Time's up for ${gameState.players[gameState.currentPlayerIndex].name}. Penalty: ${penalty}`);
    
    // Disable buttons
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.style.pointerEvents = 'none';
    });
    
    updatePlayerList();
    setTimeout(nextQuestion, 1500);
}

function selectAnswer(event) {
    clearInterval(gameState.timer);
    const selectedBtn = event.target;
    const isCorrect = selectedBtn.dataset.correct === 'true';

    // Visual feedback
    if (isCorrect) {
        selectedBtn.classList.add('correct');
        // Award points based on time left
        const points = gameState.timeLeft * 10;
        const currentSet = Math.floor(gameState.currentQuestionIndex / gameState.questionsPerSet);
        gameState.players[gameState.currentPlayerIndex].setsScores[currentSet] += points;
        gameState.players[gameState.currentPlayerIndex].score += points;
    } else {
        selectedBtn.classList.add('incorrect');
        // Penalty for wrong answer
        const penalty = -5;
        const currentSet = Math.floor(gameState.currentQuestionIndex / gameState.questionsPerSet);
        gameState.players[gameState.currentPlayerIndex].setsScores[currentSet] += penalty;
        gameState.players[gameState.currentPlayerIndex].score += penalty;
        console.log(`Wrong answer for ${gameState.players[gameState.currentPlayerIndex].name}. Penalty: ${penalty}`);
        
        // Show correct answer
        document.querySelectorAll('.answer-btn').forEach(btn => {
            if (btn.dataset.correct === 'true') {
                btn.classList.add('correct');
            }
        });
    }

    // Disable all buttons
    document.querySelectorAll('.answer-btn').forEach(btn => {
        btn.style.pointerEvents = 'none';
    });

    updatePlayerList();
    setTimeout(nextQuestion, 2000);
}

function nextQuestion() {
    gameState.currentQuestionIndex++;

    console.log(`Moving to question ${gameState.currentQuestionIndex} of ${gameState.totalSets * gameState.questionsPerSet}`);

    // Check if we've completed all questions (20 total)
    if (gameState.currentQuestionIndex >= gameState.totalSets * gameState.questionsPerSet) {
        console.log('All questions completed, showing results');
        showResults();
        return;
    }

    // Check if we've completed a set (every 5 questions)
    const currentSet = Math.floor((gameState.currentQuestionIndex - 1) / gameState.questionsPerSet);
    const nextSet = Math.floor(gameState.currentQuestionIndex / gameState.questionsPerSet);

    console.log(`Current set: ${currentSet}, Next set: ${nextSet}, Total sets: ${gameState.totalSets}`);

    if (currentSet < nextSet && nextSet < gameState.totalSets) {
        // We've completed a set and there are more sets to come
        console.log(`Completed set ${currentSet}, moving to set ${nextSet}`);
        gameState.currentSetIndex = nextSet;
        gameState.currentLevel = nextSet + 1;
        showLevelComplete();
        return;
    }

    if (gameState.isHost && gameState.players.length > 1) {
        // Multi-player mode: switch players and show waiting screen
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.players.length;
        document.getElementById('question-area').classList.add('hidden');
        document.getElementById('waiting-screen').classList.remove('hidden');
        setTimeout(showQuestion, 2000);
    } else {
        // Single player mode: continue immediately
        console.log('Continuing to next question in same set');
        setTimeout(showQuestion, 1500);
    }
}

function showLevelComplete() {
    document.getElementById('question-area').classList.add('hidden');
    document.getElementById('waiting-screen').classList.remove('hidden');

    // Update waiting screen to show level completion
    const waitingScreen = document.getElementById('waiting-screen');
    const completedSet = Math.floor((gameState.currentQuestionIndex - 1) / gameState.questionsPerSet) + 1;
    const nextSet = completedSet + 1;

    waitingScreen.innerHTML = `
        <h2>🎉 Set ${completedSet} Conquered!</h2>
        <p>Excellent work! You've mastered 5 challenging questions.</p>
        <p>Current Score: ${gameState.players[gameState.currentPlayerIndex].score} points</p>
        <p>🚀 Gear up for Set ${nextSet} – Loading in 5 seconds...</p>
        <div id="countdown-timer" style="font-size: 24px; color: #007bff;">5</div>
    `;

    console.log(`Completed Set ${completedSet}, moving to Set ${nextSet}`);
    console.log(`Current question index: ${gameState.currentQuestionIndex}`);

    // Countdown animation
    let count = 5;
    const countdownEl = document.getElementById('countdown-timer');
    const countdownInterval = setInterval(() => {
        count--;
        if (countdownEl) {
            countdownEl.textContent = count;
        }
        if (count < 0) {
            clearInterval(countdownInterval);
        }
    }, 1000);

    setTimeout(() => {
        console.log('Level complete timeout triggered; index:', gameState.currentQuestionIndex, 'Max index:', gameState.totalSets * gameState.questionsPerSet);
        clearInterval(countdownInterval);
        waitingScreen.innerHTML = '<p>Loading next set...</p>';
        // Double-check that we haven't exceeded total questions
        if (gameState.currentQuestionIndex < gameState.totalSets * gameState.questionsPerSet) {
            console.log('Calling showQuestion from level complete');
            showQuestion();
        } else {
            console.log('Reached max questions, showing results from level complete');
            showResults();
        }
    }, 5000); // 5 seconds delay for creative loading
}

function showResults() {
    console.log('Showing final results after 20 questions');

    // Stop any running timer
    if (gameState.timer) {
        clearInterval(gameState.timer);
        gameState.timer = null;
    }

    document.getElementById('question-area').classList.add('hidden');
    document.getElementById('waiting-screen').classList.add('hidden');

    if (gameState.isHost && gameState.players.length > 1) {
        // Multi-player: show results on host screen
        document.getElementById('results-screen').classList.remove('hidden');
    } else {
        // Single player: show results directly
        document.getElementById('results-screen').classList.remove('hidden');
    }

    // Update results with creative display
    const resultsDiv = document.getElementById('results-screen');
    const sortedPlayers = gameState.players.sort((a, b) => b.score - a.score);
    let leaderboardHTML = '<h3>🏆 Final Results - Quiz Master! 🎉</h3>';
    sortedPlayers.forEach((player, index) => {
        const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const performance = player.score >= 150 ? '🔥 Excellent!' : player.score >= 100 ? '👍 Good job!' : '💪 Keep trying!';
        leaderboardHTML += `
            <div class="player-result animated">
                <h4>${medal} ${index + 1}. ${player.name}</h4>
                <p><strong>Overall Score:</strong> ${player.score} points ${performance}</p>
                <button class="view-details-btn" onclick="toggleDetails(this)">📊 View Set Breakdown</button>
                <div class="set-details hidden">
                    ${player.setsScores.map((setScore, setIdx) => `
                        <p>Set ${setIdx + 1}: ${setScore} points ${setScore >= 40 ? '⭐ Great!' : setScore >= 20 ? '👍 Solid!' : '💪 Improving!'}</p>
                    `).join('')}
                </div>
            </div>
        `;
    });
    leaderboardHTML += `
        <div class="interactive-section animated">
            <p>🎉 Share your victory or challenge friends!</p>
            <button id="reset-game-btn" class="btn-primary">🔄 Play Again</button>
            <button id="back-to-menu-btn" class="btn-secondary">🏠 Main Menu</button>
        </div>
    `;
    resultsDiv.innerHTML = leaderboardHTML;

    // Add simple animation class (fade-in)
    const items = resultsDiv.querySelectorAll('.animated');
    items.forEach((item, i) => {
        item.style.animationDelay = `${i * 0.2}s`;
    });

    updateLeaderboard(); // Legacy call if needed

    // Manual restart only - no auto-restart
    // Auto-back to menu after 10s if no interaction
    const autoBackTimeout = setTimeout(() => {
        console.log('No interaction, auto-backing to menu');
        backToMenu();
    }, 10000);

    // Clear timeout on button clicks
    document.getElementById('reset-game-btn').addEventListener('click', () => {
        clearTimeout(autoBackTimeout);
        playAgain();
    });
    document.getElementById('back-to-menu-btn').addEventListener('click', () => {
        clearTimeout(autoBackTimeout);
        backToMenu();
    });

    console.log('Results shown; waiting for user interaction or 10s auto-back');
}

function autoRestartGame() {
    console.log('Auto-restarting game: Resetting state and re-fetching questions');
    // Reset game state
    gameState.currentQuestionIndex = 0;
    gameState.currentSetIndex = 0;
    gameState.currentLevel = 1;
    gameState.currentPlayerIndex = 0;
    gameState.players.forEach(player => {
        player.score = 0;
        player.answers = [];
    });

    // Generate new random questions
    initializeQuestions();

    // Hide results and start new game
    document.getElementById('results-screen').classList.add('hidden');

    if (gameState.isHost && gameState.players.length > 1) {
        // Multi-player: go back to host screen
        document.getElementById('host-screen').classList.remove('hidden');
    } else {
        // Single player: start directly with new questions
        document.getElementById('question-area').classList.remove('hidden');
        showQuestion();
    }
}

function updateLeaderboard() {
    const leaderboard = document.getElementById('final-leaderboard');
    leaderboard.innerHTML = '<h3>Final Leaderboard</h3>';
    const sortedPlayers = gameState.players.sort((a, b) => b.score - a.score);
    sortedPlayers.forEach((player, index) => {
        leaderboard.innerHTML += `<p>${index + 1}. ${player.name}: ${player.score} points</p>`;
    });
}

function playAgain() {
    // Reset game state
    gameState.currentQuestionIndex = 0;
    gameState.currentSetIndex = 0;
    gameState.currentLevel = 1;
    gameState.currentPlayerIndex = 0;
    gameState.players.forEach(player => {
        player.score = 0;
        player.answers = [];
    });

    // Re-initialize questions for variety (new random questions)
    console.log('Play again: Re-initializing questions');
    initializeQuestions();

    // Hide results and start appropriate mode
    document.getElementById('results-screen').classList.add('hidden');

    if (gameState.isHost && gameState.players.length > 1) {
        // Multi-player: go back to host screen
        document.getElementById('host-screen').classList.remove('hidden');
    } else {
        // Single player: start directly
        document.getElementById('question-area').classList.remove('hidden');
        showQuestion();
    }
}

function backToMenu() {
    // Reset all screens
    document.getElementById('results-screen').classList.add('hidden');
    document.getElementById('host-screen').classList.add('hidden');
    document.getElementById('player-screen').classList.add('hidden');
    document.getElementById('question-area').classList.add('hidden');
    document.getElementById('waiting-screen').classList.add('hidden');

    // Show start screen
    document.getElementById('start-screen').classList.remove('hidden');

    // Reset game state
    gameState = {
        isHost: false,
        gamePin: null,
        players: [],
        currentPlayerIndex: 0,
        currentQuestionIndex: 0,
        currentSetIndex: 0,
        questions: [],
        timer: null,
        timeLeft: 5,
        totalSets: 4,
        questionsPerSet: 5,
        currentLevel: 1
    };

    // Re-initialize questions
    initializeQuestions();
}

// Toggle function for set details
window.toggleDetails = function(btn) {
    const details = btn.nextElementSibling;
    if (details.classList.contains('hidden')) {
        details.classList.remove('hidden');
        btn.textContent = '🔒 Hide Details';
    } else {
        details.classList.add('hidden');
        btn.textContent = '📊 View Set Breakdown';
    }
};

// Initialize the app