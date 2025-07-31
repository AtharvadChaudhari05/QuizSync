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
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100vw';
    modal.style.height = '100vh';
    modal.style.background = 'radial-gradient(circle at 60% 40%, #e0c3fc 0%, #8ec5fc 100%)';
    modal.style.zIndex = '2000';
    modal.innerHTML = `
      <div style="position: absolute; inset: 0; pointer-events: none; z-index: 0;">
        <svg width='100%' height='100%' style='position:absolute;top:0;left:0;z-index:0;pointer-events:none;'>
          <circle cx='20%' cy='30%' r='60' fill='#b224ef33'>
            <animate attributeName='cy' values='30%;35%;30%' dur='4s' repeatCount='indefinite'/></circle>
          <circle cx='80%' cy='60%' r='40' fill='#fc466b22'>
            <animate attributeName='cy' values='60%;65%;60%' dur='5s' repeatCount='indefinite'/></circle>
          <circle cx='50%' cy='80%' r='30' fill='#ffd20033'>
            <animate attributeName='cy' values='80%;85%;80%' dur='6s' repeatCount='indefinite'/></circle>
        </svg>
      </div>
      <div class="modal-content" style="width: 460px; max-width: 97vw; border-radius: 20px; box-shadow: 0 16px 64px #7f53ac77; background: #fff; padding: 0; overflow: hidden; display: flex; flex-direction: column; align-items: stretch; position: relative; border: 4px solid; border-image: linear-gradient(120deg, #fc466b 0%, #ffd200 50%, #43e97b 100%) 1; animation: popIn 0.5s cubic-bezier(.68,-0.55,.27,1.55);">
        <div style="background: linear-gradient(90deg, #7f53ac 0%, #647dee 50%, #b224ef 100%); padding: 2.5rem 1.2rem 1.2rem 1.2rem; text-align: center; border-radius: 16px 16px 0 0; box-shadow: 0 4px 24px #7f53ac22; position:relative;">
          <div style="font-size: 4.2rem; margin-bottom: 0.2rem; filter: drop-shadow(0 2px 12px #fff8); position:relative;">🔒<span style='position:absolute;top:0.2em;right:1.2em;font-size:1.5rem;animation:sparkle 1.5s infinite alternate;'>✨</span></div>
          <h2 style="color: #fff; font-size: 2.2rem; margin: 0 0 0.3rem 0; letter-spacing: 0.5px; font-family: 'Segoe UI',sans-serif; text-shadow:0 2px 8px #0002;">Authentication Required</h2>
          <div style="color: #ffe066; font-size: 1.1rem; font-weight: 500; margin-bottom: 0.2rem;">Unlock your learning journey! 🚀</div>
          <p style="color: #e0e7ff; font-size: 1.13rem; margin: 0;">You need to create an account to ${action === 'join' ? 'join' : 'create'} a quiz.</p>
        </div>
        <div class="modal-form-section" style="padding: 2.3rem 1.7rem 2rem 1.7rem; text-align: center; background: #fff; border-radius: 0 0 16px 16px; position:relative;">
          <button class="close" onclick="closeModal('authRequiredModal')" style="position: absolute; top: 18px; right: 24px; background: none; border: none; font-size: 2.3rem; color: #7f53ac; cursor: pointer; z-index: 2; transition: color 0.2s;">&times;</button>
          <div class="modal-body" style="margin-top: 0.5rem;">
            <div style="font-size: 1.22rem; color: #4a5a8a; margin-bottom: 1.3rem; font-family: 'Segoe UI',sans-serif;">Please sign up or log in to continue.<br><span style='font-size:2.7rem; display:inline-block; margin-top:0.7rem;'>🎉🤖</span></div>
            <div style="display: flex; gap: 22px; justify-content: center;">
              <button class="form-submit" onclick="switchModal('authRequiredModal', 'signupModal')"
                style="background: linear-gradient(90deg, #fc466b, #3f5efb); color: #fff; border: none; border-radius: 24px; padding: 15px 40px; font-size: 1.18rem; min-width: 150px; font-weight: bold; box-shadow: 0 2px 12px #fc466b22; transition: background 0.2s, color 0.2s, transform 0.15s; cursor: pointer; letter-spacing: 0.5px; outline:none;"
                onmouseover="this.style.background='linear-gradient(90deg,#43e97b,#38f9d7)';this.style.transform='scale(1.06)';" onmouseout="this.style.background='linear-gradient(90deg, #fc466b, #3f5efb)';this.style.transform='scale(1)';">Sign Up</button>
              <button class="form-submit" onclick="switchModal('authRequiredModal', 'loginModal')"
                style="background: #fff; color: #fc466b; border: 2px solid #fc466b; border-radius: 24px; padding: 15px 40px; font-size: 1.18rem; min-width: 150px; font-weight: bold; box-shadow: 0 2px 12px #fc466b22; transition: background 0.2s, color 0.2s, transform 0.15s; cursor: pointer; letter-spacing: 0.5px; outline:none;"
                onmouseover="this.style.background='linear-gradient(90deg,#ffd200,#43e97b)';this.style.color='#fff';this.style.transform='scale(1.06)';" onmouseout="this.style.background='#fff';this.style.color='#fc466b';this.style.transform='scale(1)';">Login</button>
            </div>
          </div>
        </div>
      </div>
      <style>
        @keyframes popIn {
          0% { transform: scale(0.7) translateY(60px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes sparkle {
          0% { opacity: 0.7; transform: scale(1) rotate(0deg); }
          100% { opacity: 1; transform: scale(1.3) rotate(20deg); }
        }
      </style>
    `;
    document.body.appendChild(modal);
  }
  // Display the modal
  document.getElementById('authRequiredModal').style.display = 'flex';
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
  const userGreeting = document.querySelector('.user-greeting');
  const profileGreetingFlex = document.querySelector('.profile-greeting-flex');

  if (loggedInUser && authButtons && userGreeting && profileGreetingFlex) {
    // User is logged in, hide login/signup buttons
    authButtons.style.display = 'none';
    // Show greeting with name and profile flex
    const user = JSON.parse(loggedInUser);
    userGreeting.textContent = `Hi, ${user.name}`;
    profileGreetingFlex.style.display = 'flex';
  } else if (authButtons && userGreeting && profileGreetingFlex) {
    // User is not logged in, show login/signup buttons and hide profile flex
    authButtons.style.display = 'flex';
    userGreeting.textContent = '';
    profileGreetingFlex.style.display = 'none';
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
