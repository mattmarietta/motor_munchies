import React, {useState, useEffect, useRef, useContext, createContext, useMemo} from 'react';
import GoogleMapReact from 'google-map-react';
import {useMapsLibrary} from '@vis.gl/react-google-maps'
import SideBar from './SideBar.jsx'
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
import Combobox from 'react-widgets/Combobox';
import { Link } from 'react-router-dom';
import styles from './Map.module.css'
// Material UI imports
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

export default function GoogleMap() {
  const placesLib = useMapsLibrary('places');
  
  useEffect(() => {
    if (!placesLib) return;
  }, [placesLib]);

  return (
    <Map />
  )
}

export const MapContext = createContext({
  latitude: {},
  setLatitude: () => {},
  longitude: {},
  setLongitude: () => {},
  foodTrucks: {},
  setFoodTrucks: () => {},
  truckId: {},
  selectTruckId: () => {},
  truckData: {},
  selected: {},
  setSelected: () => {},
});

export const Map = () => {
  // Map hooks
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [foodTrucks, setFoodTrucks] = useState(truckData);
  const [truckId, selectTruckId] = useState(null);
  const initState = truckData; // Original list of truck objects
  const [selected, setSelected] = useState(null);
  console.log(foodTrucks)
  
  const value = {latitude, setLatitude, longitude, setLongitude, foodTrucks, setFoodTrucks, truckId, selectTruckId, initState, selected, setSelected}

  // // SideBar hooks
  // const searchText = useRef('');
  // const distance = useRef(5);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log(position.coords)
        setLatitude(l => l = position.coords.latitude);
        setLongitude(l => l = position.coords.longitude);
      },
      (error) => {
        console.log("Error getting location: " + error.message)
        // Set default coordinates when user does not allow location tracking
        setLatitude(l => l = 33.78417570117769)
        setLongitude(l => l = -118.11417623398914)
      }
    )
    renderAddedLocations()
  }, [])

  return (
    <MapContext.Provider value={value}>
      <div className={styles.container}>
        <SideBar />
        <div className={styles['google-map']} style={{height: "100vh", width: "100%"}}>
          <GoogleMapReact
            // Store API key in .env
            bootstrapURLKeys={{ key: `${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}` }}
            defaultZoom={15}
            center={selected || [latitude, longitude]}
            onClick={() => {selectTruckId(t => t = null)}}
          >
            {
              foodTrucks.map((truck, index) => {
                return (
                  <LocalShippingIcon fontSize="large" color="primary"
                    id={index}
                    key={index}
                    lat={truck.latitude}
                    lng={truck.longitude}
                    // Log the food truck that the user clicks on
                    onClick={() => {selectTruckId(t => t = index)}}
                  />
                )
              })
            }
            {
              foodTrucks.map((truck, index) => {
                if (truckId == index) {
                  return (
                    <div 
                      key={index} 
                      lat={truck.latitude}
                      lng={truck.longitude}
                      style={{backgroundColor: "white", fontSize: "2rem", width: 100, position: "relative", bottom: 20, cursor: "pointer"}}
                      >
                        <Link to={`/foodtruck.html/${truckId}`} style={{textDecoration: "none", color: "black"}}>
                        {console.log(truck.name)}
                        {truck.name}
                        </Link>
                    </div>
                  )
                }
                return null
              })
            }
            <LocationSearchingIcon fontSize="medium" color="primary" 
              lat={selected ? selected.lat : latitude} lng={selected ? selected.lng : longitude}
            />
          </GoogleMapReact>
        </div>
      </div>
    </MapContext.Provider>
  )
}

const renderAddedLocations = () => {
  let userLocations = JSON.parse(localStorage.getItem("UserLocations"));
      if (userLocations){
        userLocations.forEach(location => {
          truckData.push({
            name: location.title,
            latitude: location.coords.lat,
            longitude: location.coords.lng,
          });
        });
      }
  console.log(truckData)
}

// LIST OF TRUCK NAMES & LOCATIONS
let truckData = [
  {
    name: "Alaska",
    latitude: 61.3850,
    longitude: -152.2683
  },
  {
    name: "Alabama",
    latitude: 32.7990,
    longitude: -86.8073
  },
  {
    name: "Arkansas",
    latitude: 34.9513,
    longitude: -92.3809
  },
  {
    name: "Arizona",
    latitude: 33.7712,
    longitude: -111.3877
  },
  {
    name: "California",
    latitude: 36.1700,
    longitude: -119.7462
  },
  {
    name: "joe",
    latitude: 33.782387140081305, 
    longitude: -118.11334211896353
  },
  {
    name: "mcdonalds",
    latitude: 33.79897911508526, 
    longitude: -118.1248210722348
  },
  {
    name: "a park",
    latitude: 33.78985218396594,
    longitude: -118.12165261162879
  },
  {
    name: "la fitniss",
    latitude: 33.795742690199134,
    longitude: -118.12258947424955
  },
  {
    name: "The Queen Mary",
    latitude: 33.7529,
    longitude: -118.1914,
  },
  {
    name: "Long Beach Convention & Entertainment Center",
    latitude: 33.7651,
    longitude: -118.1896,
  },
  {
    name: "Aquarium of the Pacific",
    latitude: 33.7628,
    longitude: -118.1964,
  },
  {
    name: "Shoreline Village",
    latitude: 33.7625,
    longitude: -118.1966,
  },
  {
    name: "Rancho Los Alamitos Historic Ranch & Gardens",
    latitude: 33.7812,
    longitude: -118.1436,
  },
  {
    name: "El Dorado Nature Center",
    latitude: 33.8152,
    longitude: -118.0883,
  },
  {
    name: "Rosie's Dog Beach",
    latitude: 33.7717,
    longitude: -118.1486,
  },
  {
    name: "The Pike Outlets",
    latitude: 33.7656,
    longitude: -118.1919,
  },
  {
    name: "Long Beach Museum of Art",
    latitude: 33.7564,
    longitude: -118.1454,
  },
  {
    name: "Earl Burns Miller Japanese Garden",
    latitude: 33.7854,
    longitude: -118.1274,
  },
]