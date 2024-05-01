import React, {useContext, createContext, useState, useRef, useEffect} from 'react'
import { MapContext } from './Map.jsx'
import Review from '../Review.jsx'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import { Link } from 'react-router-dom';
// Combobox import @ https://jquense.github.io/react-widgets/docs/Combobox/
import Combobox from 'react-widgets/Combobox';
import "react-widgets/styles.css";
import styles from './Map.module.css'
import './my-theme.scss'
// Material UI imports
import Slider from '@mui/material/Slider';
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Rating from '@mui/material/Rating';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AddCommentOutlinedIcon from '@mui/icons-material/AddCommentOutlined';

const ToggleContext = createContext()

export default function SideBar() {
  // Get hooks from <Map /> in /Map.jsx
  const {latitude, setLatitude, longitude, setLongitude, foodTrucks, setFoodTrucks, truckId, selectTruckId, initState, selected, setSelected} = useContext(MapContext);
  // SideBar hooks
  const [searchText, setSearchText] = useState('');
  const [distance, setDistance] = useState(10);
  const [isAutocompleteVisible, setIsAutocompleteVisible] = useState(false);
  const [reviewSelected, setReviewSelected] = useState(false)
  const [reviewText, setReviewText] = useState({comment: '', rating: null})
  const [menuSelected, setMenuSelected] = useState(false)
  
  // Calculate distance between two coordinates in miles
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const deg2rad = (deg) => { return deg * (Math.PI / 180)}

    var R = 3958.8; // Earth’s mean radius in miles
    var dLat = deg2rad(lat2 - lat1);
    var dLong = deg2rad(lon2 - lon1);
    var a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) + 
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;

    return d; // Returns the distance in miles
  }

  const handleSlider = (e) => {
    selectTruckId(null)
    setFoodTrucks(initState)
    setFoodTrucks(f => 
      f.filter(truck => 
        (selected !== null ? 
          getDistance(selected.lat, selected.lng, truck.latitude, truck.longitude) < e.target.value : // < distance 
          getDistance(latitude, longitude, truck.latitude, truck.longitude) < e.target.value)
        )
      )
    }

  const handleSearch = () => {
    console.log(`Searching for "${searchText}" within ${distance} miles with selected=${selected}`)
    setFoodTrucks(f => 
      f.filter(truck => {
        const nameMatch = truck.name.toLowerCase().includes(searchText.toLowerCase().replace(/\s*\([^]*\)/, ''))
        const withinDistance = selected !== null ? 
          getDistance(selected.lat, selected.lng, truck.latitude, truck.longitude) < distance : 
          getDistance(latitude, longitude, truck.latitude, truck.longitude) < distance
        return nameMatch && withinDistance
      })
    )
  }

  const handleReset = () => {
    console.log("reset")
    setFoodTrucks([...initState])
    setDistance(10)
    setSearchText('')
    selectTruckId(null)
  }

  const handleSelectTruck = (value) => {
    value = value.replace(/\s*\([^]*\)/, '')
    const selectedTruck = foodTrucks.find(truck => truck.name === value)

    setSelected({
      lat: selectedTruck.latitude,
      lng: selectedTruck.longitude
    })

    selectTruckId(foodTrucks.indexOf(foodTrucks.find(truck => truck.name === value)))
  }
  
  const handleAddReview = () => {
    console.log(reviewText)
    let reviewList = JSON.parse(localStorage.getItem("allReviews"))
    const user = JSON.parse(localStorage.getItem("user"))
    if (user && user.loggedIn) {
      reviewList.unshift({
        username: user ? user.username : 'Guest',
        comment: reviewText.comment,
        rating: reviewText.rating
      })
      localStorage.setItem("allReviews", JSON.stringify(reviewList))
    } else {
      alert("You are not logged in!")
    }
    setReviewText({comment: '', rating: null})
    setReviewSelected(false)
  }

  const foodTruckAutocomplete = () => {
    const currentCoordinates = {lat: selected? selected.lat : latitude, lng: selected? selected.lng : longitude}
    let filteredFoodTrucks = foodTrucks.map(truck => `${truck.name} (${getDistance(truck.latitude, truck.longitude, currentCoordinates.lat, currentCoordinates.lng).toFixed(2)} mi)`)

    // const filterByDistance = foodTrucks
    // .sort((a, b) => {
    //     a = getDistance(a.latitude, a.longitude, currentCoordinates.lat, currentCoordinates.lng)
    //     b = getDistance(b.latitude, b.longitude, currentCoordinates.lat, currentCoordinates.lng)
    //     return a - b
    // })
    // .map(truck => `${truck.name} (${getDistance(truck.latitude, truck.longitude, currentCoordinates.lat, currentCoordinates.lng).toFixed(2)} mi)`)

    // return filteredFoodTrucks
    return filteredFoodTrucks
  }

  useEffect(() => {
    setSearchText('');
  }, [isAutocompleteVisible])
  

  return (
    <div className={styles['side-bar']} style={{width: foodTrucks[truckId] ? "50%" : "20%"}}>
      <div className={styles['toggle-button']}>
        <button onClick={() => setIsAutocompleteVisible(!isAutocompleteVisible)}>Toggle search mode</button>
      </div>
      <ToggleContext.Provider value={isAutocompleteVisible}>
        <PlacesAutocomplete className={styles.searchbox} setSelected={setSelected} style={{display: "none"}}/>
      </ToggleContext.Provider>
      <Combobox 
        id="truck-autocomplete"
        className={styles['truck-searchbox']}
        placeholder="Search for a food truck"
        data={[...foodTruckAutocomplete()]}
        value={searchText.replace(/\s*\([^]*\)/, '')}
        onChange={value => setSearchText(value)}
        onSelect={value => {handleSelectTruck(value)}}
        style={{cursor: "pointer", display: isAutocompleteVisible ? "block" : "none"}}
      />
      <div>
        <p>Distance:</p>
        <Slider id="slider"
          valueLabelDisplay="auto"
          value={distance}
          step={1}
          min={1}
          max={50}
          onChange={(e) => {setDistance(d => d = e.target.value); handleSlider(e)}}
        />
      </div>
      <form>
        <button 
        id="reset-button"
        type="reset"
        onClick={() => handleReset()}>
        <RestartAltIcon />Reset</button>
        <button 
        type="button"
        onClick={() => handleSearch()}>
          <SearchIcon />Search
        </button>
      </form>
      {
        foodTrucks[truckId] ? 
        (<div className={styles['truck-info']}>
          <div className={styles['truck-info-header']}>
            <p>{foodTrucks[truckId].name || ''}</p>
            <div className={styles.rating}>
              <Rating name="half-rating-read" defaultValue={0} value={foodTrucks[truckId].rating || 0} precision={0.5} readOnly></Rating>
              <p>({foodTrucks[truckId].rating})</p>
            </div>
            <hr />
            {/* display food truck address and information */}
            <div className={styles['truck-info-details']}>
              <p>@ {foodTrucks[truckId].details.address || ''}</p>
              <div>
                <p style={{fontStyle: "italic"}}>{foodTrucks[truckId].details.about || ''}</p>
                <p></p>
              </div>
            </div>
          </div>
          <form className={styles['info-tab']}>
            <button type="button" onClick={() => setMenuSelected(false)}>Reviews</button>
            <button type="button" onClick={() => setMenuSelected(true)}>Menu</button>
          </form>
          {
            menuSelected ? 
            (<div className={styles.menu}>
              <div>
                <p className="bold">Food</p>
                <ul>
                  {foodTrucks[truckId].details.menu.map((item, index) => {
                    if (item.type === "food") {
                      return (<li key={index}>{item.item}: ${item.cost}</li>)
                    }
                  })}
                </ul>
              </div>
              <div>
                <p className="bold">Drinks</p>
                <ul>
                  {foodTrucks[truckId].details.menu.map((item, index) => {
                    if (item.type === "drink") {
                      return (<li key={index}>{item.item}: ${item.cost}</li>)
                    }
                  })}
                </ul>
              </div>
              {/* <Link 
                to={`/foodtruck/${truckId}`} 
                style={{color: "white", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "left", gap: 5}}
              >
                <OpenInNewIcon fontSize=""/>See all menu items ({JSON.parse(localStorage.getItem("allLocations"))[truckId].details.menu.length})
              </Link> */}
            </div>)
            
            :
            (<div className={styles.reviews}>
              { 
                JSON.parse(localStorage.getItem("allReviews")).map((review, index) => {
                  if (index < 5) {
                    return (
                      <Review key={index} username={review.username} comment={review.comment} rating={parseInt(review.rating)} />
                    )
                  }
                })
              }
              <button id="post-review-btn" onClick={(e) => setReviewSelected(true)} style={{display: reviewSelected ? "none" : "flex"}}><AddCommentOutlinedIcon />Post a review</button>
              <form className={styles['add-review']} style={{display: reviewSelected ? "block" : "none"}}>
                <p className={styles['add-review-rating']}>
                  Your rating: 
                  <Rating 
                    name="half-rating-read" 
                    defaultValue={0} 
                    precision={0.5} 
                    value={reviewText.rating || 0} 
                    onChange={(e) => setReviewText({...reviewText, rating: e.target.value})}
                  />
                </p>
                <textarea 
                  value={reviewText.comment}
                  onChange={e => setReviewText({...reviewText, comment: e.target.value})}
                  className={styles['review-input']}
                  id='review-input'
                  type="text"
                  placeholder="How was your experience?"
                >
                </textarea>
                <div>
                  <button id="cancel-review-btn" type="button" onClick={() => {setReviewText({comment: '', rating: null}); setReviewSelected(false)}}>Cancel</button>
                  <button type="button" onClick={() => handleAddReview()}>Add review</button>
                </div>
              </form>
              <Link 
                to={`/foodtruck/${truckId}`} 
                style={{color: "white", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "left", gap: 5}}
              >
                <OpenInNewIcon fontSize=""/>See all reviews ({JSON.parse(localStorage.getItem("allReviews")).length})
              </Link>
            </div>)
          }
        </div>)
        :
        (<div>No food truck selected</div>)
      }
    </div>
  )
}


const PlacesAutocomplete = ({ setSelected }) => {
  const toggle = useContext(ToggleContext)
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    callbackName: "YOUR_CALLBACK_NAME",
    requestOptions: {
      types: ['(cities)'],
      componentRestrictions: { 
        country : ['us'],
      }
    },
    debounce: 300,
  });

  useEffect(() => {
    const resetButton = document.getElementById("reset-button");
    resetButton.addEventListener("click", () => {
      clearSuggestions();
      setValue('');
    })
  }, [])

   const handleSelect = async (address) => {
    setValue(address, false)
    clearSuggestions()
    
    const results = await getGeocode({ address })
    const {lat, lng} = getLatLng(results[0])
    console.log("📍 Coordinates: ", { lat, lng })
    setSelected({lat, lng})
   }

  return (
    <div className={styles['autocomplete-container']}>
      <Combobox 
        // className={styles['search-box']}
        placeholder="Search for a city"
        hideCaret
        hideEmptyPopup
        value={value}
        data={ready ? data.map(({ description }) => description) : []}
        onChange={value => setValue(value)}
        onSelect={handleSelect}
        style={{display: toggle ? "none" : "block"}}
      />
    </div>
  );
};