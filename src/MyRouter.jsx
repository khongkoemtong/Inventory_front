// import React from 'react';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';

// // Import Layout មេ
// import Dashboard from './Admin/Dashboard';

// // Import Components សម្រាប់បង្ហាញក្នុង Dashboard
// import Overview from './Admin/Overview';
// import Product from './Admin/Product';
// import ProductForm from './Admin/form/ProductForm';
// import Orders from './Admin/Orders';
// import LowStockAlerts from './Admin/LowStockAlerts';
// import Analytics from './Admin/Analytics';
// import Reports from './Admin/Reports';
// import Suppliers from './Admin/Suppliers';
// import SettingsComponent from './Admin/SettingsComponent';
// import CategoryPage from './Admin/Category';
// import Category from './Admin/Category';
// import Login from './Admin/form/Login';
// import Register from './Admin/form/Register';
// import Home from './Customer/Home';
// import Customers from './Admin/Customers';
// import NotFound from './Admin/NotFound';
// import Profile from './Customer/Profile';

// function MyRouter() {
//   return (
//     <BrowserRouter>
     
//       <Routes>
//         <Route path='/profile/:id' element={<Profile/>}/>
//           <Route path='/login' element={<Login/>}/>
//           <Route path='*' element={<NotFound/>}/>
//         <Route path='/register' element={<Register/>}/>
//         <Route path='/' element={<Home/>}/>
//         {/* កំណត់ Dashboard ជា Parent Route (Layout មេ) */}
//         <Route path="/dashboard" element={<Dashboard />}>
            
//           {/* បង្ហាញ Overview ជាទំព័រដើមនៅពេលចូល URL "/" */}
//           <Route index element={<Overview />} />
          
//           {/* បណ្តុំទំព័រផលិតផល */}
//           <Route path="products" element={<Product />} />
//           <Route path="products/create" element={<ProductForm />} />
//           <Route path="products/edit/:id" element={<ProductForm />} />
          
//           {/* បណ្តុំទំព័រផ្សេងៗទៀត */}
//           <Route path="low-stock" element={<LowStockAlerts />} />
//           <Route path="orders" element={<Orders />} />
//           <Route path="analytics" element={<Analytics />} />
//           <Route path="reports" element={<Reports />} />
//           <Route path="suppliers" element={<Suppliers />} />
//           <Route path="settings" element={<SettingsComponent />} />
//           <Route path='category' element={<Category/>}/>
//           <Route path='customer' element={<Customers/>}/>
          
//         </Route>
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default MyRouter;



// src/MyRouter.jsx

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Qrcode from './Customer/Qrcode';
import InventoryPage from './Customer/InventoryPage';

// ១. ប្រាកដថាឈ្មោះ File ត្រូវបេះបិទ (បើ InventoryPage.jsx ត្រូវសរសេរ InventoryPage)


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Qrcode/>} />
        <Route path="/inventory/:userId" element={<InventoryPage/>} />
      </Routes>
    </Router>
  );
}

export default App;