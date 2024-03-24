import React, {useState, useEffect} from 'react'

export default function SearchBar(props) {
  useEffect(() => {
    // Use this to add event listener ? that will allow for enter key, which then stores that input value
  }, [])
  const [location, setLocation] = useState();

  const styles = {
    height: '20px',
    width: `${props.width}`,
    borderRadius: '5px',
    border: 'none',
    boxShadow: '0px 0px 2px',
    padding: '5px 5px 5px 10px'
  }
  
  return (
    <>
      <input 
      style={styles} 
      type="textbox" 
      value={location}
      placeholder="Enter a city or zipcode" />
    </>
  )
}