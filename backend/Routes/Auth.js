const express = require('express')
const User = require('../models/User')
const Order = require('../models/Orders')
const router = express.Router()
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken'); 
const axios = require('axios')
const fetch = require('../middleware/fetchdetails');
const Rest = require('../models/Rest');
const Category = require('../models/Category');
const jwtSecret = "HaHa"
// var foodItems= require('../index').foodData;
// require("../index")
//Creating a user and storing data to MongoDB Atlas, No Login Requiered
router.post('/createuser', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
    body('name').isLength({ min: 3 })
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() })
    }
    // console.log(req.body)
    // let user = await User.findOne({email:req.body.email})
    const salt = await bcrypt.genSalt(10)
    let securePass = await bcrypt.hash(req.body.password, salt);
    try {
        await User.create({
            name: req.body.name,
            // password: req.body.password,  first write this and then use bcryptjs
            password: securePass,
            email: req.body.email,
            location: req.body.location,
            cords: req.body.cords
        }).then(user => {
            const data = {
                user: {
                    id: user.id
                }
            }
            const authToken = jwt.sign(data, jwtSecret);
            success = true;
            res.json({ message:"SignUp Success",success, authToken})
        })
            .catch(err => {
                console.log(err);
                res.json({ error: "Please enter a unique value." })
            })
    } catch (error) {
        console.error(error.message);
    }
})

// Authentication a User, No login Requiered
router.post('/login', [
    body('email', "Enter a Valid Email").isEmail(),
    body('password', "Password cannot be blank").exists(),
], async (req, res) => {
    let success = false
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });  //{email:email} === {email}
        if (!user) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }

        const pwdCompare = await bcrypt.compare(password, user.password); // this return true false.
        if (!pwdCompare) {
            return res.status(400).json({ success, error: "Try Logging in with correct credentials" });
        }
        const data = {
            user: {
                id: user.id,
            }
        }
        success = true;
        // console.log(user.cords);
        const authToken = jwt.sign(data, jwtSecret);
        res.json({ message:"Login Success",success, authToken,cords:user.cords})
        

    } catch (error) {
        console.error(error.message)
        res.send("Server Error")
    }
})

// Get logged in User details, Login Required.
router.post('/getuser', fetch, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password") // -password will not pick password from db.
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.send("Server Error")

    }
})
// Get logged in User details, Login Required.
// router.post('/getlocation', async (req, res) => {
//     try {
//         let lat = req.body.latlong.lat
//         let long = req.body.latlong.long
//         console.log(lat, long)
//         let location = await axios
//             .get("https://api.opencagedata.com/geocode/v1/json?q=" + lat + "+" + long + "&key=9b430925a46949219df1874db10086fd")
//             .then(async res => {
//                 // console.log(`statusCode: ${res.status}`)
//                 console.log(res.data.results)
//                 // let response = stringify(res)
//                 // response = await JSON.parse(response)
//                 let response = await res.data.results[0].components;
//                 // let cords = await res.data.results[0].components;
                
//                 console.log(response)
//                 let { village, city_district, county,state_district, state, postcode, country} = response;
//                 return String(village + " , "  + city_district + " , " + county + " , "+ state_district + " , " + state + " -\n " + postcode+", \n "+country);
//             })
//             .catch(error => {
//                 console.error(error);
//             })
//         res.send({ location});

//     } catch (error) {
//         console.error(error.message)
//         res.send("Server Error")

//     }
// })

router.post('/getlocation', async (req, res) => {
    try {
        let lat = req.body.latlong.lat
        let long = req.body.latlong.long
        console.log(lat, long)
        let location = await axios
            .get("https://api.opencagedata.com/geocode/v1/json?q=" + lat + "+" + long + "&key=9b430925a46949219df1874db10086fd")
            .then(async res => {
                // console.log(`statusCode: ${res.status}`)
                console.log(res.data.results)
                // let response = stringify(res)
                // response = await JSON.parse(response)
                let response = res.data.results[0].components;
                
                console.log(response)
                let { village, city_district, county,state_district, state, postcode, country } = response;
                return String(village + " , "  + city_district + " , " + county + " , "+ state_district + " , " + state + " -\n " + postcode+", \n "+country);
            })
            .catch(error => {
                console.error(error)
            })
        res.send({ location})

    } catch (error) {
        console.error(error.message)
        res.send("Server Error")

    }
})

router.post('/foodData', async (req, res) => {
    try {
        // console.log( JSON.stringify(global.foodData))
        // const userId = req.user.id;
        // await database.listCollections({name:"food_items"}).find({});
        res.send([global.foodData, global.foodCategory])
    } catch (error) {
        console.error(error.message)
        res.send("Server Error")

    }
})

router.post('/orderData', async (req, res) => {
    let data = req.body.order_data
    await data.splice(0,0,{Order_date:req.body.order_date})
    console.log("1231242343242354",req.body.email)

    //if email not exisitng in db then create: else: InsertMany()
    let eId = await Order.findOne({ 'email': req.body.email })    
    console.log(eId)
    if (eId===null) {
        try {
            console.log(data)
            console.log("1231242343242354",req.body.email)
            await Order.create({
                email: req.body.email,
                order_data:[data]
            }).then(() => {
                res.json({ success: true })
            })
        } catch (error) {
            console.log(error.message)
            res.send("Server Error", error.message)

        }
    }

    else {
        try {
            await Order.findOneAndUpdate({email:req.body.email},
                { $push:{order_data: data} }).then(() => {
                    res.json({ success: true })
                })
        } catch (error) {
            console.log(error.message)
            res.send("Server Error", error.message)
        }
    }
})

router.post('/myOrderData', async (req, res) => {
    try {
        console.log(req.body.email)
        let eId = await Order.findOne({ 'email': req.body.email })
        //console.log(eId)
        res.json({orderData:eId})
    } catch (error) {
        res.send("Error",error.message)
    }
    

});

router.post('/regRest',  async (req, res) => {
        try {
            const { CategoryName,name,img,options,description,Capacity,Seats,Location,cords,
                // distance
            } = req.body;
            const Rname = await Rest.findOne({ name });
            const cat=await Category.findOne({CategoryName});
            if (Rname) {
                return res.status(410)
                    .json({ message: 'Restaurant already exists', success: false });
            }
            if(!cat){//
                const catModel= new Category({CategoryName});
                await catModel.save();
            }
            const restModel = new Rest({ CategoryName,name,img,options,description,Capacity,Seats,Location,cords,
                // distance
            });
            // userModel.password = await bcrypt.hash(password, 10);
            await restModel.save();
            // window.location.reload();
            try {
                res.status(202)
                    .json({
                        message: "Restaurant Added!",
                        success: true,
                        restModel
                    })
            }catch (err) {
            res.status(500)
                .json({
                    message: "Internal server error",
                    success: false
                })
        }
    }catch (err) {
        res.status(500)
            .json({
                message: "Internal server error",
                error:err,
                success: false
            })
    }
});

router.post('/book',  async (req, res) => {
    try {
        const {name,UserSeats} = req.body;
        const avail = await Rest.findOne({name});
        if(!avail){
            return res.status(206)
            .json({
                message: "Restaurant doesn't exist",
                success: false
            })
        }
        
        if(avail.Seats>=UserSeats){
            avail.Seats=avail.Seats-UserSeats;
            await avail.save();
            return res.status(202)
            .json({
                message: "Restaurant Booked!",
                success: true
            })
        }
        else {
            return res.status(203)
                .json({
                    message: "Only " + avail.UserSeats + " Seats Available!",
                    success: false
                })
        }
    }

    catch (err) {
        return res.status(500)
            .json({
                message: "Internal server error",
                success: false,
                error: err
            })
    }
});
router.post('/add',  async (req, res) => {
    try {
        const {name,UserSeats} = req.body;
        const avail = await Rest.findOne({name});
        if(!avail){
            return res.status(206)
            .json({
                message: "Restaurant doesn't exist",
                success: false
            })
        }
        
        if(avail.Seats+UserSeats<=avail.Capacity){
            avail.Seats=avail.Seats+UserSeats;
            
            await avail.save();
            
            return res.status(202)
                .json({
                    message: "Restaurant Freed!",
                    success: true
                })
        }
        else {
            return res.status(203)
                .json({
                    message: "Capacity Exceeded!",
                    success: false
                })
        }
    }

    catch (err) {
        return res.status(500)
            .json({
                message: "Internal server error",
                success: false,
                error: err
            })
    }
});



module.exports = router;