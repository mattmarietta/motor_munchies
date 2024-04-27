import React from 'react'
import Map from './Map.jsx'
import FoodTruck from './FoodTruck.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

export default function MapAPI() {
  return (
    <Router>
      <Routes>
        <Route path='/maptest.html' exact element={<Map />} />
        <Route path='/foodtruck.html/:truckId' element={<FoodTruck />} />
      </Routes>
    </Router>
  )
}