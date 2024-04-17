import React, {useState, useEffect, useRef, createContext} from 'react'

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
      <ul>
        <div className="left">
          <div className="search-container">
            <form id="fakeSearchForm">
              <input 
              id="searchbar" 
              type="text" 
              placeholder="Search..." 
              name="search" 
              onChange={(e) => locationRef.current = e.target.value}
              />
              <button type="submit" onClick={() => {e.preventDefault(); window.location.assign("./map.html")}}>Search</button>
            </form>
          </div>
          {/* List of navigation buttons */}
          <li><a className="active" href="./index.html">Home</a></li>
          <li><a href="./about.html">About</a></li>
          <li><a href="./support.html">Support</a></li>
          <li><a href="reviewtest.html">Reviewtest</a></li>
          <li><button id="loginBtn" className="right">Log in</button></li>
          <li><button id="signupBtn" className="right">Sign up</button></li>
          
        </div>
      </ul>
    </div>
  )
}