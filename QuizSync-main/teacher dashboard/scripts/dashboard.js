// Dashboard JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        // User is not logged in, redirect to home page
        alert('You need to be logged in to access the teacher dashboard.');
        window.location.href = '../home.html';
        return;
    }
    
    // DOM Elements
    const creationOptionsSection = document.getElementById('creation-options');
    const quizInfoSection = document.getElementById('quiz-info');
    const addQuestionsSection = document.getElementById('add-questions');
    
    const manualBtn = document.querySelector('.manual-btn');
    const aiBtn = document.querySelector('.ai-btn');
    const backToOptionsBtn = document.getElementById('back-to-options-btn');
    const continueToQuestionsBtn = document.getElementById('continue-to-questions-btn');
    const backToInfoBtn = document.getElementById('back-to-info-btn');
    const saveDraftBtn = document.getElementById('save-draft-btn');
    const publishQuizBtn = document.getElementById('publish-quiz-btn');
    
    const scheduleTypeRadios = document.querySelectorAll('input[name="schedule-type"]');
    const scheduleDatesContainer = document.querySelector('.schedule-dates');
    
    const timeSettingTypeRadios = document.querySelectorAll('input[name="time-setting-type"]');
    const timePerQuestionGroup = document.querySelector('.time-per-question-group');
    const totalTimeGroup = document.querySelector('.total-time-group');
    
    const generateCodeBtn = document.getElementById('generate-code-btn');
    const editCodeBtn = document.getElementById('edit-code-btn');
    const secureCodeInput = document.getElementById('secure-code');
    
    const questionTypeRadios = document.querySelectorAll('input[name="question-type-main"]');
    const multipleChoiceOptions = document.getElementById('multiple-choice-options');
    const multipleChoiceTypeRadios = document.querySelectorAll('input[name="multiple-choice-type"]');
    const optionsGroup = document.getElementById('options-group');
    const textAnswerGroup = document.getElementById('text-answer-group');
    
    const optionsContainer = document.getElementById('options-container');
    const addOptionBtn = document.getElementById('add-option-btn');
    const addQuestionBtn = document.getElementById('add-question-btn');
    const resetQuestionBtn = document.getElementById('reset-question-btn');
    const questionsList = document.getElementById('questions-list');
    
    // Profile Modal
    const profileBtn = document.querySelector('.profile-btn');
    const profileModal = document.getElementById('profileModal');
    const closeProfileBtn = profileModal.querySelector('.close');
    const profileNameEl = document.querySelector('.js-profile-name');
    const profileEmailEl = document.querySelector('.js-profile-email');
    const logoutBtn = document.querySelector('.js-profile-logout');
    
    // Quiz data storage
    let quizData = {
        title: '',
        tags: [],
        timeSettingType: 'per-question',
        timePerQuestion: 30,
        totalTime: 10,
        scheduleType: 'now',
        startDate: null,
        expiryDate: null,
        secureCode: generateRandomCode(),
        questions: []
    };
    
    // Flow Navigation
    manualBtn.addEventListener('click', function() {
        // Start manual quiz creation
        creationOptionsSection.classList.add('hidden');
        quizInfoSection.classList.remove('hidden');
        
        // Pre-fill the secure code
        secureCodeInput.value = quizData.secureCode;
    });
    
    aiBtn.addEventListener('click', function() {
        // Navigate to AI quiz generator page
        window.location.href = 'ai-quiz-generator.html';
    });
    
    backToOptionsBtn.addEventListener('click', function() {
        quizInfoSection.classList.add('hidden');
        creationOptionsSection.classList.remove('hidden');
    });
    
    continueToQuestionsBtn.addEventListener('click', function() {
        // Validate quiz info form
        const quizTitleInput = document.getElementById('quiz-title');
        if (!quizTitleInput.value.trim()) {
            alert('Please enter a quiz title');
            quizTitleInput.focus();
            return;
        }
        
        // Save quiz info data
        saveQuizInfoData();
        
        // Switch to questions section
        quizInfoSection.classList.add('hidden');
        addQuestionsSection.classList.remove('hidden');
    });
    
    backToInfoBtn.addEventListener('click', function() {
        addQuestionsSection.classList.add('hidden');
        quizInfoSection.classList.remove('hidden');
    });
    
    saveDraftBtn.addEventListener('click', function() {
        // Save the current quiz as a draft
        saveQuizData(false);
        alert('Quiz saved as draft!');
    });
    
    publishQuizBtn.addEventListener('click', function() {
        // Validate that we have at least one question
        if (quizData.questions.length === 0) {
            alert('Please add at least one question before publishing');
            return;
        }
        
        // Publish the quiz
        const publishedQuiz = saveQuizData(true);
        alert('Quiz published successfully!');
        
        // Redirect to teacher waiting room
        setTimeout(() => {
            window.location.href = `waiting_room.html?quiz=${publishedQuiz.id}`;
        }, 1000);
    });
    
    // Schedule Type Toggle
    scheduleTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'scheduled') {
                scheduleDatesContainer.classList.remove('hidden');
            } else {
                scheduleDatesContainer.classList.add('hidden');
            }
        });
    });

    // Time Setting Type Toggle
    timeSettingTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.value === 'per-question') {
                timePerQuestionGroup.classList.remove('hidden');
                totalTimeGroup.classList.add('hidden');
            } else if (this.value === 'total') {
                timePerQuestionGroup.classList.add('hidden');
                totalTimeGroup.classList.remove('hidden');
            }
        });
    });
    
    // Secure Code Functionality
    generateCodeBtn.addEventListener('click', function() {
        secureCodeInput.value = generateRandomCode();
    });
    
    editCodeBtn.addEventListener('click', function() {
        if (secureCodeInput.readOnly) {
            secureCodeInput.readOnly = false;
            editCodeBtn.textContent = 'Save';
            secureCodeInput.focus();
        } else {
            secureCodeInput.readOnly = true;
            editCodeBtn.textContent = 'Edit';
            
            // Validate code format if needed
            if (!secureCodeInput.value.trim()) {
                secureCodeInput.value = generateRandomCode();
            }
        }
    });
    
    // Question Type Toggle
    questionTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const isMultipleChoice = this.value === 'multiple-choice';
            
            // Show/hide relevant sections
            if (isMultipleChoice) {
                multipleChoiceOptions.classList.remove('hidden');
                optionsGroup.classList.remove('hidden');
                textAnswerGroup.classList.add('hidden');
            } else {
                multipleChoiceOptions.classList.add('hidden');
                optionsGroup.classList.add('hidden');
                textAnswerGroup.classList.remove('hidden');
            }
        });
    });
    
    // Multiple Choice Type Toggle
    multipleChoiceTypeRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const isSingle = this.value === 'single';
            const optionSelects = optionsContainer.querySelectorAll('.option-select input');
            
            optionSelects.forEach(select => {
                if (isSingle) {
                    select.type = 'radio';
                    select.name = 'correct-option';
                } else {
                    select.type = 'checkbox';
                    select.name = 'correct-options[]';
                }
            });
        });
    });
    
    // Add Option Button
    addOptionBtn.addEventListener('click', function() {
        const optionCount = optionsContainer.querySelectorAll('.option-row').length;
        const newRow = document.createElement('div');
        newRow.className = 'option-row';
        
        const isSingle = document.querySelector('input[name="multiple-choice-type"]:checked').value === 'single';
        
        newRow.innerHTML = `
            <div class="option-select">
                <input type="${isSingle ? 'radio' : 'checkbox'}" name="${isSingle ? 'correct-option' : 'correct-options[]'}" value="${optionCount}">
            </div>
            <input type="text" class="option-text" placeholder="Option ${optionCount + 1}" required>
            <button type="button" class="remove-option-btn">&times;</button>
        `;
        
        // Enable all remove buttons when we have more than 2 options
        if (optionCount >= 2) {
            const removeButtons = optionsContainer.querySelectorAll('.remove-option-btn');
            removeButtons.forEach(btn => btn.disabled = false);
        }
        
        optionsContainer.appendChild(newRow);
        
        // Add event listener to the new remove button
        const removeBtn = newRow.querySelector('.remove-option-btn');
        removeBtn.addEventListener('click', function() {
            removeOption(newRow);
        });
        
        // Focus the new input field
        newRow.querySelector('.option-text').focus();
    });
    
    // Function to remove an option
    function removeOption(optionRow) {
        optionsContainer.removeChild(optionRow);
        
        // If we have only 2 options left, disable the remove buttons
        if (optionsContainer.querySelectorAll('.option-row').length <= 2) {
            const removeButtons = optionsContainer.querySelectorAll('.remove-option-btn');
            removeButtons.forEach(btn => btn.disabled = true);
        }
        
        // Reindex the options
        const optionRows = optionsContainer.querySelectorAll('.option-row');
        optionRows.forEach((row, index) => {
            const optionInput = row.querySelector('.option-text');
            optionInput.placeholder = `Option ${index + 1}`;
            
            const optionSelect = row.querySelector('.option-select input');
            optionSelect.value = index;
        });
    }
    
    // Add Question Button
    addQuestionBtn.addEventListener('click', function() {
        // Validate question form
        const questionText = document.getElementById('question-text').value.trim();
        if (!questionText) {
            alert('Please enter a question');
            document.getElementById('question-text').focus();
            return;
        }
        
        // Get question type
        const questionType = document.querySelector('input[name="question-type-main"]:checked').value;
        
        let questionObj = {
            id: Date.now().toString(), // Simple unique ID
            text: questionText,
            type: questionType,
            image: null // Handle image upload in a real implementation
        };
        
        if (questionType === 'multiple-choice') {
            // Get multiple choice sub-type
            const multipleChoiceType = document.querySelector('input[name="multiple-choice-type"]:checked').value;
            questionObj.multipleChoiceType = multipleChoiceType;
            
            // Get options
            const optionRows = optionsContainer.querySelectorAll('.option-row');
            const options = [];
            let hasCorrectOption = false;
            
            optionRows.forEach((row, index) => {
                const optionText = row.querySelector('.option-text').value.trim();
                if (!optionText) {
                    alert(`Please enter text for Option ${index + 1}`);
                    row.querySelector('.option-text').focus();
                    return;
                }
                
                const isCorrect = row.querySelector('.option-select input').checked;
                if (isCorrect) hasCorrectOption = true;
                
                options.push({
                    text: optionText,
                    isCorrect: isCorrect
                });
            });
            
            if (!hasCorrectOption) {
                alert('Please select at least one correct answer');
                return;
            }
            
            questionObj.options = options;
            
        } else if (questionType === 'text-answer') {
            // Get correct text answer
            const correctTextAnswer = document.getElementById('correct-text-answer').value.trim();
            if (!correctTextAnswer) {
                alert('Please enter the correct answer');
                document.getElementById('correct-text-answer').focus();
                return;
            }
            
            questionObj.correctAnswer = correctTextAnswer;
        }
        
        // Add to quizData
        quizData.questions.push(questionObj);
        
        // Add to preview
        addQuestionToPreview(questionObj);
        
        // Reset form
        resetQuestionForm();
        
        // Show success message
        alert('Question added successfully!');
    });
    
    // Add question to preview panel
    function addQuestionToPreview(question) {
        // Remove empty state if it exists
        const emptyState = questionsList.querySelector('.empty-state');
        if (emptyState) {
            questionsList.removeChild(emptyState);
        }
        
        // Create question element
        const questionEl = document.createElement('div');
        questionEl.className = 'question-preview-item';
        questionEl.dataset.id = question.id;
        
        let optionsHtml = '';
        let questionTypeBadge = '';
        
        // Format based on question type
        if (question.type === 'multiple-choice') {
            // Format options for display
            optionsHtml = question.options.map((option, index) => {
                return `
                    <div class="preview-option ${option.isCorrect ? 'correct' : ''}">
                        <span class="option-marker">${String.fromCharCode(65 + index)}.</span>
                        <span class="option-preview-text">${option.text}</span>
                        ${option.isCorrect ? '<span class="correct-marker">✓</span>' : ''}
                    </div>
                `;
            }).join('');
            
            questionTypeBadge = question.multipleChoiceType === 'single' ? 'Single Choice' : 'Multiple Choice';
        } else if (question.type === 'text-answer') {
            optionsHtml = `
                <div class="preview-text-answer">
                    <span class="text-answer-label">Correct Answer:</span>
                    <span class="text-answer-value">${question.correctAnswer}</span>
                </div>
            `;
            
            questionTypeBadge = 'Text/Numeric Answer';
        }
        
        questionEl.innerHTML = `
            <div class="question-preview-header">
                <h4 class="question-preview-text">${question.text}</h4>
                <div class="question-preview-actions">
                    <button type="button" class="btn-edit-question" data-id="${question.id}">Edit</button>
                    <button type="button" class="btn-delete-question" data-id="${question.id}">Delete</button>
                </div>
            </div>
            <div class="question-preview-options">
                ${optionsHtml}
            </div>
            <div class="question-preview-footer">
                <span class="question-type-badge">${questionTypeBadge}</span>
            </div>
        `;
        
        // Add CSS
        const style = document.createElement('style');
        style.textContent = `
            .question-preview-item {
                background: white;
                border-radius: 8px;
                padding: 16px;
                margin-bottom: 16px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                border: 1px solid var(--accent-light);
            }
            .question-preview-header {
                display: flex;
                justify-content: space-between;
                margin-bottom: 12px;
                align-items: flex-start;
            }
            .question-preview-text {
                font-weight: 600;
                color: var(--primary);
                margin: 0;
                flex: 1;
            }
            .question-preview-actions {
                display: flex;
                gap: 8px;
            }
            .btn-edit-question, .btn-delete-question {
                padding: 4px 8px;
                font-size: 0.8rem;
                border-radius: 4px;
                cursor: pointer;
                background: var(--bg-light);
                border: 1px solid var(--accent-light);
                color: var(--primary);
            }
            .btn-delete-question {
                color: var(--danger);
                border-color: var(--danger);
            }
            .question-preview-options {
                margin-bottom: 12px;
            }
            .preview-option {
                display: flex;
                align-items: center;
                padding: 6px 8px;
                margin-bottom: 6px;
                border-radius: 4px;
                background: var(--bg-light);
            }
            .preview-option.correct {
                background: rgba(16, 185, 129, 0.1);
                border: 1px solid var(--success);
            }
            .option-marker {
                font-weight: 600;
                margin-right: 8px;
                color: var(--primary);
            }
            .correct-marker {
                color: var(--success);
                font-weight: bold;
                margin-left: auto;
            }
            .preview-text-answer {
                padding: 10px;
                background: rgba(94, 124, 255, 0.1);
                border: 1px solid var(--accent-light);
                border-radius: 4px;
            }
            .text-answer-label {
                font-weight: 600;
                color: var(--primary);
                margin-right: 8px;
            }
            .text-answer-value {
                color: var(--accent);
                font-weight: 600;
                padding: 2px 8px;
                background: white;
                border-radius: 3px;
                border: 1px solid var(--accent-light);
            }
            .question-preview-footer {
                display: flex;
                gap: 8px;
            }
            .question-type-badge {
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 0.8rem;
                background: var(--accent-light);
                color: var(--primary-dark);
            }
        `;
        document.head.appendChild(style);
        
        // Add to the questions list
        questionsList.appendChild(questionEl);
        
        // Add event listeners for edit and delete buttons
        const editBtn = questionEl.querySelector('.btn-edit-question');
        const deleteBtn = questionEl.querySelector('.btn-delete-question');
        
        editBtn.addEventListener('click', function() {
            editQuestion(question.id);
        });
        
        deleteBtn.addEventListener('click', function() {
            deleteQuestion(question.id);
        });
    }
    
    // Function to edit a question
    function editQuestion(questionId) {
        const question = quizData.questions.find(q => q.id === questionId);
        if (!question) return;
        
        // Populate form with question data
        document.getElementById('question-text').value = question.text;
        
        // Set question type
        document.querySelector(`input[name="question-type-main"][value="${question.type}"]`).checked = true;
        
        // Show/hide appropriate sections based on question type
        if (question.type === 'multiple-choice') {
            multipleChoiceOptions.classList.remove('hidden');
            optionsGroup.classList.remove('hidden');
            textAnswerGroup.classList.add('hidden');
            
            // Set multiple choice sub-type
            document.querySelector(`input[name="multiple-choice-type"][value="${question.multipleChoiceType}"]`).checked = true;
            
            // Clear existing options
            while (optionsContainer.firstChild) {
                optionsContainer.removeChild(optionsContainer.firstChild);
            }
            
            // Add options
            question.options.forEach((option, index) => {
                const newRow = document.createElement('div');
                newRow.className = 'option-row';
                
                const isSingle = question.multipleChoiceType === 'single';
                
                newRow.innerHTML = `
                    <div class="option-select">
                        <input type="${isSingle ? 'radio' : 'checkbox'}" 
                               name="${isSingle ? 'correct-option' : 'correct-options[]'}" 
                               value="${index}" 
                               ${option.isCorrect ? 'checked' : ''}>
                    </div>
                    <input type="text" class="option-text" placeholder="Option ${index + 1}" value="${option.text}" required>
                    <button type="button" class="remove-option-btn" ${question.options.length <= 2 ? 'disabled' : ''}>&times;</button>
                `;
                
                optionsContainer.appendChild(newRow);
                
                // Add event listener to the remove button
                const removeBtn = newRow.querySelector('.remove-option-btn');
                removeBtn.addEventListener('click', function() {
                    removeOption(newRow);
                });
            });
        } else if (question.type === 'text-answer') {
            multipleChoiceOptions.classList.add('hidden');
            optionsGroup.classList.add('hidden');
            textAnswerGroup.classList.remove('hidden');
            
            // Set correct text answer
            document.getElementById('correct-text-answer').value = question.correctAnswer;
        }
        
        // Remove question from list
        deleteQuestion(questionId, false);
        
        // Scroll to form
        document.querySelector('.questions-editor').scrollIntoView({ behavior: 'smooth' });
    }
    
    // Function to delete a question
    function deleteQuestion(questionId, confirmDelete = true) {
        if (confirmDelete) {
            if (!confirm('Are you sure you want to delete this question?')) {
                return;
            }
        }
        
        // Remove from quizData
        quizData.questions = quizData.questions.filter(q => q.id !== questionId);
        
        // Remove from DOM
        const questionEl = questionsList.querySelector(`.question-preview-item[data-id="${questionId}"]`);
        if (questionEl) {
            questionsList.removeChild(questionEl);
        }
        
        // Show empty state if no questions
        if (quizData.questions.length === 0) {
            questionsList.innerHTML = `
                <div class="empty-state">
                    <p>No questions added yet</p>
                    <p class="hint">Questions you add will appear here</p>
                </div>
            `;
        }
    }
    
    // Reset Question Form
    function resetQuestionForm() {
        document.getElementById('question-form').reset();
        
        // Get the current question type
        const currentQuestionType = document.querySelector('input[name="question-type-main"]:checked').value;
        
        // Show/hide appropriate sections based on question type
        if (currentQuestionType === 'multiple-choice') {
            multipleChoiceOptions.classList.remove('hidden');
            optionsGroup.classList.remove('hidden');
            textAnswerGroup.classList.add('hidden');
            
            // Reset options container to default state (2 options)
            while (optionsContainer.firstChild) {
                optionsContainer.removeChild(optionsContainer.firstChild);
            }
            
            // Get the current multiple choice type
            const isSingle = document.querySelector('input[name="multiple-choice-type"]:checked').value === 'single';
            
            // Add two default options
            for (let i = 0; i < 2; i++) {
                const newRow = document.createElement('div');
                newRow.className = 'option-row';
                
                newRow.innerHTML = `
                    <div class="option-select">
                        <input type="${isSingle ? 'radio' : 'checkbox'}" name="${isSingle ? 'correct-option' : 'correct-options[]'}" value="${i}" ${i === 0 ? 'checked' : ''}>
                    </div>
                    <input type="text" class="option-text" placeholder="Option ${i + 1}" required>
                    <button type="button" class="remove-option-btn" disabled>&times;</button>
                `;
                
                optionsContainer.appendChild(newRow);
            }
        } else {
            // Text answer type
            multipleChoiceOptions.classList.add('hidden');
            optionsGroup.classList.add('hidden');
            textAnswerGroup.classList.remove('hidden');
            
            // Clear the correct text answer
            document.getElementById('correct-text-answer').value = '';
        }
    }
    
    // Save Quiz Info Data
    function saveQuizInfoData() {
        quizData.title = document.getElementById('quiz-title').value.trim();
        quizData.tags = document.getElementById('quiz-tags').value.split(',').map(tag => tag.trim()).filter(tag => tag);
        quizData.timePerQuestion = parseInt(document.getElementById('time-per-question').value) || 30;
        quizData.totalTime = parseInt(document.getElementById('total-time').value) || 10;
        quizData.scheduleType = document.querySelector('input[name="schedule-type"]:checked').value;
        quizData.timeSettingType = document.querySelector('input[name="time-setting-type"]:checked').value;
        
        if (quizData.scheduleType === 'scheduled') {
            quizData.startDate = document.getElementById('start-date').value;
            quizData.expiryDate = document.getElementById('expiry-date').value;
        } else {
            quizData.startDate = null;
            quizData.expiryDate = null;
        }
        
        quizData.secureCode = document.getElementById('secure-code').value.trim();
    }
    
    // Save Quiz Data
    function saveQuizData(isPublished) {
        // Get the latest quiz info
        saveQuizInfoData();
        
        // Create the complete quiz object
        const completeQuiz = {
            ...quizData,
            id: generateUniqueId(),
            createdBy: JSON.parse(loggedInUser).id,
            createdAt: new Date().toISOString(),
            status: isPublished ? 'published' : 'draft',
            participants: []
        };
        
        // Get existing quizzes from localStorage
        let quizzes = [];
        try {
            const storedQuizzes = localStorage.getItem('quizSync_quizzes');
            if (storedQuizzes) {
                quizzes = JSON.parse(storedQuizzes);
            }
        } catch (error) {
            console.error('Error loading quizzes from localStorage:', error);
        }
        
        // Add the new quiz
        quizzes.push(completeQuiz);
        
        // Save to localStorage
        try {
            localStorage.setItem('quizSync_quizzes', JSON.stringify(quizzes));
            console.log('Quiz saved successfully!');
            return completeQuiz; // Return the published quiz object
        } catch (error) {
            console.error('Error saving quiz to localStorage:', error);
            alert('Error saving quiz. Please try again.');
            return null; // Indicate failure
        }
    }
    
    // Helper Functions
    function generateRandomCode(length = 6) {
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
    
    function generateUniqueId() {
        return 'quiz_' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
    }
    
    // Profile Modal Functions
    profileBtn.addEventListener('click', function() {
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (user) {
            profileNameEl.textContent = user.name;
            profileEmailEl.textContent = user.email;
        }
        profileModal.style.display = 'block';
    });
    
    closeProfileBtn.addEventListener('click', function() {
        profileModal.style.display = 'none';
    });
    
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('loggedInUser');
        alert('Logged out successfully!');
        window.location.href = '../home.html';
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === profileModal) {
            profileModal.style.display = 'none';
        }
    });
    
    // Initialize
    function init() {
        // Generate secure code
        secureCodeInput.value = quizData.secureCode;
        
        // Set current date/time in datetime-local inputs
        const now = new Date();
        const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
        const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        
        // Format for datetime-local input
        const formatDateForInput = (date) => {
            return date.toISOString().slice(0, 16);
        };
        
        document.getElementById('start-date').value = formatDateForInput(oneHourLater);
        document.getElementById('expiry-date').value = formatDateForInput(oneDayLater);
    }
    
    // Call initialization
    init();
}); 