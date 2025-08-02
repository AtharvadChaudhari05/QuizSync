// Generated Quiz JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        // User is not logged in, redirect to home page
        alert('You need to be logged in to view the generated quiz.');
        window.location.href = '../home.html';
        return;
    }

    // DOM Elements
    const quizContent = document.getElementById('quiz-content');
    const noQuizMessage = document.getElementById('no-quiz');

    // Load and display the generated quiz
    loadGeneratedQuiz();

    function loadGeneratedQuiz() {
        // Get the generated quiz data from localStorage
        const generatedQuizData = localStorage.getItem('generatedQuiz');
        
        if (!generatedQuizData) {
            showNoQuizMessage();
            return;
        }

        try {
            const quiz = JSON.parse(generatedQuizData);
            displayQuiz(quiz);
        } catch (error) {
            console.error('Error parsing quiz data:', error);
            showNoQuizMessage();
        }
    }

    function displayQuiz(quiz) {
        const quizHTML = `
            <div class="quiz-header">
                <h1>${quiz.title}</h1>
                <p>AI Generated Quiz - ${quiz.chapterName}</p>
            </div>

            <div class="quiz-info">
                <div class="quiz-info-item">
                    <div class="quiz-info-label">Course</div>
                    <div class="quiz-info-value">${quiz.courseName}</div>
                </div>
                <div class="quiz-info-item">
                    <div class="quiz-info-label">Subject</div>
                    <div class="quiz-info-value">${quiz.subjectName}</div>
                </div>
                <div class="quiz-info-item">
                    <div class="quiz-info-label">Chapter</div>
                    <div class="quiz-info-value">${quiz.chapterName}</div>
                </div>
                <div class="quiz-info-item">
                    <div class="quiz-info-label">Questions</div>
                    <div class="quiz-info-value">${quiz.questionCount}</div>
                </div>
                <div class="quiz-info-item">
                    <div class="quiz-info-label">Quiz Code</div>
                    <div class="secure-code">${quiz.secureCode}</div>
                </div>
            </div>

            <div class="questions-container" id="questions-container">
                ${quiz.questions.map((question, index) => generateQuestionHTML(question, index + 1)).join('')}
            </div>

            <div class="questions-navigation">
                <button class="nav-btn" onclick="scrollQuestions('left')" id="prev-btn">
                    ← Previous
                </button>
                <div class="questions-counter">
                    Question <span id="current-question">1</span> of ${quiz.questions.length}
                </div>
                <button class="nav-btn" onclick="scrollQuestions('right')" id="next-btn">
                    Next →
                </button>
            </div>

            <div class="action-buttons">
                <button class="btn btn-secondary" onclick="showAnswers()">Show All Answers</button>
                <button class="btn btn-primary" onclick="saveQuiz()">Save Quiz</button>
                <button class="btn btn-secondary" onclick="generateNewQuiz()">Generate New Quiz</button>
            </div>
        `;

        quizContent.innerHTML = quizHTML;
        
        // Ensure proper layout after content is loaded
        setTimeout(() => {
            const questionCards = document.querySelectorAll('.question-card');
            questionCards.forEach(card => {
                card.style.width = '350px';
                card.style.minWidth = '350px';
                card.style.maxWidth = '400px';
                card.style.boxSizing = 'border-box';
                card.style.flexShrink = '0';
            });
            
            // Initialize navigation
            updateNavigationButtons();
        }, 100);
    }

    function generateQuestionHTML(question, questionNumber) {
        let optionsHTML = '';
        let explanationHTML = '';

        // Clean and sanitize text content
        const cleanText = (text) => {
            if (!text) return '';
            return text.toString().trim().replace(/\s+/g, ' ');
        };

        if (question.type === 'multiple-choice') {
            optionsHTML = question.options.map((option, index) => {
                const optionLabel = String.fromCharCode(65 + index); // A, B, C, D...
                const isCorrect = index === question.correctAnswer;
                const cleanOption = cleanText(option);
                return `
                    <div class="option ${isCorrect ? 'correct' : ''}" data-correct="${isCorrect}">
                        <div class="option-label">${optionLabel}</div>
                        <div class="option-text">${cleanOption}</div>
                    </div>
                `;
            }).join('');
        } else if (question.type === 'true-false') {
            optionsHTML = question.options.map((option, index) => {
                const isCorrect = index === question.correctAnswer;
                const cleanOption = cleanText(option);
                return `
                    <div class="option ${isCorrect ? 'correct' : ''}" data-correct="${isCorrect}">
                        <div class="option-label">${index === 0 ? 'T' : 'F'}</div>
                        <div class="option-text">${cleanOption}</div>
                    </div>
                `;
            }).join('');
        } else if (question.type === 'fill-in-blank') {
            const cleanAnswer = cleanText(question.correctAnswer);
            optionsHTML = `
                <div class="option correct">
                    <div class="option-label">✓</div>
                    <div class="option-text">Correct Answer: <strong>${cleanAnswer}</strong></div>
                </div>
            `;
        }

        if (question.explanation) {
            const cleanExplanation = cleanText(question.explanation);
            explanationHTML = `
                <div class="explanation">
                    <div class="explanation-title">Explanation:</div>
                    <div class="explanation-text">${cleanExplanation}</div>
                </div>
            `;
        }

        const cleanQuestion = cleanText(question.question);
        return `
            <div class="question-card">
                <div class="question-header">
                    <div class="question-number">Question ${questionNumber}</div>
                    <div class="question-type">${question.type.replace('-', ' ')}</div>
                </div>
                <div class="question-text">${cleanQuestion}</div>
                <div class="options-container">
                    ${optionsHTML}
                </div>
                ${explanationHTML}
            </div>
        `;
    }

    function showNoQuizMessage() {
        quizContent.style.display = 'none';
        noQuizMessage.style.display = 'block';
    }

    // Global functions for button actions
    window.showAnswers = function() {
        const options = document.querySelectorAll('.option');
        options.forEach(option => {
            if (option.dataset.correct === 'true') {
                option.classList.add('correct');
            } else if (option.dataset.correct === 'false') {
                option.classList.add('incorrect');
            }
        });
    };

    window.saveQuiz = function() {
        const generatedQuizData = localStorage.getItem('generatedQuiz');
        if (generatedQuizData) {
            try {
                const quiz = JSON.parse(generatedQuizData);
                
                // Get existing saved quizzes or create new array
                const savedQuizzes = JSON.parse(localStorage.getItem('savedQuizzes') || '[]');
                
                // Add current quiz to saved quizzes
                savedQuizzes.push({
                    ...quiz,
                    savedAt: new Date().toISOString(),
                    id: generateUniqueId()
                });
                
                // Save back to localStorage
                localStorage.setItem('savedQuizzes', JSON.stringify(savedQuizzes));
                
                alert('Quiz saved successfully! You can find it in your saved quizzes.');
            } catch (error) {
                console.error('Error saving quiz:', error);
                alert('Error saving quiz. Please try again.');
            }
        }
    };

    window.generateNewQuiz = function() {
        // Clear the current generated quiz
        localStorage.removeItem('generatedQuiz');
        
        // Navigate back to AI generator
        window.location.href = 'ai-quiz-generator.html';
    };

    // Helper function to generate unique ID
    function generateUniqueId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    // Navigation functions
    window.scrollQuestions = function(direction) {
        const container = document.getElementById('questions-container');
        const scrollAmount = 400; // Width of one question card + gap
        
        if (direction === 'left') {
            container.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        } else {
            container.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
        
        // Update navigation after scroll
        setTimeout(updateNavigationButtons, 500);
    };

    function updateNavigationButtons() {
        const container = document.getElementById('questions-container');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const currentQuestionSpan = document.getElementById('current-question');
        
        if (!container || !prevBtn || !nextBtn) return;
        
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;
        
        // Update previous button
        prevBtn.disabled = scrollLeft <= 0;
        
        // Update next button
        nextBtn.disabled = scrollLeft >= maxScroll;
        
        // Update current question counter
        if (currentQuestionSpan) {
            const questionWidth = 400; // Approximate width of question card + gap
            const currentQuestion = Math.floor(scrollLeft / questionWidth) + 1;
            currentQuestionSpan.textContent = currentQuestion;
        }
    }

    // Add scroll event listener to update navigation
    document.addEventListener('DOMContentLoaded', function() {
        const container = document.getElementById('questions-container');
        if (container) {
            container.addEventListener('scroll', updateNavigationButtons);
        }
    });
}); 