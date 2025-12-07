// App.jsx (version mise à jour)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { LanguageProvider } from './context/LanguageContext';
import Home from './page/Home';
import ProductDetail from './page/ProductDetail';
import Cart from './page/Cart';
import Checkout from './page/Checkout';
import OrderConfirmation from './page/OrderConfirmation';
import CategoryPage from './page/CategoryPage';
import ClothingCategoryPage from './page/ClothingCategoryPage';
import AuthPage from './Components/AuthPage';
import ShoesCategory from './page/ShoesCategory';
import SearchResults from './page/SearchResults';
import AddProductForm from './page/AddProductForm';
import AdminPanel from './page/AdminPanel';
import AdminFloatingButton from './Components/AdminFloatingButton';
import BagCategorypage from './page/BagCategorypage';
import BijouPage from './page/BijouPage';
import WelcomeDiscountModal from './Components/WelcomeDiscountModal';
import PhoneAndAccessorieCategory from './page/PhoneAndAccessorieCategory';
import NotFound from './page/NotFound';

function App() {
  return (
    <LanguageProvider>
      <CurrencyProvider>
        <CartProvider>
          <Router>
            <div className="App">
              {/* <AdminFloatingButton /> */}
              <WelcomeDiscountModal />
              <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/produit" element={<ProductDetail />} />
              <Route path="/product/:category/:id" element={<ProductDetail />} />
              <Route path="/Cart" element={<Cart />} />
              <Route path="/Checkout" element={<Checkout />} />
              <Route path="/Confirmation" element={<OrderConfirmation />} />
              <Route path="/category" element={<CategoryPage />} />
              <Route path="/clothing" element={<ClothingCategoryPage />} />
              <Route path="/bags" element={<BagCategorypage  />} />
              <Route path="/Form" element={<AuthPage />} />
              <Route path="/shoes" element={<ShoesCategory />} />
              <Route path="/bijou" element={<BijouPage />} />
              <Route path="/telephone_accessoires" element={<PhoneAndAccessorieCategory />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/admin/add-product" element={<AddProductForm />} />
              {/* Route 404 - Doit être en dernier */}
              <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </Router>
        </CartProvider>
      </CurrencyProvider>
    </LanguageProvider>
  );
}

export default App;