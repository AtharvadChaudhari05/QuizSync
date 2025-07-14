// Get the email and password entered by the user
const loginEmailElement = document.querySelector('.js-input-login-email')
const loginPasswordElement = document.querySelector('.js-input-login-password')

const loginButton = document.querySelector(".js-login-btn");
if (loginButton) {
  loginButton.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent form submission if inside a form
    const enteredEmail = loginEmailElement.value.trim();
    const enteredPassword = loginPasswordElement.value;

    // Find the user with the entered email
    const user = userData.find((data) => data.email === enteredEmail);

    if (user) {
      const userId = user.id; // Get the user's id

      // Find the user again by id (demonstrating use of id)
      const userById = userData.find((data) => data.id === userId);

      if (userById && userById.password === enteredPassword) {
        localStorage.setItem('loggedInUser', JSON.stringify(userById)); // Store user info
        alert("Login successful!");
        
        // Close the login modal
        closeModal('loginModal');
        
        // Update auth buttons if the function exists
        if (typeof updateAuthButtons === 'function') {
          updateAuthButtons();
        }
      } else {
        alert("Incorrect password.");
      }
    } else {
      alert("No user found with this email.");
    }
  });
}

