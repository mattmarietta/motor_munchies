import React from 'react'
import Map from './Map.jsx'
import FoodTruck from './FoodTruck.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

export default function MapAPI() {
  return (
    <Router>
      <Routes>
        <Route exact path='/maptest.html' element={<Map />} />
        <Route path='/foodtruck/:truckId' element={<FoodTruck />} />
      </Routes>
    </Router>
  )
}