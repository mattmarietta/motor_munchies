import React, {useState, useEffect} from 'react';

export default function FoodTruck() {
  const [truckName, setTruckName] = useState('');

  useEffect(() => {
    // let truckId = window.location.href.split("/").pop()
    // let selectedTruck = truckData.filter(t => t.id === truckId)[0]
    console.log("rendered")
  }, [])

  return (
    <>
      <p>Food Truck: {truckName}</p>
    </>
  )
}