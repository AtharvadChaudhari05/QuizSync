// Results Page Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if results exist in localStorage
    const resultsString = localStorage.getItem('quizSync_results');
    const quizDataString = localStorage.getItem('quizSync_quizData');
    
    if (!resultsString || !quizDataString) {
        // If no results, redirect to join page
        alert('Quiz results not found. Please take a quiz first.');
        window.location.href = 'join_quiz.html';
        return;
    }
    
    const results = JSON.parse(resultsString);
    const quizData = JSON.parse(quizDataString);
    
    // Display quiz information
    document.getElementById('quizName').textContent = quizData.quizName;
    
    // Format and display date
    const quizDate = new Date(results.completedAt);
    const formattedDate = quizDate.toLocaleDateString() + ' ' + quizDate.toLocaleTimeString();
    document.getElementById('quizDate').textContent = formattedDate;
    
    // Display score
    document.getElementById('scoreValue').textContent = results.totalPoints;
    document.getElementById('totalQuestions').textContent = results.totalQuestions;
    document.getElementById('correctAnswers').textContent = results.correctAnswers;
    document.getElementById('scorePercentage').textContent = results.percentage + '%';
    
    // Apply animation to score circle based on percentage
    const scoreCircle = document.querySelector('.score-circle');
    if (scoreCircle) {
        // Add color based on score percentage
        if (results.percentage >= 90) {
            scoreCircle.style.background = 'linear-gradient(135deg, #1de9b6 0%, #5e7cff 100%)';
        } else if (results.percentage >= 70) {
            scoreCircle.style.background = 'linear-gradient(135deg, #fbbf24 0%, #5e7cff 100%)';
        } else if (results.percentage >= 50) {
            scoreCircle.style.background = 'linear-gradient(135deg, #fbbf24 0%, #fc466b 100%)';
        } else {
            scoreCircle.style.background = 'linear-gradient(135deg, #fc466b 0%, #324376 100%)';
        }
    }
    
    // Add event listeners for action buttons
    document.querySelector('.btn-home').addEventListener('click', function() {
        window.location.href = '../home.html';
    });
    
    document.querySelector('.btn-join').addEventListener('click', function() {
        window.location.href = 'join_quiz.html';
    });
}); 