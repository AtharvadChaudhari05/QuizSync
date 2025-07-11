// Quiz Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if student info and quiz data exist in localStorage
    const studentInfoString = localStorage.getItem('quizSync_studentInfo');
    const quizDataString = localStorage.getItem('quizSync_quizData');
    
    if (!studentInfoString || !quizDataString) {
        // If no student info or quiz data, redirect to join page
        alert('Session information not found. Please join the quiz again.');
        window.location.href = 'join_quiz.html';
        return;
    }
    
    const studentInfo = JSON.parse(studentInfoString);
    const quizData = JSON.parse(quizDataString);
    
    // Initialize quiz state
    let quizState = {
        currentQuestionIndex: 0,
        answers: [],
        timeLeft: 0,
        timerInterval: null,
        questions: []
    };
    
    // Display quiz name in header
    document.getElementById('quizNameHeader').textContent = quizData.quizName;
    
    // Set total questions
    document.getElementById('totalQuestions').textContent = quizData.totalQuestions;
    
    // Generate mock questions (in a real app, these would come from the server)
    quizState.questions = generateMockQuestions(quizData.totalQuestions);
    
    // Initialize the first question
    displayQuestion(quizState.currentQuestionIndex);
    
    // Set up event listeners
    document.getElementById('nextQuestionBtn').addEventListener('click', function() {
        // Save the current answer
        saveAnswer();
        
        // Move to the next question
        if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
            quizState.currentQuestionIndex++;
            displayQuestion(quizState.currentQuestionIndex);
        } else {
            // If this is the last question, show submit button
            document.getElementById('nextQuestionBtn').style.display = 'none';
            document.getElementById('submitQuizBtn').style.display = 'inline-block';
        }
    });
    
    document.getElementById('submitQuizBtn').addEventListener('click', function() {
        // Save the final answer
        saveAnswer();
        
        // Clear the timer
        clearInterval(quizState.timerInterval);
        
        // Show completion modal
        const quizCompletedModal = document.getElementById('quizCompletedModal');
        quizCompletedModal.style.display = 'block';
        
        // Calculate and store results
        const results = calculateResults(quizState.questions, quizState.answers);
        localStorage.setItem('quizSync_results', JSON.stringify(results));
        
        // Redirect to results page after 2 seconds
        setTimeout(() => {
            window.location.href = 'results.html';
        }, 2000);
    });
    
    // Function to display a question
    function displayQuestion(index) {
        const question = quizState.questions[index];
        
        // Update question number
        document.getElementById('currentQuestionNum').textContent = index + 1;
        
        // Display question text
        document.getElementById('questionText').textContent = question.text;
        
        // Clear previous options/input
        document.getElementById('multipleChoiceContainer').innerHTML = '';
        document.getElementById('textAnswer').value = '';
        
        // Show appropriate answer input based on question type
        if (question.type === 'multiple-choice') {
            document.getElementById('multipleChoiceContainer').style.display = 'block';
            document.getElementById('textAnswerContainer').style.display = 'none';
            
            // Create options
            question.options.forEach((option, optionIndex) => {
                const optionItem = document.createElement('div');
                optionItem.className = 'option-item';
                optionItem.dataset.index = optionIndex;
                
                const optionInput = document.createElement('input');
                optionInput.type = 'radio';
                optionInput.name = 'quizOption';
                optionInput.id = `option${optionIndex}`;
                optionInput.value = optionIndex;
                
                const optionLabel = document.createElement('label');
                optionLabel.className = 'option-label';
                optionLabel.htmlFor = `option${optionIndex}`;
                
                const optionMarker = document.createElement('div');
                optionMarker.className = 'option-marker';
                
                const optionText = document.createElement('div');
                optionText.textContent = option;
                
                optionLabel.appendChild(optionMarker);
                optionLabel.appendChild(optionText);
                
                optionItem.appendChild(optionInput);
                optionItem.appendChild(optionLabel);
                
                // Add click handler for the entire option item
                optionItem.addEventListener('click', function() {
                    // Remove selected class from all options
                    document.querySelectorAll('.option-item').forEach(item => {
                        item.classList.remove('selected');
                    });
                    
                    // Add selected class to clicked option
                    this.classList.add('selected');
                    
                    // Check the radio button
                    optionInput.checked = true;
                });
                
                document.getElementById('multipleChoiceContainer').appendChild(optionItem);
            });
        } else {
            // Text/numeric question
            document.getElementById('multipleChoiceContainer').style.display = 'none';
            document.getElementById('textAnswerContainer').style.display = 'block';
        }
        
        // Start timer for this question
        startQuestionTimer(quizData.timePerQuestion);
    }
    
    // Function to start the timer for a question
    function startQuestionTimer(seconds) {
        // Clear any existing timer
        clearInterval(quizState.timerInterval);
        
        // Set initial time
        quizState.timeLeft = seconds;
        updateTimerDisplay();
        
        // Start the timer
        quizState.timerInterval = setInterval(() => {
            quizState.timeLeft--;
            updateTimerDisplay();
            
            if (quizState.timeLeft <= 0) {
                // Time's up for this question
                clearInterval(quizState.timerInterval);
                
                // Show time's up modal
                const questionCompletedModal = document.getElementById('questionCompletedModal');
                questionCompletedModal.style.display = 'block';
                
                // Save the current answer (even if incomplete)
                saveAnswer();
                
                // Move to next question after 2 seconds
                setTimeout(() => {
                    questionCompletedModal.style.display = 'none';
                    
                    // If this is not the last question, move to next
                    if (quizState.currentQuestionIndex < quizState.questions.length - 1) {
                        quizState.currentQuestionIndex++;
                        displayQuestion(quizState.currentQuestionIndex);
                    } else {
                        // If this is the last question, submit the quiz
                        const results = calculateResults(quizState.questions, quizState.answers);
                        localStorage.setItem('quizSync_results', JSON.stringify(results));
                        
                        // Show completion modal
                        const quizCompletedModal = document.getElementById('quizCompletedModal');
                        quizCompletedModal.style.display = 'block';
                        
                        // Redirect to results page after 2 seconds
                        setTimeout(() => {
                            window.location.href = 'results.html';
                        }, 2000);
                    }
                }, 2000);
            }
        }, 1000);
    }
    
    // Function to update the timer display
    function updateTimerDisplay() {
        const minutes = Math.floor(quizState.timeLeft / 60);
        const seconds = quizState.timeLeft % 60;
        
        document.getElementById('questionTimer').textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Change color when time is running low
        if (quizState.timeLeft <= 10) {
            document.getElementById('questionTimer').style.color = '#fc466b';
        } else {
            document.getElementById('questionTimer').style.color = '#fff';
        }
    }
    
    // Function to save the current answer
    function saveAnswer() {
        const currentQuestion = quizState.questions[quizState.currentQuestionIndex];
        let answer = null;
        
        if (currentQuestion.type === 'multiple-choice') {
            const selectedOption = document.querySelector('input[name="quizOption"]:checked');
            if (selectedOption) {
                answer = parseInt(selectedOption.value);
            }
        } else {
            // Text/numeric question
            answer = document.getElementById('textAnswer').value.trim();
        }
        
        // Store the answer
        quizState.answers[quizState.currentQuestionIndex] = answer;
    }
});

// Function to generate mock questions
function generateMockQuestions(count) {
    const questions = [];
    
    // Generate multiple choice questions
    for (let i = 0; i < Math.floor(count * 0.7); i++) {
        questions.push({
            id: `q${i + 1}`,
            text: `Multiple Choice Question ${i + 1}: What is the capital of ${getRandomCountry()}?`,
            type: 'multiple-choice',
            options: getRandomCities(4),
            correctAnswer: Math.floor(Math.random() * 4) // Random correct answer index
        });
    }
    
    // Generate text/numeric questions
    for (let i = Math.floor(count * 0.7); i < count; i++) {
        const isNumeric = Math.random() > 0.5;
        
        if (isNumeric) {
            const num1 = Math.floor(Math.random() * 100);
            const num2 = Math.floor(Math.random() * 100);
            
            questions.push({
                id: `q${i + 1}`,
                text: `Numeric Question ${i + 1}: What is ${num1} + ${num2}?`,
                type: 'text',
                correctAnswer: (num1 + num2).toString()
            });
        } else {
            questions.push({
                id: `q${i + 1}`,
                text: `Text Question ${i + 1}: What is the chemical symbol for ${getRandomElement()}?`,
                type: 'text',
                correctAnswer: getRandomElementSymbol()
            });
        }
    }
    
    // Shuffle the questions
    return shuffleArray(questions);
}

// Function to calculate quiz results
function calculateResults(questions, answers) {
    let correctCount = 0;
    let totalPoints = 0;
    const questionResults = [];
    
    questions.forEach((question, index) => {
        const userAnswer = answers[index];
        let isCorrect = false;
        
        if (question.type === 'multiple-choice') {
            isCorrect = userAnswer === question.correctAnswer;
        } else {
            // For text/numeric questions, do case-insensitive comparison
            isCorrect = userAnswer && userAnswer.toLowerCase() === question.correctAnswer.toLowerCase();
        }
        
        if (isCorrect) {
            correctCount++;
            totalPoints += 10; // 10 points per correct answer
        }
        
        questionResults.push({
            questionId: question.id,
            userAnswer,
            correctAnswer: question.correctAnswer,
            isCorrect
        });
    });
    
    return {
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        totalPoints,
        percentage: Math.round((correctCount / questions.length) * 100),
        questionResults,
        completedAt: new Date().toISOString()
    };
}

// Helper functions
function getRandomCountry() {
    const countries = ['France', 'Japan', 'Brazil', 'Australia', 'Egypt', 'Canada', 'India', 'Germany', 'Mexico', 'South Africa'];
    return countries[Math.floor(Math.random() * countries.length)];
}

function getRandomCities(count) {
    const cities = ['Paris', 'Tokyo', 'London', 'New York', 'Berlin', 'Rome', 'Madrid', 'Moscow', 'Beijing', 'Cairo', 
                   'Sydney', 'Toronto', 'Dubai', 'Singapore', 'Seoul', 'Bangkok', 'Amsterdam', 'Istanbul', 'Rio de Janeiro'];
    
    // Shuffle and take the first 'count' cities
    return shuffleArray(cities).slice(0, count);
}

function getRandomElement() {
    const elements = ['Oxygen', 'Carbon', 'Hydrogen', 'Nitrogen', 'Gold', 'Silver', 'Iron', 'Sodium', 'Calcium', 'Potassium'];
    return elements[Math.floor(Math.random() * elements.length)];
}

function getRandomElementSymbol() {
    const symbols = ['O', 'C', 'H', 'N', 'Au', 'Ag', 'Fe', 'Na', 'Ca', 'K'];
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
} 