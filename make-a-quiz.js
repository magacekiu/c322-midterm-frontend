let host = "https://midterm-backend-latest.onrender.com";
let questions = [];
let quizQuestions = [];
let quizId = null;

loadQuestions();

async function loadQuestions() {
  let response = await fetch(host + "/questions");
  questions = await response.json();
  displayQuestions();
}

function displayQuestions() {
  let questionBank = document.getElementById("questionBank");
  questionBank.innerHTML = "";

  for (let question of questions) {
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${host}/questions/${question.id}/image" alt="question">
      <div>${question.id}. ${question.description}</div>
      <form>
        <input type="radio" name="question${question.id}" value="${question.choices[0]}"> ${question.choices[0]}<br>
        <input type="radio" name="question${question.id}" value="${question.choices[1]}"> ${question.choices[1]}<br>
        <input type="radio" name="question${question.id}" value="${question.choices[2]}"> ${question.choices[2]}
      </form>
    `;
    card.onclick = () => addToQuiz(question);
    questionBank.appendChild(card);
  }
}

function addToQuiz(question) {
  if (!quizQuestions.includes(question)) {
    quizQuestions.push(question);
    updateQuizDisplay();
  }
}

function removeFromQuiz(question) {
  let index = quizQuestions.indexOf(question);
  if (index > -1) {
    quizQuestions.splice(index, 1);
    updateQuizDisplay();
  }
}

function updateQuizDisplay() {
  let quizQuestionsDiv = document.getElementById("quizQuestions");
  let questionCountSpan = document.getElementById("questionCount");
  
  quizQuestionsDiv.innerHTML = "";
  questionCountSpan.textContent = quizQuestions.length;

  for (let question of quizQuestions) {
    let card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${host}/questions/${question.id}/image" alt="question">
      <p>${question.description}</p>
    `;
    card.onclick = () => removeFromQuiz(question);
    quizQuestionsDiv.appendChild(card);
  }
}

async function saveChanges() {
  let title = document.getElementById("quizTitle").value;
  let questionIds = quizQuestions.map(q => q.id);

  let quiz = {
    title: title,
    questionIds: questionIds
  };

  let url = quizId ? `${host}/quizzes/${quizId}` : `${host}/quizzes`;
  let method = quizId ? "PUT" : "POST";

  let response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(quiz)
  });

  if (response.ok) {
    if (!quizId) {
      quizId = await response.text();
    }
    alert("Quiz saved successfully!");
    console.log("Quiz ID: " + quizId);
  } else {
    alert("Failed to save quiz. Please try again.");
  }
}

async function saveAndNew() {
  await saveChanges();
  quizId = null;
  quizQuestions = [];
  document.getElementById("quizTitle").value = "";
  updateQuizDisplay();
}