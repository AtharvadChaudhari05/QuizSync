document.addEventListener('DOMContentLoaded', function () {
  const profileBtn = document.querySelector('.profile-btn');

  if (profileBtn) {
    profileBtn.addEventListener('click', function () {
      const userJson = localStorage.getItem('loggedInUser');
      if (userJson) {
        const user = JSON.parse(userJson);
        document.querySelector('.js-profile-name').innerHTML = user.name;
        document.querySelector('.js-profile-email').innerHTML = user.email;
      } else {
        document.querySelector('.js-profile-name').innerHTML = 'No user is Signed In!';
        document.querySelector('.js-profile-email').innerHTML = '';
      }
      // Open the profile modal
      document.getElementById('profileModal').style.display = 'block';
    });
  }

  // Attach logout event to the correct button
  const logoutBtn = document.querySelector('.js-profile-logout');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      localStorage.removeItem('loggedInUser');
      alert('Logged Out Successfully!');
      // Close the profile modal
      document.getElementById('profileModal').style.display = 'none';
    });
  }
});