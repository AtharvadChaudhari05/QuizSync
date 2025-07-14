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
    const quizTitleEl = document.getElementById('quiz-title');
    const quizCodeEl = document.getElementById('quiz-code');
    const studentsCountEl = document.getElementById('students-count');
    const questionsCountEl = document.getElementById('questions-count');
    const studentsList = document.getElementById('students-list');
    const copyCodeBtn = document.getElementById('copy-code-btn');
    const startQuizBtn = document.getElementById('start-quiz-btn');
    const cancelQuizBtn = document.getElementById('cancel-quiz-btn');
    
    // Profile Modal
    const profileBtn = document.querySelector('.profile-btn');
    const profileModal = document.getElementById('profileModal');
    const closeProfileBtn = profileModal.querySelector('.close');
    const profileNameEl = document.querySelector('.js-profile-name');
    const profileEmailEl = document.querySelector('.js-profile-email');
    const logoutBtn = document.querySelector('.js-profile-logout');
    
    // Get quiz ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const quizId = urlParams.get('quiz');
    
    // Quiz data
    let currentQuiz = null;
    
    // Student data
    let students = [];
    
    // Initialize
    initializeWaitingRoom();
    
    // Initialize the waiting room
    function initializeWaitingRoom() {
        if (!quizId) {
            alert('No quiz ID specified. Redirecting to dashboard.');
            window.location.href = 'index.html';
            return;
        }
        
        // Load quiz data
        loadQuizData();
        
        // Set up event listeners
        setupEventListeners();
        
        // Start simulating student joins (for demo)
        startStudentJoinSimulation();
        
        // Start polling for new students
        setInterval(checkForNewStudents, 3000);
    }
    
    // Load quiz data
    function loadQuizData() {
        try {
            // Get quizzes from localStorage
            const quizzes = JSON.parse(localStorage.getItem('quizSync_quizzes') || '[]');
            
            // Find the current quiz
            currentQuiz = quizzes.find(quiz => quiz.id === quizId);
            
            if (!currentQuiz) {
                alert('Quiz not found. Redirecting to dashboard.');
                window.location.href = 'index.html';
                return;
            }
            
            // Initialize the quiz status if not already set
            if (!currentQuiz.status) {
                currentQuiz.status = 'waiting';
            }
            
            // Initialize participants array if not exists
            if (!currentQuiz.participants) {
                currentQuiz.participants = [];
            }
            
            // Update the UI with quiz data
            updateQuizInfo();
            
        } catch (error) {
            console.error('Error loading quiz data:', error);
            alert('Error loading quiz data.');
        }
    }
    
    // Update quiz info in the UI
    function updateQuizInfo() {
        quizTitleEl.textContent = currentQuiz.title;
        quizCodeEl.textContent = currentQuiz.secureCode;
        questionsCountEl.textContent = currentQuiz.questions.length;
        updateStudentsList();
    }
    
    // Update the students list
    function updateStudentsList() {
        // Get current participants
        students = currentQuiz.participants || [];
        
        // Update count
        studentsCountEl.textContent = students.length;
        
        // Clear existing list
        if (students.length > 0) {
            // Remove empty state if it exists
            const emptyState = studentsList.querySelector('.empty-state');
            if (emptyState) {
                studentsList.removeChild(emptyState);
            }
            
            // Clear any existing student entries
            const existingItems = studentsList.querySelectorAll('.student-item');
            existingItems.forEach(item => item.remove());
            
            // Add students to list
            students.forEach(student => {
                addStudentToList(student);
            });
        } else {
            // Show empty state
            studentsList.innerHTML = `
                <div class="empty-state">
                    <p>No students have joined yet</p>
                    <p>Share the quiz code to get started</p>
                </div>
            `;
        }
    }
    
    // Add a student to the list
    function addStudentToList(student) {
        const studentEl = document.createElement('div');
        studentEl.className = 'student-item';
        studentEl.dataset.id = student.id;
        
        // Get initials for icon
        const nameParts = student.name.split(' ');
        const initials = nameParts.length > 1 
            ? (nameParts[0][0] + nameParts[1][0]).toUpperCase()
            : nameParts[0].substring(0, 2).toUpperCase();
        
        // Format join time
        const joinTime = formatTime(new Date(student.joinTime));
        
        studentEl.innerHTML = `
            <div class="student-icon">${initials}</div>
            <div class="student-info">
                <div class="student-name">${student.name}</div>
                <div class="student-email">${student.email}</div>
            </div>
            <div class="student-joined">${joinTime}</div>
        `;
        
        studentsList.appendChild(studentEl);
    }
    
    // Check for new students
    function checkForNewStudents() {
        // In a real app, this would make an API call to get the latest participants
        // For demo, we'll just check localStorage
        try {
            const quizzes = JSON.parse(localStorage.getItem('quizSync_quizzes') || '[]');
            const updatedQuiz = quizzes.find(quiz => quiz.id === quizId);
            
            if (updatedQuiz && updatedQuiz.participants) {
                // Check if there are new students
                if (updatedQuiz.participants.length > students.length) {
                    // Update our local data
                    currentQuiz = updatedQuiz;
                    // Update the UI
                    updateStudentsList();
                }
            }
        } catch (error) {
            console.error('Error checking for new students:', error);
        }
    }
    
    // Start the quiz
    function startQuiz() {
        if (students.length === 0) {
            alert('There are no students in the quiz. Please wait for students to join.');
            return;
        }
        
        // Update quiz status
        currentQuiz.status = 'active';
        currentQuiz.startTime = new Date().toISOString();
        
        // Save updated quiz
        saveQuizData();
        
        // Show success message
        alert('Quiz has been started! Students will now be redirected to the quiz page.');
        
        // In a real app, this would notify all connected students
        // For demo, we'll just redirect to a confirmation page
        window.location.href = `quiz_monitor.html?quiz=${quizId}`;
    }
    
    // Cancel the quiz
    function cancelQuiz() {
        if (!confirm('Are you sure you want to cancel this quiz? This action cannot be undone.')) {
            return;
        }
        
        // Update quiz status
        currentQuiz.status = 'cancelled';
        
        // Save updated quiz
        saveQuizData();
        
        // Redirect to dashboard
        alert('Quiz has been cancelled.');
        window.location.href = 'index.html';
    }
    
    // Save quiz data to localStorage
    function saveQuizData() {
        try {
            // Get all quizzes
            const quizzes = JSON.parse(localStorage.getItem('quizSync_quizzes') || '[]');
            
            // Find the index of the current quiz
            const quizIndex = quizzes.findIndex(quiz => quiz.id === quizId);
            
            if (quizIndex !== -1) {
                // Update the quiz
                quizzes[quizIndex] = currentQuiz;
                
                // Save back to localStorage
                localStorage.setItem('quizSync_quizzes', JSON.stringify(quizzes));
                console.log('Quiz data saved successfully.');
            }
        } catch (error) {
            console.error('Error saving quiz data:', error);
        }
    }
    
    // Setup event listeners
    function setupEventListeners() {
        // Copy quiz code button
        copyCodeBtn.addEventListener('click', function() {
            const code = quizCodeEl.textContent;
            navigator.clipboard.writeText(code)
                .then(() => {
                    copyCodeBtn.textContent = '✓ Copied';
                    setTimeout(() => {
                        copyCodeBtn.textContent = '📋 Copy';
                    }, 2000);
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    alert('Failed to copy code. Please try again.');
                });
        });
        
        // Start quiz button
        startQuizBtn.addEventListener('click', startQuiz);
        
        // Cancel quiz button
        cancelQuizBtn.addEventListener('click', cancelQuiz);
        
        // Profile button
        profileBtn.addEventListener('click', function() {
            const user = JSON.parse(localStorage.getItem('loggedInUser'));
            if (user) {
                profileNameEl.textContent = user.name;
                profileEmailEl.textContent = user.email;
            }
            profileModal.style.display = 'block';
        });
        
        // Close profile modal
        closeProfileBtn.addEventListener('click', function() {
            profileModal.style.display = 'none';
        });
        
        // Logout button
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
    }
    
    // Helper function to format time
    function formatTime(date) {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    // For demo purposes - simulate students joining
    function startStudentJoinSimulation() {
        // Only run this in demo mode and if we don't already have students
        if (students.length === 0) {
            // Add a few sample students with delay
            const sampleStudents = [
                {
                    id: 'student_1',
                    name: 'John Smith',
                    email: 'john.smith@example.com',
                    joinTime: new Date().toISOString()
                },
                {
                    id: 'student_2',
                    name: 'Emma Johnson',
                    email: 'emma.j@example.com',
                    joinTime: new Date(Date.now() + 3000).toISOString()
                },
                {
                    id: 'student_3',
                    name: 'Michael Brown',
                    email: 'michael.b@example.com',
                    joinTime: new Date(Date.now() + 7000).toISOString()
                }
            ];
            
            // Add first student immediately
            setTimeout(() => {
                currentQuiz.participants = currentQuiz.participants || [];
                currentQuiz.participants.push(sampleStudents[0]);
                updateStudentsList();
                saveQuizData();
            }, 1500);
            
            // Add second student after 5 seconds
            setTimeout(() => {
                currentQuiz.participants.push(sampleStudents[1]);
                updateStudentsList();
                saveQuizData();
            }, 5000);
            
            // Add third student after 10 seconds
            setTimeout(() => {
                currentQuiz.participants.push(sampleStudents[2]);
                updateStudentsList();
                saveQuizData();
            }, 10000);
        }
    }
    
    // Close modal function for the profile modal
    function closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }
    
    // Expose to global scope for the close button
    window.closeModal = closeModal;
}); 