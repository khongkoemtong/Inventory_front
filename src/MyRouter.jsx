import React, { useState } from 'react'; // ១. បន្ថែម useState ត្រង់នេះ
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Admin Layout
import Dashboard from './Admin/Dashboard';
// Dashboard Components
import Overview from './Admin/Overview';
import Product from './Admin/Product';
import ProductForm from './Admin/form/ProductForm';
import Orders from './Admin/Orders';
import LowStockAlerts from './Admin/LowStockAlerts';
import Analytics from './Admin/Analytics';
import Reports from './Admin/Reports';
import Suppliers from './Admin/Suppliers';
import SettingsComponent from './Admin/SettingsComponent';
import Category from './Admin/Category';
import Customers from './Admin/Customers';
// Auth
import Login from './Admin/form/Login';
import Register from './Admin/form/Register';
// Customer
import Home from './Customer/Home';
import Profile from './Customer/Profile';
import AdminRoute from './Admin/AdminRoute';
// Other
import NotFound from './Admin/NotFound';
import CheckoutForm from './Admin/form/CheckoutForm';
import Navbar from './Customer/components/Navbar';

function MyRouter() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // បន្ថែម State បើក/បិទ Cart

  // គណនាចំនួន Item សរុបសម្រាប់បង្ហាញលើ Navbar
  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  // ២. បង្កើត State សម្រាប់ Guest Info និង Cart នៅទីនេះ
  const [guestInfo, setGuestInfo] = useState({
    customer_name: '',
    phone: '',
    address: '' // បន្ថែម address បើត្រូវការ
  });

  // គណនាតម្លៃសរុបដើម្បីបោះទៅឱ្យ Checkout
  const total = cartItems.reduce((sum, item) => sum + parseFloat(item.price) * item.qty, 0).toFixed(2);

  return (
    <BrowserRouter>
      <Navbar
        onCartClick={() => setIsCartOpen(true)}
        cartCount={cartCount}
      />
      <Routes>

        <Route
          path="/"
          element={
            <Home
              cartItems={cartItems}
              setCartItems={setCartItems}
              isCartOpen={isCartOpen}
              setIsCartOpen={setIsCartOpen}
            />
          }
        />        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:id" element={<Profile />} />

        <Route path="/checkout" element={
          <CheckoutForm
            guestInfo={guestInfo}
            setGuestInfo={setGuestInfo}
            cartItems={cartItems}
            total={total}
            setCartItems={setCartItems}
          />
        } />

        {/* Admin Protected Route */}
        <Route
          path="/dashboard"
          element={
            <AdminRoute>
              <Dashboard />
            </AdminRoute>
          }
        >
          <Route index element={<Overview />} />
          <Route path="products" element={<Product />} />
          <Route path="products/create" element={<ProductForm />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="low-stock" element={<LowStockAlerts />} />
          <Route path="orders" element={<Orders />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="reports" element={<Reports />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="settings" element={<SettingsComponent />} />
          <Route path="category" element={<Category />} />
          <Route path="customer" element={<Customers />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default MyRouter;