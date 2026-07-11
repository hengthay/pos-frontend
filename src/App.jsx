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
import Customer from './pages/Customer'
import CustomerCreate from './components/Customer/CustomerCreate'
import CustomerUpdate from './components/Customer/CustomerUpdate'
import CustomerDetail from './components/Customer/CustomerDetail'
import Sale from './pages/Sale'
import SaleUpdate from './components/Sale/SaleUpdate'
import SaleDetail from './components/Sale/SaleDetail'
import SaleDetailUpdate from './components/Sale/SaleDetailUpdate'
import Purchase from "./pages/Purchase"
import PurchaseCreate from './components/Purchase/PurchaseCreate'
import PurchaseUpdate from './components/Purchase/PurchaseUpdate'
import PurchaseDetail from './components/Purchase/PurchaseDetail'

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
          <Route path='/customers' element={<Customer />}/>
          <Route path='/customers/create' element={<CustomerCreate />}/>
          <Route path='/customers/:id/edit' element={<CustomerUpdate />}/>
          <Route path='/customers/:id/view' element={<CustomerDetail />}/>
          <Route path='/sales' element={<Sale />}/>
          <Route path='/sales/:id/edit' element={<SaleUpdate />}/>
          <Route path='/sales/:id/view' element={<SaleDetail />}/>
          <Route path='/sales/:id/updateDetail' element={<SaleDetailUpdate />}/>
          <Route path='/purchases' element={<Purchase />}/>
          <Route path='/purchases/create' element={<PurchaseCreate />}/>
          <Route path='/purchases/:id/edit' element={<PurchaseUpdate />}/>
          <Route path='/purchases/:id/view' element={<PurchaseDetail />}/>

        </Route>
      </Route>
      <Route path='/login' element={<Login />}/>
      {/* Fallback */}
      <Route path='*' element={<NotFound />}/>
    </Routes>
  )
}

export default App