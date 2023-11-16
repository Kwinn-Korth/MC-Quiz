// variables for logic, so many variables
var questionContainer = document.getElementById("quiz-container"); 
var questionElement = document.getElementById("question");
var choicesElement = document.getElementById("choices");
var startButton = document.getElementById("start-button");
var submitButton = document.getElementById("submit-button");
var resultElement = document.getElementById("result");
var timerElement = document.getElementById("timer");
var timeRemainingElement = document.getElementById("time-remaining");
var scoreInputElement = document.getElementById("score-input");
var initialsInput = document.getElementById("initials");
var displayScoresButton = document.getElementById("display-scores-button");
var retakeQuizButton = document.getElementById("retake-quiz-button");

var questions = [
    {
        question: "What is the basic structure of a webpage?",
        choices: ["html", "css", "javascript", "java"],
        correctAnswer: 0,
    },
    {
        question: "What is the logic of a webpage?",
        choices: ["html", "css", "javascript", "java"],
        correctAnswer: 2,
    },
    {
        question: "What is an array?",
        choices: ["A type of loop that iterates over a set of elements", "A stored collection of values or elements", "A way to store text-based data", "A built-in function for drawing shapes and graphics"],
        correctAnswer: 1,
    },
    {
        question: "What is the role of CSS?",
        choices: ["It is used to connect to APIs", "It is used to add interactivity to web pages", "It is used for managing server-side operations and handling database queries to retrieve and store data", "It is used to style web pages"],
        correctAnswer: 3,
    },
];

let currentQuestionIndex = 0;
let score = 0;
let quizStarted = false;
let timerInterval;

// timer
var quizTimeInSeconds = 120;

// event listener to make the quiz start
startButton.addEventListener("click", startQuiz);

// Add event listeners for the new buttons
displayScoresButton.addEventListener("click", displayScores);
retakeQuizButton.addEventListener("click", startQuiz);

function startQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    resultElement.textContent = "";
    scoreInputElement.style.display = "none";
    displayScoresButton.style.display = "inline-block";
    retakeQuizButton.style.display = "none";
    startButton.style.display = "none";
    submitButton.style.display = "inline-block";
    quizStarted = true;
    questionContainer.style.display = "block"; 
    startTimer(); 
    loadQuestion();
}

function startTimer() {
    let timeRemaining = quizTimeInSeconds;
    timeRemainingElement.textContent = timeRemaining;

    timerInterval = setInterval(() => {
        timeRemaining--;
        timeRemainingElement.textContent = timeRemaining;

        if (timeRemaining === 0) {
            clearInterval(timerInterval);
            finishQuiz();
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function loadQuestion() {
    var currentQuestion = questions[currentQuestionIndex];

    if (currentQuestion) {
        questionContainer.style.display = "block"; 
        questionElement.textContent = currentQuestion.question;

        choicesElement.innerHTML = "";
        currentQuestion.choices.forEach((choice, index) => {
            var choiceButton = document.createElement("button");
            choiceButton.textContent = choice;
            choiceButton.onclick = () => selectAnswer(index);
            choicesElement.appendChild(choiceButton);
        });
    } else {
        // No more questions, should hide the question container
        questionContainer.style.display = "none";
        finishQuiz();
    }
}

function selectAnswer(selectedIndex) {
    currentQuestionIndex++;
    if (selectedIndex === questions[currentQuestionIndex - 1].correctAnswer) {
        score++;
    }

    if (currentQuestionIndex < questions.length) {
        loadQuestion();
    } else {
        finishQuiz();
        stopTimer(); 
    }
}

function finishQuiz() {
    quizStarted = false;
    submitButton.style.display = "none";
    displayScoresButton.style.display = "inline-block";
    retakeQuizButton.style.display = "inline-block";
    scoreInputElement.style.display = "block";
    resultElement.textContent = `You scored ${score} out of ${questions.length} questions.`;
}

function displayScores() {
    // Retrieve scores from local storage
    var scores = JSON.parse(localStorage.getItem('scores')) || [];

    if (scores.length > 0) {
        var scoreList = "Previous Scores:\n";
        for (var i = 0; i < scores.length; i++) {
            scoreList += scores[i] + "\n";
        }
        resultElement.textContent = scoreList;
    } else {
        resultElement.textContent = "No previous scores found.";
    }

    // Hide and show relevant buttons
    displayScoresButton.style.display = "none";
    retakeQuizButton.style.display = "inline-block";
    scoreInputElement.style.display = "none";
}

function submitAnswer() {
    if (quizStarted) {
        var selectedButton = choicesElement.querySelector(".selected");
        if (selectedButton) {
            selectedButton.classList.remove("selected");
        } else {
            return;
        }
    }
}

function logScore() {
    var initials = initialsInput.value;
    var finalScore = `${initials}: ${score}`;

    // Check if there are existing scores in local storage
    var scores = JSON.parse(localStorage.getItem('scores')) || [];

    // Add the current score to the list
    scores.push(finalScore);

    // Store the list of scores in local storage
    localStorage.setItem('scores', JSON.stringify(scores));

    // Display a message
    resultElement.textContent = `Score logged for ${initials}`;

    scoreInputElement.style.display = 'none';
}

choicesElement.addEventListener("click", (event) => {
    var selectedButton = event.target;
    if (selectedButton.tagName === "BUTTON") {
        if (quizStarted) {
            var selectedButtons = choicesElement.querySelectorAll("button");
            selectedButtons.forEach((button) => {
                button.classList.remove("selected");
            });
            selectedButton.classList.add("selected");
        }
    }
});
