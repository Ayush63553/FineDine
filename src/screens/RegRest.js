import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Navbar from '../components/Navbar';
import { handleError, handleSuccess } from '../utils';
export default function RegRest() {
  const [credentials, setCredentials] = useState({ category:"",name: "",img:"",options1:"", options2:"", description:"",
    // capacity:0,seats:0,
    geolocation: "" ,cords:[],
    // distance:0,
  })
  let [address, setAddress] = useState("");
  let navigate = useNavigate()
  const handleClick = async (e) => {
      e.preventDefault();
      let navLocation = () => {
          return new Promise((res, rej) => {
              navigator.geolocation.getCurrentPosition(res, rej);
            });
        }
        let latlong = await navLocation().then(res => {
            let latitude = res.coords.latitude;
            let longitude = res.coords.longitude;
      return [latitude, longitude]
    })
    console.log(latlong)
    let [lat, long] = latlong
    console.log(lat, long)
    const response = await fetch("http://localhost:5000/api/auth/getlocation", {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ latlong: { lat, long } })
        
    });
    const { location } = await response.json()
    console.log(location);
    setAddress(location);
    credentials.cords=latlong;
    setCredentials({ ...credentials, [e.target.name]: location ,})
}

const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/regRest", {
        // credentials: 'include',
        // Origin:"http://localhost:3000/login",
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ CategoryName: credentials.category, name: credentials.name, img: credentials.img, 
            options: {"VIP":credentials.options1,"regular":credentials.options2}, description: credentials.description,
            // Capacity:credentials.capacity,Seats:credentials.seats,
            Location: credentials.geolocation,
            cords:credentials.cords,
            // distance:credentials.distance
          })
    });
    const json = await response.json()
    console.log(json);
    if (json.success) {
        //save the auth toke to local storage and redirect
        localStorage.setItem('token', json.authToken)
        navigate("/login")
        handleSuccess("Registered")
        
    }
    else {
        handleError("Enter Valid Credentials")
    }
}

const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
}
return (
    <div style={{ backgroundImage: 'url("https://images.pexels.com/photos/1565982/pexels-photo-1565982.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1")', backgroundSize: 'cover',height: '100vh' }}>
      <div>
      <Navbar />
      </div>
        <div className='container' >
          <form className='w-50 m-auto mt-5 border bg-dark border-success rounded' onSubmit={handleSubmit}>
            <div className="m-3">
              <label htmlFor="name" className="form-label">Category</label>
              <input type="text" className="form-control" name='category' value={credentials.category} onChange={onChange} aria-describedby="emailHelp" />
            </div>
            <div className="m-3">
              <label htmlFor="name" className="form-label">Restaurant Name</label>
              <input type="text" className="form-control" name='name' value={credentials.name} onChange={onChange} aria-describedby="emailHelp" />
            </div>
            <div className="m-3">
              <label htmlFor="name" className="form-label">Link for Restaurant Image</label>
              <input type="text" className="form-control" name='img' value={credentials.img} onChange={onChange} aria-describedby="emailHelp" />
            </div>
            <div className="m-3">
              <label htmlFor="name" className="form-label">VIP price</label>
              <input type="text" className="form-control" name='options1' value={credentials.options1} onChange={onChange} aria-describedby="emailHelp" />
            </div>
            <div className="m-3">
              <label htmlFor="name" className="form-label">regular price</label>
              <input type="text" className="form-control" name='options2' value={credentials.options2} onChange={onChange} aria-describedby="emailHelp" />
            </div>
            <div className="m-3">
              <label htmlFor="name" className="form-label">Description of Restaurant</label>
              <input type="text" className="form-control" name='description' value={credentials.description} onChange={onChange} aria-describedby="emailHelp" />
            </div>
            {/* <div className="m-3">
              <label htmlFor="name" className="form-label">Capacity of Restaurant</label>
              <input type="number" className="form-control" name='capacity' value={credentials.capacity} onChange={onChange} aria-describedby="emailHelp" />
            </div>
            <div className="m-3">
              <label htmlFor="name" className="form-label">Seats Available</label>
              <input type="number" className="form-control" name='seats' value={credentials.seats} onChange={onChange} aria-describedby="emailHelp" />
            </div> */}
            <div className="m-3">
              <label htmlFor="address" className="form-label">Restaurant Address</label>
              <fieldset>
                <input type="text" className="form-control" name='address' placeholder='"Click below for fetching address"' value={address} onChange={(e)=>setAddress(e.target.value)} aria-describedby="emailHelp" />
              </fieldset>
            </div>
            <div className="m-3">
              <button type="button" onClick={handleClick} name="geolocation" className=" btn btn-success">Click for current Location </button>
            </div>
            
            <button type="submit" className="m-3 btn btn-success">Submit</button>
            <Link to="/login" className="m-3 mx-1 btn btn-danger">Already a user</Link>
          </form>
        </div>
      </div>
  )
}