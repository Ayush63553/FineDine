/* eslint-disable react/jsx-no-undef */

import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from "react-router-dom";
import Badge from "@material-ui/core/Badge";
// import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useCart } from './ContextReducer';
import Modal from '../Modal';
import Cart from '../screens/Cart';
import { handleSuccess } from '../utils';
export default function Navbar(props) {

    const [cartView, setCartView] = useState(false)
    const [loggedInUser, setLoggedInUser] = useState("");//
    useEffect(() => {//
        setLoggedInUser(localStorage.getItem("loggedInUser"));
      }, []);
    localStorage.setItem('temp', "first")
    let navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem("loggedInUser");//
        global.Xcord=0;
        global.Ycord=0;
        handleSuccess("User Loggedout");//
        setTimeout(() => {
            navigate("/login");
        }, 1000);
    }

    const loadCart = () => {
        setCartView(true)
    }

    const items = useCart();
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-dark bg-success position-sticky"
                style={{ boxShadow: "0px 10px 20px black", filter: 'blur(20)', position: "fixed", zIndex: "10", width: "100%" }}>
                <div className="container-fluid">
                    <Link className="navbar-brand fs-1 fst-italic" to="/">FineDine</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link fs-5 mx-3 active" aria-current="page" to="/home">Home</Link>  {/* index.css - nav-link color white */}
                            </li>
                            {(localStorage.getItem("token")) ?
                                
                                <li className="nav-item">
                                    <Link className="nav-link fs-5 mx-3 active" aria-current="page" to="/book" >Bookings</Link>  {/* index.css - nav-link color white */}
                                </li>
                                 : ""}
                            {(localStorage.getItem("token")) ?
                                
                                <li className="nav-item">
                                    <Link className="nav-link fs-5 mx-3 active" aria-current="page" to="/restaurant" >Reg. Restaurant?</Link>  {/* index.css - nav-link color white */}
                                </li>
                                 : ""}
                        </ul>
                        {(!localStorage.getItem("token")) ?
                            <form className="d-flex">
                                <Link className="btn bg-white text-success mx-1 " to="/login">Login</Link>
                                <Link className="btn bg-white text-success mx-1" to="/signup">Signup</Link>
                            </form> :
                            <div>

                                <div className="btn bg-white text-success mx-2 " onClick={loadCart}>
                                    <Badge color="secondary" badgeContent={items.length} >
                                        {/* <BookIcon /> */}
                                    </Badge>
                                    Confirm Bookings
                                </div>

                                {cartView ? <Modal onClose={() => setCartView(false)}><Cart></Cart></Modal> : ""}

                                <button onClick={handleLogout} className="btn bg-white text-success" >Logout</button></div>}
                    </div>
                </div>
            </nav>
        </div>
    )
}
