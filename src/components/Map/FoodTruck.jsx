import React, {useState, useEffect, useContext} from 'react';
import Review from '../Review.jsx'
import { useParams } from 'react-router-dom';
import styles from './FoodTruck.module.css'
import Rating from '@mui/material/Rating';

export default function FoodTruck() {

  useEffect(() => {
    console.log("rendered")
  }, [])

  const id = useParams() // Get the id in the URL

  const reviewsList = JSON.parse(localStorage.getItem("allReviews"))
  const foodTrucks = JSON.parse(localStorage.getItem("allLocations"))
  console.log(id)

  return (
    <div className={styles['foodtruck-page']}>
      <div className={styles['header']}>
        <h3>{foodTrucks[id.truckId].name}, <p style={{fontSize: ".9rem"}}>@{foodTrucks[id.truckId].details.address}</p></h3>
        <Rating name="half-rating-read" defaultValue={0} value={foodTrucks[id.truckId].rating || 0} precision={0.5} readOnly></Rating>
      </div>
      <div className={styles['reviews']}>
        {
          reviewsList.map((review, index) => {
            return (<Review key={index} username={review.username} comment={review.comment} rating={review.rating} page/>)
            // 'user is not defined' ?
          })
        }
      </div>
    </div>
  )
}