// AI Quiz Generator JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const loggedInUser = localStorage.getItem('loggedInUser');
    if (!loggedInUser) {
        // User is not logged in, redirect to home page
        alert('You need to be logged in to access the AI quiz generator.');
        window.location.href = '../home.html';
        return;
    }

    // DOM Elements
    const aiQuizForm = document.getElementById('ai-quiz-form');
    const generateBtn = document.getElementById('generate-btn');
    const btnText = document.querySelector('.btn-text');
    const btnLoading = document.querySelector('.btn-loading');
    const loadingDiv = document.getElementById('loading');
    const errorMessage = document.getElementById('error-message');

    // Form submission handler
    aiQuizForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(aiQuizForm);
        const quizData = {
            courseName: formData.get('course-name'),
            subjectName: formData.get('subject-name'),
            chapterName: formData.get('chapter-name'),
            questionCount: parseInt(formData.get('question-count'))
        };

        // Validate form data
        if (!validateForm(quizData)) {
            return;
        }

        // Show loading state
        showLoading(true);

        // Simulate AI generation (in a real app, this would call an AI API)
        setTimeout(() => {
            // Generate sample quiz questions
            const generatedQuiz = generateSampleQuiz(quizData);
            
            // Store the generated quiz data
            localStorage.setItem('generatedQuiz', JSON.stringify(generatedQuiz));
            
            // Navigate to the generated quiz page
            window.location.href = 'generated-quiz.html';
        }, 3000); // Simulate 3 seconds of AI processing
    });

    // Form validation
    function validateForm(data) {
        // Hide any previous error messages
        hideError();

        // Check if all fields are filled
        if (!data.courseName || !data.subjectName || !data.chapterName || !data.questionCount) {
            showError('Please fill in all required fields.');
            return false;
        }

        // Validate question count
        if (data.questionCount < 5 || data.questionCount > 30) {
            showError('Please select a valid number of questions (5-30).');
            return false;
        }

        return true;
    }

    // Show loading state
    function showLoading(show) {
        if (show) {
            generateBtn.disabled = true;
            btnText.style.display = 'none';
            btnLoading.style.display = 'inline';
            loadingDiv.style.display = 'block';
            hideError();
        } else {
            generateBtn.disabled = false;
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            loadingDiv.style.display = 'none';
        }
    }

    // Show error message
    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    }

    // Hide error message
    function hideError() {
        errorMessage.style.display = 'none';
    }

    // Generate sample quiz questions (simulating AI generation)
    function generateSampleQuiz(data) {
        const questions = [];
        
        // Get all available questions for this topic
        const availableQuestions = getAllQuestionsForTopic(data);
        
        // Shuffle the questions to randomize selection
        const shuffledQuestions = shuffleArray([...availableQuestions]);
        
        // Select unique questions up to the requested count
        const selectedQuestions = shuffledQuestions.slice(0, data.questionCount);
        
        // Generate questions with unique IDs
        for (let i = 0; i < selectedQuestions.length; i++) {
            const questionData = selectedQuestions[i];
            questions.push({
                id: `q${i + 1}`,
                type: 'multiple-choice',
                question: questionData.question,
                options: questionData.options,
                correctAnswer: questionData.correctAnswer,
                explanation: questionData.explanation
            });
        }

        return {
            title: `${data.courseName} - ${data.subjectName} Quiz`,
            courseName: data.courseName,
            subjectName: data.subjectName,
            chapterName: data.chapterName,
            questionCount: data.questionCount,
            questions: questions,
            generatedAt: new Date().toISOString(),
            secureCode: generateRandomCode()
        };
    }

    // Get all available questions for a specific topic
    function getAllQuestionsForTopic(data) {
        const questionDatabase = {
            'Computer Science': {
                'Programming': {
                    'Variables and Data Types': [
                        {
                            question: 'In a banking application, what data type would you use to store a customer\'s account balance?',
                            options: ['int', 'float', 'double', 'string'],
                            correctAnswer: 2,
                            explanation: 'Account balances require decimal precision for cents, so double is most appropriate for financial calculations.'
                        },
                        {
                            question: 'When building a social media app, which data type would you use to store a user\'s profile picture?',
                            options: ['string (file path)', 'int', 'boolean', 'char'],
                            correctAnswer: 0,
                            explanation: 'Profile pictures are stored as file paths or URLs, which are strings pointing to the actual image file.'
                        },
                        {
                            question: 'For an e-commerce website, what data type would you use to track if a product is in stock?',
                            options: ['int (quantity)', 'boolean (in stock/out of stock)', 'string (yes/no)', 'float (percentage)'],
                            correctAnswer: 1,
                            explanation: 'Boolean is most efficient for simple in-stock/out-of-stock status, while int would be used for actual quantity tracking.'
                        },
                        {
                            question: 'In a weather app, what data type would you use to store the current temperature?',
                            options: ['int', 'float', 'string', 'boolean'],
                            correctAnswer: 1,
                            explanation: 'Temperature often includes decimal points (e.g., 72.5°F), so float is the appropriate data type.'
                        },
                        {
                            question: 'For a student management system, what data type would you use to store a student\'s GPA?',
                            options: ['int', 'float', 'string', 'boolean'],
                            correctAnswer: 1,
                            explanation: 'GPA values like 3.75 require decimal precision, making float the correct choice.'
                        },
                        {
                            question: 'In a hospital management system, what data type would you use to store a patient\'s blood pressure reading?',
                            options: ['int', 'float', 'string', 'boolean'],
                            correctAnswer: 1,
                            explanation: 'Blood pressure readings like 120/80 require decimal precision, making float the appropriate data type.'
                        },
                        {
                            question: 'For a restaurant ordering system, what data type would you use to store the number of items in an order?',
                            options: ['int', 'float', 'string', 'boolean'],
                            correctAnswer: 0,
                            explanation: 'Item counts are whole numbers, so int is the most appropriate data type for storing quantities.'
                        },
                        {
                            question: 'In a flight booking system, what data type would you use to store whether a seat is available?',
                            options: ['int', 'float', 'string', 'boolean'],
                            correctAnswer: 3,
                            explanation: 'Seat availability is a true/false condition, making boolean the most efficient data type.'
                        },
                        {
                            question: 'For a music streaming app, what data type would you use to store the duration of a song in seconds?',
                            options: ['int', 'float', 'string', 'boolean'],
                            correctAnswer: 0,
                            explanation: 'Song duration in seconds is typically a whole number, so int is the appropriate data type.'
                        },
                        {
                            question: 'In a fitness tracking app, what data type would you use to store a user\'s weight?',
                            options: ['int', 'float', 'string', 'boolean'],
                            correctAnswer: 1,
                            explanation: 'Weight measurements often include decimal points (e.g., 70.5 kg), so float is the appropriate data type.'
                        }
                    ],
                    'Control Structures': [
                        {
                            question: 'In a login system, what control structure would you use to check if a user\'s password is correct?',
                            options: ['for loop', 'if-else statement', 'while loop', 'switch statement'],
                            correctAnswer: 1,
                            explanation: 'If-else statements are used to make decisions based on conditions, perfect for password validation.'
                        },
                        {
                            question: 'When processing a list of orders in an online store, which loop would you use to send confirmation emails to all customers?',
                            options: ['while loop', 'for loop', 'do-while loop', 'if statement'],
                            correctAnswer: 1,
                            explanation: 'For loops are ideal when you know the exact number of items (orders) to process.'
                        },
                        {
                            question: 'In a game, what control structure would you use to keep the game running until the player quits?',
                            options: ['for loop', 'if statement', 'while loop', 'switch statement'],
                            correctAnswer: 2,
                            explanation: 'While loops continue until a condition becomes false, perfect for game loops that run until the player quits.'
                        },
                        {
                            question: 'For a vending machine, what control structure would you use to handle different product selections (1=Coke, 2=Pepsi, 3=Water)?',
                            options: ['if-else chain', 'switch statement', 'for loop', 'while loop'],
                            correctAnswer: 1,
                            explanation: 'Switch statements efficiently handle multiple possible values, perfect for product selection menus.'
                        },
                        {
                            question: 'In a banking app, what would you use to exit a transaction if the account balance is insufficient?',
                            options: ['continue statement', 'break statement', 'return statement', 'exit function'],
                            correctAnswer: 2,
                            explanation: 'Return statements immediately exit the function, perfect for stopping transactions when conditions aren\'t met.'
                        },
                        {
                            question: 'In a traffic light system, what control structure would you use to cycle through red, yellow, and green lights?',
                            options: ['if-else chain', 'switch statement', 'for loop', 'while loop'],
                            correctAnswer: 1,
                            explanation: 'Switch statements efficiently handle multiple discrete states, perfect for traffic light cycling.'
                        },
                        {
                            question: 'For a password reset system, what control structure would you use to validate email format and send reset link?',
                            options: ['for loop', 'if-else statement', 'while loop', 'switch statement'],
                            correctAnswer: 1,
                            explanation: 'If-else statements are used to make decisions based on validation conditions.'
                        },
                        {
                            question: 'In a calculator app, what control structure would you use to handle different mathematical operations (+, -, *, /)?',
                            options: ['if-else chain', 'switch statement', 'for loop', 'while loop'],
                            correctAnswer: 1,
                            explanation: 'Switch statements efficiently handle multiple operation types, perfect for calculator functionality.'
                        },
                        {
                            question: 'For a file upload system, what control structure would you use to check file size and type before uploading?',
                            options: ['for loop', 'if-else statement', 'while loop', 'switch statement'],
                            correctAnswer: 1,
                            explanation: 'If-else statements are used to make decisions based on file validation conditions.'
                        },
                        {
                            question: 'In a music player, what control structure would you use to handle different playback controls (play, pause, stop, next)?',
                            options: ['if-else chain', 'switch statement', 'for loop', 'while loop'],
                            correctAnswer: 1,
                            explanation: 'Switch statements efficiently handle multiple control commands, perfect for media player functionality.'
                        }
                    ],
                    'Functions': [
                        {
                            question: 'In an e-commerce website, what function would you create to calculate the total price including tax and shipping?',
                            options: ['calculateTotal()', 'displayPrice()', 'validateOrder()', 'processPayment()'],
                            correctAnswer: 0,
                            explanation: 'calculateTotal() would take item prices, tax rate, and shipping cost as parameters and return the final total.'
                        },
                        {
                            question: 'For a social media app, what function would you use to validate a user\'s email format?',
                            options: ['sendEmail()', 'validateEmail()', 'createUser()', 'loginUser()'],
                            correctAnswer: 1,
                            explanation: 'validateEmail() would check if the email contains @ symbol, proper domain format, and return true/false.'
                        },
                        {
                            question: 'In a banking application, what function would you create to transfer money between accounts?',
                            options: ['transferMoney(fromAccount, toAccount, amount)', 'checkBalance(account)', 'withdrawMoney(account, amount)', 'depositMoney(account, amount)'],
                            correctAnswer: 0,
                            explanation: 'transferMoney() would take source account, destination account, and amount as parameters to perform the transfer.'
                        },
                        {
                            question: 'For a weather app, what function would you use to convert Celsius to Fahrenheit?',
                            options: ['getWeather()', 'convertTemperature(celsius)', 'displayForecast()', 'updateLocation()'],
                            correctAnswer: 1,
                            explanation: 'convertTemperature() would take a Celsius value as parameter and return the Fahrenheit equivalent using the formula F = (C × 9/5) + 32.'
                        },
                        {
                            question: 'In a student management system, what function would you create to calculate a student\'s GPA?',
                            options: ['calculateGPA(grades)', 'displayGrades()', 'addStudent()', 'updateRecord()'],
                            correctAnswer: 0,
                            explanation: 'calculateGPA() would take an array of grades as parameter and return the calculated GPA based on grade points and credit hours.'
                        },
                        {
                            question: 'For a fitness tracking app, what function would you create to calculate BMI (Body Mass Index)?',
                            options: ['calculateBMI(weight, height)', 'trackWorkout()', 'setGoal()', 'displayStats()'],
                            correctAnswer: 0,
                            explanation: 'calculateBMI() would take weight and height as parameters and return BMI using the formula BMI = weight / (height²).'
                        },
                        {
                            question: 'In a restaurant management system, what function would you create to calculate tip amount?',
                            options: ['calculateTip(bill, percentage)', 'processPayment()', 'displayMenu()', 'takeOrder()'],
                            correctAnswer: 0,
                            explanation: 'calculateTip() would take bill amount and tip percentage as parameters and return the tip amount.'
                        },
                        {
                            question: 'For a car rental system, what function would you create to calculate rental cost?',
                            options: ['calculateRentalCost(days, rate)', 'bookCar()', 'checkAvailability()', 'processPayment()'],
                            correctAnswer: 0,
                            explanation: 'calculateRentalCost() would take number of days and daily rate as parameters and return the total rental cost.'
                        },
                        {
                            question: 'In a library management system, what function would you create to calculate overdue fines?',
                            options: ['calculateFine(daysOverdue, dailyRate)', 'checkOutBook()', 'returnBook()', 'searchBooks()'],
                            correctAnswer: 0,
                            explanation: 'calculateFine() would take days overdue and daily fine rate as parameters and return the total fine amount.'
                        },
                        {
                            question: 'For a hotel booking system, what function would you create to calculate room rates with discounts?',
                            options: ['calculateRoomRate(baseRate, discount)', 'bookRoom()', 'checkAvailability()', 'processPayment()'],
                            correctAnswer: 0,
                            explanation: 'calculateRoomRate() would take base rate and discount percentage as parameters and return the final room rate.'
                        }
                    ]
                },
                'Data Structures': {
                    'Arrays': [
                        {
                            question: 'In a shopping cart system, what data structure would you use to store the list of items a customer wants to buy?',
                            options: ['Single variable', 'Array of items', 'Database table', 'Text file'],
                            correctAnswer: 1,
                            explanation: 'An array of items allows you to store multiple products, their quantities, and prices in an organized way.'
                        },
                        {
                            question: 'For a leaderboard in a gaming app, how would you store the top 10 player scores?',
                            options: ['10 separate variables', 'Array of 10 elements', 'Database only', 'Text file'],
                            correctAnswer: 1,
                            explanation: 'An array of 10 elements is perfect for storing and sorting the top 10 scores efficiently.'
                        },
                        {
                            question: 'In a calendar application, how would you represent a week\'s schedule with 7 days?',
                            options: ['7 separate variables', 'Array with 7 elements', 'Database table', 'Object with 7 properties'],
                            correctAnswer: 1,
                            explanation: 'An array with 7 elements (index 0-6) is ideal for storing daily schedules in a structured way.'
                        },
                        {
                            question: 'For a music playlist app, what data structure would you use to store the order of songs?',
                            options: ['Random variables', 'Array of song objects', 'Single string', 'Database only'],
                            correctAnswer: 1,
                            explanation: 'An array of song objects maintains the order and allows easy navigation (next/previous song).'
                        },
                        {
                            question: 'In a restaurant menu system, how would you store the available dishes and their prices?',
                            options: ['Two separate arrays', '2D array (dishes and prices)', 'Single string', 'Database only'],
                            correctAnswer: 1,
                            explanation: 'A 2D array allows you to store dish names in one column and prices in another, maintaining the relationship.'
                        }
                    ]
                }
            },
            'Mathematics': {
                'Algebra': {
                    'Linear Equations': [
                        {
                            question: 'A taxi charges $2.50 base fare plus $1.20 per mile. If you paid $15.70, how many miles did you travel?',
                            options: ['8 miles', '9 miles', '10 miles', '11 miles'],
                            correctAnswer: 2,
                            explanation: 'Set up equation: 2.50 + 1.20x = 15.70. Subtract 2.50: 1.20x = 13.20. Divide by 1.20: x = 11 miles.'
                        },
                        {
                            question: 'A cell phone plan costs $40 per month plus $0.10 per text message. If your bill was $52, how many texts did you send?',
                            options: ['100 texts', '110 texts', '120 texts', '130 texts'],
                            correctAnswer: 2,
                            explanation: 'Set up equation: 40 + 0.10x = 52. Subtract 40: 0.10x = 12. Divide by 0.10: x = 120 texts.'
                        },
                        {
                            question: 'A car rental costs $25 per day plus $0.15 per mile. If you paid $67 for a 2-day rental, how many miles did you drive?',
                            options: ['100 miles', '110 miles', '113 miles', '120 miles'],
                            correctAnswer: 2,
                            explanation: 'Set up equation: 2(25) + 0.15x = 67. Simplify: 50 + 0.15x = 67. Subtract 50: 0.15x = 17. Divide by 0.15: x = 113.33 miles.'
                        },
                        {
                            question: 'A gym membership costs $30 per month plus a $50 joining fee. If you paid $170 total for 4 months, what was the joining fee?',
                            options: ['$40', '$50', '$60', '$70'],
                            correctAnswer: 1,
                            explanation: 'Set up equation: 50 + 4(30) = 170. Simplify: 50 + 120 = 170. The joining fee was $50.'
                        },
                        {
                            question: 'A pizza delivery charges $3 base fee plus $2 per mile. If delivery cost $11, how far was the delivery?',
                            options: ['3 miles', '4 miles', '5 miles', '6 miles'],
                            correctAnswer: 1,
                            explanation: 'Set up equation: 3 + 2x = 11. Subtract 3: 2x = 8. Divide by 2: x = 4 miles.'
                        },
                        {
                            question: 'A parking garage charges $5 for the first hour and $2 for each additional hour. If you paid $13, how long did you park?',
                            options: ['3 hours', '4 hours', '5 hours', '6 hours'],
                            correctAnswer: 2,
                            explanation: 'Set up equation: 5 + 2(x-1) = 13. Simplify: 5 + 2x - 2 = 13. 2x + 3 = 13. 2x = 10. x = 5 hours.'
                        },
                        {
                            question: 'A movie theater charges $8 for adults and $5 for children. If a family paid $26 for 4 tickets, how many adults were there?',
                            options: ['1 adult', '2 adults', '3 adults', '4 adults'],
                            correctAnswer: 1,
                            explanation: 'Let x = adults, then (4-x) = children. Set up equation: 8x + 5(4-x) = 26. Simplify: 8x + 20 - 5x = 26. 3x = 6. x = 2 adults.'
                        },
                        {
                            question: 'A coffee shop charges $3 for a basic coffee and $0.50 for each extra shot. If you paid $5, how many extra shots did you get?',
                            options: ['2 shots', '3 shots', '4 shots', '5 shots'],
                            correctAnswer: 2,
                            explanation: 'Set up equation: 3 + 0.50x = 5. Subtract 3: 0.50x = 2. Divide by 0.50: x = 4 extra shots.'
                        },
                        {
                            question: 'A bike rental costs $15 for the first day and $8 for each additional day. If you paid $39, how many days did you rent?',
                            options: ['3 days', '4 days', '5 days', '6 days'],
                            correctAnswer: 1,
                            explanation: 'Set up equation: 15 + 8(x-1) = 39. Simplify: 15 + 8x - 8 = 39. 8x + 7 = 39. 8x = 32. x = 4 days.'
                        },
                        {
                            question: 'A tutoring service charges $20 per hour with a $10 registration fee. If you paid $90 total for 4 hours, what was the registration fee?',
                            options: ['$5', '$10', '$15', '$20'],
                            correctAnswer: 1,
                            explanation: 'Set up equation: 10 + 4(20) = 90. Simplify: 10 + 80 = 90. The registration fee was $10.'
                        }
                    ],
                    'Quadratic Equations': [
                        {
                            question: 'A ball is thrown upward from a height of 5 feet with initial velocity of 48 ft/s. The height h(t) = -16t² + 48t + 5. When does the ball hit the ground?',
                            options: ['1 second', '2 seconds', '3 seconds', '4 seconds'],
                            correctAnswer: 2,
                            explanation: 'Set h(t) = 0: -16t² + 48t + 5 = 0. Use quadratic formula: t = (-48 ± √(48² - 4(-16)(5))) / 2(-16). t ≈ 3.1 seconds.'
                        },
                        {
                            question: 'A rectangular garden has a perimeter of 60 feet. If the area is 200 square feet, what are the dimensions?',
                            options: ['10 ft × 20 ft', '15 ft × 15 ft', '12 ft × 18 ft', '8 ft × 25 ft'],
                            correctAnswer: 0,
                            explanation: 'Let x = width, then length = 30-x. Area = x(30-x) = 200. Solve: x² - 30x + 200 = 0. x = 10 or 20. Dimensions are 10×20 ft.'
                        },
                        {
                            question: 'A company\'s profit P(x) = -x² + 100x - 800, where x is units sold. How many units must be sold to break even?',
                            options: ['20 units', '40 units', '60 units', '80 units'],
                            correctAnswer: 1,
                            explanation: 'Break even when P(x) = 0: -x² + 100x - 800 = 0. Use quadratic formula: x = (-100 ± √(100² - 4(-1)(-800))) / 2(-1). x = 20 or 80. Break even at 20 units.'
                        },
                        {
                            question: 'A rocket\'s height h(t) = -4.9t² + 98t. When does it reach maximum height?',
                            options: ['5 seconds', '10 seconds', '15 seconds', '20 seconds'],
                            correctAnswer: 1,
                            explanation: 'Maximum height occurs at vertex. t = -b/(2a) = -98/(2(-4.9)) = 10 seconds.'
                        },
                        {
                            question: 'A rectangular picture frame has an area of 120 square inches. If the length is 4 inches more than the width, what are the dimensions?',
                            options: ['8 in × 12 in', '10 in × 14 in', '12 in × 16 in', '6 in × 10 in'],
                            correctAnswer: 0,
                            explanation: 'Let x = width, then length = x + 4. Area = x(x + 4) = 120. Solve: x² + 4x - 120 = 0. x = 8 or -15. Dimensions are 8×12 inches.'
                        }
                    ]
                },
                'Calculus': {
                    'Derivatives': [
                        {
                            question: 'What is the derivative of x²?',
                            options: ['x', '2x', 'x³', '2x²'],
                            correctAnswer: 1,
                            explanation: 'The derivative of x² is 2x using the power rule: d/dx(xⁿ) = nxⁿ⁻¹.'
                        },
                        {
                            question: 'What is the derivative of a constant?',
                            options: ['The constant itself', '0', '1', 'Undefined'],
                            correctAnswer: 1,
                            explanation: 'The derivative of any constant is 0 because constants do not change with respect to x.'
                        },
                        {
                            question: 'What is the derivative of sin(x)?',
                            options: ['cos(x)', '-sin(x)', 'tan(x)', 'sec(x)'],
                            correctAnswer: 0,
                            explanation: 'The derivative of sin(x) is cos(x).'
                        },
                        {
                            question: 'What is the derivative of eˣ?',
                            options: ['eˣ', 'xeˣ', 'eˣ⁻¹', 'ln(x)'],
                            correctAnswer: 0,
                            explanation: 'The derivative of eˣ is eˣ itself.'
                        },
                        {
                            question: 'What is the derivative of ln(x)?',
                            options: ['1/x', 'x', '1', 'eˣ'],
                            correctAnswer: 0,
                            explanation: 'The derivative of ln(x) is 1/x.'
                        }
                    ]
                }
            },
            'Physics': {
                'Mechanics': {
                    'Newton\'s Laws': [
                        {
                            question: 'A car with mass 1500 kg accelerates at 2 m/s². What force is required?',
                            options: ['750 N', '1500 N', '3000 N', '4500 N'],
                            correctAnswer: 2,
                            explanation: 'F = ma = 1500 kg × 2 m/s² = 3000 N. This is the force needed to accelerate the car.'
                        },
                        {
                            question: 'A 60 kg person stands on a bathroom scale. What force does the scale read?',
                            options: ['60 N', '600 N', '588 N', '6000 N'],
                            correctAnswer: 2,
                            explanation: 'Weight = mg = 60 kg × 9.8 m/s² = 588 N. The scale reads the normal force, which equals the weight.'
                        },
                        {
                            question: 'A rocket exerts 5000 N of thrust. If the rocket has mass 1000 kg, what is its acceleration?',
                            options: ['2 m/s²', '5 m/s²', '10 m/s²', '20 m/s²'],
                            correctAnswer: 1,
                            explanation: 'a = F/m = 5000 N / 1000 kg = 5 m/s². This is the rocket\'s acceleration upward.'
                        },
                        {
                            question: 'A 0.5 kg ball is thrown with 20 N of force. What is the ball\'s acceleration?',
                            options: ['10 m/s²', '20 m/s²', '40 m/s²', '100 m/s²'],
                            correctAnswer: 2,
                            explanation: 'a = F/m = 20 N / 0.5 kg = 40 m/s². This is the ball\'s initial acceleration.'
                        },
                        {
                            question: 'A truck with mass 2000 kg needs to accelerate at 1.5 m/s². What force is required?',
                            options: ['1500 N', '2000 N', '3000 N', '4000 N'],
                            correctAnswer: 2,
                            explanation: 'F = ma = 2000 kg × 1.5 m/s² = 3000 N. This is the force needed to accelerate the truck.'
                        }
                    ],
                    'Kinematics': [
                        {
                            question: 'A car travels 120 km in 2 hours. What is its average speed?',
                            options: ['40 km/h', '50 km/h', '60 km/h', '70 km/h'],
                            correctAnswer: 2,
                            explanation: 'Average speed = distance/time = 120 km / 2 hours = 60 km/h.'
                        },
                        {
                            question: 'A runner accelerates from rest to 10 m/s in 5 seconds. What is the acceleration?',
                            options: ['1 m/s²', '2 m/s²', '5 m/s²', '10 m/s²'],
                            correctAnswer: 1,
                            explanation: 'a = (v - u)/t = (10 m/s - 0 m/s) / 5 s = 2 m/s².'
                        },
                        {
                            question: 'A train travels 300 km in 4 hours. What is its average velocity?',
                            options: ['60 km/h', '75 km/h', '80 km/h', '100 km/h'],
                            correctAnswer: 1,
                            explanation: 'Average velocity = displacement/time = 300 km / 4 hours = 75 km/h.'
                        },
                        {
                            question: 'A ball is dropped from a height of 20 meters. How long does it take to hit the ground? (g = 9.8 m/s²)',
                            options: ['1 second', '2 seconds', '3 seconds', '4 seconds'],
                            correctAnswer: 1,
                            explanation: 'Using h = ½gt²: 20 = ½(9.8)t². Solve: t² = 4.08, t ≈ 2 seconds.'
                        },
                        {
                            question: 'A cyclist travels 15 km north in 30 minutes, then 10 km east in 20 minutes. What is the average speed for the entire trip?',
                            options: ['25 km/h', '30 km/h', '35 km/h', '40 km/h'],
                            correctAnswer: 1,
                            explanation: 'Total distance = 15 + 10 = 25 km. Total time = 30 + 20 = 50 minutes = 5/6 hours. Average speed = 25 km / (5/6 h) = 30 km/h.'
                        }
                    ]
                },
                'Thermodynamics': {
                    'Heat and Temperature': [
                        {
                            question: 'What is the SI unit of temperature?',
                            options: ['Fahrenheit', 'Celsius', 'Kelvin', 'Rankine'],
                            correctAnswer: 2,
                            explanation: 'The SI unit of temperature is Kelvin (K).'
                        },
                        {
                            question: 'What is the difference between heat and temperature?',
                            options: ['Heat is energy, temperature is a measure', 'Temperature is energy, heat is a measure', 'They are the same thing', 'Heat is always higher'],
                            correctAnswer: 0,
                            explanation: 'Heat is a form of energy, while temperature is a measure of the average kinetic energy of particles.'
                        },
                        {
                            question: 'What is the SI unit of heat energy?',
                            options: ['Watt', 'Joule', 'Calorie', 'Newton'],
                            correctAnswer: 1,
                            explanation: 'The SI unit of heat energy is the Joule (J).'
                        },
                        {
                            question: 'What is thermal expansion?',
                            options: ['The increase in volume with temperature', 'The decrease in volume with temperature', 'The change in mass with temperature', 'The change in color with temperature'],
                            correctAnswer: 0,
                            explanation: 'Thermal expansion is the tendency of matter to change in volume in response to a change in temperature.'
                        },
                        {
                            question: 'What is the first law of thermodynamics?',
                            options: ['Energy cannot be created or destroyed', 'Entropy always increases', 'Heat flows from hot to cold', 'Pressure and volume are inversely related'],
                            correctAnswer: 0,
                            explanation: 'The first law of thermodynamics states that energy cannot be created or destroyed, only transferred or converted.'
                        }
                    ]
                }
            },
            'Chemistry': {
                'Atomic Structure': [
                    {
                        question: 'What is the atomic number of an element?',
                        options: ['The number of neutrons', 'The number of protons', 'The number of electrons', 'The total number of particles'],
                        correctAnswer: 1,
                        explanation: 'The atomic number is the number of protons in the nucleus of an atom.'
                    },
                    {
                        question: 'What is the mass number of an atom?',
                        options: ['The number of protons', 'The number of neutrons', 'The sum of protons and neutrons', 'The number of electrons'],
                        correctAnswer: 2,
                        explanation: 'The mass number is the sum of protons and neutrons in the nucleus.'
                    },
                    {
                        question: 'What are isotopes?',
                        options: ['Atoms with different numbers of protons', 'Atoms with different numbers of neutrons', 'Atoms with different numbers of electrons', 'Atoms of different elements'],
                        correctAnswer: 1,
                        explanation: 'Isotopes are atoms of the same element with different numbers of neutrons.'
                    },
                    {
                        question: 'What is the charge of an electron?',
                        options: ['Positive', 'Negative', 'Neutral', 'Variable'],
                        correctAnswer: 1,
                        explanation: 'Electrons carry a negative electrical charge.'
                    },
                    {
                        question: 'What is the nucleus of an atom composed of?',
                        options: ['Protons and electrons', 'Protons and neutrons', 'Neutrons and electrons', 'Only protons'],
                        correctAnswer: 1,
                        explanation: 'The nucleus contains protons and neutrons, while electrons orbit around it.'
                    }
                ],
                'Chemical Bonding': [
                    {
                        question: 'What is an ionic bond?',
                        options: ['Sharing of electrons', 'Transfer of electrons', 'Sharing of protons', 'Transfer of neutrons'],
                        correctAnswer: 1,
                        explanation: 'An ionic bond is formed by the transfer of electrons from one atom to another.'
                    },
                    {
                        question: 'What is a covalent bond?',
                        options: ['Sharing of electrons', 'Transfer of electrons', 'Sharing of protons', 'Transfer of neutrons'],
                        correctAnswer: 0,
                        explanation: 'A covalent bond is formed by the sharing of electrons between atoms.'
                    },
                    {
                        question: 'What type of bond is formed between sodium and chlorine in NaCl?',
                        options: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'],
                        correctAnswer: 1,
                        explanation: 'NaCl forms an ionic bond because sodium donates an electron to chlorine.'
                    },
                    {
                        question: 'What is a polar covalent bond?',
                        options: ['Equal sharing of electrons', 'Unequal sharing of electrons', 'Complete transfer of electrons', 'No sharing of electrons'],
                        correctAnswer: 1,
                        explanation: 'A polar covalent bond involves unequal sharing of electrons between atoms.'
                    },
                    {
                        question: 'What is the octet rule?',
                        options: ['Atoms tend to gain 8 electrons', 'Atoms tend to have 8 valence electrons', 'Atoms tend to lose 8 electrons', 'Atoms tend to share 8 electrons'],
                        correctAnswer: 1,
                        explanation: 'The octet rule states that atoms tend to gain, lose, or share electrons to achieve 8 valence electrons.'
                    }
                ]
            }
        };

        // Try to get specific questions based on the input data
        let specificQuestions = null;
        try {
            specificQuestions = questionDatabase[data.courseName]?.[data.subjectName]?.[data.chapterName];
        } catch (e) {
            // If specific questions not found, continue with generic generation
        }

        // If we have specific questions for this topic, return them
        if (specificQuestions && specificQuestions.length > 0) {
            return specificQuestions;
        }

        // If no specific questions found, return generic questions
        return generateIntelligentGenericQuestions(data);
    }

    // Generate intelligent generic questions when specific questions are not available
    function generateIntelligentGenericQuestions(data) {
        return [
            {
                question: `What is the primary focus of ${data.chapterName} in ${data.subjectName}?`,
                options: [
                    'Basic principles and fundamentals',
                    'Advanced applications and techniques',
                    'Historical development and background',
                    'Practical implementation and tools'
                ],
                correctAnswer: 0,
                explanation: `${data.chapterName} primarily focuses on the basic principles and fundamental concepts that form the foundation of ${data.subjectName}.`
            },
            {
                question: `Which of the following best describes the importance of ${data.chapterName}?`,
                options: [
                    'It is optional for understanding the subject',
                    'It provides essential foundational knowledge',
                    'It is only useful for advanced students',
                    'It has no practical applications'
                ],
                correctAnswer: 1,
                explanation: `${data.chapterName} provides essential foundational knowledge that is crucial for understanding ${data.subjectName}.`
            },
            {
                question: `What type of knowledge does ${data.chapterName} primarily deal with?`,
                options: [
                    'Theoretical concepts and principles',
                    'Practical skills and techniques',
                    'Historical facts and dates',
                    'Mathematical formulas only'
                ],
                correctAnswer: 0,
                explanation: `${data.chapterName} primarily deals with theoretical concepts and principles that are fundamental to ${data.subjectName}.`
            },
            {
                question: `How does ${data.chapterName} relate to the broader field of ${data.subjectName}?`,
                options: [
                    'It is completely independent',
                    'It serves as a building block for other topics',
                    'It is only relevant to this specific chapter',
                    'It has no connection to other areas'
                ],
                correctAnswer: 1,
                explanation: `${data.chapterName} serves as a building block for other topics within ${data.subjectName}, providing essential knowledge for further study.`
            },
            {
                question: `What is the main learning objective of studying ${data.chapterName}?`,
                options: [
                    'To memorize facts and figures',
                    'To understand core concepts and principles',
                    'To complete assignments quickly',
                    'To pass examinations only'
                ],
                correctAnswer: 1,
                explanation: `The main learning objective of studying ${data.chapterName} is to understand the core concepts and principles that are fundamental to ${data.subjectName}.`
            }
        ];
    }

    // Shuffle array function to randomize question selection
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }



    // Generate random code for quiz
    function generateRandomCode(length = 6) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
}); 