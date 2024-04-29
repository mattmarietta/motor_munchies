import React, {useState, useEffect, useContext} from 'react';
import Review from '../Review.jsx'
import { useParams } from 'react-router-dom';

export default function FoodTruck() {

  const styles = {
    margin: 20,
    fontSize: "1rem"
  }

  useEffect(() => {
    // let truckId = window.location.href.split("/").pop()
    // let selectedTruck = truckData.filter(t => t.id === truckId)[0]
    console.log("rendered")
  }, [])

  const id = useParams() // Get the id in the URL

  const reviewsList = JSON.parse(localStorage.getItem("allReviews"))
  const foodTrucks = JSON.parse(localStorage.getItem("allLocations"))
  console.log(id)

  return (
    <div style={styles}>
      <h3 style={{textAlign: "center"}}>{foodTrucks[id.truckId].name}</h3>
      {
        reviewsList.map((review, index) => {
          return (<Review key={index} username={review.username} comment={review.comment} rating={review.rating} page/>)
          // 'user is not defined' ?
        })
      }
    </div>
  )
}