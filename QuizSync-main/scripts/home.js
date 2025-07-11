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
// Join Quiz button redirects directly to student dashboard
function joinQuiz() {
  window.location.href = "student_dashboard/join_quiz.html";
}
// Create Quiz button triggers modal
function createQuiz() {
  window.location.href = "teacher_dashboard.html";    //redirect to teacher dashboard
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

// Open Profile Modal on profile button click
document.querySelector('.profile-btn').addEventListener('click', function() {
  document.getElementById('profileModal').style.display = 'block';
});
