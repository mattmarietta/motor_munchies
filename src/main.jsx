import React from 'react'
import ReactDOM from 'react-dom/client'
import NavBar from './components/NavBar.jsx'
import Footer from './components/Footer.jsx'
import Login from './components/Login/Login.jsx'

const source = [
  {location: 'root-navbar', component: <NavBar />},
  {location: 'root-footer', component: <Footer />},
  {location: 'root-login', component: <Login />}
]

source.forEach(item => {
  const id = document.getElementById(item.location)
  if (id) {
    ReactDOM.createRoot(id).render(
      <React.StrictMode>
        {item.component}
      </React.StrictMode>)
  }
})
