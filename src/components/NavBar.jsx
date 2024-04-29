import React, {useState, useEffect, useRef, createContext} from 'react'
// Material UI imports
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

export default function NavBar() {
  useEffect(() => {
    document.querySelectorAll("#searchbar")
    //Add unique class name to each component? fixes problem of having to do foreach
    .forEach(component => component.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && locationRef.current != '') {
        e.preventDefault();
        console.log(locationRef.current)
        window.location.assign("./map.html")
      }
    }))
  }, [])

  let locationRef = useRef('');
  const userContext = createContext();

  return (
    <div className="nav">
      {/* List of navigation buttons */}
      <ul>
        <li><button onClick={() => window.location.assign("/index.html")} className="active">Home</button></li>
        <li><button onClick={() => window.location.assign("/about.html")}>About</button></li>
        <li><button onClick={() => window.location.assign("/support.html")}>Support</button></li>
        <li><button onClick={() => window.location.assign("/reviewtest.html")}>Reviewtest</button></li>
        <li><button id="loginBtn">Log in</button></li>
        <li><button id="signupBtn">Sign up</button></li>
      </ul>
      <h1>Motor Munchies</h1>

      <div className="search-container" style={{display: "flex", gap: 5}}>
        <PersonIcon style={{display: JSON.parse(localStorage.getItem("user")) ? "block" : "none"}} />
        <p>{JSON.parse(localStorage.getItem("user")) ? JSON.parse(localStorage.getItem("user")).username : "Hello, Guest"}</p>
        <LogoutIcon onClick={() => {localStorage.removeItem("user"); location.reload() }} style={{display: JSON.parse(localStorage.getItem("user")) ? "block" : "none", cursor: "pointer" }} />
      </div>
      {/* <div className="search-container">
        <form id="fakeSearchForm">
          <input 
          id="searchbar" 
          type="text" 
          placeholder="Search..." 
          name="search" 
          onChange={(e) => locationRef.current = e.target.value}
          />
          <button type="submit" onClick={() => {e.preventDefault(); window.location.assign("/map.html")}}>Search</button>
        </form>
      </div> */}
    </div>
  )
}