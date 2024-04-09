import React, {useState, useEffect, useRef, createContext} from 'react'

export default function SearchBar(props) {
  const styles = {
    height: '20px',
    width: `${props.width}`,
    borderRadius: '5px',
    border: 'none',
    boxShadow: '0px 0px 2px',
    padding: '5px 5px 5px 10px'
  }

  useEffect(() => {
    document.querySelectorAll("#searchbar")
    //Add unique class name to each component? fixes problem of having to do foreach
    .forEach(component => component.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && locationRef.current != '') {
        window.location.assign("./map.html")
        console.log(locationRef.current)
      }
    }))
  }, [])

  let locationRef = useRef('');
  const userContext = createContext();
  
  return (
    <userContext.Provider value={locationRef.current}>
      <input id="searchbar"
      style={styles} 
      type="textbox" 
      placeholder="Enter a city or zipcode"
      autoComplete="off"
      onChange={(e) => {
        locationRef.current = e.target.value
      }} />
    </userContext.Provider>
  )
}