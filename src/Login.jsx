import React, {useState, useEffect} from 'react'
import styles from './Login.module.css'

function Signin() {
  
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className={styles.container}>
      <h2>Sign in</h2>
      <label htmlFor="email">
        Email
      </label>
      <input 
        id="email" 
        type="email" 
        value={email} 
        placeholder="Enter your email address"
        onChange={(e) => {
          setEmail(e.target.value)
      }} />
      
      <label htmlFor="password">
        Password
      </label>
      <input 
      id="password" 
      type="password" 
      value={password} 
      placeholder="Enter your password"
      onChange={(e) => {
        setPassword(e.target.value)
      }} />
      
      <button type="button">Not registered? Sign up</button>

      <button 
      type="submit" 
      onClick={(e) => {
        setEmail(document.getElementById("email").value);
        setPassword(document.getElementById("password").value)
        console.log(`Submitted email ${email}, password ${password}`)
      }}
      >LOGIN
      </button>
    </div>
  )
}