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
    // Append custom locations to list, then store combined data
    renderAddedLocations()
    let allLocationsJson = JSON.stringify(truckData);
    localStorage.setItem("allLocations", allLocationsJson);
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
            options={{
              gestureHandling: 'greedy',
              clickableIcons: false
            }}
            center={selected || [latitude, longitude]}
            onClick={() => {selectTruckId(t => t = null)}}
          >
            {
              foodTrucks.map((truck, index) => {
                return (
                  <LocalShippingIcon fontSize="large" color={index === truckId ? "secondary" : "primary"} style={{position: "relative", zIndex: 5, cursor: "pointer"}}
                    id={`foodtruck-${index}`} 
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
                      style={{backgroundColor: "white", fontSize: "1.1rem", width: 200, textAlign: "center", position: "relative", bottom: 40, cursor: "pointer", borderRadius: 5, boxShadow: "0 0 3px black"}}
                      >
                        <Link to={`/foodtruck/${truckId}`} style={{textDecoration: "none", color: "black"}}>
                        {console.log(truck.name)}
                        {truck.name}
                        </Link>
                    </div>
                  )
                }
                return null
              })
            }
            <LocationSearchingIcon fontSize="medium" color="primary" style={{position: "relative"}}
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
        // rating: Math.round((Math.random()*(5-2.5)+2.5)/0.5)*0.5,
        details: {
          address: location.details.address,
          about: location.details.about,
          menu: location.details.menu
        }
      });
    });
  }
}

// LIST OF TRUCK NAMES & LOCATIONS
const userLocations = JSON.parse(localStorage.getItem("UserLocations"));
function getRandomRating() {
  return Math.floor(Math.random() * 5) + 1;
}
let truckData = [
  {
    name: "Taco Time Truck",
    latitude: 33.766758,
    longitude: -118.190769,
    rating: getRandomRating(),
    details: {
      address: "123 Main St, Long Beach, CA 90815",
      about: "Authentic Mexican Street Tacos",
      menu: [
        { item: "Taco", cost: 2.50, type: "food" },
        { item: "Burrito", cost: 5.00, type: "food" },
        { item: "Soda", cost: 1.00, type: "drink" },
      ]
    },
  },
  {
    name: "Burger Bistro",
    latitude: 33.774735,
    longitude: -118.164700,
    rating: getRandomRating(),
    details: {
      address: "456 Elm St, Long Beach, CA 90815",
      about: "Gourmet burgers and fries",
      menu: [
        { item: "Cheeseburger", cost: 6.50, type: "food" },
        { item: "Fries", cost: 3.00, type: "food" },
        { item: "Milkshake", cost: 4.00, type: "drink" },
      ]
    },
  },
  {
    name: "Pizza Planet",
    latitude: 33.775582,
    longitude: -118.145579,
    rating: getRandomRating(),
    details: {
      address: "789 Oak St, Long Beach, CA 90815",
      about: "Wood-fired pizzas",
      menu: [
        { item: "Margherita Pizza", cost: 8.00, type: "food" },
        { item: "Pepperoni Pizza", cost: 9.00, type: "food" },
        { item: "Garlic Knots", cost: 4.50, type: "food" },
        { item: "Soft Drink", cost: 2.00, type: "drink" },
      ]
    },
  },
  {
    name: "Sushi Express",
    latitude: 33.767992,
    longitude: -118.152300,
    rating: getRandomRating(),
    details: {
      address: "101 Pine St, Long Beach, CA 90815",
      about: "Fresh sushi rolls",
      menu: [
        { item: "California Roll", cost: 5.50, type: "food" },
        { item: "Spicy Tuna Roll", cost: 6.00, type: "food" },
        { item: "Miso Soup", cost: 3.00, type: "food" },
        { item: "Green Tea", cost: 1.50, type: "drink" },
      ]
    },
  },
  {
    name: "Wrap n' Roll",
    latitude: 33.762995,
    longitude: -118.150229,
    rating: getRandomRating(),
    details: {
      address: "202 Maple St, Long Beach, CA 90815",
      about: "Variety of wraps and sandwiches",
      menu: [
        { item: "Chicken Caesar Wrap", cost: 7.00, type: "food" },
        { item: "Turkey Club Sandwich", cost: 8.00, type: "food" },
        { item: "Chips", cost: 2.00, type: "food" },
        { item: "Iced Tea", cost: 2.50, type: "drink" },
      ]
    },
  },
  {
    name: "Waffle Wagon",
    latitude: 33.764474,
    longitude: -118.142068,
    rating: getRandomRating(),
    details: {
      address: "303 Cedar St, Long Beach, CA 90815",
      about: "Sweet and savory waffles",
      menu: [
        { item: "Classic Waffle", cost: 4.00, type: "food" },
        { item: "Chicken and Waffles", cost: 8.00, type: "food" },
        { item: "Coffee", cost: 2.50, type: "drink" },
      ]
    },
  },
  {
    name: "BBQ Pit Stop",
    latitude: 33.759680,
    longitude: -118.147432,
    rating: getRandomRating(),
    details: {
      address: "404 Birch St, Long Beach, CA 90815",
      about: "Slow-smoked BBQ meats",
      menu: [
        { item: "Pulled Pork Sandwich", cost: 9.00, type: "food" },
        { item: "Brisket Plate", cost: 12.00, type: "food" },
        { item: "Cornbread", cost: 3.00, type: "food" },
        { item: "Sweet Tea", cost: 2.00, type: "drink" },
      ]
    },
  },
  {
    name: "Crispy Crunch Food Truck",
    latitude: 33.775181,
    longitude: -118.137707,
    rating: getRandomRating(),
    details: {
      address: "505 Walnut St, Long Beach, CA 90815",
      about: "Crispy and crunchy delights",
      menu: [
        { item: "Crispy Chicken Sandwich", cost: 7.00, type: "food" },
        { item: "Fish and Chips", cost: 9.00, type: "food" },
        { item: "Onion Rings", cost: 4.00, type: "food" },
        { item: "Lemonade", cost: 2.50, type: "drink" },
      ]
    },
  },
  {
    name: "Healthy Bites Truck",
    latitude: 33.768220,
    longitude: -118.124516,
    rating: getRandomRating(),
    details: {
      address: "606 Spruce St, Long Beach, CA 90815",
      about: "Fresh and healthy options",
      menu: [
        { item: "Avocado Toast", cost: 6.50, type: "food" },
        { item: "Quinoa Salad", cost: 8.00, type: "food" },
        { item: "Green Smoothie", cost: 5.00, type: "drink" },
      ]
    },
  },
  {
    name: "Sizzling Sausages",
    latitude: 33.782475,
    longitude: -118.113176,
    rating: getRandomRating(),
    details: {
      address: "707 Pine St, Long Beach, CA 90815",
      about: "Delicious grilled sausages",
      menu: [
        { item: "Bratwurst", cost: 5.00, type: "food" },
        { item: "Italian Sausage", cost: 6.00, type: "food" },
        { item: "Soft Pretzel", cost: 3.00, type: "food" },
        { item: "Beer", cost: 4.00, type: "drink" },
      ]
    },
  },
  {
    name: "Sweet Treats Truck",
    latitude: 33.769375,
    longitude: -118.183552,
    rating: getRandomRating(),
    details: {
      address: "808 Oak St, Long Beach, CA 90815",
      about: "Irresistible desserts and sweets",
      menu: [
        { item: "Cupcake", cost: 3.50, type: "food" },
        { item: "Brownie", cost: 4.00, type: "food" },
        { item: "Ice Cream", cost: 5.00, type: "food" },
        { item: "Milkshake", cost: 6.00, type: "drink" },
      ]
    },
  },
  {
    name: "Sizzling Fajitas Truck",
    latitude: 33.774200,
    longitude: -118.182489,
    rating: getRandomRating(),
    details: {
      address: "909 Elm St, Long Beach, CA 90815",
      about: "Authentic Mexican fajitas",
      menu: [
        { item: "Chicken Fajitas", cost: 8.00, type: "food" },
        { item: "Steak Fajitas", cost: 10.00, type: "food" },
        { item: "Vegetarian Fajitas", cost: 7.00, type: "food" },
        { item: "Margarita", cost: 5.00, type: "drink" },
      ]
    },
  },
  {
    name: "Fresh Catch Seafood",
    latitude: 33.775885,
    longitude: -118.180579,
    rating: getRandomRating(),
    details: {
      address: "1010 Cedar St, Long Beach, CA 90815",
      about: "Delicious seafood dishes",
      menu: [
        { item: "Fish Tacos", cost: 8.00, type: "food" },
        { item: "Shrimp Scampi", cost: 12.00, type: "food" },
        { item: "Clam Chowder", cost: 5.00, type: "food" },
        { item: "Lemonade", cost: 2.50, type: "drink" },
      ]
    },
  },
  {
    name: "Noodle Nirvana",
    latitude: 33.775511,
    longitude: -118.172096,
    rating: getRandomRating(),
    details: {
      address: "1616 Pine St, Long Beach, CA 90815",
      about: "Delicious noodle dishes",
      menu: [
        { item: "Pad Thai", cost: 9.00, type: "food" },
        { item: "Beef Pho", cost: 10.00, type: "food" },
        { item: "Spring Rolls", cost: 5.00, type: "food" },
        { item: "Thai Iced Tea", cost: 3.00, type: "drink" },
      ]
    },
  },
  {
    name: "Gyro Junction",
    latitude: 33.770294,
    longitude: -118.164704,
    rating: getRandomRating(),
    details: {
      address: "1717 Oak St, Long Beach, CA 90815",
      about: "Authentic Greek gyros",
      menu: [
        { item: "Lamb Gyro", cost: 8.00, type: "food" },
        { item: "Chicken Shawarma", cost: 9.00, type: "food" },
        { item: "Greek Salad", cost: 6.00, type: "food" },
        { item: "Baklava", cost: 3.50, type: "food" },
        { item: "Fruit Smoothie", cost: 4.00, type: "drink" },
      ]
    },
  },
  {
    name: "Cheese Please Truck",
    latitude: 33.845447,
    longitude: -118.182740,
    rating: getRandomRating(),
    details: {
      address: "1818 Elm St, Long Beach, CA 90815",
      about: "Gourmet grilled cheese sandwiches",
      menu: [
        { item: "Classic Grilled Cheese", cost: 6.00, type: "food" },
        { item: "Bacon and Tomato Grilled Cheese", cost: 8.00, type: "food" },
        { item: "Soup Combo", cost: 10.00, type: "food" },
        { item: "Iced Tea", cost: 2.50, type: "drink" },
      ]
    },
  },
  {
    name: "Churro Carnival",
    latitude: 33.802310,
    longitude: -118.160236,
    rating: getRandomRating(),
    details: {
      address: "1919 Pine St, Long Beach, CA 90815",
      about: "Freshly fried churros",
      menu: [
        { item: "Classic Churro", cost: 3.00, type: "food" },
        { item: "Churro Ice Cream Sandwich", cost: 5.00, type: "food" },
        { item: "Churro Bites", cost: 4.00, type: "food" },
        { item: "Mexican Hot Chocolate", cost: 3.50, type: "drink" },
      ]
    },
  },
  {
    name: "Hot Dog Heaven",
    latitude: 33.790933,
    longitude: -118.116367,
    rating: getRandomRating(),
    details: {
      address: "2121 Elm St, Long Beach, CA 90815",
      about: "Classic and gourmet hot dogs",
      menu: [
        { item: "Classic Hot Dog", cost: 4.00, type: "food" },
        { item: "Chili Cheese Dog", cost: 6.00, type: "food" },
        { item: "Chicago Style Dog", cost: 5.00, type: "food" },
        { item: "Soda", cost: 1.50, type: "drink" },
      ]
    },
  },
  {
    name: "Bao Buns",
    latitude: 33.795650,
    longitude: -118.108155,
    rating: getRandomRating(),
    details: {
      address: "2222 Pine St, Long Beach, CA 90815",
      about: "Soft and steamed bao buns",
      menu: [
        { item: "Pork Belly Bao", cost: 6.00, type: "food" },
        { item: "Chicken Teriyaki Bao", cost: 7.00, type: "food" },
        { item: "Vegetarian Bao", cost: 5.00, type: "food" },
        { item: "Bubble Tea", cost: 4.00, type: "drink" },
      ]
    },
  },
]