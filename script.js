const questions = [
  {
      question: "What is the time complexity of the quicksort algorithm in its worst case?",
      options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
      correct: 1
  },
  {
      question: "Which of these is NOT a valid way to prevent SQL injection?",
      options: ["Using prepared statements", "Escaping user input manually", "Using ORMs", "Trusting client-side validation only"],
      correct: 3
  },
  {
      question: "What is the difference between process and thread?",
      options: [
          "Processes share memory space, threads don't",
          "Threads share memory space, processes don't",
          "There is no difference",
          "Threads are faster but less secure"
      ],
      correct: 1
  },
  {
      question: "Which HTTP status code indicates a client-side error?",
      options: ["2xx", "3xx", "4xx", "5xx"],
      correct: 2
  },
  {
      question: "What is a closure in JavaScript?",
      options: [
          "A function that has access to variables in its outer scope",
          "A way to close browser windows",
          "A method to end loops",
          "A type of database connection"
      ],
      correct: 0
  },
  {
      question: "What is the purpose of the 'virtual' keyword in C++?",
      options: [
          "To create a virtual machine",
          "To enable method overriding",
          "To allocate virtual memory",
          "To create abstract classes only"
      ],
      correct: 1
  },
  {
      question: "Which design pattern is best suited for connecting two incompatible interfaces?",
      options: ["Factory", "Singleton", "Adapter", "Observer"],
      correct: 2
  },
  {
      question: "What is the main purpose of the CAP theorem?",
      options: [
          "To define database security",
          "To describe distributed system trade-offs",
          "To optimize network protocols",
          "To measure CPU performance"
      ],
      correct: 1
  },
  {
      question: "What is a race condition?",
      options: [
          "A competition between processes",
          "A bug in timing-dependent code",
          "A network speed test",
          "A type of sorting algorithm"
      ],
      correct: 1
  },
  {
      question: "Which of these is NOT a principle of SOLID?",
      options: [
          "Single Responsibility",
          "Open-Closed",
          "Tight Coupling",
          "Interface Segregation"
      ],
      correct: 2
  }
];

let currentQuestion = 0;
let score = 0;
let userAnswers = [];

function createBackgroundAnimations() {
  const container = document.querySelector('.background-animation');
  for (let i = 0; i < 20; i++) {
      const element = document.createElement('div');
      element.style.position = 'absolute';
      element.style.width = '30px';
      element.style.height = '30px';
      element.style.border = '2px solid rgba(255,255,255,0.1)';
      element.style.borderRadius = i % 2 === 0 ? '50%' : '0';
      element.style.animation = `rotate ${5 + i}s linear infinite`;
      element.style.left = `${Math.random() * 100}%`;
      element.style.top = `${Math.random() * 100}%`;
      container.appendChild(element);
  }

  const keyframes = `
      @keyframes rotate {
          from { transform: rotate(0deg) translate(50px) rotate(0deg); }
          to { transform: rotate(360deg) translate(50px) rotate(-360deg); }
      }
  `;
  const style = document.createElement('style');
  style.textContent = keyframes;
  document.head.appendChild(style);
}

function displayQuestion() {
  const questionEl = document.getElementById('question');
  const optionsEl = document.getElementById('options');
  const currentQuestionNum = document.getElementById('current-question');
  const scoreEl = document.getElementById('score');

  questionEl.textContent = questions[currentQuestion].question;
  optionsEl.innerHTML = '';
  currentQuestionNum.textContent = currentQuestion + 1;
  scoreEl.textContent = score;

  questions[currentQuestion].options.forEach((option, index) => {
      const button = document.createElement('button');
      button.className = 'option';
      button.textContent = option;
      button.onclick = () => checkAnswer(index);
      optionsEl.appendChild(button);
  });
}

async function checkAnswer(selectedIndex) {
  const correctIndex = questions[currentQuestion].correct;
  const options = document.querySelectorAll('.option');
  
  userAnswers.push({
      question: questions[currentQuestion].question,
      selectedAnswer: questions[currentQuestion].options[selectedIndex],
      correctAnswer: questions[currentQuestion].options[correctIndex],
      isCorrect: selectedIndex === correctIndex
  });

  options.forEach(opt => opt.style.pointerEvents = 'none');

  if (selectedIndex === correctIndex) {
      options[selectedIndex].classList.add('correct');
      score++;
  } else {
      options[selectedIndex].classList.add('wrong');
      await new Promise(resolve => setTimeout(resolve, 400));
      options[correctIndex].classList.add('correct');
  }

  await new Promise(resolve => setTimeout(resolve, 800));

  currentQuestion++;
  if (currentQuestion < questions.length) {
      displayQuestion();
  } else {
      endQuiz();
  }
}

function endQuiz() {
  const quizContent = document.querySelector('.quiz-content');
  quizContent.innerHTML = `
      <div class="question">Quiz Complete!</div>
      <div class="options">
          <div class="score">Final Score: ${score} out of ${questions.length}</div>
      </div>
  `;
  document.getElementById('restart-btn').style.display = 'block';
  document.getElementById('review-btn').style.display = 'block';
}

function restartQuiz() {
  currentQuestion = 0;
  score = 0;
  userAnswers = [];
  const quizContent = document.querySelector('.quiz-content');
  const reviewContainer = document.getElementById('review-container');
  quizContent.innerHTML = `
  <div class="question" id="question"></div>
  <div class="options" id="options"></div>
`;
reviewContainer.style.display = 'none';
  document.getElementById('restart-btn').style.display = 'none';
  document.getElementById('review-btn').style.display = 'none';
  quizContent.style.display = 'grid';
  document.getElementById('current-question').textContent = '1';
  document.getElementById('score').textContent = '0';
  // document.getElementById('review-container').style.display = 'none';
  // document.querySelector('.quiz-content').style.display = 'grid';
  displayQuestion();
}

function showReview() {
  const reviewContainer = document.getElementById('review-container');
  const quizContent = document.querySelector('.quiz-content');
  
  reviewContainer.style.display = 'grid';
  quizContent.style.display = 'none';
  
  reviewContainer.innerHTML = userAnswers.map((answer, index) => `
      <div class="review-item">
          <div class="question">Question ${index + 1}: ${answer.question}</div>
          <div class="review-answer ${answer.isCorrect ? 'correct' : 'wrong'}">
              Your answer: ${answer.selectedAnswer}
              ${!answer.isCorrect ? `<br>Correct answer: ${answer.correctAnswer}` : ''}
          </div>
      </div>
  `).join('');
}

document.getElementById('restart-btn').onclick = restartQuiz;
document.getElementById('review-btn').onclick = showReview;
createBackgroundAnimations();
displayQuestion();