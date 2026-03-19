// Question pool, will be moved to a data file in the future when i expand the amount of questions.
const questionPool = [
    {
        id: 1,
        text: "Question Placeholder 1",
        image: "images/placeholder.png",
        answers: [
            { text: "right answer", correct: true },
            { text: "wrong answer 1", correct: false },
            { text: "wrong answer 2", correct: false },
            { text: "wrong answer 3", correct: false }
        ],
        infoBlurb: "This is the informational blurb for question 1. It provides additional context and learning material about the topic."
    },
    {
        id: 2,
        text: "Question Placeholder 2",
        image: "images/placeholder.png",
        answers: [
            { text: "wrong answer 1", correct: false },
            { text: "right answer", correct: true },
            { text: "wrong answer 2", correct: false },
            { text: "wrong answer 3", correct: false }
        ],
        infoBlurb: "This is the informational blurb for question 2. Here you can learn more about this specific topic and related concepts."
    },
    {
        id: 3,
        text: "Question Placeholder 3",
        image: "images/placeholder.png",
        answers: [
            { text: "wrong answer 1", correct: false },
            { text: "wrong answer 2", correct: false },
            { text: "right answer", correct: true },
            { text: "Wrong answer 4", correct: false }
        ],
        infoBlurb: "This is the informational blurb for question 3. Use this space to expand on the subject matter and provide valuable insights."
    }
];

let currentQuestion = null;
let answerSelected = false;

// Function to shuffle an array
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Function to get a random question
function getRandomQuestion() {
    return questionPool[Math.floor(Math.random() * questionPool.length)];
}

// Function to display a question
function displayQuestion(question) {
    currentQuestion = question;
    answerSelected = false;

    // Reset question box to original structure
    const questionBox = document.querySelector('.question-box');
    questionBox.innerHTML = `
        <h2 id="question">${question.text}</h2>
        <img id="question-image" src="${question.image}" alt="Question Image">
    `;

    // Reset all answer boxes to visible and original state
    const answerBoxes = document.querySelectorAll('.answer-box');
    answerBoxes.forEach(box => {
        box.style.display = 'flex';
        box.style.backgroundColor = '#2ecc71'; // Reset to original green
        box.style.pointerEvents = 'auto';
        box.classList.remove('correct', 'incorrect', 'next-button');
        
        // Remove all existing event listeners by cloning and replacing the element
        const newBox = box.cloneNode(true);
        box.parentNode.replaceChild(newBox, box);
        
        // Add the click event listener to the new element
        newBox.addEventListener('click', function() {
            handleAnswerClick(this);
        });
    });

    // Shuffle answers and display them
    const shuffledAnswers = shuffleArray(question.answers);
    for (let i = 0; i < 4; i++) {
        const answerBox = document.getElementById(`answer${i + 1}`);
        const answerText = answerBox.querySelector("p");
        answerText.textContent = shuffledAnswers[i].text;
        
        // Store the correct status for this answer
        answerBox.dataset.correct = shuffledAnswers[i].correct;
        
        // Remove previous styling and enable clicking
        answerBox.classList.remove("correct", "incorrect");
        answerBox.style.pointerEvents = "auto";
        answerBox.style.opacity = "1";
    }
}

// Function to handle answer selection
function handleAnswerClick(answerBox) {
    if (answerSelected) return; // Prevent multiple answers on same question
    
    answerSelected = true;
    const isCorrect = answerBox.dataset.correct === "true";
    
    // Highlight the selected answer
    if (isCorrect) {
        answerBox.classList.add("correct");
    } else {
        answerBox.classList.add("incorrect");
    }
    
    // Disable all answer boxes
    document.querySelectorAll(".answer-box").forEach(box => {
        box.style.pointerEvents = "none";
    });
    
    // Show informational blurb after a delay
    setTimeout(() => {
        showInfoBlurb();
    }, 1000);
}

// Function to show the informational blurb
function showInfoBlurb() {
    // Replace question box content with informational blurb
    const questionBox = document.querySelector('.question-box');
    questionBox.innerHTML = `
        <h2>Did you know?</h2>
        <p style="color: white; font-size: 18px; text-align: center; padding: 20px;">${currentQuestion.infoBlurb}</p>
    `;
    
    // Clear text from first 3 answer boxes and disable them
    const answerBoxes = document.querySelectorAll('.answer-box');
    for (let i = 0; i < 3; i++) {
        answerBoxes[i].querySelector('p').textContent = '';
        answerBoxes[i].style.pointerEvents = 'none';
        answerBoxes[i].style.opacity = '0.3';
    }
    
    // Transform last answer box into "Next" button
    const nextButton = answerBoxes[3];
    nextButton.classList.add('next-button');
    nextButton.querySelector('p').textContent = 'Next';
    nextButton.style.pointerEvents = 'auto';
    nextButton.style.opacity = '1';
    
    // Remove old click handler and add new one for next button
    nextButton.removeEventListener('click', handleAnswerClick);
    nextButton.addEventListener('click', function() {
        const nextQuestion = getRandomQuestion();
        displayQuestion(nextQuestion);
    });
}

// Add event listeners to answer boxes
document.querySelectorAll(".answer-box").forEach((answerBox, index) => {
    answerBox.addEventListener("click", function() {
        handleAnswerClick(this);
    });
});

// Initialize with first random question
document.addEventListener("DOMContentLoaded", function() {
    const firstQuestion = getRandomQuestion();
    displayQuestion(firstQuestion);
});

