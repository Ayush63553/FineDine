import './App.css';
import '../node_modules/bootstrap-dark-5/dist/css/bootstrap-dark.min.css'  //npm i bootstrap-dark-5 boostrap
import '../node_modules/bootstrap/dist/js/bootstrap.bundle';
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js";

import Home from './screens/Home';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom";
// import Navbar from './components/Navbar';
import Login from './screens/Login';
import Signup from './screens/Signup';
import { CartProvider } from './components/ContextReducer';
import MyOrder from './screens/MyOrder';
import RefrshHandler from './RefreshHandler.js';
import { useState } from 'react';
import RegRest from './screens/RegRest.js';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const PrivateRoute = ({ element }) => {
    return isAuthenticated ? element : <Navigate to="/login" />
  }
  return (
    <CartProvider>
      <Router>
        <div>
        <RefrshHandler setIsAuthenticated={setIsAuthenticated} />
          <Routes>
            <Route path='/' element={<Navigate to="/login" />} />
            <Route exact path='/restaurant' element={<RegRest/>}/> 
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/signup" element={<Signup />} />
            {/* <Route exact path="/home" element={<Home />} /> */}
            <Route path='/home' element={<PrivateRoute element={<Home />} />} />
            <Route exact path="/book" element={<MyOrder />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
