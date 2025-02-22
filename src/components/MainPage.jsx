import React, { } from 'react'

export default function MainPage() {
  return (
    <div className="main-page">
      <div>
        <p className="maintext">Get Started!</p>
        <div>
          {JSON.parse(localStorage.getItem("user")) && JSON.parse(localStorage.getItem("user")).loggedIn && JSON.parse(localStorage.getItem("user")).type === "Owner"
          ? <li><a href='/owner.html'>I want to <span className="bold">add my food truck</span></a></li>
          : null
          }
          <li><a href='/map.html'>I am <span className="bold">looking for food trucks</span></a></li>
        </div>
      </div>
      <img width="600px" height="500px" className="mainImg" src="src/assets/FoodTruck.png" />
    </div>
  )
}