// Join Quiz Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        // User is not logged in, redirect to home page
        alert('You need to be logged in to join a quiz.');
        window.location.href = '../home.html';
        return;
    }
    
    const joinQuizForm = document.getElementById('joinQuizForm');
    
    // Pre-fill user information from logged-in user data
    if (loggedInUser) {
        const user = JSON.parse(loggedInUser);
        if (document.getElementById('studentEmail')) {
            document.getElementById('studentEmail').value = user.email;
        }
        if (document.getElementById('studentName')) {
            document.getElementById('studentName').value = user.name;
        }
    }
    
    if (joinQuizForm) {
        joinQuizForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const quizCode = document.getElementById('quizCode').value.trim();
            const studentEmail = document.getElementById('studentEmail').value.trim();
            const studentName = document.getElementById('studentName').value.trim();
            
            // Basic validation
            if (!quizCode || !studentEmail || !studentName) {
                alert('Please fill in all fields');
                return;
            }
            
            // Store student info in localStorage for use in waiting room
            const studentInfo = {
                quizCode,
                studentEmail,
                studentName,
                joinTime: new Date().toISOString()
            };
            
            localStorage.setItem('quizSync_studentInfo', JSON.stringify(studentInfo));
            
            // In a real application, we would validate the quiz code with the server here
            // For now, we'll simulate a successful join and redirect to waiting room
            
            // Simulate checking if quiz code exists (in real app, this would be a server request)
            simulateQuizCodeValidation(quizCode)
                .then(quizData => {
                    // Store quiz data in localStorage
                    localStorage.setItem('quizSync_quizData', JSON.stringify(quizData));
                    
                    // Redirect to waiting room
                    window.location.href = 'waiting_room.html';
                })
                .catch(error => {
                    alert(error.message);
                });
        });
    }
});

// Simulate quiz code validation (in a real app, this would be a server request)
function simulateQuizCodeValidation(quizCode) {
    return new Promise((resolve, reject) => {
        // Simulate server delay
        setTimeout(() => {
            // For demo purposes, accept any non-empty code
            if (quizCode.length > 0) {
                // Mock quiz data
                const quizData = {
                    quizId: 'quiz_' + Math.random().toString(36).substr(2, 9),
                    quizName: 'Sample Quiz ' + quizCode,
                    teacherName: 'John Doe',
                    totalQuestions: 10,
                    timePerQuestion: 30, // seconds
                    quizCode: quizCode,
                    status: 'waiting' // waiting, active, completed
                };
                resolve(quizData);
            } else {
                reject(new Error('Invalid quiz code. Please check and try again.'));
            }
        }, 1000);
    });
} 