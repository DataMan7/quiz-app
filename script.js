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
function initializeQuestions() {
    console.log('Initializing questions...');

    // Use predefined questions for reliability
    const allQuestions = [
        // Set 1 - Science
        [
            { question: "What is the chemical symbol for water?", options: ["H2O", "CO2", "O2", "NaCl"], correct: 0 },
            { question: "How many bones are in the human body?", options: ["206", "208", "210", "212"], correct: 0 },
            { question: "What planet is known as the 'Red Planet'?", options: ["Venus", "Mars", "Jupiter", "Saturn"], correct: 1 },
            { question: "What is the powerhouse of the cell?", options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi"], correct: 1 },
            { question: "Which gas do plants absorb from the air?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 1 }
        ],
        // Set 2 - History
        [
            { question: "In which year did World War II end?", options: ["1944", "1945", "1946", "1947"], correct: 1 },
            { question: "Who was the first President of the United States?", options: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"], correct: 2 },
            { question: "Which ancient wonder was located in Alexandria?", options: ["Hanging Gardens", "Lighthouse", "Colossus", "Pyramids"], correct: 1 },
            { question: "Who painted the Sistine Chapel ceiling?", options: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Donatello"], correct: 1 },
            { question: "In which year did the Titanic sink?", options: ["1910", "1912", "1914", "1916"], correct: 1 }
        ],
        // Set 3 - Geography
        [
            { question: "What is the longest river in the world?", options: ["Amazon", "Nile", "Yangtze", "Mississippi"], correct: 1 },
            { question: "Which country has the most natural lakes?", options: ["Canada", "Russia", "Finland", "Sweden"], correct: 0 },
            { question: "What is the capital of Australia?", options: ["Sydney", "Melbourne", "Canberra", "Perth"], correct: 2 },
            { question: "Which is the smallest continent?", options: ["Europe", "Australia", "Africa", "Asia"], correct: 1 },
            { question: "What is the highest mountain in the world?", options: ["K2", "Kangchenjunga", "Everest", "Lhotse"], correct: 2 }
        ],
        // Set 4 - Sports & Entertainment
        [
            { question: "How many players are on a basketball team?", options: ["5", "6", "7", "8"], correct: 0 },
            { question: "Who directed the movie 'Inception'?", options: ["Steven Spielberg", "Christopher Nolan", "Martin Scorsese", "Quentin Tarantino"], correct: 1 },
            { question: "In which sport is the term 'home run' used?", options: ["Baseball", "Cricket", "Soccer", "Tennis"], correct: 0 },
            { question: "What is the highest-grossing film of all time?", options: ["Titanic", "Avatar", "Avengers: Endgame", "Star Wars"], correct: 1 },
            { question: "How many rings are on the Olympic symbol?", options: ["4", "5", "6", "7"], correct: 1 }
        ]
    ];

    // Shuffle questions within each set and randomize set order
    gameState.questions = shuffleArray(allQuestions).map(set => shuffleArray(set));

    console.log('Questions initialized successfully!');
    console.log(`Total sets: ${gameState.questions.length}`);
    console.log(`Questions per set: ${gameState.questions[0]?.length || 0}`);
    console.log('Sample question from set 1:', gameState.questions[0]?.[0]);
}

function generateRandomQuestion(topic) {
    console.log(`Generating question for topic: ${topic}`);
    const templates = {
        "Science": [
            { q: "What is the chemical symbol for water?", a: ["H2O", "CO2", "O2", "NaCl"], c: 0 },
            { q: "How many bones are in the human body?", a: ["206", "208", "210", "212"], c: 0 },
            { q: "What planet is known as the 'Red Planet'?", a: ["Venus", "Mars", "Jupiter", "Saturn"], c: 1 },
            { q: "What is the powerhouse of the cell?", a: ["Nucleus", "Mitochondria", "Ribosome", "Golgi"], c: 1 },
            { q: "Which gas do plants absorb from the air?", a: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], c: 1 }
        ],
        "History": [
            { q: "In which year did World War II end?", a: ["1944", "1945", "1946", "1947"], c: 1 },
            { q: "Who was the first President of the United States?", a: ["Thomas Jefferson", "Abraham Lincoln", "George Washington", "John Adams"], c: 2 },
            { q: "Which ancient wonder was located in Alexandria?", a: ["Hanging Gardens", "Lighthouse", "Colossus", "Pyramids"], c: 1 },
            { q: "Who painted the Sistine Chapel ceiling?", a: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Donatello"], c: 1 },
            { q: "In which year did the Titanic sink?", a: ["1910", "1912", "1914", "1916"], c: 1 }
        ],
        "Geography": [
            { q: "What is the longest river in the world?", a: ["Amazon", "Nile", "Yangtze", "Mississippi"], c: 1 },
            { q: "Which country has the most natural lakes?", a: ["Canada", "Russia", "Finland", "Sweden"], c: 0 },
            { q: "What is the capital of Australia?", a: ["Sydney", "Melbourne", "Canberra", "Perth"], c: 2 },
            { q: "Which is the smallest continent?", a: ["Europe", "Australia", "Africa", "Asia"], c: 1 },
            { q: "What is the highest mountain in the world?", a: ["K2", "Kangchenjunga", "Everest", "Lhotse"], c: 2 }
        ],
        "Sports": [
            { q: "How many players are on a basketball team?", a: ["5", "6", "7", "8"], c: 0 },
            { q: "In which sport is the term 'home run' used?", a: ["Baseball", "Cricket", "Soccer", "Tennis"], c: 0 },
            { q: "How many rings are on the Olympic symbol?", a: ["4", "5", "6", "7"], c: 1 },
            { q: "Which country has won the most FIFA World Cups?", a: ["Germany", "Argentina", "Brazil", "Italy"], c: 2 },
            { q: "In tennis, what does 'love' mean?", a: ["15", "30", "0", "40"], c: 2 }
        ],
        "Entertainment": [
            { q: "Who directed the movie 'Inception'?", a: ["Steven Spielberg", "Christopher Nolan", "Martin Scorsese", "Quentin Tarantino"], c: 1 },
            { q: "What is the highest-grossing film of all time?", a: ["Titanic", "Avatar", "Avengers: Endgame", "Star Wars"], c: 1 },
            { q: "Which band released the album 'Abbey Road'?", a: ["Rolling Stones", "Beatles", "Pink Floyd", "Queen"], c: 1 },
            { q: "Who played Jack Sparrow in Pirates of the Caribbean?", a: ["Orlando Bloom", "Johnny Depp", "Geoffrey Rush", "Keira Knightley"], c: 1 },
            { q: "What is the name of the wizarding school in Harry Potter?", a: ["Durmstrang", "Beauxbatons", "Hogwarts", "Ilvermorny"], c: 2 }
        ],
        "Fun Facts": [
            { q: "What animal is known as the 'King of the Jungle'?", a: ["Tiger", "Elephant", "Lion", "Giraffe"], c: 2 },
            { q: "How many colors are in a rainbow?", a: ["5", "6", "7", "8"], c: 2 },
            { q: "What is the largest animal in the world?", a: ["Elephant", "Blue Whale", "Giraffe", "Polar Bear"], c: 1 },
            { q: "Which fruit is known as the 'king of fruits' in Southeast Asia?", a: ["Mango", "Durian", "Pineapple", "Banana"], c: 1 },
            { q: "What is the only food that doesn't spoil?", a: ["Rice", "Honey", "Salt", "Sugar"], c: 1 }
        ],
        "Riddles": [
            { q: "What has keys but can't open locks?", a: ["Piano", "Computer", "Car", "House"], c: 0 },
            { q: "What gets wetter as it dries?", a: ["Towel", "Hair", "Clothes", "Sponge"], c: 0 },
            { q: "What has a head, a tail, but no body?", a: ["Snake", "Coin", "Comet", "Arrow"], c: 1 },
            { q: "What can you catch but not throw?", a: ["Ball", "Cold", "Fish", "Bird"], c: 1 },
            { q: "What has one eye but can't see?", a: ["Cyclops", "Needle", "Camera", "Storm"], c: 1 }
        ]
    };

    const topicTemplates = templates[topic] || templates["Fun Facts"];
    const randomIndex = Math.floor(Math.random() * topicTemplates.length);
    const randomTemplate = topicTemplates[randomIndex];

    console.log(`Selected template ${randomIndex} from ${topic}: ${randomTemplate.q}`);

    const question = {
        question: randomTemplate.q,
        options: [...randomTemplate.a],
        correct: randomTemplate.c
    };

    console.log(`Generated question: ${question.question}`);
    console.log(`Options: ${question.options.join(', ')}`);
    console.log(`Correct answer index: ${question.correct}`);

    return question;
}

// Event listeners
document.getElementById('single-player-btn').addEventListener('click', startSinglePlayer);
document.getElementById('host-btn').addEventListener('click', startHosting);
document.getElementById('join-btn').addEventListener('click', showJoinScreen);
document.getElementById('join-game-btn').addEventListener('click', joinGame);
document.getElementById('submit-name-btn').addEventListener('click', submitName);
document.getElementById('start-quiz-btn').addEventListener('click', startQuiz);
document.getElementById('play-again-btn').addEventListener('click', playAgain);
document.getElementById('back-to-menu-btn').addEventListener('click', backToMenu);

document.querySelectorAll('.answer-btn').forEach(btn => {
    btn.addEventListener('click', selectAnswer);
});

function startSinglePlayer() {
    gameState.isHost = false;
    gameState.players = [{ name: "Player", score: 0, answers: [] }];
    initializeQuestions();
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('question-area').classList.remove('hidden');
    showQuestion();
}

function startHosting() {
    gameState.isHost = true;
    gameState.gamePin = generatePin();
    initializeQuestions();
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
        gameState.players.push({ name, score: 0, answers: [] });
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
    // Check if we've completed all questions (20 total)
    if (gameState.currentQuestionIndex >= gameState.totalSets * gameState.questionsPerSet) {
        console.log('All questions completed, showing results');
        showResults();
        return;
    }

    // Calculate which set and question to show
    const currentSetIndex = Math.floor(gameState.currentQuestionIndex / gameState.questionsPerSet);
    const questionInSet = gameState.currentQuestionIndex % gameState.questionsPerSet;

    console.log(`Showing question ${gameState.currentQuestionIndex + 1}: Set ${currentSetIndex + 1}, Question ${questionInSet + 1} in set`);

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
            nextQuestion();
        }
    }, 1000);
}

function selectAnswer(event) {
    clearInterval(gameState.timer);
    const selectedBtn = event.target;
    const isCorrect = selectedBtn.dataset.correct === 'true';

    // Visual feedback
    if (isCorrect) {
        selectedBtn.classList.add('correct');
        // Award points based on time left
        const points = gameState.timeLeft * 20;
        gameState.players[gameState.currentPlayerIndex].score += points;
    } else {
        selectedBtn.classList.add('incorrect');
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
    const completedSet = gameState.currentSetIndex;
    const nextSet = gameState.currentSetIndex + 1;

    waitingScreen.innerHTML = `
        <h2>🎉 Set ${completedSet} Complete!</h2>
        <p>Great job! You finished 5 questions.</p>
        <p>Current Score: ${gameState.players[0].score} points</p>
        <p>Loading Set ${nextSet}...</p>
    `;

    console.log(`Completed Set ${completedSet}, moving to Set ${nextSet}`);
    console.log(`Current question index: ${gameState.currentQuestionIndex}`);

    setTimeout(() => {
        waitingScreen.innerHTML = '<p>Loading next set...</p>';
        // Double-check that we haven't exceeded total questions
        if (gameState.currentQuestionIndex < gameState.totalSets * gameState.questionsPerSet) {
            showQuestion();
        } else {
            showResults();
        }
    }, 2000); // Reduced from 3 seconds to 2 seconds for faster gameplay
}

function showResults() {
    document.getElementById('question-area').classList.add('hidden');

    if (gameState.isHost && gameState.players.length > 1) {
        // Multi-player: show results on host screen
        document.getElementById('results-screen').classList.remove('hidden');
    } else {
        // Single player: show results directly
        document.getElementById('results-screen').classList.remove('hidden');
    }

    // Update results with level completion info
    const resultsDiv = document.getElementById('results-screen');
    const scoreElement = document.getElementById('player-score');
    scoreElement.textContent = gameState.players[0].score;

    // Add level completion message
    const levelMessage = document.createElement('p');
    levelMessage.textContent = `Congratulations! You completed all ${gameState.totalSets} levels with ${gameState.totalSets * gameState.questionsPerSet} questions!`;
    levelMessage.style.fontSize = '1.2em';
    levelMessage.style.color = '#007bff';
    levelMessage.style.margin = '10px 0';

    // Insert after the score
    scoreElement.parentNode.insertBefore(levelMessage, scoreElement.nextSibling);

    updateLeaderboard();

    // Auto-restart with new questions after 5 seconds
    setTimeout(() => {
        autoRestartGame();
    }, 5000);
}

function autoRestartGame() {
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

// Initialize the app
initializeQuestions();