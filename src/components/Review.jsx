import React, {useState, useContext, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { MapContext } from './Map/Map.jsx'
import PropTypes from 'prop-types';
// Material UI imports
import Rating from '@mui/material/Rating';
import { WrapText } from '@mui/icons-material';

export default function Review(props) {
  // get truck from local storage that matches id
  const { foodTruck, truckId } = useContext(MapContext)
  const styles = {
    display: "flex",
    flexDirection: "column",
    marginBottom: 10,
    fontSize: ".8rem",
  }

  const styles4page = {
    display: "flex",
    flexDirection: "column",
    marginBottom: 20,
  }
  
  return (
    <div className="review" style={props.page ? styles4page : styles}>
      <p className="bold" style={{marginBottom: 5}}>
        {props.username}
      </p>
      <Rating 
        name="half-rating-read" 
        defaultValue={props.rating} 
        value={props.rating} 
        precision={0.5} 
        size="small" readOnly
      />
      <p>{props.comment}</p>
      <hr style={{width: "100%", borderColor: "white", opacity: "10%", marginTop: 20}}></hr>
    </div>
  )
}

Review.defaultProps = {
  username: "Guest",
  comment: "...",
  rating: 1
}

Review.propTypes = {
  username: PropTypes.string,
  comment: PropTypes.string,
  rating: PropTypes.number || PropTypes.string
}

// LIST OF REVIEWS
const reviewsList = [
  {
    username: "Mikey",
    comment: "Food was amazing, Earned a returning customer!",
    rating: 5
  },
  {
    username: "Smith",
    comment: "Absolutely amazing!",
    rating: 5,
  },
  {
    username: "Alice",
    comment: "It's pretty good, but portions feel a little small.",
    rating: 3,
  },
  {
    username: "Bob",
    comment: "Best reccomended food truck, customer service was the best!",
    rating: 5,
  },
  {
    username: "Paula",
    comment: "Customer service was great, food was too spicey.",
    rating: 4,
  },
  {
    username: "Jake33",
    comment: "A little pricey for my taste, but food was worth it.",
    rating: 4,
  },
]
// Only initialize list if it is not in local storage yet
localStorage.getItem("allReviews") ? null : localStorage.setItem("allReviews", JSON.stringify(reviewsList));