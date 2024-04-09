import './Login.css'

export default function Login() {
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


  return (
    <>
      <div id="loginModal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => closeModal('loginModal')}>&times;</span>
          <h2>Login to Motor Munchies</h2>
          <form>
            <label htmlFor="loginUsername">Username:</label>
            <input type="text" id="loginUsername" name="username" required />
            <label htmlFor="loginPassword">Password:</label>
            <input type="password" id="loginPassword" name="password" required />
            <button type="button" onClick={() => fakeLogin()}>Login</button>
          </form>
        </div>
      </div>

      <div id="signupModal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => closeModal('signupModal')}>&times;</span>
          <h2>Sign up for Motor Munchies</h2>
          <form>
            <label htmlFor="signupUsername">Username:</label>
            <input type="text" id="signupUsername" name="username" required />
            <label htmlFor="signupEmail">Email:</label>
            <input type="email" id="signupEmail" name="email" required />
            <label htmlFor="signupPassword">Password:</label>
            <input type="password" id="signupPassword" name="password" required />
            <button type="button" onClick={() => fakeSignup()}>Sign up</button>
          </form>
        </div>
      </div>
    </>
  )
}