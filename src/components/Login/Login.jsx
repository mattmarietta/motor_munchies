import './Login.css'
import React, {useEffect, useState} from 'react'

export default function Login() {
  function showModal(modalId) {
    document.getElementById(modalId).style.display = "block";
  }
  
  function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
  }
  
  function fakeLogin() {
    if (document.getElementById("loginUsername").value === JSON.parse(localStorage.getItem("user")).username) {
      const user = JSON.parse(localStorage.getItem("user"))
      user.loggedIn = true
      localStorage.setItem("user", JSON.stringify(user))
      closeModal('loginModal');
      location.reload()
    }
    else {
      alert("Invalid credentials");
    }
  }
  
  function fakeSignup() {
    const userInfo = {
      username: username,
      type: userType,
      loggedIn: true,
    }
    if (username && document.getElementById("signupEmail").value && document.getElementById("signupPassword") && userType) {
      localStorage.setItem("user", JSON.stringify(userInfo))
      closeModal('signupModal');
      location.reload();
    }
    else {
      alert("Invalid sign up")
    }
  }
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).loggedIn : false
    if (!user) {
      document.getElementById('loginBtn').onclick = function() {
        showModal('loginModal');
      };
      document.getElementById('signupBtn').onclick = function() {
        showModal('signupModal');
      };
    }
  }, [])

  const [userType, setUserType] = useState(null)
  const [username, setUsername] = useState('')

  return (
    <>
      <div id="loginModal" className="modal">
        <div className="modal-content">
          <div className="top-container">
            <h2>Login to Motor Munchies</h2>
            <span className="close bold" 
              onClick={() => {
                closeModal('loginModal')
                document.getElementById("loginUsername").value = ''; 
                document.getElementById("loginPassword").value = ''
              }}
            >
              &times;
            </span>
          </div>
          <form>
            <label htmlFor="loginUsername">Username:</label>
            <input type="text" id="loginUsername" name="username" autoComplete="off" required />
            <label htmlFor="loginPassword">Password:</label>
            <input type="password" id="loginPassword" name="password" autoComplete="off" required />
            <button type="button" onClick={() => fakeLogin()}>Login</button>
          </form>
        </div>
      </div>

      <div id="signupModal" className="modal">
        <div className="modal-content" id="modalContent">
          <div className="top-container">
            <h2>Sign up for Motor Munchies</h2>
            <span 
              className="close" 
              onClick={() => {
                closeModal('signupModal'); 
                setUsername(''); 
                document.getElementById("signupEmail").value = ''; 
                document.getElementById("signupPassword").value = ''
                }}
            >
              &times;
            </span>
          </div>
          <form>
            <label htmlFor="signupUsername">Username:</label>
            <input type="text" id="signupUsername" name="username" autoComplete="off" value={username} onChange={(e) => setUsername(u => u = e.target.value)} maxLength="20" required />
            <label htmlFor="signupEmail">Email:</label>
            <input type="email" id="signupEmail" name="email" autoComplete="off" required />
            <label htmlFor="signupPassword">Password:</label>
            <input type="password" id="signupPassword" name="password" autoComplete="off" required />
            <div className="user-type">
              <div>
                <input type="radio" id="foodTruckOwner" value="Owner" onChange={() => setUserType("Owner")} checked={userType === "Owner"} />
                <label htmlFor="foodTruckOwner">I own a food truck</label>
              </div>
              <div>
                <input type="radio" id="customer" value="Customer" onChange={() => setUserType("Customer")} checked={userType === "Customer"} />
                <label htmlFor="customer">I am a customer</label>
              </div>
            </div>
            <button type="button" onClick={() => fakeSignup()}>Sign up</button>
          </form>
        </div>
      </div>
    </>
  )
}