import React from 'react'
import ReactDOM from 'react-dom/client'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import Login from './components/Login/Login.jsx'
import MapAPI from './components/Map/MapAPI.jsx'
import MainPage from './components/MainPage.jsx'

const source = [
  {location: 'root-navbar', component: <NavBar />},
  // {location: 'root-footer', component: <Footer />},
  {location: 'root-login', component: <Login />},
  {location: 'root-map', component: <MapAPI />},
  {location: 'root-mainpage', component: <MainPage />}
]

source.forEach(item => {
  const id = document.getElementById(item.location)
  if (id) {
    ReactDOM.createRoot(id).render(
      <>
        {item.component}
      </>)
  }
})
