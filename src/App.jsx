import React from 'react'
import { Route, Routes } from 'react-router-dom'
import DashboardLayout from './components/layout/DashboardLayout'
import NotFound from './pages/NotFound'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'
import SaleOrder from './pages/SaleOrder'
import Category from './pages/Category'
import CategoryCreate from './components/Category/CategoryCreate'
import CategoryUpdate from './components/Category/CategoryUpdate'

const App = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path='/' element={<SaleOrder />}/>
          <Route path='/categories' element={<Category />}/>
          <Route path='/categories/create' element={<CategoryCreate />}/>
          <Route path='/categories/:id/edit' element={<CategoryUpdate />}/>
        </Route>
      </Route>
      <Route path='/login' element={<Login />}/>
      {/* Fallback */}
      <Route path='*' element={<NotFound />}/>
    </Routes>
  )
}

export default App