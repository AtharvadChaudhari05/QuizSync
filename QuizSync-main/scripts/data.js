let userData = [];
try {
  const storedData = localStorage.getItem("userData");
  if (storedData) {
    userData = JSON.parse(storedData);
  }
} catch (error) {
  console.error("Error loading user data from localStorage:", error);
  userData = []; // Fallback to empty array
}

function setupFormHandlers() {
  document.addEventListener("submit", function (event) {
    if (event.target.id === "signupForm") {
      event.preventDefault();

      // Get form values
      const name = document.querySelector(".js-input-signup-name").value.trim();
      const email = document
        .querySelector(".js-input-signup-email")
        .value.trim();
      const password = document.querySelector(
        ".js-input-signup-password"
      ).value;
      const confirmPassword = document.querySelector(
        ".js-input-signup-submit"
      ).value;

      // Basic validation
      if (!name || !email || !password || !confirmPassword) {
        alert("Please fill in all fields");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      // Check if email already exists
      const emailExists = userData.some((user) => user.email === email);
      if (emailExists) {
        alert("Email already registered");
        return;
      }

      // Create user object
      const userObj = {
        id: generateUniqueId(),
        name,
        email,
        password,
        registrationDate: new Date().toISOString(),
      };

      // Add to userData array
      userData.push(userObj);

      console.log("User data stored:", userObj);
      console.log("All users:", userData);

      // Save data to localStorage with error handling
      try {
        localStorage.setItem("userData", JSON.stringify(userData));
        console.log("Data saved to localStorage successfully");
      } catch (error) {
        console.error("Error saving to localStorage:", error);
        alert("Error saving data. Please try again.");
        return;
      }

      // Show success message
      alert("Account created successfully!");

      // Clear the form
      event.target.reset();

      // Close the modal
      closeModal("signupModal");

      // Reset password strength indicator
      const strengthIndicator = document.getElementById("passwordStrength");
      const strengthText = document.getElementById("strengthText");
      if (strengthIndicator) strengthIndicator.style.width = "0%";
      if (strengthText) strengthText.textContent = "Weak";
    }
  });
}

function generateUniqueId() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 8;
  let id;
  let attempts = 0;

  do {
    id = "";
    for (let i = 0; i < length; i++) {
      id += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    attempts++;
    console.log(`🔍 Checking if ID "${id}" is unique (attempt ${attempts})...`);
  } while (userData.some((user) => user.id === id));

  console.log(`✅ Unique ID generated: "${id}" after ${attempts} attempt(s)`);
  return id;
}

setupFormHandlers();

// Function to get all stored users (for testing/debugging)
function getAllUsers() {
  return userData;
}

// Function to find user by email
function findUserByEmail(email) {
  return userData.find((user) => user.email === email);
}

// Function to clear all user data (for testing)
function clearAllUsers() {
  userData = [];
  try {
    localStorage.removeItem("userData");
    console.log("All user data cleared from localStorage");
  } catch (error) {
    console.error("Error clearing localStorage:", error);
  }
}
