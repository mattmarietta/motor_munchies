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
  const [distance, setDistance] = useState(5);
  const [isAutocompleteVisible, setIsAutocompleteVisible] = useState(false);
  const [reviewSelected, setReviewSelected] = useState(false)
  const [reviewText, setReviewText] = useState({comment: '', rating: null})
  
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
        truck.name.toLowerCase().includes(searchText.toLowerCase())
        &&
        (selected !== null ? 
        getDistance(selected.lat, selected.lng, truck.latitude, truck.longitude) < distance : 
        getDistance(latitude, longitude, truck.latitude, truck.longitude) < distance)
      })
    )
  }

  const handleReset = () => {
    console.log("reset")
    setFoodTrucks([...initState])
    setDistance(5)
    setSearchText('')
    selectTruckId(null)
  }

  const handleSelect = (value) => {
    // setSelected(null)
    const selectedTruck = foodTrucks.find(truck => truck.name === value)
    console.log(selectedTruck)
    // setLatitude(l => l = selectedTruck.latitude)
    // setLongitude(l => l = selectedTruck.longitude)
    setSelected({
      lat: selectedTruck.latitude,
      lng: selectedTruck.longitude
    })
    selectTruckId(foodTrucks.indexOf(foodTrucks.find(truck => truck.name === value)))
  }

  const handleAddReview = () => {
    console.log(reviewText)
    let reviewList = JSON.parse(localStorage.getItem("allReviews"))
    reviewList.unshift({
      comment: reviewText.comment,
      rating: reviewText.rating
    })
    localStorage.setItem("allReviews", JSON.stringify(reviewList))
    setReviewText({comment: '', rating: null})
    setReviewSelected(false)
  }

  const foodTruckAutocomplete = () => {
    const filteredFoodTrucks = foodTrucks.map(truck => truck.name)
    return filteredFoodTrucks
  }

  useEffect(() => {
    setSearchText('');
  }, [isAutocompleteVisible])


  return (
    <div className={styles['side-bar']} style={{width: truckId ? "50%" : "20%"}}>
      <div class={styles['toggle-button']}>
        <button onClick={() => setIsAutocompleteVisible(!isAutocompleteVisible)}>Toggle search mode</button>
      </div>
      <ToggleContext.Provider value={isAutocompleteVisible}>
        <PlacesAutocomplete className={styles.searchbox} setSelected={setSelected} style={{display: "none"}}/>
      </ToggleContext.Provider>
      {/* <input 
      id="truck-searchbox"
      value={searchText}
      type="textbox"
      onChange={e => {setSearchText(s => s = e.target.value)}}
      placeholder="Search for a food truck"
      /> */}
      <Combobox 
        id="truck-autocomplete"
        className={styles['truck-searchbox']}
        placeholder="Search for a food truck"
        data={[...foodTruckAutocomplete()]}
        value={searchText}
        onChange={value => setSearchText(value)}
        onSelect={value => {handleSelect(value)}}
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
        (<div className={styles['truck-info']} style={{display: truckId ? "block" : "none"}}>
          <div className={styles['truck-info-header']}>
            <p>{foodTrucks[truckId].name || ''}</p>
            <div className={styles.rating}>
              <Rating name="half-rating-read" defaultValue={0} value={foodTrucks[truckId].rating || 0} precision={0.5} readOnly></Rating>
              <p>({foodTrucks[truckId].rating})</p>
            </div>
            {/* insert food truck address, information */}
          </div>
          <div className={styles.reviews}>
            { 
              JSON.parse(localStorage.getItem("allReviews")).map((review, index) => {
                if (index < 5) {
                  return (
                    <Review key={index} username={review.username} comment={review.comment} rating={review.rating} />
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
          </div>
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

  // const handleSelect =
  //   ({ description }) => () => {
  //     // When the user selects a place, we can replace the keyword without request data from API
  //     // by setting the second parameter to "false"
  //     setValue(description, false);
  //     clearSuggestions();

  //     // Get latitude and longitude via utility functions
  //     getGeocode({ address: description }).then((results) => {
  //       const { lat, lng } = getLatLng(results[0]);
  //       console.log("📍 Coordinates: ", { lat, lng });
  //       setSelected({ lat, lng })
  //     });
  //   };

  // const renderSuggestions = () =>
  //   data.map((suggestion) => {
  //     const {
  //       place_id,
  //       structured_formatting: { main_text, secondary_text },
  //     } = suggestion;

  //     return (
  //       <li 
  //       key={place_id} 
  //       onClick={handleSelect(suggestion)}
  //       style={{cursor: "pointer"}}>
  //         {main_text} {secondary_text}
  //       </li>
  //     );
  //   });

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
      {/* <input
        className={styles['search-box']}
        value={value}
        onChange={e => setValue(e.target.value)}
        disabled={!ready}
        placeholder="Search for a city"
      /> */}
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
      {/* We can use the "status" to decide whether we should display the dropdown or not */}
      {/* {status === "OK" && <ul className={styles['address-list']}>{renderSuggestions()}</ul>} */}
    </div>
  );
};