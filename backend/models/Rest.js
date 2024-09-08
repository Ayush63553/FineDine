const mongoose = require('mongoose')

const { Schema } = mongoose;

const foodSchema = new Schema({
    CategoryName: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    img:{
        type:String,
        required:true
    }, 
    options: {
        type: Array,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    // Capacity: {
    //     type: Number,
    //     // required:true,
    // },
    
    // Seats: {
    //     type: Number,
    //     // required:true,
    // },
    Location: {
        type: String,
        required: true,
    },
    cords: {
        type: Array,
        // required:true,
    },
    // distance: {
    //     type: Number,
    //     // required:true,
    // },
});

// module.exports = mongoose.model('food_items',foodSchema)
module.exports = mongoose.model('food_items',foodSchema);