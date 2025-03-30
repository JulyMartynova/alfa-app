import React from 'react';
import logo from './logo.svg';
import './App.css';
import ProductsPage from './pages/ProductsPage'
import CreateProductPage from './pages/CreateProductPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
      <Route path = "/products" element={<ProductsPage/>}/>
      <Route path ="/create-product" element = {<CreateProductPage></CreateProductPage>} />
      <Route path ="/products/:id" element = {<ProductDetailsPage/>} />
      <Route path="/" element = {<ProductsPage/>} />
      </Routes>
    </Router>
      
  );
}

export default App;
