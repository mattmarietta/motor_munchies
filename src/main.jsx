import React from 'react'
import ReactDOM from 'react-dom/client'
import NavBar from './NavBar.jsx'
import SearchBar from './SearchBar.jsx'
import Login from './Login.jsx'
import './index.css'
//import '../assets/dist/css/bootstrap.min.css'

const source = [
  {location: 'root-navbar', component: <NavBar />},
  {location: 'root-searchbar', component: <SearchBar width="400px"/>},
  {location: 'root-login', component: <Login />},
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


// ReactDOM.createRoot(document.getElementById('root-navbar')).render(
//   <React.StrictMode>
//     <NavBar />
//   </React.StrictMode>,
// )

// ReactDOM.createRoot(document.getElementById('root-searchbar')).render(
//   <React.StrictMode>
//     <SearchBar width="400px"/>
//   </React.StrictMode>,
// )
