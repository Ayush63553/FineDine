const mongoose = require('mongoose')

const { Schema } = mongoose;

const CatSchema = new Schema({
    CategoryName: {
        type: String,
        required: true,
    },

});

module.exports = mongoose.model("foodcategories", CatSchema)