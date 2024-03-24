let host = "http://localhost:8080";
let quizzes = [];
let currentQuizIndex = 0;
let currentQuestionIndex = 0;
let score = 0;

loadQuizzes();

async function loadQuizzes() {
  let response = await fetch(host + "/quizzes");
  quizzes = await response.json();
  displayQuizzes();
}

function displayQuizzes() {
  let quizCardsContainer = document.getElementById("quizCards");
  quizCardsContainer.innerHTML = "";

  for (let quiz of quizzes) {
    let quizCard = document.createElement("div");
    quizCard.className = "quiz-card";
    quizCard.innerHTML = `
      <h3>${quiz.id}</h3>
      <p>${quiz.title}</p>
      <p>(${quiz.questions.length} questions)</p>
    `;
    quizCard.onclick = () => startQuiz(quiz);
    quizCardsContainer.appendChild(quizCard);
  }
}

function startQuiz(quiz) {
  currentQuizIndex = quizzes.indexOf(quiz);
  currentQuestionIndex = 0;
  score = 0;
  document.getElementById("topNav").classList.add("hide");
  document.getElementById("quizList").classList.add("hide");
  document.getElementById("quizContainer").classList.remove("hide");
  displayQuestion();
}

function displayQuestion() {
  let quiz = quizzes[currentQuizIndex];
  let question = quiz.questions[currentQuestionIndex];
  let questionImage = document.getElementById("questionImage");
  let questionId = document.getElementById("questionId");
  let questionDescription = document.getElementById("questionDescription");
  let answerForm = document.getElementById("answerForm");

  questionImage.src = `${host}/questions/${question.id}/image`;
  questionId.textContent = question.id;
  questionDescription.textContent = question.description;

  for (let i = 0; i < question.choices.length; i++) {
    let choiceLabel = document.querySelector(`label[for="choice${i}"]`);
    choiceLabel.textContent = question.choices[i];
  }

  let prevButton = document.getElementById("prevButton");
  let nextButton = document.getElementById("nextButton");
  let questionProgress = document.getElementById("questionProgress");

  if (currentQuestionIndex === 0) {
    prevButton.classList.add("hide");
  } else {
    prevButton.classList.remove("hide");
  }

  if (currentQuestionIndex === quiz.questions.length - 1) {
    nextButton.textContent = "Finish";
  } else {
    nextButton.textContent = "Next";
  }

  questionProgress.textContent = `Question ${currentQuestionIndex + 1} out of ${quiz.questions.length}`;
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    displayQuestion();
  }
}

function nextQuestion() {
  let quiz = quizzes[currentQuizIndex];
  let question = quiz.questions[currentQuestionIndex];
  let selectedAnswer = document.querySelector('input[name="answer"]:checked');

  if (selectedAnswer) {
    if (question.choices[selectedAnswer.value] === question.answer) {
      score++;
    }

    if (currentQuestionIndex === quiz.questions.length - 1) {
      showScore();
    } else {
      currentQuestionIndex++;
      displayQuestion();
    }
  } else {
    alert("Please select an answer.");
  }
}

function showScore() {
  let quiz = quizzes[currentQuizIndex];
  let scoreContainer = document.getElementById("scoreContainer");
  let quizTitle = document.getElementById("quizTitle");
  let scoreElement = document.getElementById("score");
  quizTitle.textContent = quiz.title;
  scoreElement.textContent = `${score} out of ${quiz.questions.length}`;
  document.getElementById("quizContainer").classList.add("hide");
  scoreContainer.classList.remove("hide");
  document.getElementById("topNav").classList.remove("hide");
}