  function showModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

function fakeLogin() {
  alert("Login successful!");
  closeModal('loginModal');
}

function fakeSignup() {
  alert("Signup successful!");
  closeModal('signupModal');
}

window.onload = function() {
  document.getElementById('loginBtn').onclick = function() {
    showModal('loginModal');
  };
  document.getElementById('signupBtn').onclick = function() {
    showModal('signupModal');
  };
};

document.getElementById('fakeSearchForm').addEventListener('submit', function(e) {
  e.preventDefault();
  var searchTerm = e.target.search.value;
  alert('Searching for: ' + searchTerm);
});
