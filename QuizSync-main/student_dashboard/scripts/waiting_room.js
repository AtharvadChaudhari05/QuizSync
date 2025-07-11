// Waiting Room Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if student info exists in localStorage
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
    
    // Display quiz information
    document.getElementById('quizName').textContent = quizData.quizName;
    document.getElementById('quizCode').textContent = quizData.quizCode;
    document.getElementById('teacherName').textContent = quizData.teacherName;
    
    // Add current student to participants list
    addParticipant(studentInfo.studentName, true); // true = current user
    
    // Simulate other participants joining (in a real app, this would be from server)
    simulateParticipants();
    
    // Start polling for quiz status (in a real app, this would be using WebSockets)
    startPollingQuizStatus();
});

// Add a participant to the list
function addParticipant(name, isCurrentUser = false) {
    const participantsList = document.getElementById('participantsList');
    
    const participantItem = document.createElement('div');
    participantItem.className = 'participant-item';
    
    const participantDot = document.createElement('div');
    participantDot.className = 'participant-dot';
    
    const participantName = document.createElement('div');
    participantName.textContent = name + (isCurrentUser ? ' (You)' : '');
    
    participantItem.appendChild(participantDot);
    participantItem.appendChild(participantName);
    
    participantsList.appendChild(participantItem);
}

// Simulate other participants joining (for demo purposes)
function simulateParticipants() {
    const mockNames = [
        'Alice Smith', 
        'Bob Johnson', 
        'Carol Williams', 
        'David Brown', 
        'Emma Davis'
    ];
    
    let delay = 2000; // Start after 2 seconds
    
    mockNames.forEach(name => {
        setTimeout(() => {
            addParticipant(name);
        }, delay);
        delay += Math.floor(Math.random() * 3000) + 1000; // Random delay between 1-4 seconds
    });
}

// Poll for quiz status (in a real app, this would be using WebSockets)
function startPollingQuizStatus() {
    // Simulate quiz starting after a random time between 10-20 seconds
    const startDelay = Math.floor(Math.random() * 10000) + 10000;
    
    setTimeout(() => {
        // Update quiz status in localStorage
        const quizData = JSON.parse(localStorage.getItem('quizSync_quizData'));
        quizData.status = 'active';
        localStorage.setItem('quizSync_quizData', JSON.stringify(quizData));
        
        // Show a message that quiz is starting
        const waitingAnimation = document.querySelector('.waiting-animation');
        if (waitingAnimation) {
            waitingAnimation.innerHTML = '<div class="spinner"></div><p>Quiz is starting...</p>';
        }
        
        // Redirect to quiz page after 2 seconds
        setTimeout(() => {
            window.location.href = 'quiz.html';
        }, 2000);
    }, startDelay);
} 