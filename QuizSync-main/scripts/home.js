// Modal functionality
function openModal(modalType) {
  let modalId = "";
  if (modalType === "login") modalId = "loginModal";
  else if (modalType === "signup") modalId = "signupModal";
  else if (modalType === "joinQuiz") modalId = "joinQuizModal";
  if (modalId) document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function switchModal(fromModal, toModal) {
  closeModal(fromModal);
  openModal(
    toModal === "loginModal"
      ? "login"
      : toModal === "signupModal"
      ? "signup"
      : toModal
  );
}
// Close modal when clicking outside
window.onclick = function (event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};

// Function to check if user is logged in and handle accordingly
function checkLoginAndProceed(action) {
  const loggedInUser = localStorage.getItem('loggedInUser');
  if (!loggedInUser) {
    // Create and show auth required modal
    showAuthRequiredModal(action);
    return false;
  }
  return true;
}

// Function to show auth required modal
function showAuthRequiredModal(action) {
  // Create modal if it doesn't exist
  if (!document.getElementById('authRequiredModal')) {
    const modal = document.createElement('div');
    modal.id = 'authRequiredModal';
    modal.className = 'modal';
    
    modal.innerHTML = `
      <div class="modal-content">
        <div class="modal-form-section">
          <button class="close" onclick="closeModal('authRequiredModal')">&times;</button>
          <div class="modal-header">
            <h2>Authentication Required</h2>
            <p>You need to create an account to ${action === 'join' ? 'join' : 'create'} a quiz.</p>
          </div>
          <div class="modal-body" style="text-align: center; padding: 20px;">
            <p>Please sign up or log in to continue.</p>
            <div style="display: flex; gap: 20px; justify-content: center; margin-top: 24px;">
              <button class="form-submit" onclick="switchModal('authRequiredModal', 'signupModal')" 
                style="background: linear-gradient(90deg, #667eea, #764ba2); padding: 12px 24px; font-size: 16px; min-width: 140px; font-weight: bold;">Sign Up</button>
              <button class="form-submit" onclick="switchModal('authRequiredModal', 'loginModal')"
                style="padding: 12px 24px; font-size: 16px; min-width: 140px; font-weight: bold;">Login</button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
  }
  
  // Display the modal
  document.getElementById('authRequiredModal').style.display = 'block';
}

// Join Quiz button - check login first
function joinQuiz() {
  if (checkLoginAndProceed('join')) {
    window.location.href = "student_dashboard/join_quiz.html";
  }
}

// Create Quiz button - check login first
function createQuiz() {
  if (checkLoginAndProceed('create')) {
    // Instead of redirecting to teacher dashboard, show a message
    showFeatureUnavailableModal('create');
  }
}

// Function to show feature unavailable modal
function showFeatureUnavailableModal(feature) {
  // Redirect to teacher dashboard instead of showing "coming soon" message
  window.location.href = "teacher dashboard/index.html";
}

// Join Quiz Modal submit
function submitJoinQuiz() {
  const code = document.getElementById("quizCodeInput").value.trim();
  if (!code) {
    document.getElementById("quizCodeInput").style.borderColor = "#ef4444";
    document.getElementById("quizCodeInput").placeholder =
      "Please enter a code!";
    return;
  }
  document.getElementById("quizCodeInput").style.borderColor = "#10b981";
  // Redirect to student dashboard join quiz page
  window.location.href = "student_dashboard/join_quiz.html";
  closeModal("joinQuizModal");
}
// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});
// Animation on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);
// Observe feature cards for animation
document.querySelectorAll(".feature-card").forEach((card) => {
  observer.observe(card);
});
// Animation on scroll for sections
function revealSectionsOnScroll() {
  document.querySelectorAll(".section, .quiz-section").forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top < window.innerHeight - 80) {
      section.classList.add("visible");
    }
  });
}
window.addEventListener("scroll", revealSectionsOnScroll);
window.addEventListener("DOMContentLoaded", revealSectionsOnScroll);
// Password strength logic for signup
function getPasswordStrength(password) {
  let score = 0;
  if (!password) return 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function updatePasswordStrength() {
  const password = document.getElementById("signupPassword").value;
  const strengthBar = document.getElementById("passwordStrength");
  const strengthText = document.getElementById("strengthText");
  const score = getPasswordStrength(password);
  let width = "0%";
  let color = "#ef4444";
  let text = "Weak";
  if (score === 1) {
    width = "20%";
    color = "#ef4444";
    text = "Very Weak";
  } else if (score === 2) {
    width = "40%";
    color = "#f59e42";
    text = "Weak";
  } else if (score === 3) {
    width = "60%";
    color = "#fbbf24";
    text = "Moderate";
  } else if (score === 4) {
    width = "80%";
    color = "#10b981";
    text = "Strong";
  } else if (score === 5) {
    width = "100%";
    color = "#2563eb";
    text = "Very Strong";
  }
  strengthBar.style.width = width;
  strengthBar.style.background = color;
  strengthText.textContent = text;
}
document
  .getElementById("signupPassword")
  .addEventListener("input", updatePasswordStrength);


  
// Password visibility toggle functionality for all password fields
function setupPasswordVisibilityToggles() {
  // Find all toggle buttons
  const toggleButtons = document.querySelectorAll(
    ".toggle-password-visibility"
  );
  toggleButtons.forEach(function (toggleBtn) {
    // Find the previous sibling input[type=password] (or text)
    let passwordInput = toggleBtn.previousElementSibling;
    // If the previous sibling is not an input, search within the parent
    if (
      !passwordInput ||
      passwordInput.tagName.toLowerCase() !== "input" ||
      (passwordInput.type !== "password" && passwordInput.type !== "text")
    ) {
      passwordInput = toggleBtn.parentElement.querySelector(
        'input[type="password"], input[type="text"]'
      );
    }
    if (!passwordInput) return;

    toggleBtn.addEventListener("click", function () {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        toggleBtn.textContent = "Hide";
      } else {
        passwordInput.type = "password";
        toggleBtn.textContent = "Show";
      }
    });
  });
}

// Call the password visibility toggle setup after DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", setupPasswordVisibilityToggles);
} else {
  setupPasswordVisibilityToggles();
}

// Update the auth buttons based on login status
function updateAuthButtons() {
  const loggedInUser = localStorage.getItem('loggedInUser');
  const authButtons = document.querySelector('.auth-buttons');
  
  if (loggedInUser && authButtons) {
    // User is logged in, hide login/signup buttons
    authButtons.style.display = 'none';
  } else if (authButtons) {
    // User is not logged in, show login/signup buttons
    authButtons.style.display = 'flex';
  }
}

// Call this function when the page loads
document.addEventListener('DOMContentLoaded', function() {
  updateAuthButtons();
  
  // Also update after logout
  const logoutBtn = document.querySelector('.js-profile-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      setTimeout(updateAuthButtons, 100); // Short delay to ensure logout is complete
    });
  }
});

// Open Profile Modal on profile button click
document.querySelector('.profile-btn').addEventListener('click', function() {
  document.getElementById('profileModal').style.display = 'block';
});
