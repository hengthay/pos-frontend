import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import DashboardLayout from './components/layout/DashboardLayout'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

const App = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path='/' element={<Home />}/>
        </Route>
      </Route>
      <Route path='/login' element={<Login />}/>
      {/* Fallback */}
      <Route path='*' element={<NotFound />}/>
    </Routes>
  )
}

export default App