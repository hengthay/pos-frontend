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
import Product from './pages/Product'
import ProductCreate from "./components/Product/ProductCreate"
import ProductUpdate from "./components/Product/ProductUpdate"
import ProductDetail from "./components/Product/ProductDetail"
import InventoryTransaction from './pages/InventoryTransaction'
import InventoryTransactionDetail from './components/InventoryTransaction/InventoryTransactionDetail'

const App = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path='/' element={<SaleOrder />}/>
          <Route path='/categories' element={<Category />}/>
          <Route path='/categories/create' element={<CategoryCreate />}/>
          <Route path='/categories/:id/edit' element={<CategoryUpdate />}/>
          <Route path='/products' element={<Product />}/>
          <Route path='/products/create' element={<ProductCreate />}/>
          <Route path='/products/:id/edit' element={<ProductUpdate />}/>
          <Route path='/products/:id/view' element={<ProductDetail />}/>
          <Route path='/inventories-transaction' element={<InventoryTransaction />}/>
          <Route path='/inventories-transaction/:id/view' element={<InventoryTransactionDetail />}/>
        </Route>
      </Route>
      <Route path='/login' element={<Login />}/>
      {/* Fallback */}
      <Route path='*' element={<NotFound />}/>
    </Routes>
  )
}

export default App