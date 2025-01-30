const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");
const restartBtn = document.getElementById("restart-btn");
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const questionText = document.getElementById("question-text");
const answersDiv = document.getElementById("answers");
const scoreText = document.getElementById("score");
const questionCounter = document.getElementById("question-counter");

let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let userAnswers = []; // Track the user's answers (correct or not)

// Load questions from the API before allowing the quiz to start
fetch("questions.json")
  .then((response) => response.json())
  .then((data) => {
    console.log("Raw data received:", data); // Debugging
    if (data.questions) {
      questions = data.questions.map((q) => ({
        question: q.description, // The question text
        answers: q.options.map((opt) => ({
          text: opt.description, // Option text
          correct: opt.is_correct, // Check if it's the correct answer
        })),
      }));
      console.log("Formatted questions:", questions); // Debugging
    } else {
      console.error("Incorrect JSON format: no 'questions' key found!");
    }
  })
  .catch((error) => console.error("Error loading data:", error));

// Start the quiz
startBtn.addEventListener("click", () => {
  if (questions.length === 0) {
    alert("Questions are not loaded yet!");
    return;
  }
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  currentQuestionIndex = 0;
  score = 0;
  userAnswers = []; // Clear previous answers
  showQuestion();
});

// Display a question
function showQuestion() {
  resetState();
  let question = questions[currentQuestionIndex];

  if (!question) {
    alert("Error: Question not found!");
    return;
  }

  questionText.innerText = question.question;
  questionCounter.innerText = `Question ${currentQuestionIndex + 1} of ${
    questions.length
  }`;

  question.answers.forEach((answer, index) => {
    const label = document.createElement("label");
    label.classList.add("block", "text-lg", "mb-2");

    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "answer";
    radio.value = answer.correct;
    radio.classList.add("mr-2", "accent-blue-500");

    label.appendChild(radio);
    label.appendChild(document.createTextNode(answer.text));

    answersDiv.appendChild(label);

    // Add event to handle answer selection
    radio.addEventListener("change", () =>
      handleAnswerSelection(radio, answer.correct)
    );
  });
}

// Reset the answer display
function resetState() {
  nextBtn.classList.add("hidden");
  answersDiv.innerHTML = "";
}

// Handle user answer
function handleAnswerSelection(radio, correct) {
  // Store the answer choice (true for correct, false for incorrect)
  if (radio.checked) {
    userAnswers[currentQuestionIndex] = correct;
    nextBtn.classList.remove("hidden");
  }
}

// Move to the next question
nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showResults();
  }
});

// Display results and show a summary
function showResults() {
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  // Count how many correct answers the user selected
  const correctAnswers = userAnswers.filter((answer) => answer === true).length;

  scoreText.innerHTML = `
    <p class="text-2xl font-semibold"></p>
  `;

  const resultMessage =
    correctAnswers === questions.length
      ? "Perfect score! Well done!"
      : correctAnswers > questions.length / 2
      ? "Good job, you got most of the answers right!"
      : "Better luck next time! Keep practicing!";

  scoreText.innerHTML += `
    <p class="text-xl mt-4">${resultMessage}</p>
    <p class="text-lg text-gray-600 mt-2">Correct Answers: ${correctAnswers} / ${questions.length}</p>
  `;
}

// Restart the quiz
restartBtn.addEventListener("click", () => {
  resultScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");
});
