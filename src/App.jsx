import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import DashboardLayout from './components/layout/DashboardLayout'

const App = () => {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route path='/' element={<Home />}/>
      </Route>
    </Routes>
  )
}

export default App