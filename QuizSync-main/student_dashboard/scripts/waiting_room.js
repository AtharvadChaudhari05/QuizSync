// Waiting Room Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get student info from localStorage
    const studentInfo = JSON.parse(localStorage.getItem('quizSync_studentInfo') || '{}');
    const quizData = JSON.parse(localStorage.getItem('quizSync_quizData') || '{}');
    
    // DOM elements
    const quizNameEl = document.getElementById('quizName');
    const quizCodeEl = document.getElementById('quizCode');
    const teacherNameEl = document.getElementById('teacherName');
    const participantsList = document.getElementById('participantsList');
    
    // Initialize
    initializeWaitingRoom();
    
    function initializeWaitingRoom() {
        // Check if we have student info and quiz data
        if (!studentInfo.quizCode || !quizData.quizId) {
            alert('Missing quiz information. Redirecting to join page.');
            window.location.href = 'join_quiz.html';
            return;
        }
        
        // Display quiz info
        displayQuizInfo();
        
        // Add this student to quiz participants (in a real app, this would be done on the server)
        addStudentToQuiz();
        
        // Start polling for quiz status
        setInterval(checkQuizStatus, 3000);
    }
    
    function displayQuizInfo() {
        quizNameEl.textContent = quizData.quizName || 'Unknown Quiz';
        quizCodeEl.textContent = studentInfo.quizCode;
        teacherNameEl.textContent = quizData.teacherName || 'Unknown Teacher';
        
        // Add this student to the participants list
        addParticipant(studentInfo.studentName, new Date(studentInfo.joinTime));
    }
    
    function addStudentToQuiz() {
        try {
            // Get quizzes from localStorage
            const quizzes = JSON.parse(localStorage.getItem('quizSync_quizzes') || '[]');
            
            // Find the current quiz
            const quizIndex = quizzes.findIndex(quiz => quiz.secureCode === studentInfo.quizCode);
            
            if (quizIndex !== -1) {
                const quiz = quizzes[quizIndex];
                
                // Initialize participants array if not exists
                if (!quiz.participants) {
                    quiz.participants = [];
                }
                
                // Check if student already exists in participants
                const existingStudentIndex = quiz.participants.findIndex(
                    p => p.email === studentInfo.studentEmail
                );
                
                if (existingStudentIndex === -1) {
                    // Add student to participants
                    const student = {
                        id: 'student_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
                        name: studentInfo.studentName,
                        email: studentInfo.studentEmail,
                        joinTime: studentInfo.joinTime || new Date().toISOString()
                    };
                    
                    quiz.participants.push(student);
                    
                    // Save updated quiz
                    quizzes[quizIndex] = quiz;
                    localStorage.setItem('quizSync_quizzes', JSON.stringify(quizzes));
                }
            }
        } catch (error) {
            console.error('Error adding student to quiz:', error);
        }
    }
    
    function addParticipant(name, joinTime) {
        // Create participant element
        const participantEl = document.createElement('div');
        participantEl.className = 'participant';
        
        // Format time
        const timeStr = joinTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        participantEl.innerHTML = `
            <span class="participant-name">${name}</span>
            <span class="participant-time">${timeStr}</span>
        `;
        
        participantsList.appendChild(participantEl);
    }
    
    function checkQuizStatus() {
        try {
            // Get quizzes from localStorage
            const quizzes = JSON.parse(localStorage.getItem('quizSync_quizzes') || '[]');
            
            // Find the current quiz
            const quiz = quizzes.find(q => q.secureCode === studentInfo.quizCode);
            
            if (quiz) {
                // Check if quiz status has changed to active
                if (quiz.status === 'active') {
                    // Quiz has started, redirect to quiz page
                    localStorage.setItem('quizSync_currentQuizId', quiz.id);
                    
                    // Show message
                    alert('The quiz is starting now!');
                    
                    // Redirect to quiz page
                    window.location.href = 'quiz.html';
                } else if (quiz.status === 'cancelled') {
                    // Quiz has been cancelled
                    alert('This quiz has been cancelled by the teacher. Redirecting to join page.');
                    window.location.href = 'join_quiz.html';
                }
            }
        } catch (error) {
            console.error('Error checking quiz status:', error);
        }
    }
}); 